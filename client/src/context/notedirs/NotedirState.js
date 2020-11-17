import React, { useReducer } from 'react';
import axios from 'axios';
import NotedirContext from './notedirContext';
import NotedirReducer from './notedirReducer';
import {
    GET_NOTEDIRS,
    SET_NOTEDIR,
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
                'x-notebook': notebookId
            }
        };

        try {
            const res = await axios.get('/api/notedirs',config);
            dispatch({
                type: GET_NOTEDIRS,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: NOTEDIR_ERROR,
                payload: err.msg || 'Server Error'
            })
        }
    }

    //設定目前的筆記目錄
    const setNotedir = async notedirId => {
        try {
            dispatch({
                type: SET_NOTEDIR,
                payload: notedirId
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
            const res = await axios.post('/api/notedirs', notedir, config);
            dispatch({
                type: ADD_NOTEDIR,
                payload: res.data
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
            const res = await axios.put(`/api/notedirs/${id}`, notedir, config);
            dispatch({
                type: UPDATE_NOTEDIR,
                payload: res.data
            });
        } catch (err) {
            dispatch({ type: NOTEDIR_ERROR});
        }
    }

    //刪除筆記目錄
    const deleteNotedir = async (notedirId, notebookId) => {
        const config = {
            headers: {
                'x-notebook': notebookId
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
            setNotedir,
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