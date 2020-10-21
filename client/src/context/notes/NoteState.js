import React, { useReducer } from 'react';
import axios from 'axios';
import NoteContext from './noteContext';
import NoteReducer from './noteReducer';
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

const NoteState = props => {
    const initialState = {
        notes: null,
        current: null,
        cacheNotes: [],
        editorEnable: false,
        saveEnable: false,
        filtered: null,
        orderBy: 'asc',
        sortBy: 'title',
        error: null,
        loading: false
    };

    const [state, dispatch] = useReducer(NoteReducer, initialState);

    //查詢全部筆記清單
    const getNotes = async notedirId => {
        const config = {
            headers: {
                'x-notedir': notedirId
            }
        };

        try {
            //todo: 動態load N筆資料
            const res = await axios.get('/api/notes',config);
            
            dispatch({
                type: GET_NOTES,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: NOTE_ERROR,
                payload: err.msg
            })
        }
    }

    //設定目前的筆記內容
    const setCurrentNote = note => {
        try {
            dispatch({
                type: SET_CURRENT_NOTE,
                payload: note
            })
        } catch (err) {
            dispatch({type: NOTE_ERROR})
        }
    }

    //查詢筆記內容
    const getNoteDetail = async id => {
        try {
            const res = await axios.get(`/api/notes/${id}`);
            dispatch({
                type: GET_NOTE_DETAIL,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: NOTE_ERROR,
                payload: err.msg
            })
        }
    }

    //新增筆記
    const addNote = async note => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/notes/', note, config);
            dispatch({
                type: ADD_NOTE,
                payload: res.data
            });
        } catch (err) {
            dispatch({
                type: NOTE_ERROR,
                payload: err.msg
            });
        }
    }

    //修改筆記
    const updateNote = async (id, note) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.put(`/api/notes/${id}`, note, config);
            dispatch({
                type: UPDATE_NOTE,
                payload: res.data
            });
        } catch (err) {
            dispatch({ type: NOTE_ERROR});
        }
    }

    //刪除筆記
    const deleteNote = () => {

    }

    //篩選筆記
    const filterNote = () => {

    }

    //排序筆記
    const sortNote = () => {

    }

    //新增暫存的筆記
    const appendCacheNote = note => {
        try {
            dispatch({
                type: APPEND_CACHE_NOTE,
                payload: note
            })
        } catch (err) {
            dispatch({type: NOTE_ERROR})
        }
    }

    //編輯暫存的筆記
    const modifyCacheNote = note => {
        try {
            dispatch({
                type: MODIFY_CACHE_NOTE,
                payload: note
            })
        } catch (err) {
            dispatch({type: NOTE_ERROR})
        }
    }

    //刪除暫存的筆記
    const removeCacheNote = id => {
        try {
            dispatch({
                type: REMOVE_CACHE_NOTE,
                payload: id
            })
        } catch (err) {
            dispatch({type: NOTE_ERROR})
        }
    }

    //啟用編輯器
    const enableEditor = () => {
        try {
            dispatch({ type: ENABLE_EDITOR });
        } catch (err) {
            dispatch({type: NOTE_ERROR});
        }
    };

    //停用編輯器
    const disableEditor = () => {
        try {
            dispatch({ type: DISABLE_EDITOR });
        } catch (err) {
            dispatch({type: NOTE_ERROR});
        }
    };

    //啟用儲存功能
    const enableSave = () => {
        try {
            dispatch({ type: ENABLE_SAVE });
        } catch (err) {
            dispatch({type: NOTE_ERROR});
        }
    }

    //停用儲存功能
    const disableSave = () => {
        try {
            dispatch({ type: DISABLE_SAVE });
        } catch (err) {
            dispatch({type: NOTE_ERROR});
        }
    }

    return (
        <NoteContext.Provider
        value={{
            notes: state.notes,
            current: state.current,
            cacheNotes: state.cacheNotes,
            editorEnable: state.editorEnable,
            saveEnable: state.saveEnable,
            filtered: state.filtered,
            orderBy: state.orderBy,
            sortBy: state.sortBy,
            error: state.error,
            getNotes,
            getNoteDetail,
            setCurrentNote,
            enableEditor,
            disableEditor,
            addNote,
            updateNote,
            deleteNote,
            filterNote,
            sortNote,
            appendCacheNote,
            modifyCacheNote,
            removeCacheNote,
            enableSave,
            disableSave
        }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;