import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Notedirs from '../notedirs/NoteDirs';
import Notes from '../notes/Notes';
// import NoteEditor from '../notes/NoteEditor';
import Editor from '../layout/Editor';
import NotedirSorter from '../notedirs/NotedirSorter';
import useAsyncReference from '../../utils/useAsyncReference';

import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

import SaveButton from '../../component/layout/SaveButton';
import {
    UNSAVE,
    SAVING,
    SAVED,
    DISABLESAVE
} from '../../saveState';

// Import Style
import '../../style/page/Note.css';

const Note = ({ match }) => {
    const notedirContext = useContext(NotedirContext);
    const noteContext = useContext(NoteContext);

    const { notes, 
        current, 
        cacheNotes, 
        appendCacheNote, 
        modifyCacheNote, 
        removeCacheNote, 
        discardCacheNote,
        setCurrentNote, 
        getNoteDetail,
        editorEnable, 
        enableEditor, 
        disableEditor, 
        save, 
        setSave,
        deleteEnable,
        enableDelete,
        disableDelete,
        addNote,
        updateNote,
        deleteNote,
        error,
        loading } = noteContext;

    const [currentRef, setCurrentRef] = useAsyncReference(current);

    const autoSaveInterval = 10000;
    const [autoSave, setAutoSave] = useState(true);
    const [autoSaveIntervalToken, setAutoSaveIntervalToken] = useState({});

    const host = `${window.location.protocol}//${window.location.host}`;
    
    const getId = () => {
        return cacheNotes.length == 0 ? 1 : Math.max(...cacheNotes.map(cacheNote => cacheNote._id)) + 1;
    }

    useEffect(() => {
        //控制儲存、編輯器狀態
        if(current) {
            ((cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) 
                ? (current.title !== '' || current.content !== '') 
                    ? setSave(UNSAVE) : setSave(DISABLESAVE)
                : setSave(SAVED));
        } else {
            disableEditor();
            setSave(DISABLESAVE);
        }
    },[current, cacheNotes]);

    useEffect(() => {
        //控制刪除狀態
        current && notes.map(note => note._id).indexOf(current._id) !== -1 ? enableDelete() : disableDelete();
    },[current, notes]);

    useEffect(() => {
        setCurrentRef(current);
    }, [current]);

    const titleChange = e => {
        e.preventDefault();

        if(current){
            let note = Object.assign({},current,{title: e.target.value});
            setCurrentNote(note);
            cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1 ?
                modifyCacheNote(note) : appendCacheNote(note);
        }
    }

    const setCacheNoteContent = note => {
        let currentNote = {
            _id: note._id,
            title: note.title,
            content: cacheNotes.find(cacheNote => {
                return cacheNote._id == note._id
            }).content
        };
        setCurrentNote(currentNote);
        modifyCacheNote(currentNote);
    }

    const setNoteContent = async note => {
        // if(cacheNotes.map(cacheNote => cacheNote._id).indexOf(note._id) == -1) {
            await getNoteDetail(note._id);
            
        // } else {
        //     let currentNote = await cacheNotes.find(cacheNote => {
        //         return cacheNote._id == note._id
        //     });
        //     setCurrentNote({
        //         _id: note._id,
        //         title: note.title,
        //         content: currentNote.content
        //     });
        // }
    };

    const editorContentChange = async data => {
        if(current) {
            let note = {
                _id: current._id,
                title: current.title,
                content: data
            };
            
            await setCurrentNote(note);
            cacheNotes.map(cacheNote => cacheNote._id).indexOf(note._id) !== -1 ?
                modifyCacheNote(note) : appendCacheNote(note);
        }
    }

    const onAdd = e => {
        e.preventDefault();
        let newNote = {
            _id: getId(),
            title: '',
            content: ''
        };
        setCurrentNote(newNote);
        appendCacheNote(newNote);
    };

    const onEdit = e => {
        e.preventDefault();
        current && enableEditor();
    }

    const onDelete = async e => {
        e.preventDefault();
        current && await deleteNote(notedirContext.current._id, current._id);
    }

    const onDiscard = e => {
        e.preventDefault();
        current && discardCacheNote(current._id);
    }

    const onSave = async () => {
        if(currentRef.current && (currentRef.current.title !== '' || currentRef.current.content !== '')
            && (cacheNotes.map(cacheNote => cacheNote._id).indexOf(currentRef.current._id) !== -1)) {
            console.log('save editor');
        
            let newContent = await ReplaceImage(currentRef.current.content);

            // 儲存筆記
            let saveNote = {
                title: currentRef.current.title,
                content: newContent,
                notedir: notedirContext.current._id
            };

            //設定儲存狀態為正在儲存
            setSave(SAVING);
            //判斷要做Add還是Update
            if(notes.map(note => note._id).indexOf(currentRef.current._id) === -1) {
                //新增筆記到資料庫
                await addNote(saveNote);
            } else {
                //更新筆記到資料庫
                await updateNote(currentRef.current._id, saveNote);
            }
            if(error){
                setSave(UNSAVE);

                console.log('error');
            } else {
                removeCacheNote(currentRef.current._id);
                console.log('executed');
            }
        }

        async function ReplaceImage(content){
            let _content = content;
            // 替換圖片src(只抓出Blob)
            let imgSrcArr = Array.from( new DOMParser().parseFromString( content, 'text/html' )
            .querySelectorAll( 'img' ) )
            .map(img => img.getAttribute('src'))
            .filter((val) => {
                return val ? val.indexOf('blob') !== -1 : false;
            });

            for(let i = 0; i < imgSrcArr.length; i++){
                let imgSrc = imgSrcArr[i];
                try{
                    let imgBlob = await fetch(imgSrc).then(r => r.blob());
                    let imgFile = new File([imgBlob], 'image', { lastModified: new Date().getTime(), type: imgBlob.type });
                    const config = {
                        headers: {
                        'Content-Type': 'multipart/form-data'
                        }
                    };
                    
                    // 上傳圖片至Server
                    const data = new FormData();
                    data.append( 'image', imgFile );
                    const res = await axios.post('/images/upload', data, config);

                    // 釋放掉Blob參照   
                    window.URL.revokeObjectURL(imgSrc);

                    // 把圖片的src重新設定為server上的檔案位置
                    _content = _content.replace(imgSrc, `${host}/images/${res.data.filename}`);
                }
                catch(err){
                    //todo
                }
            }

            return _content;
        }
    };

    useEffect(() => {
        // 清除上一次的token
        autoSaveIntervalToken && clearInterval(autoSaveIntervalToken);
    
        // 當自動儲存開啟/關閉改變時執行(清除setinterval或設定setinterval)
        if(autoSave){
            console.log('autosave launch');
            
            setAutoSaveIntervalToken(setInterval(onSave, autoSaveInterval));
        }
        else{
            console.log('auto closed');

            autoSaveIntervalToken && clearInterval(autoSaveIntervalToken);
        }

        return () => {
            autoSaveIntervalToken && clearInterval(autoSaveIntervalToken);
        }
    
    }, [autoSave]);

    return (
        <div className='note-container'>
            <div className='header'>
                <Link to='../'>回到筆記本</Link>
                <NotedirSorter />
            </div>
            <Notedirs notebookId={match.params.id} />
            <Notes notedirId={notedirContext.current ? notedirContext.current._id : null} 
                addEvent={onAdd} 
                setCacheNoteContent={setCacheNoteContent} 
                setNoteContent = {setNoteContent} />
            <div className='note-header'>
                {deleteEnable ? (<button className='note-delete-btn right-align' onClick={onDelete}>刪除</button>)
                : (<button className='note-discard-btn right-align' onClick={onDiscard} disabled={!current}>捨棄</button>)}
                <button className='note-edit-btn right-align' onClick={onEdit} disabled={!editorEnable}>編輯</button>
                <div className='note-title-container'>
                    <input type='text' placeholder='新筆記' className='note-title' value={current ? current.title : ''} onChange={titleChange} disabled={!editorEnable}/>
                    <SaveButton state={save} onSave={onSave} />
                </div>
            </div>
            {/* <NoteEditor 
                note={current}
                enable={editorEnable}
                loading={loading} /> */}
            <Editor 
                enable={editorEnable}
                content={currentRef.current ? currentRef.current.content : ''} 
                loading={loading} 
                contentChange={editorContentChange} />
            <div className='recycle-bin'></div>
        </div>
    )
}

export default Note;