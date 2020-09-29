import {
    GET_NOTEBOOKS,
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
        if(action.payload.sortBy === 'title'){
            if(action.payload.sort === 'asc')
                return a.title < b.title ? -1 : 1
            else
                return a.title > b.title ? -1 : 1
        }
        else {
            if(action.payload.sort === 'asc')
                return a.date < b.date ? -1 : 1
            else
                return a.date > b.date ? -1 : 1
        }
    };

    switch(action.type) {
        case GET_NOTEBOOKS:
            return {
                ...state,
                notebooks: action.payload,
                loading: false
            };
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
                }),
                loading: false
            }
        case SORT_NOTEBOOK:
            return {
                ...state,
                sort: action.payload.sort,
                sortBy: action.payload.sortBy,
                filtered: state.filtered === null ? state.filtered : state.filtered.sort(sortNotebook),
                notebooks: state.notebooks === null ? state.notebooks : state.notebooks.sort(sortNotebook),
                loading: false
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