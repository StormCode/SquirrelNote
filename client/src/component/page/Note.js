import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import { Notebook } from "phosphor-react";
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { decrypt } from '../../utils/crypto';
import Tooltip from "@material-ui/core/Tooltip";
import styled from 'styled-components';
import { NotePencil, Browser, FileX, Trash, ArrowsLeftRight } from "phosphor-react";
import makeResponsiveCSS from '../../utils/make-responsive-css';
import Spinner from '../layout/Spinner';

import ImgSrcParser from '../../general/imgSrcParser';
import Notedirs from '../notedirs/NoteDirs';
import Notes from '../notes/Notes';
import Editor from '../general/Editor';
import Models from '../general/Models';

// Import Resource
import EditorSmallImage from '../../assets/note/editor_300w.png';
import EditorMediumImage from '../../assets/note/editor_1000w.png';
import EditorLargeImage from '../../assets/note/editor_2000w.png';

// Import Style
import { theme } from '../../style/themes';
import deleteStyle from '../../style/model/delete';
import IntroBox from '../../style/general/IntroBox';

import AuthContext from '../../context/auth/authContext';
import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';
import { setAlert } from '../../actions/alertActions';
import {
    getNotebooks,
    setCurrentNotebook
} from '../../actions/notebookActions';

import SaveButton from '../notes/SaveButton';
import {
    SAVING,
    SAVED
} from '../../saveState';
import {
    SAVE_NOTE_ERROR,
    UPLOAD_IMAGE_ERROR
} from '../../error';

const { orange, lightOrange, darkOrange, yellow, gray, lightGrayOpacity3, darkGray } = theme;

const MainContainerBaseStyle = `
    flex: 1 1 auto;
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
    height: 100%;

    .header-panel {
        flex: 0 0 auto;
        position: relative;
        background: linear-gradient(90deg,#fff 75%, ${lightGrayOpacity3} 100%);
        border-bottom: 3px solid;
        border-image: linear-gradient(45deg, ${orange}, ${yellow}) 1;
        color: ${darkGray};
    }

        .header-panel .parlgrm {
            position: absolute;
            top: 0;
            left: 0;
            background: ${orange};
            display: inline-block;
            min-width: 3.5rem;
            margin-left: -.5rem;
            margin-right: .5rem;
            height: 100%;
            transform: skew(-30deg);
        }

        .header-panel .notebook-icon {
            position: absolute;
            top: 0;
            left: .8rem;
            color: #FFF;
        }

        .header-panel .title {
            text-indent: 4rem;
            font-size: 1.2rem;
        }

    .content-panel {
        flex: 1 1 auto;
        display: flex;
        width: 100%;
        height: 100%;
    }

    .note-title-container {
        flex: 1 1 100%;
        display: flex;
        flex-flow: row nowrap;
        margin: 0 .5rem;
        width: 100%;
        height: 3rem;
    }

        .note-title-container .note-title {
            flex: 1 1 auto;
            border: none;
            border-top: 1px solid ${orange};
            border-radius: 0;
            outline: none;
            padding: .5rem;
            font-size: 1.5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

            .note-title-container .note-title:disabled {
                color: #000;
                background: none;
            }
`;

const MainContainerResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                .content-panel {
                    flex-flow: column nowrap;
                }

                .rwd-nav-bar {
                    position: sticky;
                    bottom: 0;
                    z-index: 1;
                    display: flex;
                    flex-flow: row nowrap;
                }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                .content-panel {
                    flex-flow: row nowrap;
                }

                .rwd-nav-bar {
                    display: none;
                }
            `
        }
      ])
}

const MainContainer = styled.div`
    ${MainContainerBaseStyle}
    ${MainContainerResponsiveStyle()}
`;

const SideBar = styled.div`
    flex: 0 0 30px;
    background: ${orange};
    display: ${props => props.notedirCollapse || props.noteCollapse ? 'flex' : 'none'};
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
        display: ${props => props.notedirCollapse ? 'inline-block' : 'none'};
    }

    .note-item {
        display: ${props => props.noteCollapse ? 'inline-block' : 'none'};
    }
`;

const RwdNavbarBaseStyle = props => {
    return `
        flex: 1 1 25%;
        background: linear-gradient(${props.isCurrent ? orange : lightOrange}, ${darkOrange});
        position: relative;
        border: 1px solid ${darkOrange};
        padding: .5rem 0;
        font-size: 1.2rem;
        font-weight: bold;
        color: #000;

        &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            background: linear-gradient(rgba(255, 255, 255, .75), rgba(255, 255, 255, .1));
            width: 100%;
            height: 40%;
        }

        &:active {
            background: linear-gradient(${orange}, rgb(210, 87, 0));
        }
    `
};

const RwdNavButton = styled.button`
    ${props => RwdNavbarBaseStyle(props)}
`;

const NotedirModel = styled.li`
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
        padding: 2rem 1.5rem;
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
        padding: 1rem;
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

const NotedirContainerBaseStyle = `
    .recycle-bin {
        height: 2rem;
    }

        .recycle-bin > button {
            border: none;
            background: ${orange};
            color: #FFF;
            width: 100%;
            height: 100%;
        }

            .recycle-bin > button:hover {
                background: ${darkOrange};
            }
`;

const NotedirContainerResponsiveStyle = props => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                max-width: none;
                flex: 1 1 auto;
                display: ${props.visible ? 'flex' : 'none'};
                
                .recycle-bin {
                    flex: none;
                    display: none;
                }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                max-width: 20%;     /* 配合下面flex的設定 */

                flex: 0 1 20%;
                display: ${props.collapse ? 'none' : 'flex'};
                flex-flow: column nowrap;
                
                .recycle-bin {
                    flex: 0 1 auto;
                    display: block;
                }
            `
        }
    ])
}

const NotedirContainer = styled.div`
    ${NotedirContainerBaseStyle}
    ${props => NotedirContainerResponsiveStyle(props)}
`;

const NoteContainerBaseStyle = `
    flex-flow: column nowrap;
`;

const NoteContainerResponsiveStyle = props => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                max-width: none;
                flex: 1 1 auto;
                display: ${props.visible ? 'flex' : 'none'};
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                max-width: 20%;     /* 配合下面flex的設定 */

                flex: 0 1 20%;
                display: ${props.collapse ? 'none' : 'flex'};
            `
        }
    ])
}

const NoteContainer = styled.div`
    ${NoteContainerBaseStyle}
    ${props => NoteContainerResponsiveStyle(props)}
`;

const EditorAreaContainerBaseStyle = `
    flex-flow: column nowrap;
`;

const EditorAreaContainerResponsiveStyle = props => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                flex: 1 1 auto;
                display: ${props.visible ? 'flex' : 'none'};
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                flex: 1 1 60%;
                display: flex;
                width: 0;
            `
        }
    ])
}

const EditorAreaContainer = styled.div`
    ${EditorAreaContainerBaseStyle}
    ${props => EditorAreaContainerResponsiveStyle(props)}
`;

const EditorAreaBaseStyle = props => {
    return `
        flex: 1 1 100%;
        display: flex;
        border-left: 1px solid rgba(255,120,0,1);
        flex-flow: column nowrap;
        height: 100%;

        .note-header {
            flex: 0 1 50px;
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-end;
        }

        .editor {
            flex: 1 1 auto;
            overflow-x: hidden;
            overflow-y: auto;
            height: 0;
        }

        .ck-sticky-panel {
            display: ${props.showToolPanel ? 'block' : 'none'};
        }

        .ck-editor__editable {
            border: none;
        }

        .ck-editor__main {
            overflow-x: hidden;
            overflow-y: auto;
            height: 0;
        }

        .tiny-btn {
            margin: 0 5px;
            padding: 0;
            border: none;
            background: none;
        }

        .editor-function-container {
            position: relative;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            margin-top: .3rem;
            height: 2.5rem;
        }

            .editor-function-container:before {
                content: '';
                background: ${orange};
                display: inline-block;
                position: absolute;
                top: 10%;
                left: -1rem;
                width: .5rem;
                height: 80%;
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

const EditorArea = styled.div`
    ${props => EditorAreaBaseStyle(props)}
`;

const Note = ({ 
    match,
    notebooks,
    currentNotebook,
    getNotebooks,
    setCurrentNotebook,
    setAlert 
}) => {
    const history = useHistory();
    const authContext = useContext(AuthContext);
    const notedirContext = useContext(NotedirContext);
    const noteContext = useContext(NoteContext);

    useEffect(() => {
        authContext.loadUser();

        return () => {
            // 清除自動儲存interval
            clearInterval(autoSaveIntervalToken.current.value);
            autoSaveIntervalToken.current = null;
        }

        // eslint-disable-next-line
    }, []);

    const {
        notes,
        current,
        cacheCurrent,
        cacheMap,
        appendCacheNote,
        modifyCacheNote,
        removeCacheNote,
        setCacheNote,
        setCurrentNote,
        clearCurrentNote,
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
        success,
        error,
        loading
    } = noteContext;

    const notedirLoading = notedirContext.loading;
    const noteLoading = noteContext.loading;
    const autoSaveInterval = process.env.REACT_APP_AUTOSAVE_INTERVAL || 300000;
    const [autoSave] = useState(true);
    const [saveTextUpdateInterval] = useState(10000);
    const [modelOpen, setModelOpen] = useState(false);
    const [deleteNoteVisible, setDeleteNoteVisible] = useState(false);
    const [destNotedir, setDestNotedir] = useState(null);
    const [destNotedirError, setDestNotedirError] = useState(false);
    const autoSaveIntervalToken = useRef({});
    
    const toggleOpen = () => setModelOpen(!modelOpen);
    
    //目前筆記的狀態：編輯/閱讀模式
    const NOTEMODE = {
        EDIT: 'EDIT',
        READ: 'READ'
    };
    
    const [noteMode, setNoteMode] = useState(NOTEMODE.READ);
    
    const host = `${window.location.protocol}//${window.location.host}`;
    
    const notedirs = notedirContext.notedirs;
    const notedirId = notedirContext.current !== '' ? notedirContext.current ? notedirContext.current._id : null : notedirContext.current;
    const setNoteCount = notedirContext.setNoteCount;
    const allCacheNotes = [...cacheMap.values()].flat();
    const currentCacheNotes = cacheMap.get(notedirId) || [];      // 目前目錄裡的快取筆記
    
    useEffect(() => {
        if(notebooks && notebooks.length > 0) {
            setCurrentNotebook(match.params.id);
        } else {
            getNotebooks();            
        }

        // eslint-disable-next-line
    }, [notebooks]);
    
    useEffect(() => {
        if(current && current._id && cacheCurrent) {
            if(currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) {
                modifyCacheNote(notedirId, current);
            } else {
                let currentNote = notes.find(note => note._id === current._id);
                currentNote && (cacheCurrent.title !== current.title || cacheCurrent.content !== current.content)
                && appendCacheNote(notedirId, current);
            }
        } else {
            //控制筆記狀態
            setNoteMode(NOTEMODE.READ);
        }

        // eslint-disable-next-line
    },[current, cacheCurrent, cacheMap]);
    
    useEffect(() => {
        window.addEventListener("beforeunload", onClose);
        
        return () => {
            window.removeEventListener("beforeunload", onClose);
        }

        // eslint-disable-next-line
    },[current, cacheMap]);
        
    useEffect(() => {
        //控制刪除狀態
        current && notes.map(note => note._id).indexOf(current._id) !== -1 ? enableDelete() : disableDelete();

        // eslint-disable-next-line
    },[current, notes]);
        
    useEffect(() => {
        // 當目錄切換時清除目前的筆記
        // 因為是直接清除current，可忽略current取到舊值的問題，所以在這裡並沒有相依current
        clearCurrentNote();
        
        // for 行動版:點擊目錄項目切換到筆記列表
        notedirContext.current !== null 
        && setPanelVisible({
            [PANEL.NOTEDIR]: false,
            [PANEL.NOTE]: true,
            [PANEL.EDITANDVIEW]: false
        });

        // eslint-disable-next-line
    }, [notedirContext.current]);

    useEffect(() => {
        success && setAlert(success, 'success');

        // eslint-disable-next-line
    }, [success]);

    useEffect(() => {
        error && setAlert(error, 'danger');

        // eslint-disable-next-line
    }, [error]);
        
    // 視窗關閉前確認是否有未儲存的暫存筆記
    const onClose = e => {
        if(allCacheNotes.length > 0) {
            e.preventDefault();
            e.returnValue = '';
        }
        
        return null;
    }
    
    const PANEL = {
        NOTEDIR: 'NOTEDIR',
        NOTE: 'NOTE',
        EDITANDVIEW: 'EDITANDVIEW'
    }

    const defaultPanelState = {
        [PANEL.NOTEDIR]: false,
        [PANEL.NOTE]: true,
        [PANEL.EDITANDVIEW]: false
    };
        
    const [panelVisible, setPanelVisible] = useState(defaultPanelState);
    const [noteFilterKeyword, setNoteFilterKeyword] = useState(null);

    const setKeyword = keyword => {
        setNoteFilterKeyword(keyword);
    }
        
    const titleChange = useCallback(e => {
        e.preventDefault();
        
        current && setCurrentNote({ title: e.target.value });

        // eslint-disable-next-line
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
        current && setCurrentNote({ content: data });

        // eslint-disable-next-line
    },[current]);

    const setCacheNoteContent = note => {
        let currentNote = {
            _id: note._id,
            title: note.title,
            content: currentCacheNotes.find(cacheNote => {
                return cacheNote._id === note._id
            }).content,
            notedir: note.notedir
        };
        setCacheNote(currentNote);
        setNoteMode(NOTEMODE.EDIT);
    }

    const setNoteContent = note => {
        //取得筆記內容
        getNoteDetail(note._id);

        // for 行動版: 切換到編輯/檢視panel
        setPanelVisible({
            [PANEL.NOTEDIR]: false,
            [PANEL.NOTE]: false,
            [PANEL.EDITANDVIEW]: true
        });
    };

    const onAdd = e => {
        e.preventDefault();
        let newNote = {
            _id: uuidv4(),
            title: '',
            content: '',
            date: null,
            notedir: notedirId
        };
        appendCacheNote(notedirId, newNote);
        setNoteMode(NOTEMODE.EDIT);

        // for 行動版: 切換到編輯/檢視panel
        setPanelVisible({
            [PANEL.NOTEDIR]: false,
            [PANEL.NOTE]: false,
            [PANEL.EDITANDVIEW]: true
        });
    };

    const onEdit = e => {
        e.preventDefault();
        setNoteMode(NOTEMODE.EDIT);
    }

    const onDelete = e => {
        e.preventDefault();
        // 若目前的目錄是在「(全部)」則用快取筆記裡的目錄ID
        let deleteNotedirId;
        let noteCount;
        if(notedirId === '') {
            deleteNotedirId = cacheCurrent.notedir;
            noteCount = notedirs.find(notedir => notedir._id === deleteNotedirId).note_count - 1;
        } else {
            deleteNotedirId = notedirId;
            noteCount = notedirContext.current.note_count - 1;
        }
        current && deleteNote(deleteNotedirId, current._id);
        setDeleteNoteVisible(false);
        setNoteCount(deleteNotedirId, noteCount);
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
        removeCacheNote(notedirId, current._id);
        clearCurrentNote();
    }

    const openMoveNoteModel = e => {
        e.preventDefault();
        current && setModelOpen(!modelOpen);
    }

    const onMove = e => {
        e.preventDefault();
        
        // 回傳移動筆記後清單是否要移除移動的項目
        const delItemCallback = () => {
            return notedirId !== '' ? true : false;
        }

        if(destNotedir) {
            const noteField = {...current, 'notedir': destNotedir._id};
            let sourceNotedirId;
            let sourceNoteCount;
            const destNotedirId = destNotedir._id;
            const destNoteCount = destNotedir.note_count + 1;
            // 若目前的目錄是在「(全部)」則用快取筆記裡的目錄ID
            if(notedirId === '') {
                sourceNotedirId = cacheCurrent.notedir;
                sourceNoteCount = notedirs.find(notedir => notedir._id === sourceNotedirId).note_count - 1;
            } else {
                sourceNotedirId = notedirId;
                sourceNoteCount = notedirContext.current.note_count - 1;
            }
            moveNote(current._id, noteField, destNotedir.title, delItemCallback);
            setNoteCount(sourceNotedirId, sourceNoteCount);
            setNoteCount(destNotedirId, destNoteCount);
            setDestNotedir(null);
            setModelOpen(false);
        }
    }

    const onModelClose = e => {
        e.preventDefault();
        setDestNotedir(null);
        setDestNotedirError(false);
        setModelOpen(false);
    }

    const toggleDeleteOpen = () => {
        setDeleteNoteVisible(!deleteNoteVisible);
    }

    const toggleNotedirCollapse = () => {
        setListCollapse({...listCollapse, 'notedir': !listCollapse.notedir});
    }

    const toggleNoteCollapse = () => {
        setListCollapse({...listCollapse, 'note': !listCollapse.note});
    }

    const onEditorDoubleClick = e => {
        e.preventDefault();
        if(cacheCurrent && noteMode === NOTEMODE.READ) {
            setNoteMode(NOTEMODE.EDIT);
        }
    }

    const onSave = async () => {
        if(current && (current.title !== '' || current.content !== '')
        && (currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1)) {
            try {
                //設定儲存狀態為正在儲存
                setSave({state: SAVING, showUpdateTime: false});

                let newContent = await ReplaceImage(current.content);

                // 判斷筆記儲存的目錄
                let saveNotedirId;
                let noteCount;

                // 1. 判斷要做Add還是Update
                // 2. 判斷筆記儲存的目錄
                if(notes.map(note => note._id).indexOf(current._id) === -1) {
                    // 若目前的目錄是在「(全部)」則把筆記存入預設的目錄
                    if(notedirId === '') {
                        let currentNotebook = notebooks.find(notebook => notebook._id === match.params.id);
                        let defaultNotedirId = currentNotebook.notedirs.find(notedir => notedir.default === true)._id;
                        saveNotedirId = defaultNotedirId;
                        noteCount = notedirs.find(notedir => notedir._id === defaultNotedirId).note_count + 1;
                        
                    } else {
                        saveNotedirId = notedirId;
                        noteCount = notedirContext.current.note_count + 1;
                    }

                    // 儲存筆記
                    let saveNote = {
                        title: current.title,
                        content: newContent,
                        notedir: saveNotedirId
                    };
                    
                    // 新增筆記
                    addNote(notedirId, current._id, saveNote, noteFilterKeyword);
                    setNoteCount(saveNotedirId, noteCount);
                } else {
                    //如果內容有被改過但又被改回來，儲存狀態直接設已儲存、移除快取筆記
                    //儲存按鈕上的儲存時間從資料庫抓，因為實際上沒有執行儲存，所以時間應該顯示上次儲存的時間
                    if(cacheCurrent.title === current.title && cacheCurrent.content === current.content) {
                        removeCacheNote(notedirId, current._id);
                        setSave({state: SAVED, showUpdateTime: true});
                        return;
                    }

                    // 若此筆記是已儲存過的筆記用目前筆記裡的目錄ID，否則用目前目錄ID
                    if(notes.findIndex(note => note._id === current._id) !== -1) {
                        saveNotedirId = current.notedir;
                    } else {
                        saveNotedirId = notedirId;
                    }
    
                    // 儲存筆記
                    let saveNote = {
                        title: current.title,
                        content: newContent,
                        notedir: saveNotedirId
                    };

                    // 更新筆記
                    updateNote(notedirId, current._id, saveNote, noteFilterKeyword);
                }
            } catch {
                setAlert(SAVE_NOTE_ERROR, 'danger');
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

                    if(!imgFile) throw new Error('圖片轉換發生錯誤');

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
                catch {
                    setAlert(UPLOAD_IMAGE_ERROR, 'danger');
                }
            }

            return _content;
        }
    };

    const onAutoSave = () => {
        current && (current.title !== '' || current.content !== '')
        && (currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) 
        && setAlert('自動儲存...','info',1500);
        onSave();
    }

    useEffect(() => {
        // 清除上一次的token
        autoSaveIntervalToken.current.value && clearInterval(autoSaveIntervalToken.current.value);

        // 當自動儲存開啟/關閉改變時執行(清除setinterval或設定setinterval)
        if(autoSave && noteMode === NOTEMODE.EDIT && currentCacheNotes.length > 0){
            autoSaveIntervalToken.current.value = setInterval(onAutoSave, autoSaveInterval);
        }
        else{
            clearInterval(autoSaveIntervalToken.current.value);
            autoSaveIntervalToken.current.value = null;
        }

        // eslint-disable-next-line
    }, [autoSave, current, cacheCurrent, cacheMap , autoSaveInterval, noteMode]);

    const LoadRecycleBin = () => {
        history.push('/recyclebin');
    };

    const iconChange = {
        'edit': () => {
            setColor({...defaultColor, 'edit': current && cacheCurrent ? orange : defaultColor.edit});
        },
        'view': () => {
            setColor({...defaultColor, 'view': current && cacheCurrent && currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) === -1 ? orange : defaultColor.view});
        },
        'discard': () => {
            setColor({...defaultColor, 'discard': cacheCurrent ? orange : defaultColor.discard});
        },
        'delete': () => {
            setColor({...defaultColor, 'delete': orange});
        },
        'move': () => {
            setColor({...defaultColor, 'move': current && cacheCurrent && currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) === -1 ? orange : defaultColor.move});
        },
        'default': () => {
            setColor(defaultColor);
        }
    }

    const Notedir = ({notedir, onSelect}) => {
        const notedirSelect = e => {
            e.preventDefault();

            // 判斷選取的目錄是否為筆記目前存放的目錄
            if(notedir._id === current.notedir) {
                setDestNotedirError(true);
            } else {
                setDestNotedirError(false);
                onSelect(notedir);
            }
        }

        return <NotedirModel
                    isCurrent={destNotedir !== null ? destNotedir._id === notedir._id : false}
                    onClick={notedirSelect}>
                    {notedir.title}
                </NotedirModel>;
    };

    const BtnContent = ({onChange, children, tooltip}) => {
        return <Tooltip
            title={tooltip}
            placement='top'
        >
            <span
                onMouseEnter={onChange}
                onMouseLeave={iconChange.default}>
                {children}
            </span>
        </Tooltip>
    };

    // 行動版切換目錄列表/筆記列表/編輯及檢視
    const togglePanel = e => {
        e.preventDefault();
        let panelState = {
            [PANEL.NOTEDIR]: false,
            [PANEL.NOTE]: false,
            [PANEL.EDITANDVIEW]: false
        };
        panelState = {...panelState, [e.target.name]: true};
        setPanelVisible(panelState);
    }

    return (
        <MainContainer>
            {currentNotebook ? <div className='header-panel'><i className='parlgrm'></i><span className='notebook-icon'><Notebook size={20} /></span><p className='title'>{currentNotebook.title}</p></div> : null}
            <div className='content-panel'>
                <SideBar notedirCollapse={listCollapse.notedir} noteCollapse={listCollapse.note}>
                    <li className='notedir-item' onClick={toggleNotedirCollapse}>目 錄</li>
                    <li className='note-item' onClick={toggleNoteCollapse}>筆 記</li>
                </SideBar>
                {(notedirLoading || noteLoading) ? <Spinner /> : null}
                <NotedirContainer visible={panelVisible.NOTEDIR} collapse={listCollapse.notedir}>
                    <Notedirs 
                        notebookId={match.params.id} 
                        toggleCollapse={toggleNotedirCollapse}/>
                    <div className='recycle-bin'>
                        <button className='recycle-bin-btn' onClick={LoadRecycleBin}>回收站</button>
                    </div>
                </NotedirContainer>
                <NoteContainer visible={panelVisible.NOTE} collapse={listCollapse.note}>
                    <Notes
                        notebookId={match.params.id}
                        addEvent={onAdd}
                        setCacheNoteContent={setCacheNoteContent}
                        setNoteContent = {setNoteContent}
                        setKeyword={setKeyword} 
                        toggleCollapse={toggleNoteCollapse}/>
                </NoteContainer>
                <EditorAreaContainer visible={panelVisible.EDITANDVIEW}>
                    <EditorArea className='editor-area'
                        showToolPanel={noteMode === NOTEMODE.EDIT}
                        current={current}
                        cacheCurrent={cacheCurrent}>
                        <div className='note-header'>
                            <div className='editor-function-container'>
                                {(deleteEnable && currentCacheNotes.length === 0) || (current && currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) === -1) ? 
                                    (<button className='note-delete-btn tiny-btn' onClick={toggleDeleteOpen}>
                                        <BtnContent onChange={iconChange.delete} children={<Trash size={22} color={color.delete} />} tooltip='刪除筆記' />
                                </button>)
                                : (<button className='note-discard-btn tiny-btn' onClick={onDiscard} disabled={!cacheCurrent}>
                                        <BtnContent onChange={iconChange.discard} children={<FileX size={22} color={color.discard} />} tooltip='捨棄筆記' />
                                    </button>)}
                                {noteMode === NOTEMODE.EDIT ?
                                (<button
                                    className='note-view-btn tiny-btn'
                                    onClick={onView}
                                    disabled={!(cacheCurrent && current && currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) === -1)}>
                                    <BtnContent onChange={iconChange.view} children={<Browser size={22} color={color.view} />} tooltip='檢視筆記' />
                                </button>)
                                : (<button className='note-edit-btn tiny-btn' onClick={onEdit} disabled={!(current && cacheCurrent)}>
                                    <BtnContent onChange={iconChange.edit} children={<NotePencil size={22} color={color.edit} />} tooltip='編輯筆記' />
                                </button>)}
                                <button 
                                    className='note-move-btn tiny-btn' 
                                    onClick={openMoveNoteModel} 
                                    disabled={!(cacheCurrent && current && currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) === -1)}>
                                    <BtnContent onChange={iconChange.move} children={<ArrowsLeftRight size={22} color={color.move} />} tooltip='移動筆記' />
                                </button>
                            </div>
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
                        {current ?
                            <Editor
                                enable={noteMode === NOTEMODE.EDIT}
                                content={current.content ? current.content : ''}
                                loading={loading}
                                contentChange={contentChange}
                                onDoubleClick={onEditorDoubleClick} />
                            : <IntroBox>
                                <img alt='editor-bg' src={EditorSmallImage}
                                    srcSet={`
                                        ${EditorSmallImage} 300w,
                                        ${EditorMediumImage} 1000w,
                                        ${EditorLargeImage} 2000w
                                    `}
                                />
                                <p>你可以在這裡編輯/檢視筆記內容</p>
                            </IntroBox>
                        }
                    </EditorArea>
                </EditorAreaContainer>
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
                        {destNotedirError ? 
                            <Alert color="warning">
                                此筆記目前已存放在你選取的目錄
                            </Alert>
                        : null}
                        <ul>
                            {notedirs && notedirs.map(notedir => {
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
                <div className='rwd-nav-bar'>
                    <RwdNavButton name={PANEL.NOTEDIR} onClick={togglePanel} isCurrent={panelVisible.NOTEDIR === true}>目錄</RwdNavButton>
                    <RwdNavButton name={PANEL.NOTE} onClick={togglePanel} isCurrent={panelVisible.NOTE === true}>筆記</RwdNavButton>
                    <RwdNavButton name={PANEL.EDITANDVIEW} onClick={togglePanel} isCurrent={panelVisible.EDITANDVIEW === true}>編輯/檢視</RwdNavButton>
                    <RwdNavButton onClick={LoadRecycleBin}>回收站</RwdNavButton>
                </div>
            </div>
        </MainContainer>
    )
}

Note.propTypes = {
    match: PropTypes.object.isRequired,
    notebooks: PropTypes.array,
    current: PropTypes.object,
    getNotebooks: PropTypes.func.isRequired,
    setCurrentNotebook: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired
}

const mapStateProps = state => ({
    notebooks: state.notebooks.notebooks,
    currentNotebook: state.notebooks.current
});

export default connect(
    mapStateProps,
    { getNotebooks, setCurrentNotebook, setAlert }
)(Note);