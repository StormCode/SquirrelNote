import {
    GET_DELETED_ITEMS,
    FILTER_RECYCLELIST,
    CLEAR_FILTER_RECYCLELIST,
    SORT_RECYCLELIST,
    PERMANENTLY_DELETE,
    CLEAR_RECYCLEBIN,
    RECYCLEBIN_ERROR
} from '../types';

export default (state,action) => {
    const sortRecyclebin = (a,b) => {
        let sort = action.payload.orderBy || state.orderBy;
        let sortBy = action.payload.sortBy || state.sortBy;

        if(sortBy === 'title'){
            if(sort === 'asc')
                return a.title < b.title ? -1 : 1
            else
                return a.title > b.title ? -1 : 1
        }
        else {
            if(sort === 'asc')
                return a.date < b.date ? -1 : 1
            else
                return a.date > b.date ? -1 : 1
        }
    };

    switch(action.type){
        case GET_DELETED_ITEMS:
            return {
                ...state,
                deletedItems: action.payload.sort(sortRecyclebin),
                loading: false
            }
        case SORT_RECYCLELIST:
            return {
                ...state,
                orderBy: action.payload.orderBy,
                sortBy: action.payload.sortBy,
                filtered: state.filtered === null ? state.filtered : state.filtered.sort(sortRecyclebin),
                deletedItems: state.deletedItems === null ? state.deletedItems : state.deletedItems.sort(sortRecyclebin)
            }
        case FILTER_RECYCLELIST:
            return {
                ...state,
                filtered: state.deletedItems.filter(deletedItem => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return deletedItem.title.match(regex);
                })
            }
        case PERMANENTLY_DELETE:
            return {
                ...state,
                deletedItems: state.deletedItems.filter(deletedItem => 
                    deletedItem.id !== action.payload)
            }
        case CLEAR_FILTER_RECYCLELIST:
            return {
                ...state,
                filtered: null
            }
        case CLEAR_RECYCLEBIN:
            return {
                ...state,
                deletedItems: null,
                filtered: null,
                loading: true,
                error: null
            }
        case RECYCLEBIN_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default: return state;
    }
}