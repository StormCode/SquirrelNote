import React, { useReducer } from 'react'
import axios from 'axios';
import recyclebinContext from './recyclebinContext';
import recyclebinReducer from './recyclebinReducer';
import {
    RESTORE_RECYCLEBIN,
    FILTER_RECYCLELIST,
    SORT_RECYCLELIST,
    RECYCLEBIN_ERROR
} from '../types';

const RecycleBinState = props => {
    const initialState = {
        orderBy: 'asc',
        sortBy: 'title',
        filtered: null,
        error: null
    };

    const [state, dispatch] = useReducer(recyclebinReducer, initialState);

    const restoreRecycleBin = () => {

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
                orderBy: state.orderBy,
                sortBy: state.sortBy,
                filtered: state.filtered,
                error: state.error,
                restoreRecycleBin,
                sortRecycleList,
                filterRecycleList,
            }}>
                {props.children}
        </recyclebinContext.Provider>
    )
}

export default RecycleBinState;