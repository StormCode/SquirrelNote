import axios from 'axios';
import { decrypt } from '../utils/crypto';

import {
    GET_DELETED_ITEMS,
    FILTER_RECYCLELIST,
    CLEAR_FILTER_RECYCLELIST,
    SORT_RECYCLELIST,
    RESTORE_RECYCLELIST,
    PERMANENTLY_DELETE,
    CLEAR_RECYCLEBIN,
    RECYCLEBIN_ERROR
} from './types';
import {
    RESTORE_DELETED_ITEM_SUCCESS,
    PERMANENTLY_DELETE_SUCCESS
} from '../success';
import {
    GET_DELETED_ITEM_ERROR,
    RESTORE_DELETED_ITEM_ERROR,
    PERMANENTLY_DELETE_ERROR,
    SERVER_ERROR
} from '../error';

// 取得回收站項目
export const getDeletedItems = () => async dispatch => {
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
export const restore = id => async dispatch => {
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
export const permanentlyDelete = id => async dispatch => {
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
export const sortRecycleList = (orderBy, sortBy) => dispatch => {
    dispatch({
        type: SORT_RECYCLELIST,
        payload: {orderBy, sortBy}
    });
}

// 篩選回收站項目
export const filterRecycleList = text => dispatch => {
    dispatch({
        type: FILTER_RECYCLELIST,
        payload: text
    });
}

// 清除篩選回收站項目
export const clearFilterRecycleList = text => dispatch => {
    dispatch({
        type: CLEAR_FILTER_RECYCLELIST,
        payload: text
    });
}

// 清除回收站資料
export const clearRecyclebin = () => dispatch => {
    dispatch({ type: CLEAR_RECYCLEBIN });
}