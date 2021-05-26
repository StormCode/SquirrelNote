import axios from 'axios';
import { encrypt, decrypt } from '../utils/crypto';
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
} from './types.js';
import {
    DELETE_NOTE_SUCCESS,
    MOVE_NOTE_SUCCESS
} from './success';
import {
    DELETE_NOTE_ERROR,
    MOVE_NOTE_ERROR,
    GET_NOTE_ERROR,
    GET_NOTE_DETAIL_ERROR,
    SERVER_ERROR,
    UNKNOW_ERROR
} from './error';

//查詢筆記本裡全部筆記清單
export const getAllNotes = notebookId => async dispatch => {
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
export const getNotes = notedirId => async dispatch => {
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
export const getNoteDetail = id => async dispatch => {
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
export const setCurrentNote = note => dispatch => {
    dispatch({
        type: SET_CURRENT_NOTE,
        payload: note
    });
}

//清除目前的筆記內容
export const clearCurrentNote = () => dispatch => {
    dispatch({ type: CLEAR_CURRENT_NOTE });
}

//新增筆記
export const addNote = (notedir, id, note, keyword) => async dispatch => {
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
export const updateNote = (notedir, id, note, keyword) => async dispatch => {
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
export const deleteNote = (notedirId, noteId) => async dispatch => {
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
export const moveNote = (id, note, destNotedirTitle, delItemCallback) => async dispatch => {
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
export const filterNote = text => dispatch => {
    dispatch({
        type: FILTER_NOTE,
        payload: text
    });
}

//新增暫存的筆記
export const appendCacheNote = (notedir, cacheNote) => dispatch => {
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
export const modifyCacheNote = (notedir, cacheNote) => dispatch => {
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
export const removeCacheNote = (notedir, id) => dispatch => {
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
export const setCacheNote = note => dispatch => {
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
export const setSave = saveState => dispatch => {
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
export const enableDelete = () => dispatch => {
    dispatch({ type: ENABLE_DELETE });
}

//停用刪除功能
export const disableDelete = () => dispatch => {
    dispatch({ type: DISABLE_DELETE });
}

//清除篩選筆記
export const clearFilterNote = () => dispatch => {
    dispatch({ type: CLEAR_FILTER_NOTE });
}

//清除筆記資料
export const clearNote = () => dispatch => {
    dispatch({ type: CLEAR_NOTE });
}