import {
    RESTORE_RECYCLEBIN,
    FILTER_RECYCLELIST,
    SORT_RECYCLELIST,
    RECYCLEBIN_ERROR
} from '../types';

export default (state,action) => {
    switch(action.type){
        case SORT_RECYCLELIST:
            return {
                ...state,
                orderBy: action.payload.orderBy,
                sortBy: action.payload.sortBy
            }
        case RECYCLEBIN_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default: return state;
    }
}