import {
    GET_NOTES,
    GET_NOTE_DETAIL,
    SET_CURRENT_NOTE,
    CLEAR_CURRENT_NOTE,
    ADD_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE,
    APPEND_CACHE_NOTE,
    MODIFY_CACHE_NOTE,
    REMOVE_CACHE_NOTE,
    ENABLE_EDITOR,
    DISABLE_EDITOR,
    SET_SAVE,
    ENABLE_DELETE,
    DISABLE_DELETE,
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
            return {
                ...state,
                editorEnable: true,
                current: action.payload,
                cacheCurrent: {
                    title: action.payload.title,
                    content: action.payload.content
                }
            }
        case SET_CURRENT_NOTE:
            return {
                ...state,
                editorEnable: true,
                current: Object.assign({}, state.current, action.payload)
            }
        case CLEAR_CURRENT_NOTE:
            return {
                ...state,
                current: null
            }
        case ADD_NOTE:
            return {
                ...state,
                current: Object.assign({}, state.current, 
                    {
                        _id: action.payload._id, 
                        date: action.payload.date
                    }),
                //因為server回傳的資料中沒有content，所以由current帶給cacheCurrent
                cacheCurrent: {
                    title: state.current.title,
                    content: state.current.content
                },
                notes: [...state.notes, action.payload]
            }
        case UPDATE_NOTE:
            return {
                ...state,
                current: Object.assign({}, state.current, 
                    {
                        date: action.payload.date
                    }),
                cacheCurrent: {
                    title: action.payload.title,
                    content: action.payload.content
                },
                notes: state.notes.map(note => 
                    note._id === action.payload._id ? action.payload : note
                )
            }
        case DELETE_NOTE:
            return {
                ...state,
                current: null,
                cacheCurrent: null,
                notes: state.notes.filter(note => 
                    note._id !== action.payload)
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
                cacheNotes: [...state.cacheNotes, action.payload],
                current: action.payload,
                cacheCurrent: {
                    title: action.payload.title,
                    content: action.payload.content
                },
                editorEnable: true
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
        case SET_SAVE:
            return {
                ...state,
                save: action.payload
            }
        case ENABLE_DELETE:
            return {
                ...state,
                deleteEnable: true
            }
        case DISABLE_DELETE:
            return {
                ...state,
                deleteEnable: false
            }
        case NOTE_ERROR:
            return {
                error: action.payload
            }
        default:
            return state;
    }
}