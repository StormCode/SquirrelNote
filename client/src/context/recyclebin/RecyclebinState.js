import React, { useReducer } from 'react'
import axios from 'axios';
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
            dispatch({
                type: GET_DELETED_ITEMS,
                payload: res.data
            });
        } catch (err) {
            dispatch({ 
                type: RECYCLEBIN_ERROR,
                payload: err.msg || 'Server Error'
            });
        }
    }

    const restoreRecycleBin = () => {

    }

    const permanentlyDelete = () => {

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
                restoreRecycleBin,
                permanentlyDelete
            }}>
                {props.children}
        </recyclebinContext.Provider>
    )
}

export default RecycleBinState;