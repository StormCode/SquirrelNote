import React, { useReducer } from 'react';
import axios from 'axios';
import { encrypt, decrypt } from '../../utils/crypto';
import NoteContext from './noteContext';
import NoteReducer from './noteReducer';
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
    SET_SAVE,
    ENABLE_DELETE,
    DISABLE_DELETE,
    NOTE_ERROR
} from '../types.js';
import {
    DISABLESAVE
} from '../../saveState';

const NoteState = props => {
    const initialState = {
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
        orderBy: 'asc',
        sortBy: 'title',
        error: null,
        loading: true
    };

    const [state, dispatch] = useReducer(NoteReducer, initialState);

    //查詢全部筆記清單
    const getNotes = async notedirId => {
        const config = {
            headers: {
                'x-notedir': encrypt(notedirId, process.env.REACT_APP_SECRET_KEY, false)
            }
        };

        try {
            //todo: 動態load N筆資料
            const res = await axios.get('/api/notes',config);
            // 解密Server回傳的note資料
            const decryptedDatas = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedDatas.map(decryptedData => {
                decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
                decryptedData.summary = decrypt(decryptedData.summary, process.env.REACT_APP_SECRET_KEY, false);
            });
            dispatch({
                type: GET_NOTES,
                payload: decryptedDatas
            });
        } catch (err) {
            dispatch({
                type: NOTE_ERROR,
                payload: err.msg || 'Server Error'
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

    //清除目前的筆記內容
    const clearCurrentNote = () => {
        try {
            dispatch({ type: CLEAR_CURRENT_NOTE })
        } catch (err) {
            dispatch({type: NOTE_ERROR})
        }
    }

    //查詢筆記內容
    const getNoteDetail = async id => {
        try {
            const res = await axios.get(`/api/notes/${id}`);
            // 解密Server回傳的note資料
            const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            decryptedData.content = decrypt(decryptedData.content, process.env.REACT_APP_SECRET_KEY, false);
            dispatch({
                type: GET_NOTE_DETAIL,
                payload: decryptedData
            });
        } catch (err) {
            console.log('err: ' + err);
            
            dispatch({
                type: NOTE_ERROR,
                payload: err.msg || 'Server Error'
            });
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
            // 加密傳至Server的note資料
            const encryptedData = {data: encrypt(note, process.env.REACT_APP_SECRET_KEY)};
            const res = await axios.post('/api/notes/', encryptedData, config);
            // 解密Server回傳的note資料
            const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            decryptedData.summary = decrypt(decryptedData.summary, process.env.REACT_APP_SECRET_KEY, false);
            dispatch({
                type: ADD_NOTE,
                payload: {...decryptedData, content: note.content}
            });
        } catch (err) {
            dispatch({
                type: NOTE_ERROR,
                payload: err.msg || 'Server Error'
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
            // 加密傳至Server的note資料
            const encryptedData = {data: encrypt(note, process.env.REACT_APP_SECRET_KEY)};
            const res = await axios.put(`/api/notes/${id}`, encryptedData, config);
            // 解密Server回傳的note資料
            const decryptedData = decrypt(res.data, process.env.REACT_APP_SECRET_KEY);
            decryptedData.title = decrypt(decryptedData.title, process.env.REACT_APP_SECRET_KEY, false);
            decryptedData.summary = decrypt(decryptedData.summary, process.env.REACT_APP_SECRET_KEY, false);
            dispatch({
                type: UPDATE_NOTE,
                payload: {...decryptedData, content: note.content}
            });
        } catch (err) {
            dispatch({ type: NOTE_ERROR});
        }
    }

    //刪除筆記
    const deleteNote = async (notedirId, noteId) => {
        const config = {
            headers: {
                'x-notedir': encrypt(notedirId, process.env.REACT_APP_SECRET_KEY, false)
            }
        };

        try {
            await axios.delete(`/api/notes/${noteId}`,config);
            dispatch({
                type: DELETE_NOTE,
                payload: noteId
            });
        } catch (err) {
            dispatch({ type: NOTE_ERROR});
        }
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
            });
        } catch (err) {
            dispatch({type: NOTE_ERROR})
        }
    }

    //捨棄暫存筆記
    const discardCacheNote = id => {
        try {
            dispatch({
                type: REMOVE_CACHE_NOTE,
                payload: id
            });
        } catch (err) {
            dispatch({ type: NOTE_ERROR});
        }
    }

    //設定儲存狀態
    const setSave = saveState => {
        try {
            dispatch({ 
                type: SET_SAVE,
                payload: saveState
            });
        } catch (err) {
            dispatch({type: NOTE_ERROR});
        }
    }

    //啟用刪除功能
    const enableDelete = () => {
        try {
            dispatch({ type: ENABLE_DELETE });
        } catch (err) {
            dispatch({type: NOTE_ERROR});
        }
    }

    //停用刪除功能
    const disableDelete = () => {
        try {
            dispatch({ type: DISABLE_DELETE });
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
            cacheCurrent: state.cacheCurrent,
            deleteEnable: state.deleteEnable,
            save: state.save,
            filtered: state.filtered,
            orderBy: state.orderBy,
            sortBy: state.sortBy,
            error: state.error,
            getNotes,
            getNoteDetail,
            setCurrentNote,
            clearCurrentNote,
            addNote,
            updateNote,
            deleteNote,
            appendCacheNote,
            modifyCacheNote,
            removeCacheNote,
            discardCacheNote,
            setSave,
            enableDelete,
            disableDelete
        }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;