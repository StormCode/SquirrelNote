import React, { useReducer } from 'react';
import axios from 'axios';
import { encrypt, decrypt } from '../../utils/crypto';
import NoteContext from './noteContext';
import NoteReducer from './noteReducer';
import {
    GET_NOTES,
    GET_NOTE_DETAIL,
    SET_CURRENT_NOTE,
    CLEAR_CURRENT_NOTE,
    ADD_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE,
    MOVE_NOTE,
    FILTER_NOTE,
    CLEAR_FILTER_NOTE,
    APPEND_CACHE_NOTE,
    MODIFY_CACHE_NOTE,
    REMOVE_CACHE_NOTE,
    SET_CACHE_NOTE,
    SET_SAVE,
    ENABLE_DELETE,
    DISABLE_DELETE,
    CLEAR_NOTE,
    NOTE_ERROR,
    NOTE_SAVE_ERROR
} from '../types.js';
import {
    DISABLESAVE
} from '../../saveState';
import {
    DELETE_NOTE_SUCCESS,
    MOVE_NOTE_SUCCESS
} from '../../success';
import {
    DELETE_NOTE_ERROR,
    MOVE_NOTE_ERROR,
    GET_NOTE_ERROR,
    GET_NOTE_DETAIL_ERROR,
    SERVER_ERROR,
    UNKNOW_ERROR
} from '../../error';

const NoteState = props => {
    const initialState = {
        notes: null,
        current: null,
        cacheCurrent: null,
        save: {
            state: DISABLESAVE,
            showUpdateTime: false
        },
        cacheMap: new Map(),    //對應筆記目錄裡的快取筆記
        cacheNotes: [],
        deleteEnable: false,
        filtered: null,
        orderBy: 'asc',
        sortBy: 'title',
        success: null,
        error: null,
        saveResult: null,
        loading: true
    };

    const [state, dispatch] = useReducer(NoteReducer, initialState);

    //查詢筆記本裡全部筆記清單
    const getAllNotes = async notebookId => {
        const config = {
            headers: {
                'x-notebook': encrypt(notebookId, process.env.REACT_APP_SECRET_KEY, false)
            }
        };

        try {
            //todo: 動態load N筆資料
            const res = await axios.get('/api/notes',config);
            // 解密Server回傳的note資料
            const decryptedDatas = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedDatas.forEach(decryptedData => {
                decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
                decryptedData.summary = decrypt(decryptedData.summary, process.env.REACT_APP_SECRET_KEY, false);
            });
            dispatch({
                type: GET_NOTES,
                payload: decryptedDatas
            });
        } catch (err) {
            dispatch({
                type: NOTE_ERROR,
                payload: `${GET_NOTE_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    //查詢單一目錄全部筆記清單
    const getNotes = async notedirId => {
        const config = {
            headers: {
                'x-notedir': encrypt(notedirId, process.env.REACT_APP_SECRET_KEY, false)
            }
        };

        try {
            //todo: 動態load N筆資料
            const res = await axios.get('/api/notes',config);
            // 解密Server回傳的note資料
            const decryptedDatas = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedDatas.forEach(decryptedData => {
                decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
                decryptedData.summary = decrypt(decryptedData.summary, process.env.REACT_APP_SECRET_KEY, false);
            });
            dispatch({
                type: GET_NOTES,
                payload: decryptedDatas
            });
        } catch (err) {
            dispatch({
                type: NOTE_ERROR,
                payload: `${GET_NOTE_ERROR}: ${err.msg || SERVER_ERROR}`
            })
        }
    }

    //查詢筆記內容
    const getNoteDetail = async id => {
        try {
            const res = await axios.get(`/api/notes/${id}`);
            // 解密Server回傳的note資料
            const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            decryptedData.content = decrypt(decryptedData.content, process.env.REACT_APP_SECRET_KEY, false);
            dispatch({
                type: GET_NOTE_DETAIL,
                payload: decryptedData
            });
        } catch (err) {
            dispatch({
                type: NOTE_ERROR,
                payload: `${GET_NOTE_DETAIL_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    //設定目前的筆記內容
    const setCurrentNote = note => {
        dispatch({
            type: SET_CURRENT_NOTE,
            payload: note
        });
    }

    //清除目前的筆記內容
    const clearCurrentNote = () => {
        dispatch({ type: CLEAR_CURRENT_NOTE });
    }

    //新增筆記
    const addNote = async (notedir, id, note, keyword) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            // 加密傳至Server的note資料
            const encryptedData = {data: encrypt(note, process.env.REACT_APP_SECRET_KEY)};
            const res = await axios.post('/api/notes/', encryptedData, config);
            // 解密Server回傳的note資料
            const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            decryptedData.summary = decrypt(decryptedData.summary, process.env.REACT_APP_SECRET_KEY, false);
            dispatch({
                type: ADD_NOTE,
                payload: {
                    notedir,
                    id,
                    note: {...decryptedData, content: note.content, notedir: note.notedir},
                    keyword
                }
            });
        } catch {
            dispatch({ type: NOTE_SAVE_ERROR });
        }
    }

    //修改筆記
    const updateNote = async (notedir, id, note, keyword) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            // 加密傳至Server的note資料
            const encryptedData = {data: encrypt(note, process.env.REACT_APP_SECRET_KEY)};
            const res = await axios.put(`/api/notes/${id}`, encryptedData, config);
            // 解密Server回傳的note資料
            const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            decryptedData.summary = decrypt(decryptedData.summary, process.env.REACT_APP_SECRET_KEY, false);
            dispatch({
                type: UPDATE_NOTE,
                payload: {
                    notedir,
                    id,
                    note: {...decryptedData, content: note.content, notedir: note.notedir}, 
                    keyword
                }
            });
        } catch {
            dispatch({ type: NOTE_SAVE_ERROR });
        }
    }

    //刪除筆記
    const deleteNote = async (notedirId, noteId) => {
        const config = {
            headers: {
                'x-notedir': encrypt(notedirId, process.env.REACT_APP_SECRET_KEY, false)
            }
        };

        try {
            await axios.delete(`/api/notes/${noteId}`,config);
            dispatch({
                type: DELETE_NOTE,
                payload: {id: noteId, success: DELETE_NOTE_SUCCESS}
            });
        } catch (err) {
            dispatch({ 
                type: NOTE_ERROR,
                payload: `${DELETE_NOTE_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    //移動筆記
    const moveNote = async (id, note, destNotedirTitle, delItemCallback) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            // 加密傳至Server的note資料
            const encryptedData = {data: encrypt(note, process.env.REACT_APP_SECRET_KEY)};
            await axios.put(`/api/notes/${id}`, encryptedData, config);
            delItemCallback() ? 
                dispatch({
                    type: MOVE_NOTE,
                    payload: {id, note, success: `${MOVE_NOTE_SUCCESS}到${destNotedirTitle}`}
                })
            : dispatch({ 
                type: CLEAR_CURRENT_NOTE,
                payload: {success: `${MOVE_NOTE_SUCCESS}到${destNotedirTitle}`}
             });
        } catch (err) {
            dispatch({ 
                type: NOTE_ERROR,
                payload: `${MOVE_NOTE_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    //篩選筆記
    const filterNote = text => {
        dispatch({
            type: FILTER_NOTE,
            payload: text
        });
    }

    //新增暫存的筆記
    const appendCacheNote = (notedir, cacheNote) => {
        try {
            dispatch({
                type: APPEND_CACHE_NOTE,
                payload: {notedir, cacheNote}
            });
        } catch {
            dispatch({ 
                type: NOTE_ERROR,
                payload: UNKNOW_ERROR
            });
        }
    }

    //編輯暫存的筆記
    const modifyCacheNote = (notedir, cacheNote) => {
        try {
            dispatch({
                type: MODIFY_CACHE_NOTE,
                payload: {notedir, cacheNote}
            });
        } catch {
            dispatch({ 
                type: NOTE_ERROR,
                payload: UNKNOW_ERROR
            });
        }
    }

    //刪除暫存的筆記
    const removeCacheNote = (notedir, id) => {
        try {
            dispatch({
                type: REMOVE_CACHE_NOTE,
                payload: {notedir, id}
            });
        } catch {
            dispatch({ 
                type: NOTE_ERROR,
                payload: UNKNOW_ERROR
            });
        }
    }

    //設定快取筆記
    const setCacheNote = note => {
        try {
            dispatch({
                type: SET_CACHE_NOTE,
                payload: note
            });
        } catch {
            dispatch({ 
                type: NOTE_ERROR,
                payload: UNKNOW_ERROR
            });
        }
    }

    //設定儲存狀態
    const setSave = saveState => {
        try {
            dispatch({ 
                type: SET_SAVE,
                payload: saveState
            });
        } catch {
            dispatch({ 
                type: NOTE_ERROR,
                payload: UNKNOW_ERROR
            });
        }
    }

    //啟用刪除功能
    const enableDelete = () => {
        dispatch({ type: ENABLE_DELETE });
    }

    //停用刪除功能
    const disableDelete = () => {
        dispatch({ type: DISABLE_DELETE });
    }

    //清除篩選筆記
    const clearFilterNote = () => {
        dispatch({ type: CLEAR_FILTER_NOTE });
    }

    //清除筆記資料
    const clearNote = () => {
        dispatch({ type: CLEAR_NOTE });
    }

    return (
        <NoteContext.Provider
        value={{
            notes: state.notes,
            current: state.current,
            cacheMap: state.cacheMap,
            cacheNotes: state.cacheNotes,
            cacheCurrent: state.cacheCurrent,
            deleteEnable: state.deleteEnable,
            save: state.save,
            filtered: state.filtered,
            orderBy: state.orderBy,
            sortBy: state.sortBy,
            success: state.success,
            error: state.error,
            saveResult: state.saveResult,
            loading: state.loading,
            getAllNotes,
            getNotes,
            getNoteDetail,
            setCurrentNote,
            clearCurrentNote,
            addNote,
            updateNote,
            deleteNote,
            moveNote,
            filterNote,
            clearFilterNote,
            appendCacheNote,
            modifyCacheNote,
            removeCacheNote,
            setCacheNote,
            setSave,
            enableDelete,
            disableDelete,
            clearNote
        }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;