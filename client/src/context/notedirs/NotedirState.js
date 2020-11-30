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
    ENABLE_EDITNOTEDIR,
    DISABLE_EDITNOTEDIR,
    ENABLE_DELETENOTEDIR,
    DISABLE_DELETENOTEDIR,
    NOTEDIR_ERROR
} from '../types.js';

const NotedirState = props => {
    const initialState = {
        currentToolPanel: null,
        notedirs: null,
        current: null,
        orderBy: 'asc',
        sortBy: 'title',
        error: null,
        currentEditNotedir: null,
        currentDeleteNotedir: null,
        loading: false
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
            decryptedDatas.map(decryptedData => {
                if(decryptedData.title) {
                    decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
                }
            });
            dispatch({
                type: GET_NOTEDIRS,
                payload: decryptedDatas
            });
        } catch (err) {
            dispatch({
                type: NOTEDIR_ERROR,
                payload: err.msg || 'Server Error'
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
        } catch (err) {
            dispatch({
                type: NOTEDIR_ERROR,
                payload: err.msg || 'Server Error'
            })
        }
    }

    //清除目前的筆記目錄
    const clearCurrentNotedir = () => {
        try {
            dispatch({
                type: CLEAR_CURRENT_NOTEDIR,
                payload: null
            });
        } catch (err) {
            dispatch({
                type: NOTEDIR_ERROR,
                payload: err.msg || 'Server Error'
            })
        }
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
                payload: decryptedData
            });
        } catch (err) {
            dispatch({ type: NOTEDIR_ERROR});
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
                payload: decryptedData
            });
        } catch (err) {
            dispatch({ type: NOTEDIR_ERROR});
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
                payload: notedirId
            });
        } catch (err) {
            dispatch({ type: NOTEDIR_ERROR});
        }
    }

    //排序筆記目錄
    const sortNotedir = (orderBy, sortBy) => {
        dispatch({
            type: SORT_NOTEDIR,
            payload: {orderBy, sortBy}
        });
    }

    //設定正在編輯的筆記目錄
    const enableEditNotedir = id => {
        try {
            dispatch({ 
                type: ENABLE_EDITNOTEDIR,
                payload: id 
            });
        } catch (err) {
            dispatch({ type: NOTEDIR_ERROR});
        }
    }

    //清除正在編輯的筆記目錄
    const disableEditNotedir = () => {
        try {
            dispatch({ type: DISABLE_EDITNOTEDIR });
        } catch (err) {
            dispatch({ type: NOTEDIR_ERROR});
        }
    }

    //設定正在刪除的筆記目錄
    const enableDeleteNotedir = id => {
        try {
            dispatch({ 
                type: ENABLE_DELETENOTEDIR,
                payload: id 
            });
        } catch (err) {
            dispatch({ type: NOTEDIR_ERROR});
        }
    }

    //清除正在刪除的筆記目錄
    const disableDeleteNotedir = id => {
        try {
            dispatch({ type: DISABLE_DELETENOTEDIR });
        } catch (err) {
            dispatch({ type: NOTEDIR_ERROR});
        }
    }

    return (
        <NotedirContext.Provider
        value={{
            notedirs: state.notedirs,
            current: state.current,
            orderBy: state.orderBy,
            sortBy: state.sortBy,
            error: state.error,
            currentEditNotedir: state.currentEditNotedir,
            currentDeleteNotedir: state.currentDeleteNotedir,
            getNotedirs,
            setCurrentNotedir,
            clearCurrentNotedir,
            addNotedir,
            updateNotedir,
            deleteNotedir,
            sortNotedir,
            enableEditNotedir,
            disableEditNotedir,
            enableDeleteNotedir,
            disableDeleteNotedir
        }}>
            {props.children}
        </NotedirContext.Provider>
    )
}

export default NotedirState;