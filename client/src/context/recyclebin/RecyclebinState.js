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
    RESTORE_RECYCLELIST,
    PERMANENTLY_DELETE,
    CLEAR_RECYCLEBIN,
    RECYCLEBIN_ERROR
} from '../types';
import {
    RESTORE_DELETED_ITEM_SUCCESS,
    PERMANENTLY_DELETE_SUCCESS
} from '../../success';
import {
    GET_DELETED_ITEM_ERROR,
    RESTORE_DELETED_ITEM_ERROR,
    PERMANENTLY_DELETE_ERROR,
    SERVER_ERROR
} from '../../error';

const RecycleBinState = props => {
    const initialState = {
        deletedItems: null,
        orderBy: 'desc',
        sortBy: 'date',
        filtered: null,
        loading: true,
        success: null,
        error: null
    };

    const [state, dispatch] = useReducer(recyclebinReducer, initialState);

    // 取得回收站項目
    const getDeletedItems = async () => {
        try {
            const res = await axios.get('/api/recyclebin');
            // 解密Server回傳的recyclebin資料
            let decryptedDatas = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            
            decryptedDatas = decryptedDatas || [];
            decryptedDatas.forEach(decryptedData => {
                decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
                if(!decryptedData.isRestoreable) {
                    decryptedData.parent_info.title = decryptedData.parent_info.title ? 
                    decrypt(decryptedData.parent_info.title, process.env.REACT_APP_SECRET_KEY, false) 
                    : decryptedData.parent_info.title;
                }
            });

            dispatch({
                type: GET_DELETED_ITEMS,
                payload: decryptedDatas
            });
        } catch (err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: `${GET_DELETED_ITEM_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    // 復原回收站項目
    const restore = async id => {
        try {
            await axios.put(`/api/recyclebin/${id}`);
            dispatch({
                type: RESTORE_RECYCLELIST,
                payload: { id, success: RESTORE_DELETED_ITEM_SUCCESS }
            });
        } catch (err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: `${RESTORE_DELETED_ITEM_ERROR}: ${err.msg || SERVER_ERROR}`
            });
        }
    }

    // 永久刪除回收站項目
    const permanentlyDelete = async id => {
        try {
            await axios.delete(`/api/recyclebin/${id}`);
            dispatch({ 
                type: PERMANENTLY_DELETE,
                payload: {id, success: PERMANENTLY_DELETE_SUCCESS}
            });
        } catch (err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: `${PERMANENTLY_DELETE_ERROR}: ${err.msg || SERVER_ERROR}`
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
        dispatch({
            type: FILTER_RECYCLELIST,
            payload: text
        });
    }

    // 清除篩選回收站項目
    const clearFilterRecycleList = text => {
        dispatch({
            type: CLEAR_FILTER_RECYCLELIST,
            payload: text
        });
    }

    // 清除回收站資料
    const clearRecyclebin = () => {
        dispatch({ type: CLEAR_RECYCLEBIN });
    }

    return (
        <recyclebinContext.Provider
            value={{
                deletedItems: state.deletedItems,
                orderBy: state.orderBy,
                sortBy: state.sortBy,
                filtered: state.filtered,
                loading: state.loading,
                success: state.success,
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