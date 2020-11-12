import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Notedirs from '../notedirs/NoteDirs';
import Notes from '../notes/Notes';
import NoteEditor from '../notes/NoteEditor';
import NotedirSorter from '../notedirs/NotedirSorter';

import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

// Import Style
import '../../style/page/Note.css';

const Note = ({ match }) => {
    const history = useHistory();
    const notedirContext = useContext(NotedirContext);
    const noteContext = useContext(NoteContext);

    const { notes, 
        current, 
        cacheNotes, 
        appendCacheNote, 
        modifyCacheNote, 
        removeCacheNote, 
        discardCacheNote,
        setCurrentNote, 
        editorEnable, 
        enableEditor, 
        disableEditor, 
        saveEnable, 
        enableSave,
        disableSave,
        deleteEnable,
        enableDelete,
        disableDelete,
        addNote,
        updateNote,
        deleteNote, 
        error,
        loading } = noteContext;

    useEffect(() => {
        //控制儲存、刪除、編輯器狀態
        if(current) {
            ((cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1) 
                && (current.title !== '' || current.content !== '') ? enableSave() : disableSave());
            notes.map(note => note._id).indexOf(current._id) !== -1 ? enableDelete() : disableDelete();
        } else {
            disableEditor();
            disableSave();
            disableDelete();
        }
    },[current, cacheNotes, notes]);

    const titleChange = e => {
        e.preventDefault();
        let note = {
            _id: current._id,
            title: e.target.value,
            content: current.content
        };
        setCurrentNote(note);
        cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1 ?
            modifyCacheNote(note) : appendCacheNote(note);
    }

    const contentChange = content => {
        let note = {
            _id: current._id,
            title: current.title,
            content
        };

        setCurrentNote(note);
        cacheNotes.map(cacheNote => cacheNote._id).indexOf(current._id) !== -1 ?
            modifyCacheNote(note) : appendCacheNote(note);
    }

    const onEdit = e => {
        e.preventDefault();
        current && enableEditor();
    }

    const onDelete = async e => {
        e.preventDefault();
        current && await deleteNote(notedirContext.current._id, current._id);
    }

    const onDiscard = e => {
        e.preventDefault();
        current && discardCacheNote(current._id);
    }

    const onSave = async e => {
        e.preventDefault();
        if(current) {
            let saveNote = {
                title: current.title,
                content: current.content,
                notedir: notedirContext.current._id
            };

            //判斷要做Add還是Update
            if(notes.map(note => note._id).indexOf(current._id) == -1) {
                //新增筆記到資料庫
                await addNote(saveNote);
            } else {
                //更新筆記到資料庫
                await updateNote(current._id, saveNote);
            }
            !error && removeCacheNote(current._id);
        }
    }

    const LoadRecycleBin = () => {
        history.push(`/recyclebin`);
    };

    return (
        <div className='note-container'>
            <div className='header'>
                <Link to='../'>回到筆記本</Link>
                <NotedirSorter />
            </div>
            <Notedirs notebookId={match.params.id} />
            <Notes notedirId={notedirContext.current ? notedirContext.current._id : null} />
            <div className='note-header'>
                {deleteEnable ? (<button className='note-delete-btn right-align' onClick={onDelete}>刪除</button>)
                : (<button className='note-discard-btn right-align' onClick={onDiscard} disabled={!current}>捨棄</button>)}
                <button className='note-edit-btn right-align' onClick={onEdit} disabled={!editorEnable}>編輯</button>
                <div className='note-title-container'>
                    <input type='text' placeholder='新筆記' className='note-title' value={current ? current.title : ''} onChange={titleChange} disabled={!editorEnable}/>
                    <button className='note-save-btn' onClick={onSave} disabled={!saveEnable}>儲存</button>
                </div>
            </div>
            <NoteEditor 
                enable={editorEnable}
                content={current ? current.content : ''} 
                loading={loading} 
                contentChange={contentChange} />
            <div className='recycle-bin'>
                <button className='recycle-bin-btn' onClick={LoadRecycleBin}>回收站</button>
            </div>
        </div>
    )
}

export default Note;