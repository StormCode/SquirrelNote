import React, { useReducer } from 'react';
import axios from 'axios';
import { encrypt, decrypt } from '../../utils/crypto';
import NotebookContext from './notebookContext';
import NotebookReducer from './notebookReducer';
import {
    GET_NOTEBOOKS,
    SET_CURRENT_NOTEBOOK,
    CLEAR_NOTEBOOK,
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
    NOTEBOOK_ERROR
} from '../types';

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
        } catch (err) {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    };

    //清除目前正在使用的筆記本
    const clearNotebook = async () => {
        try {
            dispatch({ type: CLEAR_NOTEBOOK })
        } catch (err) {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    };

    //取得筆記本
    const getNotebooks = async () => {
        try {
            const res = await axios.get('/api/notebooks');
            // 解密Server回傳的notebook資料
            const decryptedDatas = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedDatas.map(decryptedData => {
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
                payload: err.msg || 'Server Error'
            });
        }
    };

    //新增筆記本
    const addNotebook = async notebook => {
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
                payload: decryptedData
            });
        } catch (err) {
            console.log('err: ' + err);
            
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    //編輯筆記本
    const updateNotebook = async (id, notebook) => {
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
                payload: decryptedData
            });
        } catch (err) {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    //刪除筆記本
    const deleteNotebook = async id => {
        try {
            await axios.delete(`/api/notebooks/${id}`);
            dispatch({
                type: DELETE_NOTEBOOK,
                payload: id
            });
        } catch (err) {
            dispatch({ 
                type: NOTEBOOK_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    //篩選筆記本
    const filterNotebook = text => {
        dispatch({
            type: FILTER_NOTEBOOK,
            payload: text
        });
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

    return (
        <NotebookContext.Provider
            value={{
                notebooks: state.notebooks,
                current: state.current,
                filtered: state.filtered,
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