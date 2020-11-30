import React, { useReducer } from 'react'
import axios from 'axios';
import { decrypt } from '../../utils/crypto';

import recyclebinContext from './recyclebinContext';
import recyclebinReducer from './recyclebinReducer';
import {
    GET_DELETED_ITEMS,
    FILTER_RECYCLELIST,
    SORT_RECYCLELIST,
    RESTORE_RECYCLEBIN,
    PERMANENTLY_DELETE,
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

    const sortRecycleList = (orderBy, sortBy) => {
        dispatch({
            type: SORT_RECYCLELIST,
            payload: {orderBy, sortBy}
        });
    }

    const filterRecycleList = () => {

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
                restore,
                permanentlyDelete
            }}>
                {props.children}
        </recyclebinContext.Provider>
    )
}

export default RecycleBinState;