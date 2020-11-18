import {
    GET_NOTEBOOKS,
    SET_CURRENT_NOTEBOOK,
    CLEAR_NOTEBOOK,
    ADD_NOTEBOOK,
    UPDATE_NOTEBOOK,
    DELETE_NOTEBOOK,
    FILTER_NOTEBOOK,
    CLEAR_FILTER_NOTEBOOK,
    ENABLE_ADDNOTEBOOK,
    DISABLE_ADDNOTEBOOK,
    ENABLE_EDITNOTEBOOK,
    DISABLE_EDITNOTEBOOK,
    ENABLE_DELETENOTEBOOK,
    DISABLE_DELETENOTEBOOK,
    NOTEBOOK_ERROR, SORT_NOTEBOOK
} from '../types';

export default (state, action) => {
    const sortNotebook = (a,b) => {
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

    switch(action.type) {
        case GET_NOTEBOOKS:
            return {
                ...state,
                notebooks: action.payload.sort(sortNotebook),
                loading: false
            };
        case SET_CURRENT_NOTEBOOK:
            return {
                ...state,
                current: state.notebooks !== null 
                    ? state.notebooks.find(notebook => notebook._id === action.payload)
                    : null
            }
        case CLEAR_NOTEBOOK:
            return {
                ...state,
                current: null
            }
        case ADD_NOTEBOOK:
            return {
                ...state,
                notebooks: [...state.notebooks, action.payload]
            }
        case UPDATE_NOTEBOOK:
            return {
                ...state,
                notebooks: state.notebooks.map(notebook => 
                    notebook._id !== action.payload._id ? notebook : action.payload
                )
            }
        case DELETE_NOTEBOOK:
            return {
                ...state,
                notebooks: state.notebooks.filter(notebook => {
                    return notebook._id !== action.payload
                })
            }
        case FILTER_NOTEBOOK:
            return {
                ...state,
                filtered: state.notebooks.filter(notebook => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return (notebook.title.match(regex) || notebook.desc.match(regex));
                })
            }
        case SORT_NOTEBOOK:
            return {
                ...state,
                orderBy: action.payload.orderBy,
                sortBy: action.payload.sortBy,
                filtered: state.filtered === null ? state.filtered : state.filtered.sort(sortNotebook),
                notebooks: state.notebooks === null ? state.notebooks : state.notebooks.sort(sortNotebook)
            }
        case ENABLE_ADDNOTEBOOK:
            return {
                ...state,
                addNotebookVisible: true,
                currentEditNotebook: null,
                currentDeleteNotebook: null
            }
        case DISABLE_ADDNOTEBOOK:
            return {
                ...state,
                addNotebookVisible: false
            }
        case ENABLE_EDITNOTEBOOK:
            return {
                ...state,
                currentEditNotebook: action.payload,
                currentDeleteNotebook: null,
                addNotebookVisible: false
            }
        case DISABLE_EDITNOTEBOOK:
            return {
                ...state,
                currentEditNotebook: null
            }
        case ENABLE_DELETENOTEBOOK:
            return {
                ...state,
                currentDeleteNotebook: action.payload,
                currentEditNotebook: null,
                addNotebookVisible: false
            }
        case DISABLE_DELETENOTEBOOK:
            return {
                ...state,
                currentDeleteNotebook: null
            }
        case CLEAR_FILTER_NOTEBOOK:
            return {
                ...state,
                filtered: null
            }
        case NOTEBOOK_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}