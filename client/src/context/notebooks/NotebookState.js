import React, { useReducer } from 'react';
import axios from 'axios';
import { encrypt, decrypt } from '../../utils/crypto';
import NotebookContext from './notebookContext';
import NotebookReducer from './notebookReducer';
import {
    GET_NOTEBOOKS,
    SET_CURRENT_NOTEBOOK,
    ADD_NOTEBOOK,
    UPDATE_NOTEBOOK,
    DELETE_NOTEBOOK,
    FILTER_NOTEBOOK,
    SORT_NOTEBOOK,
    ENABLE_ADDNOTEBOOK,
    DISABLE_ADDNOTEBOOK,
    ENABLE_EDITNOTEBOOK,
    DISABLE_EDITNOTEBOOK,
    ENABLE_DELETENOTEBOOK,
    DISABLE_DELETENOTEBOOK,
    CLEAR_FILTER_NOTEBOOK,
    CLEAR_NOTEBOOK,
    NOTEBOOK_ERROR
} from '../types';
import {
    ADD_NOTEBOOK_SUCCESS,
    UPDATE_NOTEBOOK_SUCCESS,
    DELETE_NOTEBOOK_SUCCESS
} from '../../success';
import {
    GET_NOTEBOOK_ERROR,
    ADD_NOTEBOOK_ERROR,
    UPDATE_NOTEBOOK_ERROR,
    DELETE_NOTEBOOK_ERROR,
    SERVER_ERROR,
    UNKNOW_ERROR
} from '../../error';

const NotebookState = props => {
    const initialState = {
        notebooks: null,
        current: null,
        filtered: null,
        orderBy: 'asc',
        sortBy: 'title',
        addNotebookVisible: false,
        currentEditNotebook: null,
        currentDeleteNotebook: null,
        success: null,
        error: null
    };

    const [state, dispatch] = useReducer(NotebookReducer, initialState);

    //設定目前正在使用的筆記本
    const setCurrentNotebook = async id => {
        try {
            dispatch({
                type: SET_CURRENT_NOTEBOOK,
                payload: id
            })
        } catch {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: UNKNOW_ERROR
            });
        }
    };

    //取得筆記本
    const getNotebooks = async () => {
        try {
            const res = await axios.get('/api/notebooks');
            // 解密Server回傳的notebook資料
            const decryptedDatas = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedDatas.forEach(decryptedData => {
                decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
                decryptedData.desc = decrypt(decryptedData.desc, process.env.REACT_APP_SECRET_KEY, false);
            });
            dispatch({
                type: GET_NOTEBOOKS,
                payload: decryptedDatas
            });
        } catch (err) {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: `${GET_NOTEBOOK_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    };

    //新增筆記本
    const addNotebook = async (notebook, keyword) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            // 加密傳至Server的notebook資料
            const encryptedData = {data: encrypt(notebook, process.env.REACT_APP_SECRET_KEY)};
            const res = await axios.post('/api/notebooks', encryptedData, config);
            // 解密Server回傳的notebook資料
            const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            decryptedData.desc = decrypt(decryptedData.desc, process.env.REACT_APP_SECRET_KEY, false);
            dispatch({
                type: ADD_NOTEBOOK,
                payload: {notebook: decryptedData, keyword, success: ADD_NOTEBOOK_SUCCESS}
            });
        } catch (err) {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: `${ADD_NOTEBOOK_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    //編輯筆記本
    const updateNotebook = async (id, notebook, keyword) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            // 加密傳至Server的資料
            const encryptedData = {data: encrypt(notebook, process.env.REACT_APP_SECRET_KEY)};
            const res = await axios.put(`/api/notebooks/${id}`, encryptedData, config);
            // 解密Server回傳的資料
            const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            decryptedData.desc = decrypt(decryptedData.desc, process.env.REACT_APP_SECRET_KEY, false);
            dispatch({
                type: UPDATE_NOTEBOOK,
                payload: {notebook: decryptedData, keyword, success: UPDATE_NOTEBOOK_SUCCESS}
            });
        } catch (err) {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: `${UPDATE_NOTEBOOK_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    //刪除筆記本
    const deleteNotebook = async id => {
        try {
            await axios.delete(`/api/notebooks/${id}`);
            dispatch({
                type: DELETE_NOTEBOOK,
                payload: {id, success: DELETE_NOTEBOOK_SUCCESS}
            });
        } catch (err) {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: `${DELETE_NOTEBOOK_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    //篩選筆記本
    const filterNotebook = text => {
        try {
            dispatch({
                type: FILTER_NOTEBOOK,
                payload: text
            });
        } catch {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: UNKNOW_ERROR
            });
        }
    }

    //排序筆記本
    const sortNotebook = (orderBy, sortBy) => {
        dispatch({
            type: SORT_NOTEBOOK,
            payload: {orderBy, sortBy}
        });
    }

    //清除篩選筆記本
    const clearFilterNotebook = () => {
        dispatch({ type: CLEAR_FILTER_NOTEBOOK });
    }

    //顯示新增筆記本
    const enableAddNotebook = () => {
        dispatch({ type: ENABLE_ADDNOTEBOOK });
    }

    //隱藏新增筆記本
    const disableAddNotebook = () => {
        dispatch({ type: DISABLE_ADDNOTEBOOK });
    }

    //顯示編輯筆記本
    const enableEditNotebook = id => {
        dispatch({ 
            type: ENABLE_EDITNOTEBOOK,
            payload: id
        });
    }

    //隱藏編輯筆記本
    const disableEditNotebook = () => {
        dispatch({ type: DISABLE_EDITNOTEBOOK });
    }

    //顯示刪除筆記本
    const enableDeleteNotebook = id => {
        dispatch({ 
            type: ENABLE_DELETENOTEBOOK,
            payload: id
        });
    }

    //隱藏刪除筆記本
    const disableDeleteNotebook = () => {
        dispatch({ type: DISABLE_DELETENOTEBOOK });
    }

    //清除筆記本資料
    const clearNotebook = () => {
        dispatch({ type: CLEAR_NOTEBOOK });
    };

    return (
        <NotebookContext.Provider
            value={{
                notebooks: state.notebooks,
                current: state.current,
                filtered: state.filtered,
                success: state.success,
                error: state.error,
                orderBy: state.orderBy,
                sortBy: state.sortBy,
                addNotebookVisible: state.addNotebookVisible,
                currentEditNotebook: state.currentEditNotebook,
                currentDeleteNotebook: state.currentDeleteNotebook,
                getNotebooks,
                setCurrentNotebook,
                clearNotebook,
                addNotebook,
                updateNotebook,
                deleteNotebook,
                filterNotebook,
                sortNotebook,
                clearFilterNotebook,
                enableAddNotebook,
                disableAddNotebook,
                enableEditNotebook,
                disableEditNotebook,
                enableDeleteNotebook,
                disableDeleteNotebook
            }}>
            { props.children }
        </NotebookContext.Provider>
    )
}

export default NotebookState;