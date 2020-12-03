import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { decrypt } from '../../utils/crypto';
import styled from 'styled-components';
import ImgSrcParser from '../../utils/imgSrcParser';
import Notedirs from '../notedirs/NoteDirs';
import Notes from '../notes/Notes';
import Editor from '../layout/Editor';

import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';
import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

import SaveButton from '../notes/SaveButton';
import {
    UNSAVE,
    SAVING,
    SAVED,
    DISABLESAVE
} from '../../saveState';

const NoteContainer = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 1.5fr 3.5fr;
    grid-template-rows: auto .1fr;
    grid-template-areas: 
        "notedir-list note-list editor-area"
        "recycle-bin note-list editor-area";
    width: 100%;
    height: 100%;

    .note-list {
        grid-area: note-list;
        height: 100%;
        overflow-y: auto;
    }

    .notedir-list {
        grid-area: notedir-list;
    }

        .note-list > ul,
        .notedir-list > ul {
            margin: 0;
            padding: 0;
        }

            .note-list > ul > li {
                padding: 10px 0 10px 10px;
                font-size: 1rem;
                height: auto;
                &:hover {
                    background-color: ${props => props.isCurrent ? props.theme.lightGreenOnHover : props.theme.gray};
                };
            }

                .note-list > ul > li {
                    position: relative;
                    width: 10ch;
                }

                    .note-list > ul > li > p {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

    .note-title-container {
        display: flex;
        flex-flow: row nowrap;
        margin-top: 10px;
        width: 100%;
    }

        .note-title-container .note-title {
            flex: 1 1 auto;
            border: none;
            outline: none;
            padding: 10px;
        }

            .note-title-container .note-title:disabled {
                color: #000;
                font-size: 1.2rem;
                background: none;
            }

        .note-title-container .note-save-btn {
            flex: 0 1 15%;
        }

    .editor-area {
        grid-area: editor-area;
        display: flex;
        flex-flow: column nowrap;
        height: 100%;
        overflow-y: auto;
    }

        .editor-area .note-header {
            flex: 0 1 50px;
        }

        .editor-area .editor {
            flex: 1 1 auto;
            overflow-x: hidden;
        }

    .recycle-bin {
        grid-area: recycle-bin;
    }
`;

const EditorArea = styled.div`
    .ck-sticky-panel {
        display: ${props => props.showToolPanel ? 'block' : 'none'};
    }
`;

const Note = ({ match }) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);
    const notedirContext = useContext(NotedirContext);
    const noteContext = useContext(NoteContext);

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    const { 
        notes, 
        current, 
        cacheCurrent,
        cacheNotes, 
        appendCacheNote, 
        modifyCacheNote, 
        removeCacheNote, 
        discardCacheNote,
        setCurrentNote, 
        getNoteDetail,
        save, 
        setSave,
        deleteEnable,
        enableDelete,
        disableDelete,
        addNote,
        updateNote,
        deleteNote,
        error,
        loading 
    } = noteContext;

    const autoSaveInterval = 10000;
    const [autoSave, setAutoSave] = useState(true);
    const [autoSaveIntervalToken, setAutoSaveIntervalToken] = useState({});
    const [saveTextUpdateInterval, setSaveTextUpdateInterval] = useState(10000);

    //目前筆記的狀態：編輯/閱讀模式
    const NOTEMODE = {
        EDIT: 'EDIT',
        READ: 'READ'
    };

    const [noteMode, setNoteMode] = useState(NOTEMODE.READ);
    
    const host = `${window.location.protocol}//${window.location.host}`;

    const notebooks = notebookContext.notebooks;

    useEffect(() => {
        notebooks && notebooks.length > 0 && notebookContext.setCurrentNotebook(match.params.id);

        // eslint-disable-next-line
    }, [notebooks]);

    useEffect(() => {
        if(current && current._id) {
            if(cacheCurrent) {
                //控制儲存狀態(筆記載入時顯示已儲存)
                setSave({state: SAVED, showUpdateTime: true});
    
                if(cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) {
                    modifyCacheNote(current);
                } else {
                    let currentNote = notes.find(note => note._id === current._id);
                    currentNote && (cacheCurrent.title !== current.title || cacheCurrent.content !== current.content) 
                                && appendCacheNote(current);
                }
            }
        } else {
            //控制儲存、筆記狀態
            setNoteMode(NOTEMODE.READ);
            setSave({state: DISABLESAVE, showUpdateTime: false});
        }
    },[current]);

    useEffect(() => {
        //控制儲存狀態
        if(current && current._id
            && cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) {
                current.title !== '' || current.content !== ''
                    ? setSave({state: UNSAVE, showUpdateTime: false}) : setSave({state: DISABLESAVE, showUpdateTime: false});
            }
    },[cacheNotes]);

    useEffect(() => {
        //控制刪除狀態
        current && notes.map(note => note._id).indexOf(current._id) !== -1 ? enableDelete() : disableDelete();
    },[current, notes]);

    const titleChange = useCallback(e => {
        e.preventDefault();
        
        current && setCurrentNote({ title: e.target.value });
    },[current]);

    const contentChange = useCallback(data => {
        console.log('data: ' + data);
        current && console.log('content: ' + current.content);

        current && setCurrentNote({ content: data });
    },[current]);

    const setCacheNoteContent = note => {
        let currentNote = {
            _id: note._id,
            title: note.title,
            content: cacheNotes.find(cacheNote => {
                return cacheNote._id == note._id
            }).content
        };
        setCurrentNote(currentNote);
        setNoteMode(NOTEMODE.EDIT);
    }

    const setNoteContent = note => {
        //取得筆記內容
        getNoteDetail(note._id);
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
        setNoteMode(NOTEMODE.EDIT);
    };

    const onEdit = e => {
        e.preventDefault();
        setNoteMode(NOTEMODE.EDIT);
    }

    const onDelete = e => {
        e.preventDefault();
        current && deleteNote(notedirContext.current._id, current._id);
    }

    const onView = e => {
        e.preventDefault();
        setNoteMode(NOTEMODE.READ);
    }

    const onDiscard = e => {
        e.preventDefault();
        current && discardCacheNote(current._id);
    }

    const onSave = async () => {
        //設定儲存狀態為正在儲存
        if(current && (current.title !== '' || current.content !== '')
            && (cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1)) {
            console.log('save editor');

            try {
                //如果內容有被改過但又被改回來，儲存狀態直接設已儲存、移除快取筆記
                //儲存按鈕上的儲存時間從資料庫抓，因為實際上沒有執行儲存，所以時間應該顯示上次儲存的時間
                if(cacheCurrent.title === current.title && cacheCurrent.content === current.content) {
                    removeCacheNote(current._id);
                    setSave({state: SAVED, showUpdateTime: true});
                    return;
                }
    
                setSave({state: SAVING, showUpdateTime: false});

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
                    const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
                    _content = _content.replace(imgSrc, `${host}/api/images/${decryptedData.filename}`);
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
        if(autoSave && noteMode === NOTEMODE.EDIT){
            console.log('autosave launch');
            
            cacheNotes.length > 0 && setAutoSaveIntervalToken(setInterval(onSave, autoSaveInterval));
        }
        else{
            console.log('auto closed');

            clearInterval(autoSaveIntervalToken);
            setAutoSaveIntervalToken(null);
        }
    
    }, [autoSave, current, cacheCurrent, cacheNotes , autoSaveInterval, noteMode]);

    const LoadRecycleBin = () => {
        history.push('/recyclebin');
    };

    return (
        <NoteContainer>
            <Notedirs notebookId={match.params.id} />
            <Notes
                addEvent={onAdd} 
                setCacheNoteContent={setCacheNoteContent} 
                setNoteContent = {setNoteContent} />
            <EditorArea className='editor-area' showToolPanel={noteMode === NOTEMODE.EDIT}>
                <div className='note-header'>
                    {deleteEnable ? (<button className='note-delete-btn right-align' onClick={onDelete}>刪除</button>)
                    : (<button className='note-discard-btn right-align' onClick={onDiscard} disabled={!cacheCurrent}>捨棄</button>)}
                    {noteMode === NOTEMODE.EDIT ? 
                    (<button 
                        className='note-view-btn right-align' 
                        onClick={onView} 
                        disabled={!(cacheCurrent && current && cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) === -1)}>
                            檢視
                        </button>)
                    : (<button className='note-edit-btn right-align' onClick={onEdit} disabled={!(current && cacheCurrent)}>編輯</button>)}
                    <div className='note-title-container'>
                        <input type='text' placeholder='新筆記' className='note-title' value={current ? current.title || '' : ''} onChange={titleChange} disabled={noteMode !== NOTEMODE.EDIT}/>
                        <SaveButton 
                            visible={noteMode === NOTEMODE.EDIT}
                            state={save.state} 
                            onSave={onSave} 
                            showUpdateTime={save.showUpdateTime} 
                            updateTime={current && current._id ? current.date : null} 
                            updateInterval={saveTextUpdateInterval} />
                    </div>
                </div>
                <Editor 
                    enable={noteMode === NOTEMODE.EDIT}
                    content={current && current.content ? current.content : ''} 
                    loading={loading} 
                    contentChange={contentChange} />
            </EditorArea>
            <div className='recycle-bin'>
                <button className='recycle-bin-btn' onClick={LoadRecycleBin}>回收站</button>
            </div>
        </NoteContainer>
    )
}

export default Note;