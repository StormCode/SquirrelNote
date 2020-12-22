import React, { useReducer } from 'react';
import axios from 'axios';
import { encrypt, decrypt } from '../../utils/crypto';

import NotedirContext from './notedirContext';
import NotedirReducer from './notedirReducer';
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
} from '../types.js';
import {
    ADD_NOTEDIR_SUCCESS,
    UPDATE_NOTEDIR_SUCCESS,
    DELETE_NOTEDIR_SUCCESS
} from '../../success';
import {
    GET_NOTEDIR_ERROR,
    ADD_NOTEDIR_ERROR,
    UPDATE_NOTEDIR_ERROR,
    DELETE_NOTEDIR_ERROR,
    SERVER_ERROR,
    UNKNOW_ERROR
} from '../../error';

const NotedirState = props => {
    const initialState = {
        currentToolPanel: null,
        notedirs: null,
        current: null,
        orderBy: 'asc',
        sortBy: 'title',
        error: null,
        addNotedirVisible: false,
        currentEditNotedir: null,
        currentDeleteNotedir: null,
        success: null,
        loading: true
    };

    const [state, dispatch] = useReducer(NotedirReducer, initialState);

    //查詢全部筆記目錄清單
    const getNotedirs = async notebookId => {
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
    const setCurrentNotedir = notedirId => {
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
    const clearCurrentNotedir = () => {
        dispatch({ type: CLEAR_CURRENT_NOTEDIR });
    }

    //新增筆記目錄
    const addNotedir = async notedir => {
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
    const updateNotedir = async (id,notedir) => {
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
    const deleteNotedir = async (notedirId, notebookId) => {
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
    const sortNotedir = (orderBy, sortBy) => {
        dispatch({
            type: SORT_NOTEDIR,
            payload: {orderBy, sortBy}
        });
    }

    //顯示新增筆記目錄
    const enableAddNotedir = () => {
        dispatch({ type: ENABLE_ADDNOTEDIR });
    }

    //隱藏新增筆記目錄
    const disableAddNotedir = () => {
        dispatch({ type: DISABLE_ADDNOTEDIR });
    }

    //設定正在編輯的筆記目錄
    const enableEditNotedir = id => {
        dispatch({ 
            type: ENABLE_EDITNOTEDIR,
            payload: id 
        });
    }

    //清除正在編輯的筆記目錄
    const disableEditNotedir = () => {
        dispatch({ type: DISABLE_EDITNOTEDIR });
    }

    //設定正在刪除的筆記目錄
    const enableDeleteNotedir = id => {
        dispatch({ 
            type: ENABLE_DELETENOTEDIR,
            payload: id 
        });
    }

    //清除正在刪除的筆記目錄
    const disableDeleteNotedir = () => {
        dispatch({ type: DISABLE_DELETENOTEDIR });
    }

    //設定筆記個數
    const setNoteCount = (id, count) => {
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
    const clearNotedir = () => {
        dispatch({ type: CLEAR_NOTEDIR });
    }

    return (
        <NotedirContext.Provider
        value={{
            notedirs: state.notedirs,
            current: state.current,
            orderBy: state.orderBy,
            sortBy: state.sortBy,
            success: state.success,
            error: state.error,
            addNotedirVisible: state.addNotedirVisible,
            currentEditNotedir: state.currentEditNotedir,
            currentDeleteNotedir: state.currentDeleteNotedir,
            loading: state.loading,
            getNotedirs,
            setCurrentNotedir,
            clearCurrentNotedir,
            addNotedir,
            updateNotedir,
            deleteNotedir,
            sortNotedir,
            enableAddNotedir,
            disableAddNotedir,
            enableEditNotedir,
            disableEditNotedir,
            enableDeleteNotedir,
            disableDeleteNotedir,
            setNoteCount,
            clearNotedir
        }}>
            {props.children}
        </NotedirContext.Provider>
    )
}

export default NotedirState;