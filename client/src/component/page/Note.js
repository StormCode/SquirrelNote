import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ImgSrcParser from '../../utils/imgSrcParser';
import Notedirs from '../notedirs/NoteDirs';
import Notes from '../notes/Notes';
// import NoteEditor from '../notes/NoteEditor';
import Editor from '../layout/Editor';
import NotedirSorter from '../notedirs/NotedirSorter';

import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

import SaveButton from '../notes/SaveButton';
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
        cacheCurrent,
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

    const autoSaveInterval = 10000;
    const [autoSave, setAutoSave] = useState(true);
    const [autoSaveIntervalToken, setAutoSaveIntervalToken] = useState({});
    const [saveTextUpdateInterval, setSaveTextUpdateInterval] = useState(10000);

    const host = `${window.location.protocol}//${window.location.host}`;

    useEffect(() => {
        if(current && current._id && cacheCurrent) {
            console.log('current: ' + current._id);

            //控制儲存狀態(筆記載入時顯示已儲存)
            setSave({state: SAVED, showUpdateTime: true});

            if(cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) {
                modifyCacheNote(current);
            } else {
                console.log('cacheCurrent.title: ' + cacheCurrent.title);
                console.log('cacheCurrent.content: ' + cacheCurrent.content);
                console.log('current.title: ' + current.title);
                console.log('current.content: ' + current.content);
                
                let currentNote = notes.find(note => note._id === current._id);
                currentNote && (cacheCurrent.title !== current.title || cacheCurrent.content !== current.content) 
                            && appendCacheNote(current);
            }
        } else {
            //控制儲存、編輯器狀態
            disableEditor();
            setSave({state: DISABLESAVE, showUpdateTime: false});
        }
    },[current]);

    // useEffect(() => {
    //     if(current && (cacheTitle || cacheContent)) {
    //         //設定Current Note的content
    //         let currentNote = {};
    //         if(cacheTitle) currentNote.title = cacheTitle;
    //         if(cacheContent) currentNote.content = cacheContent;
    //         setCurrentNote(currentNote);

    //         //新增/修改快取筆記
    //         if(current._id) {
    //             currentNote._id = current._id;
    //             if(cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) {
    //                 modifyCacheNote(currentNote);
    //             } else {
    //                 let currentNote = notes.find(note => note._id === current._id);
    //                 currentNote && (cacheTitle !== current.title || cacheContent !== current.content) 
    //                             && appendCacheNote(current);
    //             }
    //         }
    //     }
    // },[cacheTitle, cacheContent]);

    useEffect(() => {
        //控制儲存狀態
        if(cacheNotes.length > 0) {
            current && current._id
                    && (cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) 
                        && (current.title !== '' || current.content !== '')
                            ? setSave({state: UNSAVE, showUpdateTime: false}) : setSave({state: DISABLESAVE, showUpdateTime: false});
        }
    },[cacheNotes]);

    useEffect(() => {
        //控制刪除狀態
        current && notes.map(note => note._id).indexOf(current._id) !== -1 ? enableDelete() : disableDelete();
    },[current, notes]);

    const titleChange = useCallback(e => {
        e.preventDefault();
        
        current && current.title !== e.target.value 
                && setCurrentNote({ title: e.target.value });

        // cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1 ?
        //     modifyCacheNote(note) : appendCacheNote(getId());
    },[current]);

    const contentChange = useCallback(data => {
        // let note = {
        //     _id: current._id,
        //     title: current.title,
        //     content: data
        // };
        console.log('data: ' + data);
        current && console.log('content: ' + current.content);

        current && current.content !== data 
                && setCurrentNote({ content: data });

        // cacheNotes.map(cacheNote => cacheNote._id).indexOf(note._id) !== -1 ?
        //     modifyCacheNote(note) : appendCacheNote(getId());
    },[current, cacheCurrent]);

    // useEffect(() => {
    //     if(current && current._id) {
    //         let currentNote = notes.find(note => note._id === current._id);
    //         currentNote && currentNote.title !== current.title && currentNote.content !== current.content 
    //                     && appendCacheNote(current);
    //     }
    // },[titleChange, contentChange]);

    const setCacheNoteContent = note => {
        let currentNote = {
            _id: note._id,
            title: note.title,
            content: cacheNotes.find(cacheNote => {
                return cacheNote._id == note._id
            }).content
        };
        setCurrentNote(currentNote);
        // modifyCacheNote(currentNote);
    }

    const setNoteContent = note => {
        // if(cacheNotes.map(cacheNote => cacheNote._id).indexOf(note._id) == -1) {
        getNoteDetail(note._id);
            
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

    const onAdd = e => {
        e.preventDefault();
        let newNote = {
            _id: uuidv4(),
            title: '',
            content: '',
            date: null
        };
        appendCacheNote(newNote);
        // setCurrentNote(newNote);
        // setCurrentCacheNote({
        //     title: '',
        //     content: ''
        // });
    };

    const onEdit = e => {
        e.preventDefault();
        current && enableEditor();
    }

    const onDelete = e => {
        e.preventDefault();
        current && deleteNote(notedirContext.current._id, current._id);
    }

    const onDiscard = e => {
        e.preventDefault();
        current && discardCacheNote(current._id);
    }

    const onSave = async () => {
        //設定儲存狀態為正在儲存
        if(current && (current.title !== '' || current.content !== '')
            && (cacheCurrent.title !== current.title || cacheCurrent.content !== current.content)
            && (cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1)) {
            console.log('save editor');
            setSave({state: SAVING, showUpdateTime: false});

            try {
                let newContent = await ReplaceImage(current.content);

                // 儲存筆記
                let saveNote = {
                    title: current.title,
                    content: newContent,
                    notedir: notedirContext.current._id
                };
    
                //判斷要做Add還是Update
                if(notes.map(note => note._id).indexOf(current._id) === -1) {
                    //新增筆記到資料庫
                    await addNote(saveNote);
                } else {
                    //更新筆記到資料庫
                    await updateNote(current._id, saveNote);
                }

                // setCurrentNote({
                //     content: newContent
                // });

                // setCurrentCacheNote({
                //     title: current.title,
                //     content: newContent
                // });
    
                //wrong
                if(error){
                    setSave({state: UNSAVE, showUpdateTime: false});
    
                    console.log('error');
                } else {
                    removeCacheNote(current._id);
                    setSave({state: SAVED, showUpdateTime: true});
                    console.log('executed');
                }
            } catch (err) {
                //todo
                console.log('儲存錯誤: ' + err);
                
            }

        }

        async function ReplaceImage(content){
            let _content = content;
            // 替換圖片src(只抓出Blob)
            let imgSrcArr = ImgSrcParser(_content)
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

                    if(!imgFile) throw '圖片轉換發生錯誤';
                    
                    // 上傳圖片至Server
                    const data = new FormData();
                    data.append( 'image', imgFile );
                    const res = await axios.post('/api/images/upload', data, config);

                    // 釋放掉Blob參照   
                    window.URL.revokeObjectURL(imgSrc);

                    // 把圖片的src重新設定為server上的檔案位置
                    _content = _content.replace(imgSrc, `${host}/api/images/${res.data.filename}`);
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
            
            cacheNotes.length > 0 && setAutoSaveIntervalToken(setInterval(onSave, autoSaveInterval));
        }
        else{
            console.log('auto closed');

            clearInterval(autoSaveIntervalToken);
            setAutoSaveIntervalToken(null);
        }
    
    }, [autoSave, current, cacheCurrent, cacheNotes , autoSaveInterval]);

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
                : (<button className='note-discard-btn right-align' onClick={onDiscard} disabled={!cacheCurrent}>捨棄</button>)}
                <button className='note-edit-btn right-align' onClick={onEdit} disabled={!editorEnable}>編輯</button>
                <div className='note-title-container'>
                    <input type='text' placeholder='新筆記' className='note-title' value={current ? current.title || '' : ''} onChange={titleChange} disabled={!editorEnable}/>
                    <SaveButton state={save.state} onSave={onSave} showUpdateTime={save.showUpdateTime} updateTime={current && current._id ? current.date : null} updateInterval={saveTextUpdateInterval} />
                </div>
            </div>
            {/* <NoteEditor 
                note={current}
                enable={editorEnable}
                loading={loading} /> */}
            <Editor 
                enable={editorEnable}
                content={current && current.content ? current.content : ''} 
                loading={loading} 
                contentChange={contentChange} />
            <div className='recycle-bin'></div>
        </div>
    )
}

export default Note;