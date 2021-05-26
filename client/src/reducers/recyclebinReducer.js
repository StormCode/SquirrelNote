import {
    GET_DELETED_ITEMS,
    FILTER_RECYCLELIST,
    CLEAR_FILTER_RECYCLELIST,
    SORT_RECYCLELIST,
    RESTORE_RECYCLELIST,
    PERMANENTLY_DELETE,
    CLEAR_RECYCLEBIN,
    RECYCLEBIN_ERROR
} from '../actions/types';
import SortRecyclebin from '../general/sort';

const initialState = {
    deletedItems: null,
    orderBy: 'desc',
    sortBy: 'date',
    filtered: null,
    loading: true,
    success: null,
    error: null
};

const GetRestoredlist = (data, id) => {
    const current = data.find(item => item.id === id);
    const type = current.type;
    let currentId;

    switch(type) {
        case 'notebook':
            currentId = current.notebook._id;
            break;
        case 'notedir':
            currentId = current.notedirs._id;
            break;
        default:
            currentId = null;
    }

    // 更新項目子層的可復原狀態
    type !== 'note' && data.forEach(item => {
        if(item.isRestoreable || item.type === 'notebook') return;
        
        if((type === 'notebook' || type === 'notedir') && item.parent_info.type === type && item.parent_info.id === currentId) {
            item.isRestoreable = true;
            delete item.parent_info;
        }
    });

    return data.filter(item => {
        return item.id !== id;
    });
}

const GetPermanentedlist = (data, id) => {
    const current = data.find(item => item.id === id);
    const type = current.type;
    const childIds = [];
    let currentId;

    switch(type) {
        case 'notedir':
            currentId = current.notedirs._id;
            break;
        case 'note':
            currentId = current.notes._id;
            break;
        default:
            currentId = null;
    }
    
    // 找出項目的子層並新增到待刪除項目
    type !== 'note' && data.forEach(item => {
        if(!item.parent_info || item.type === 'notebook') return;

        if(currentId === item.parent_info.id) {
            childIds.push(item.id);
        }
    });

    // 找出項目的父層並更新child_count
    type !== 'notebook' && current.parent_info && data.forEach(item => {
        const parentId = current.parent_info.id;
        let itemId;
        
        if(!item.child_count || item.type === 'note') return;

        switch(item.type) {
            case 'notebook':
                itemId = item.notebook._id;
                break;
            case 'notedir':
                itemId = item.notedirs._id;
                break;
            default:
                itemId = null;
        }

        if(itemId === parentId) {
            item.child_count = item.child_count - 1;
        }
    });

    return data.filter(item => {
        // 刪除項目本身並連帶刪除其子層的項目
        return item.id !== id && childIds.findIndex(childId => item.id === childId) === -1;
    });
}

export default (state = initialState,action) => {
    let sort = (action.payload && action.payload.orderBy) || state.orderBy;
    let sortBy = (action.payload && action.payload.sortBy) || state.sortBy;
    switch(action.type){
        case GET_DELETED_ITEMS:
            return {
                ...state,
                deletedItems: action.payload.sort((a,b) => SortRecyclebin(sort, sortBy, a, b)),
                loading: false
            }
        case SORT_RECYCLELIST:
            return {
                ...state,
                orderBy: action.payload.orderBy,
                sortBy: action.payload.sortBy,
                filtered: state.filtered === null ? state.filtered : state.filtered.sort((a,b) => SortRecyclebin(sort, sortBy, a, b)),
                deletedItems: state.deletedItems === null ? state.deletedItems : state.deletedItems.sort((a,b) => SortRecyclebin(sort, sortBy, a, b))
            }
        case FILTER_RECYCLELIST:
            return {
                ...state,
                filtered: state.deletedItems.filter(deletedItem => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    const parentTitle = deletedItem.parent_info ? deletedItem.parent_info.title : '';
                    return deletedItem.title.match(regex) || (parentTitle !== null ? parentTitle.match(regex) : '');
                }).sort((a,b) => SortRecyclebin(sort, sortBy, a, b))
            }
        case RESTORE_RECYCLELIST:
            return {
                ...state,
                success: action.payload.success,
                filtered: state.filtered !== null ? 
                        GetRestoredlist(state.filtered, action.payload.id)
                    : state.filtered,
                deletedItems: GetRestoredlist(state.deletedItems, action.payload.id)
            }
        case PERMANENTLY_DELETE:
            return {
                ...state,
                filtered: state.filtered !== null ? 
                        GetPermanentedlist(state.filtered, action.payload.id)
                    : state.filtered,
                deletedItems: GetPermanentedlist(state.deletedItems, action.payload.id),
                success: action.payload.success
            }
        case CLEAR_FILTER_RECYCLELIST:
            return {
                ...state,
                filtered: null
            }
        case CLEAR_RECYCLEBIN:
            return {
                ...state,
                loading: true,
                deletedItems: null,
                filtered: null,
                success: null,
                error: null
            }
        case RECYCLEBIN_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        default: return state;
    }
}