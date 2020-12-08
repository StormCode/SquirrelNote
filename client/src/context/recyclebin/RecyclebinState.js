import React, { useReducer } from 'react'
import axios from 'axios';
import { decrypt } from '../../utils/crypto';

import recyclebinContext from './recyclebinContext';
import recyclebinReducer from './recyclebinReducer';
import {
    GET_DELETED_ITEMS,
    FILTER_RECYCLELIST,
    CLEAR_FILTER_RECYCLELIST,
    SORT_RECYCLELIST,
    RESTORE_RECYCLEBIN,
    PERMANENTLY_DELETE,
    CLEAR_RECYCLEBIN,
    RECYCLEBIN_ERROR
} from '../types';

const RecycleBinState = props => {
    const initialState = {
        deletedItems: null,
        orderBy: 'asc',
        sortBy: 'title',
        filtered: null,
        loading: true,
        error: null
    };

    const [state, dispatch] = useReducer(recyclebinReducer, initialState);

    // 取得回收站項目
    const getDeletedItems = async () => {
        try {
            const res = await axios.get('/api/recyclebin');
            // 解密Server回傳的recyclebin資料
            const decryptedDatas = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedDatas.map(decryptedData => {
                decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            });
            dispatch({
                type: GET_DELETED_ITEMS,
                payload: decryptedDatas
            });
        } catch (err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    // 復原回收站項目
    const restore = async id => {
        try {
            await axios.put(`/api/recyclebin/${id}`);
            dispatch({ 
                type: RESTORE_RECYCLEBIN,
                payload: id
            });
        } catch (err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    // 永久刪除回收站項目
    const permanentlyDelete = async id => {
        try {
            await axios.delete(`/api/recyclebin/${id}`);
            dispatch({ 
                type: PERMANENTLY_DELETE,
                payload: id 
            });
        } catch (err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    // 排序回收站項目
    const sortRecycleList = (orderBy, sortBy) => {
        dispatch({
            type: SORT_RECYCLELIST,
            payload: {orderBy, sortBy}
        });
    }

    // 篩選回收站項目
    const filterRecycleList = text => {
        try{
            dispatch({
                type: FILTER_RECYCLELIST,
                payload: text
            });
        } catch(err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    // 清除篩選回收站項目
    const clearFilterRecycleList = text => {
        try{
            dispatch({
                type: CLEAR_FILTER_RECYCLELIST,
                payload: text
            });
        } catch(err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    // 清除回收站資料
    const clearRecyclebin = () => {
        try {
            dispatch({ type: CLEAR_RECYCLEBIN });
        } catch (err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    return (
        <recyclebinContext.Provider
            value={{
                deletedItems: state.deletedItems,
                orderBy: state.orderBy,
                sortBy: state.sortBy,
                filtered: state.filtered,
                loading: state.loading,
                error: state.error,
                getDeletedItems,
                sortRecycleList,
                filterRecycleList,
                clearFilterRecycleList,
                restore,
                permanentlyDelete,
                clearRecyclebin
            }}>
                {props.children}
        </recyclebinContext.Provider>
    )
}

export default RecycleBinState;