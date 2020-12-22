import {
    GET_NOTEDIRS,
    SET_CURRENT_NOTEDIR,
    CLEAR_CURRENT_NOTEDIR,
    ADD_NOTEDIR,
    UPDATE_NOTEDIR,
    DELETE_NOTEDIR,
    SORT_NOTEDIR,
    ENABLE_ADDNOTEDIR,
    DISABLE_ADDNOTEDIR,
    ENABLE_EDITNOTEDIR,
    DISABLE_EDITNOTEDIR,
    ENABLE_DELETENOTEDIR,
    DISABLE_DELETENOTEDIR,
    SET_NOTE_COUNT,
    CLEAR_NOTEDIR,
    NOTEDIR_ERROR
} from '../types.js';
import SortNotedir from '../../general/sort';

export default (state, action) => {
    let sort, sortBy;
    switch(action.type){
        case GET_NOTEDIRS:
            sort = action.payload.orderBy || state.orderBy;
            sortBy = action.payload.sortBy || state.sortBy;
            return {
                ...state,
                notedirs: action.payload.sort((a,b) => SortNotedir(sort, sortBy, a, b)),
                loading: false
            }
        case SET_CURRENT_NOTEDIR:
            return {
                ...state,
                current: action.payload !== '' ?
                            state.notedirs && state.notedirs.find(notedir => action.payload ? 
                                notedir._id === action.payload : notedir.default === true)
                            : ''
            }
        case CLEAR_CURRENT_NOTEDIR:
            return {
                ...state,
                current: null
            }
        case ADD_NOTEDIR:
            return {
                ...state,
                notedirs: [action.payload.notedir, ...state.notedirs],
                success: action.payload.success
            }
        case UPDATE_NOTEDIR:
            return {
                ...state,
                notedirs: state.notedirs.map(notedir =>
                    notedir._id !== action.payload.notedir._id ? notedir : Object.assign({}, notedir, action.payload.notedir)
                ),
                success: action.payload.success
            }
        case DELETE_NOTEDIR:
            return {
                ...state,
                current: null,
                notedirs: state.notedirs.filter(notedir => {
                    return notedir._id !== action.payload.id
                }),
                success: action.payload.success
            }
        case SORT_NOTEDIR:
            sort = action.payload.orderBy || state.orderBy;
            sortBy = action.payload.sortBy || state.sortBy;
            return {
                ...state,
                orderBy: action.payload.orderBy,
                sortBy: action.payload.sortBy,
                notedirs: state.notedirs === null ? state.notedirs : state.notedirs.sort((a,b) => SortNotedir(sort, sortBy, a, b))
            }
        case ENABLE_ADDNOTEDIR:
            return {
                ...state,
                addNotedirVisible: true
            }
        case DISABLE_ADDNOTEDIR:
            return {
                ...state,
                addNotedirVisible: false
            }
        case ENABLE_EDITNOTEDIR:
            return {
                ...state,
                currentEditNotedir: action.payload
            }
        case DISABLE_EDITNOTEDIR:
            return {
                ...state,
                currentEditNotedir: null
            }
        case ENABLE_DELETENOTEDIR:
            return {
                ...state,
                currentDeleteNotedir: action.payload
            }
        case DISABLE_DELETENOTEDIR:
            return {
                ...state,
                currentDeleteNotedir: null
            }
        case SET_NOTE_COUNT:
            return {
                ...state,
                notedirs: state.notedirs.map(notedir => {
                    if(notedir._id === action.payload.id) {
                        notedir.note_count = action.payload.count;
                    }
                    return notedir;
                })
            }
        case CLEAR_NOTEDIR:
            return {
                ...state,
                loading: true,
                currentToolPanel: null,
                notedirs: null,
                current: null,
                success: null,
                error: null,
                currentEditNotedir: null,
                currentDeleteNotedir: null
            }
        case NOTEDIR_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        default:
            return state;
    }
}