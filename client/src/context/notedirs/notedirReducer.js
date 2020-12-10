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
    CLEAR_NOTEDIR,
    NOTEDIR_ERROR
} from '../types.js';

export default (state, action) => {
    const sortNotedir = (a,b) => {
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
        case GET_NOTEDIRS:
            return {
                ...state,
                notedirs: action.payload.sort(sortNotedir),
                loading: false
            }
        case SET_CURRENT_NOTEDIR:
            return {
                ...state,
                current: action.payload !== '' ?
                            state.notedirs && state.notedirs.find(notedir => action.payload ? 
                                notedir._id == action.payload : notedir.default == true)
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
                notedirs: [action.payload, ...state.notedirs]
            }
        case UPDATE_NOTEDIR:
            return {
                ...state,
                notedirs: state.notedirs.map(notedir =>
                    notedir._id !== action.payload._id ? notedir : action.payload
                )
            }
        case DELETE_NOTEDIR:
            return {
                ...state,
                notedirs: state.notedirs.filter(notedir => {
                    return notedir._id !== action.payload
                })
            }
        case SORT_NOTEDIR:
            return {
                ...state,
                orderBy: action.payload.orderBy,
                sortBy: action.payload.sortBy,
                notedirs: state.notedirs === null ? state.notedirs : state.notedirs.sort(sortNotedir)
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
        case CLEAR_NOTEDIR:
            return {
                ...state,
                currentToolPanel: null,
                notedirs: null,
                current: null,
                error: null,
                currentEditNotedir: null,
                currentDeleteNotedir: null
            }
        case NOTEDIR_ERROR:
            return {
                error: action.payload
            }
        default:
            return state;
    }
}