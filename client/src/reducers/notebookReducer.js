import {
    GET_NOTEBOOKS,
    SET_CURRENT_NOTEBOOK,
    ADD_NOTEBOOK,
    UPDATE_NOTEBOOK,
    DELETE_NOTEBOOK,
    FILTER_NOTEBOOK,
    SORT_NOTEBOOK,
    CLEAR_FILTER_NOTEBOOK,
    ENABLE_ADDNOTEBOOK,
    DISABLE_ADDNOTEBOOK,
    ENABLE_EDITNOTEBOOK,
    DISABLE_EDITNOTEBOOK,
    ENABLE_DELETENOTEBOOK,
    DISABLE_DELETENOTEBOOK,
    CLEAR_NOTEBOOK,
    NOTEBOOK_ERROR
} from '../actions/types';
import SortNotebook from '../general/sort';

const initialState = {
    notebooks: null,
    current: null,
    filtered: null,
    orderBy: 'asc',
    sortBy: 'title',
    addNotebookVisible: false,
    currentEditNotebook: null,
    currentDeleteNotebook: null,
    success: null,
    error: null
};

export default (state = initialState, action) => {
    let sort, sortBy;
    switch(action.type) {
        case GET_NOTEBOOKS:
            sort = action.payload.orderBy || state.orderBy;
            sortBy = action.payload.sortBy || state.sortBy;
            return {
                ...state,
                notebooks: action.payload.sort((a,b) => SortNotebook(sort, sortBy, a, b)),
                loading: false
            };
        case SET_CURRENT_NOTEBOOK:
            return {
                ...state,
                current: state.notebooks !== null 
                    ? state.notebooks.find(notebook => notebook._id === action.payload)
                    : null
            }
        case ADD_NOTEBOOK:
            sort = action.payload.orderBy || state.orderBy;
            sortBy = action.payload.sortBy || state.sortBy;
            return {
                ...state,
                notebooks: [...state.notebooks, action.payload.notebook],
                filtered: state.filtered === null ? state.filtered : [...state.filtered, action.payload.notebook].filter(filteredItem => {
                    const regex = new RegExp(`${action.payload.keyword}`, 'gi');
                    return (filteredItem.title.match(regex) 
                    || filteredItem.desc.match(regex) 
                    || action.payload.notebook.title.match(regex) 
                    || action.payload.notebook.desc.match(regex));
                }).sort((a,b) => SortNotebook(sort, sortBy, a, b)),
                addNotebookVisible: false,
                success: action.payload.success
            }
        case UPDATE_NOTEBOOK:
            sort = action.payload.orderBy || state.orderBy;
            sortBy = action.payload.sortBy || state.sortBy;
            return {
                ...state,
                notebooks: state.notebooks.map(notebook => 
                    notebook._id !== action.payload.notebook._id ? notebook : action.payload.notebook
                ),
                filtered: state.filtered === null ? state.filtered : state.filtered.map(filteredItem => 
                    filteredItem._id !== action.payload.notebook._id ? filteredItem : action.payload.notebook
                    ).filter(filteredItem => {
                        const regex = new RegExp(`${action.payload.keyword}`, 'gi');
                        return (filteredItem.title.match(regex) 
                        || filteredItem.desc.match(regex) 
                        || action.payload.notebook.title.match(regex) 
                        || action.payload.notebook.desc.match(regex));
                }).sort((a,b) => SortNotebook(sort, sortBy, a, b)),
                currentEditNotebook: null,
                success: action.payload.success
            }
        case DELETE_NOTEBOOK:
            return {
                ...state,
                notebooks: state.notebooks.filter(notebook => {
                    return notebook._id !== action.payload.id
                }),
                filtered: state.filtered === null ? state.filtered : state.filtered.filter(filteredItem => 
                    filteredItem._id !== action.payload.id),
                currentDeleteNotebook: null,
                success: action.payload.success
            }
        case FILTER_NOTEBOOK:
            sort = action.payload.orderBy || state.orderBy;
            sortBy = action.payload.sortBy || state.sortBy;
            return {
                ...state,
                filtered: state.notebooks.filter(notebook => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return (notebook.title.match(regex) || notebook.desc.match(regex));
                }).sort((a,b) => SortNotebook(sort, sortBy, a, b))
            }
        case SORT_NOTEBOOK:
            return {
                ...state,
                orderBy: action.payload.orderBy,
                sortBy: action.payload.sortBy,
                filtered: state.filtered === null ? state.filtered : state.filtered.sort((a,b) => SortNotebook(sort, sortBy, a, b)),
                notebooks: state.notebooks === null ? state.notebooks : state.notebooks.sort((a,b) => SortNotebook(sort, sortBy, a, b))
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
        case CLEAR_NOTEBOOK:
            return {
                ...state,
                loading: true,
                notebooks: null,
                current: null,
                filtered: null,
                addNotebookVisible: false,
                currentEditNotebook: null,
                currentDeleteNotebook: null,
                success: null,
                error: null
            }
        case NOTEBOOK_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        default:
            return state;
    }
}