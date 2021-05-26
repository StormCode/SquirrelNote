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
    SET_CACHE_NOTE,
    SET_SAVE,
    ENABLE_DELETE,
    DISABLE_DELETE,
    CLEAR_NOTE,
    NOTE_ERROR,
    NOTE_SAVE_ERROR
} from '../actions/types';
import {
    UNSAVE,
    SAVED,
    DISABLESAVE
} from '../saveState';

const initialState = {
    notes: null,
    current: null,
    cacheCurrent: null,
    save: {
        state: DISABLESAVE,
        showUpdateTime: false
    },
    cacheMap: new Map(),    //對應筆記目錄裡的快取筆記
    cacheNotes: [],
    deleteEnable: false,
    filtered: null,
    orderBy: 'asc',
    sortBy: 'title',
    success: null,
    error: null,
    loading: true
};

export default (state = initialState, action) => {
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
                    content: action.payload.content,
                    notedir: action.payload.notedir
                },
                save: {state: SAVED, showUpdateTime: true}
            }
        case SET_CACHE_NOTE:
            return {
                ...state,
                current: action.payload,
                cacheCurrent: {
                    title: action.payload.title,
                    content: action.payload.content,
                    notedir: action.payload.notedir
                },
                save: {state: UNSAVE, showUpdateTime: false}
            }
        case SET_CURRENT_NOTE:
            return {
                ...state,
                current: Object.assign({}, state.current, action.payload)
            }
        case CLEAR_CURRENT_NOTE:
            return {
                ...state,
                current: null,
                cacheCurrent: null,
                success: action.payload ? action.payload.success : null
            }
        case ADD_NOTE:
            return {
                ...state,
                current: Object.assign({}, state.current, 
                    {
                        // _id: action.payload.note._id,
                        content: action.payload.note.content, 
                        date: action.payload.note.date
                    }),
                cacheCurrent: Object.assign({}, state.cacheCurrent, 
                    {
                        title: state.current.title,
                        content: action.payload.note.content,
                        notedir: action.payload.note.notedir
                    }),
                notes: [...state.notes, action.payload.note],
                filtered: state.filtered === null ? state.filtered : [...state.filtered, action.payload.note].filter(filteredItem => {
                    const regex = new RegExp(`${action.payload.keyword}`, 'gi');
                    return (filteredItem.title.match(regex) 
                    || action.payload.note.title.match(regex));
                }),
                cacheMap: state.cacheMap.set(action.payload.notedir, state.cacheMap.get(action.payload.notedir).filter(cacheNote => {
                    return cacheNote._id !== action.payload.id;
                })),
                save: {state: SAVED, showUpdateTime: true}
            }
        case UPDATE_NOTE:
            return {
                ...state,
                current: Object.assign({}, state.current, 
                    {
                        content: action.payload.note.content, 
                        date: action.payload.note.date,
                        notedir: action.payload.note.notedir
                    }),
                cacheCurrent: Object.assign({}, state.cacheCurrent, 
                    {
                        title: state.current.title,
                        content: action.payload.note.content,
                        notedir: action.payload.note.notedir
                    }),
                notes: state.notes.map(note => 
                    note._id === action.payload.note._id ? action.payload.note : note
                ),
                filtered: state.filtered === null ? state.filtered : state.filtered.map(filteredItem => 
                    filteredItem._id !== action.payload.note._id ? filteredItem : action.payload.note
                    ).filter(filteredItem => {
                        const regex = new RegExp(`${action.payload.keyword}`, 'gi');
                        return (filteredItem.title.match(regex) 
                        || action.payload.note.title.match(regex));
                }),
                cacheMap: state.cacheMap.set(action.payload.notedir, state.cacheMap.get(action.payload.notedir).filter(cacheNote => {
                    return cacheNote._id !== action.payload.id;
                })),
                save: {state: SAVED, showUpdateTime: true}
            }
        case DELETE_NOTE:
            return {
                ...state,
                current: null,
                cacheCurrent: null,
                notes: state.notes.filter(note => 
                    note._id !== action.payload.id),
                filtered: state.filtered === null ? state.filtered : state.filtered.filter(filteredItem => 
                    filteredItem._id !== action.payload.id),
                success: action.payload.success
            }
        case MOVE_NOTE:
            return {
                ...state,
                current: null,
                cacheCurrent: null,
                notes: state.notes.filter(note => 
                    note._id !== action.payload.id),
                success: action.payload.success
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
            let currentCacheNote = state.cacheMap.has(action.payload.notedir) ? state.cacheMap.get(action.payload.notedir) : [];
            currentCacheNote.push(action.payload.cacheNote);
            return {
                ...state,
                cacheMap: state.cacheMap.set(action.payload.notedir, currentCacheNote),
                current: action.payload.cacheNote,
                cacheCurrent: state.notes.find(note => note._id === action.payload._id)
                                ? state.cacheCurrent : {
                                    title: '',
                                    content: ''
                                },
                save: (action.payload.cacheNote.title !== '' 
                        || action.payload.cacheNote.content !== '') ? 
                            {state: SAVED, showUpdateTime: true}
                        : {state: DISABLESAVE, showUpdateTime: false}
            }
        case MODIFY_CACHE_NOTE:
            return {
                ...state,
                cacheMap: state.cacheMap.set(action.payload.notedir, state.cacheMap.get(action.payload.notedir).map(cacheNote => 
                        cacheNote._id === action.payload.cacheNote._id ? action.payload.cacheNote : cacheNote)),
                save: (action.payload.cacheNote.title !== '' 
                || action.payload.cacheNote.content !== '') ? 
                    {state: UNSAVE, showUpdateTime: false}
                : {state: DISABLESAVE, showUpdateTime: false}
            }
        case REMOVE_CACHE_NOTE:
            return {
                ...state,
                cacheMap: state.cacheMap.set(action.payload.notedir, state.cacheMap.get(action.payload.notedir).filter(cacheNote => {
                    return cacheNote._id !== action.payload.id;
                }))
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
                loading: true,
                notes: null,
                current: null,
                cacheCurrent: null,
                deleteEnable: false,
                filtered: null,
                success: null,
                error: null
            }
        case NOTE_SAVE_ERROR:
            return {
                ...state,
                save: {state: UNSAVE, showUpdateTime: false}
            }
        case NOTE_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        default:
            return state;
    }
}