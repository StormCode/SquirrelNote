import axios from 'axios';
import { encrypt, decrypt } from '../utils/crypto';

import {
    GET_NOTEDIRS,
    SET_CURRENT_NOTEDIR,
    CLEAR_CURRENT_NOTEDIR,
    ADD_NOTEDIR,
    UPDATE_NOTEDIR,
    DELETE_NOTEDIR,
    SORT_NOTEDIR,
    ENABLE_ADDNOTEDIR,
    DISABLE_ADDNOTEDIR,
    ENABLE_EDITNOTEDIR,
    DISABLE_EDITNOTEDIR,
    ENABLE_DELETENOTEDIR,
    DISABLE_DELETENOTEDIR,
    SET_NOTE_COUNT,
    CLEAR_NOTEDIR,
    NOTEDIR_ERROR
} from './types';
import {
    ADD_NOTEDIR_SUCCESS,
    UPDATE_NOTEDIR_SUCCESS,
    DELETE_NOTEDIR_SUCCESS
} from '../success';
import {
    GET_NOTEDIR_ERROR,
    ADD_NOTEDIR_ERROR,
    UPDATE_NOTEDIR_ERROR,
    DELETE_NOTEDIR_ERROR,
    SERVER_ERROR,
    UNKNOW_ERROR
} from '../error';

//查詢全部筆記目錄清單
export const getNotedirs = notebookId => async dispatch => {
    const config = {
        headers: {
            'x-notebook': encrypt(notebookId, process.env.REACT_APP_SECRET_KEY, false)
        }
    };

    try {
        const res = await axios.get('/api/notedirs',config);
        // 解密Server回傳的notedir資料
        const decryptedDatas = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
        decryptedDatas.forEach(decryptedData => {
            if(decryptedData.title) {
                decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            }
        });
        dispatch({
            type: GET_NOTEDIRS,
            payload: decryptedDatas
        });
    } catch(err) {
        dispatch({
            type: NOTEDIR_ERROR,
            payload: `${GET_NOTEDIR_ERROR}: ${err.msg || SERVER_ERROR}`
        })
    }
}

//設定目前的筆記目錄
export const setCurrentNotedir = notedirId => dispatch => {
    try {
        dispatch({
            type: SET_CURRENT_NOTEDIR,
            payload: notedirId
        });
    } catch {
        dispatch({ 
            type: NOTEDIR_ERROR,
            payload: UNKNOW_ERROR
        });
    }
}

//清除目前的筆記目錄
export const clearCurrentNotedir = () => dispatch => {
    dispatch({ type: CLEAR_CURRENT_NOTEDIR });
}

//新增筆記目錄
export const addNotedir = notedir => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // 加密傳至Server的notedir資料
        const encryptedData = {data: encrypt(notedir, process.env.REACT_APP_SECRET_KEY)};
        const res = await axios.post('/api/notedirs', encryptedData, config);
        // 解密Server回傳的notedir資料
        const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
        decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
        dispatch({
            type: ADD_NOTEDIR,
            payload: {notedir: decryptedData, success: ADD_NOTEDIR_SUCCESS}
        });
    } catch(err) {
        dispatch({ 
            type: NOTEDIR_ERROR,
            payload: `${ADD_NOTEDIR_ERROR}: ${err.msg || SERVER_ERROR}`
        });
    }
}

//修改筆記目錄
export const updateNotedir = (id,notedir) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // 加密傳至Server的notedir資料
        const encryptedData = {data: encrypt(notedir, process.env.REACT_APP_SECRET_KEY)};
        const res = await axios.put(`/api/notedirs/${id}`, encryptedData, config);
        // 解密Server回傳的notedir資料
        const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
        decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
        dispatch({
            type: UPDATE_NOTEDIR,
            payload: {notedir: decryptedData, success: UPDATE_NOTEDIR_SUCCESS}
        });
    } catch(err) {
        dispatch({ 
            type: NOTEDIR_ERROR,
            payload: `${UPDATE_NOTEDIR_ERROR}: ${err.msg || SERVER_ERROR}`
        });
    }
}

//刪除筆記目錄
export const deleteNotedir = (notedirId, notebookId) => async dispatch => {
    const config = {
        headers: {
            'x-notebook': encrypt(notebookId, process.env.REACT_APP_SECRET_KEY, false)
        }
    };

    try {
        await axios.delete(`/api/notedirs/${notedirId}`, config);
        dispatch({
            type: DELETE_NOTEDIR,
            payload: {id: notedirId, success: DELETE_NOTEDIR_SUCCESS}
        });
    } catch(err) {
        dispatch({ 
            type: NOTEDIR_ERROR,
            payload: `${DELETE_NOTEDIR_ERROR}: ${err.msg || SERVER_ERROR}`
        });
    }
}

//排序筆記目錄
export const sortNotedir = (orderBy, sortBy) => dispatch => {
    dispatch({
        type: SORT_NOTEDIR,
        payload: {orderBy, sortBy}
    });
}

//顯示新增筆記目錄
export const enableAddNotedir = () => dispatch => {
    dispatch({ type: ENABLE_ADDNOTEDIR });
}

//隱藏新增筆記目錄
export const disableAddNotedir = () => dispatch => {
    dispatch({ type: DISABLE_ADDNOTEDIR });
}

//設定正在編輯的筆記目錄
export const enableEditNotedir = id => dispatch => {
    dispatch({ 
        type: ENABLE_EDITNOTEDIR,
        payload: id 
    });
}

//清除正在編輯的筆記目錄
export const disableEditNotedir = () => dispatch => {
    dispatch({ type: DISABLE_EDITNOTEDIR });
}

//設定正在刪除的筆記目錄
export const enableDeleteNotedir = id => dispatch => {
    dispatch({ 
        type: ENABLE_DELETENOTEDIR,
        payload: id 
    });
}

//清除正在刪除的筆記目錄
export const disableDeleteNotedir = () => dispatch => {
    dispatch({ type: DISABLE_DELETENOTEDIR });
}

//設定筆記個數
export const setNoteCount = (id, count) => dispatch => {
    try {
        dispatch({
            type: SET_NOTE_COUNT,
            payload: {id, count}
        })
    } catch {
        dispatch({ 
            type: NOTEDIR_ERROR,
            payload: UNKNOW_ERROR
        });
    }
}

//清除筆記目錄資料
export const clearNotedir = () => dispatch => {
    dispatch({ type: CLEAR_NOTEDIR });
}