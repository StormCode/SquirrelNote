import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { decrypt } from '../../utils/crypto';
import styled from 'styled-components';
import { NotePencil, Browser, FileX, Trash, ArrowsLeftRight } from "phosphor-react";
import makeResponsiveCSS from '../../utils/make-responsive-css'
import {
    MediumAndBelow
} from '../../utils/breakpoints.jsx';

import ImgSrcParser from '../../utils/imgSrcParser';
import Notedirs from '../notedirs/NoteDirs';
import Notes from '../notes/Notes';
import Editor from '../layout/Editor';
import Models from '../layout/Models';

// Import Style
import { theme } from '../../style/themes';
import { deleteStyle } from '../../style/model/delete';

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

const { orange, lightOrange, darkOrange, gray, darkGray } = theme;

// grid-template-columns: 50px 1.2fr 1.5fr 3.5fr;
// "side-bar notedir-list note-list editor-area";
// .recycle-bin {
    //     grid-area: recycle-bin;
    // }
const NoteContainerBaseStyle = props => {
    return `
        width: 100%;
        height: 100%;

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

        

        .side-bar {
            grid-area: side-bar;
            background: ${orange};
            display: flex;
            flex-flow: column nowrap;
            padding: 0;

            .notedir-item,
            .note-item {
                cursor: pointer;
                background: ${lightOrange};
                border-radius: 0 10px 10px 0;
                margin: 1px 0;
                padding: .5rem 0;
                text-align: center;
                overflow: hidden;
            }

            .notedir-item {
                display: ${props.notedirCollapse ? 'inline-block' : 'none'};
            }

            .note-item {
                display: ${props.noteCollapse ? 'inline-block' : 'none'};
            }
        }
    `;
}

const NoteContainerResponsiveStyle = props => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                .rwd-nav-bar {
                    display: flex;
                    flex-flow: row nowrap;
                }
        
                    .rwd-nav-bar button {
                        flex: 1 1 25%;
                    }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                display: grid;
                grid-template-columns: ${props.notedirCollapse || props.noteCollapse ? '30px' : ''} ${props.notedirCollapse ? '' : '1.2fr'} ${props.noteCollapse ? '' : '1.5fr'} ${props.notedirCollapse ? props.noteCollapse ? '6.2fr' : '4.7fr' : props.noteCollapse ? '5fr' : '3.5fr'};
                grid-template-rows: 100%;
                grid-template-areas:
                    "${props.notedirCollapse || props.noteCollapse ? 'side-bar' : ''} ${props.notedirCollapse ? '' : 'notedir-list'} ${props.noteCollapse ? '' : 'note-list'} editor-area";
            `
        }
      ])
}

const NoteContainer = styled.div`
    ${props => NoteContainerBaseStyle(props)}
    ${props => NoteContainerResponsiveStyle(props)}
`;

const EditorAreaBaseStyle = props => {
    return `
        display: flex;
        border-left: 1px solid rgba(255,120,0,1);
        flex-flow: column nowrap;
        height: 100%;
        overflow-y: auto;

        .note-header {
            flex: 0 1 50px;
        }

        .editor {
            flex: 1 1 auto;
            overflow-x: hidden;
        }

        .ck-sticky-panel {
            display: ${props.showToolPanel ? 'block' : 'none'};
        }

        .ck-editor__editable {
            border: none;
        }

        button {
            margin: 0 5px;
            padding: 0;
            border: none;
            background: none;
        }

        &.note-discard-btn {
            cursor: ${props.cacheCurrent ? 'pointer' : 'default'};
        }

        &.note-edit-btn,
        &.note-move-btn {
            cursor: ${props.current && props.cacheCurrent ? 'pointer' : 'default'};
        }

        button&:not(&.note-discard-btn),
        button&:not(&.note-move-btn),
        button&:not(&.note-edit-btn) {
            cursor: pointer;
        }
    `;
}

const EditorAreaResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                display: flex;
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                grid-area: editor-area;
                display: block;
            `
        }
      ])
}

const EditorArea = styled.div`
    ${props => EditorAreaBaseStyle(props)}
    ${EditorAreaResponsiveStyle()}
`;

const NotedirContainer = styled.li`
    cursor: pointer;
    background: ${props => props.isCurrent ? orange : 'none'};
    color: ${props => props.isCurrent ? '#FFF' : gray};
    padding: .5rem;
    font-size: 1rem;
    height: auto;
    &:hover {
        background: ${props => props.isCurrent ? darkOrange : 'none'};
        color: ${props => props.isCurrent ? '#FFF' : orange};
    };
`;

const modelStyle = `
    width: 100%;

    .modal-body {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        border-radius: 20px;
        background: #FFF;
        padding: 30px 50px;
        box-shadow: 5px 5px 10px #000;
    }

        .modal-body > div {
            flex: 1 0 100%;
        }

    p {
        text-align: center;
    }

    .title {
        font-size: 1.5rem;
        text-align: center;
        padding: 1rem 0;
    }

    .tip {
        margin-bottom: 10px;
        font-size: .75rem;
        color: ${gray};
    }

    ul {
        border: 1px solid ${orange};
        border-left-width: .5rem;
        margin: 1.5rem auto;
    }

    .confirm-btn {
        background: ${orange};

        &:hover {
            background: ${darkOrange};
        }
    }

    .confirm-btn:disabled {
        background: ${gray};

        &:hover {
            background: ${gray};
        }
    }

    .cancel-btn {
        background: ${gray};

        &:hover {
            background: ${darkGray};
        }
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
        moveNote,
        error,
        loading
    } = noteContext;

    const autoSaveInterval = 10000;
    const [autoSave, setAutoSave] = useState(true);
    const [autoSaveIntervalToken, setAutoSaveIntervalToken] = useState({});
    const [saveTextUpdateInterval, setSaveTextUpdateInterval] = useState(10000);
    const [modelOpen, setModelOpen] = useState(false);
    const [deleteNoteVisible, setDeleteNoteVisible] = useState(false);
    const [destNotedir, setDestNotedir] = useState(null);

    const toggleOpen = () => setModelOpen(!modelOpen);

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

    const defaultColor = {
        edit: gray,
        view: gray,
        discard: gray,
        delete: gray,
        move: gray
    };

    const [color, setColor] = useState(defaultColor);
    const [listCollapse, setListCollapse] = useState({
        notedir: false,
        note: false
    });

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
        setDeleteNoteVisible(false);
    }

    const onCancelDelete = e => {
        setDeleteNoteVisible(false);
    }

    const onView = e => {
        e.preventDefault();
        setNoteMode(NOTEMODE.READ);
    }

    const onDiscard = e => {
        e.preventDefault();
        current && discardCacheNote(current._id);
    }

    const openMoveNoteModel = e => {
        e.preventDefault();
        current && setModelOpen(!modelOpen);
    }

    const onMove = e => {
        e.preventDefault();
        if(destNotedir) {
            const noteField = {...current, ['notedir']: destNotedir};
            moveNote(current._id, noteField);
            setDestNotedir(null);
            setModelOpen(false);
        }
    }

    const onModelClose = e => {
        e.preventDefault();
        setDestNotedir(null);
        setModelOpen(false);
    }

    const toggleDeleteOpen = () => {
        setDeleteNoteVisible(!deleteNoteVisible);
    }

    const toggleNotedirCollapse = () => {
        setListCollapse({...listCollapse, ['notedir']: !listCollapse.notedir});
    }

    const toggleNoteCollapse = () => {
        setListCollapse({...listCollapse, ['note']: !listCollapse.note});
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

    const iconChange = {
        'edit': () => {
            setColor({...defaultColor, ['edit']: current && cacheCurrent ? orange : defaultColor.edit});
        },
        'view': () => {
            setColor({...defaultColor, ['view']: orange});
        },
        'discard': () => {
            setColor({...defaultColor, ['discard']: cacheCurrent ? orange : defaultColor.discard});
        },
        'delete': () => {
            setColor({...defaultColor, ['delete']: orange});
        },
        'move': () => {
            setColor({...defaultColor, ['move']: current && cacheCurrent ? orange : defaultColor.move});
        },
        'default': () => {
            setColor(defaultColor);
        }
    }

    const Notedir = ({notedir, onSelect}) => {
        const notedirSelect = e => {
            e.preventDefault();
            onSelect(notedir._id);
        }

        return <NotedirContainer
                    isCurrent={destNotedir === notedir._id}
                    onClick={notedirSelect}>
                    {notedir.title}
                </NotedirContainer>;
    };

    const BtnContent = ({onChange, children}) => {
        return <span
                    onMouseEnter={onChange}
                    onMouseLeave={iconChange.default}>
                    {children}
                </span>;
    };

    return (
        <NoteContainer notedirCollapse={listCollapse.notedir} noteCollapse={listCollapse.note}>
            <ul className='side-bar'>
                <li className='notedir-item' onClick={toggleNotedirCollapse}>目 錄</li>
                <li className='note-item' onClick={toggleNoteCollapse}>筆 記</li>
            </ul>
            <Notedirs notebookId={match.params.id} toggleCollapse={toggleNotedirCollapse}/>
            <Notes
                addEvent={onAdd}
                setCacheNoteContent={setCacheNoteContent}
                setNoteContent = {setNoteContent}
                toggleCollapse={toggleNoteCollapse} />
            <EditorArea className='editor-area'
                showToolPanel={noteMode === NOTEMODE.EDIT}
                current={current}
                cacheCurrent={cacheCurrent}>
                <div className='note-header'>
                    {deleteEnable ? (<button className='note-delete-btn right-align' onClick={toggleDeleteOpen}>
                        <BtnContent onChange={iconChange.delete} children={<Trash size={20} color={color.delete} />} />
                    </button>)
                    : (<button className='note-discard-btn right-align' onClick={onDiscard} disabled={!cacheCurrent}>
                            <BtnContent onChange={iconChange.discard} children={<FileX size={20} color={color.discard} />} />
                        </button>)}
                    {noteMode === NOTEMODE.EDIT ?
                    (<button
                        className='note-view-btn right-align'
                        onClick={onView}
                        disabled={!(cacheCurrent && current && cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) === -1)}>
                        <BtnContent onChange={iconChange.view} children={<Browser size={20} color={color.view} />} />
                    </button>)
                    : (<button className='note-edit-btn right-align' onClick={onEdit} disabled={!(current && cacheCurrent)}>
                        <BtnContent onChange={iconChange.edit} children={<NotePencil size={20} color={color.edit} />} />
                    </button>)}
                    <button className='note-move-btn right-align' onClick={openMoveNoteModel} disabled={!(current && cacheCurrent)}>
                        <BtnContent onChange={iconChange.move} children={<ArrowsLeftRight size={20} color={color.move} />} />
                    </button>
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
            {/* <div className='recycle-bin'>
                <button className='recycle-bin-btn' onClick={LoadRecycleBin}>回收站</button>
            </div> */}
            <Models
                isOpen={deleteNoteVisible}
                toggleOpen={toggleDeleteOpen}
                onConfirm={onDelete}
                onCancel={onCancelDelete}
                modelStyle={deleteStyle}>
                <Models.Content>
                    <p>筆記將會移動至回收站，確定刪除嗎？</p>
                </Models.Content>
                <Models.ConfirmBtn enable={true}>刪除</Models.ConfirmBtn>
                <Models.CancelBtn>取消</Models.CancelBtn>
            </Models>
            <Models
                isOpen={modelOpen}
                toggleOpen={toggleOpen}
                onConfirm={onMove}
                onCancel={onModelClose}
                modelStyle={modelStyle}>
                <Models.Content>
                    <p className='title'>移動筆記</p>
                    <p className='tip'>請選擇要存放此筆記的目錄</p>
                    <ul>
                        {notedirContext.notedirs && notedirContext.notedirs.map(notedir => {
                            return !notedir.default
                            && (<Notedir
                                key={notedir._id}
                                notedir={notedir}
                                onSelect={setDestNotedir} />)
                        })}
                    </ul>
                </Models.Content>
                <Models.ConfirmBtn enable={destNotedir !== null}>移動</Models.ConfirmBtn>
                <Models.CancelBtn>取消</Models.CancelBtn>
            </Models>
            <MediumAndBelow>
                <div className='rwd-nav-bar'>
                    <button>目錄</button>
                    <button>筆記</button>
                    <button>編輯器</button>
                    <button>回收站</button>
                </div>
            </MediumAndBelow>
        </NoteContainer>
    )
}

export default Note;