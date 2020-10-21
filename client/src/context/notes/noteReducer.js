import {
    GET_NOTES,
    GET_NOTE_DETAIL,
    SET_CURRENT_NOTE,
    ADD_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE,
    FILTER_NOTE,
    SORT_NOTE,
    APPEND_CACHE_NOTE,
    MODIFY_CACHE_NOTE,
    REMOVE_CACHE_NOTE,
    ENABLE_EDITOR,
    DISABLE_EDITOR,
    ENABLE_SAVE,
    DISABLE_SAVE,
    NOTE_ERROR
} from '../types.js';

export default (state, action) => {
    switch(action.type){
        case GET_NOTES:
            return {
                ...state,
                notes: action.payload,
                loading: false
            }
        case GET_NOTE_DETAIL:
        case SET_CURRENT_NOTE:
            return {
                ...state,
                current: action.payload
            }
        case ADD_NOTE:
            return {
                ...state,
                notes: [...state.notes, action.payload]
            }
        case UPDATE_NOTE:
            return {
                ...state,
                notes: state.notes.map(note => 
                    note._id === action.payload._id ? action.payload : note
                )
            }
        case ENABLE_EDITOR:
            return {
                ...state,
                editorEnable: true
            }
        case DISABLE_EDITOR:
            return {
                ...state,
                editorEnable: false
            }
        case APPEND_CACHE_NOTE:
            return {
                ...state,
                cacheNotes: [...state.cacheNotes, action.payload]
            }
        case MODIFY_CACHE_NOTE:
            return {
                ...state,
                cacheNotes: state.cacheNotes.map(cacheNote => 
                    cacheNote._id === action.payload._id ? action.payload : cacheNote
                )
            }
        case REMOVE_CACHE_NOTE:
            return {
                ...state,
                cacheNotes: state.cacheNotes.filter(cacheNote => {
                    return cacheNote._id !== action.payload;
                })
            }
        case ENABLE_SAVE:
            return {
                ...state,
                saveEnable: true
            }
        case DISABLE_SAVE:
            return {
                ...state,
                saveEnable: false
            }
        case NOTE_ERROR:
            return {
                error: action.payload
            }
        default:
            return state;
    }
}