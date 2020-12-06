import {
    GET_NOTES,
    GET_NOTE_DETAIL,
    SET_CURRENT_NOTE,
    CLEAR_CURRENT_NOTE,
    ADD_NOTE,
    UPDATE_NOTE,
    DELETE_NOTE,
    MOVE_NOTE,
    FILTER_NOTE,
    CLEAR_FILTER_NOTE,
    APPEND_CACHE_NOTE,
    MODIFY_CACHE_NOTE,
    REMOVE_CACHE_NOTE,
    SET_SAVE,
    ENABLE_DELETE,
    DISABLE_DELETE,
    CLEAR_NOTE,
    NOTE_ERROR
} from '../types.js';
import {
    DISABLESAVE
} from '../../saveState';

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
                current: action.payload,
                cacheCurrent: {
                    title: action.payload.title,
                    content: action.payload.content
                }
            }
        case SET_CURRENT_NOTE:
            return {
                ...state,
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
                        content: action.payload.content, 
                        date: action.payload.date
                    }),
                cacheCurrent: {
                    title: state.current.title,
                    content: action.payload.content
                },
                notes: [...state.notes, action.payload]
            }
        case UPDATE_NOTE:
            return {
                ...state,
                current: Object.assign({}, state.current, 
                    {
                        content: action.payload.content, 
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
        case MOVE_NOTE:
            return {
                ...state,
                notes: state.notes.filter(note => 
                    note._id !== action.payload)
            }
        case FILTER_NOTE:
            return {
                ...state,
                filtered: state.notes.filter(note => {
                    const regex = new RegExp(`${action.payload}`, 'gi');
                    return note.title.match(regex);
                })
            }
        case APPEND_CACHE_NOTE:
            return {
                ...state,
                cacheNotes: [...state.cacheNotes, action.payload],
                current: action.payload,
                cacheCurrent: state.notes.find(note => note._id === action.payload._id)
                                ? state.cacheCurrent : {
                                    title: '',
                                    content: ''
                                }
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
                }),
                current: null,
                cacheCurrent: null
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
        case CLEAR_FILTER_NOTE:
            return {
                ...state,
                filtered: null
            }
        case CLEAR_NOTE:
            return {
                ...state,
                notes: null,
                current: null,
                cacheCurrent: null,
                save: {
                    state: DISABLESAVE,
                    showUpdateTime: false
                },
                cacheNotes: [],
                deleteEnable: false,
                filtered: null,
                error: null
            }
        case NOTE_ERROR:
            return {
                error: action.payload
            }
        default:
            return state;
    }
}