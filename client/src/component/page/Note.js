import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Notedirs from '../notedirs/NoteDirs';
import Notes from '../notes/Notes';
import NoteEditor from '../notes/NoteEditor';
import NotedirSorter from '../notedirs/NotedirSorter';

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

    const [autoSave, setAutoSave] = useState(true);
    const autoSaveInterval = 10000;
    const host = `${window.location.protocol}//${window.location.host}`;

    useEffect(() => {
        //控制儲存、刪除狀態
        if(current) {
            ((cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) 
                ? (current.title !== '' || current.content !== '') 
                    ? setSave(UNSAVE) : setSave(DISABLESAVE)
                : setSave(SAVED));
            notes.map(note => note._id).indexOf(current._id) !== -1 ? enableDelete() : disableDelete();
        } else {
            disableEditor();
            setSave(DISABLESAVE);
            disableDelete();
        }
    },[current, cacheNotes, notes]);

    const titleChange = e => {
        e.preventDefault();
        let note = {
            _id: current._id,
            title: e.target.value,
            content: current.content
        };
        setCurrentNote(note);
        cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1 ?
            modifyCacheNote(note) : appendCacheNote(note);
    }

    const contentChange = content => {
        let note = {
            _id: current._id,
            title: current.title,
            content
        };

        setCurrentNote(note);
        cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1 ?
            modifyCacheNote(note) : appendCacheNote(note);
    }

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

    const onSave = useCallback(async () => {
        if(current && (current.title !== '' || current.content !== '')) {
            console.log('save editor');
        
            let newContent = await ReplaceImage(current.content);
            contentChange(newContent);

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

            let saveNote = {
                title: current.title,
                content: current.content,
                notedir: notedirContext.current._id
            };

            //設定儲存狀態為正在儲存
            setSave(SAVING);
            //判斷要做Add還是Update
            if(notes.map(note => note._id).indexOf(current._id) === -1) {
                //新增筆記到資料庫
                await addNote(saveNote);
            } else if(cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) {
                //更新筆記到資料庫
                await updateNote(current._id, saveNote);
            }
            if(error){
                setSave(UNSAVE);
            } else {
                removeCacheNote(current._id);
            }
        }
    }, [current]);

    return (
        <div className='note-container'>
            <div className='header'>
                <Link to='../'>回到筆記本</Link>
                <NotedirSorter />
            </div>
            <Notedirs notebookId={match.params.id} />
            <Notes notedirId={notedirContext.current ? notedirContext.current._id : null} />
            <div className='note-header'>
                {deleteEnable ? (<button className='note-delete-btn right-align' onClick={onDelete}>刪除</button>)
                : (<button className='note-discard-btn right-align' onClick={onDiscard} disabled={!current}>捨棄</button>)}
                <button className='note-edit-btn right-align' onClick={onEdit} disabled={!editorEnable}>編輯</button>
                <div className='note-title-container'>
                    <input type='text' placeholder='新筆記' className='note-title' value={current ? current.title : ''} onChange={titleChange} disabled={!editorEnable}/>
                    <SaveButton state={save} onSave={onSave} />
                </div>
            </div>
            <NoteEditor 
                enable={editorEnable}
                content={current ? current.content : ''} 
                loading={loading} 
                contentChange={contentChange}
                autoSave={autoSave}
                autoSaveInterval={autoSaveInterval}
                saveEvent={onSave} />
            <div className='recycle-bin'></div>
        </div>
    )
}

export default Note;