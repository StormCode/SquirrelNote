import {
    GET_DELETED_ITEMS,
    FILTER_RECYCLELIST,
    SORT_RECYCLELIST,
    RESTORE_RECYCLEBIN,
    PERMANENTLY_DELETE,
    RECYCLEBIN_ERROR
} from '../types';

export default (state,action) => {
    switch(action.type){
        case GET_DELETED_ITEMS:
            return {
                ...state,
                deletedItems: action.payload,
                loading: false
            }
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