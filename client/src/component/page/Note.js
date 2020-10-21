import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Notedirs from '../../notedirs/NoteDirs';
import Notes from '../../notes/Notes';
import NoteEditor from '../../notes/NoteEditor';
import NotedirSorter from '../../notedirs/NotedirSorter';

import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

// Import Style
import '../../style/page/Note.css';

const Note = ({ match }) => {
    const notedirContext = useContext(NotedirContext);
    const noteContext = useContext(NoteContext);

    const { notes, 
        current, 
        modifyCacheNote, 
        removeCacheNote, 
        setCurrentNote, 
        editorEnable, 
        enableEditor, 
        saveEnable, 
        enableSave,
        disableSave,
        addNote,
        updateNote,
        error,
        loading } = noteContext;

    useEffect(() => {
        current && 
            (current.title !== '' || current.content !== '') ? enableSave() : disableSave()
    },[current]);

    const titleChange = e => {
        e.preventDefault();
        let note = {
            _id: current._id,
            title: e.target.value
        };

        setCurrentNote({ ...note, content: current.content});
        modifyCacheNote({ ...note, content: current.content});
    }

    const contentChange = content => {
        let note = {
            _id: current._id,
            title: current.title
        };

        setCurrentNote({ ...note, content});
        modifyCacheNote({ ...note, content});
    }

    const onEdit = e => {
        e.preventDefault();
        current && enableEditor();
    }

    const onDelete = e => {
        e.preventDefault();
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

    return (
        <div className='note-container'>
            <div className='header'>
                <Link to='../'>回到筆記本</Link>
                <NotedirSorter />
            </div>
            <Notedirs notebookId={match.params.id} />
            <Notes notedirId={notedirContext.current ? notedirContext.current._id : null} />
            <div className='note-header'>
                <button className='note-delete-btn right-align' onClick={onDelete} disabled={!editorEnable}>刪除</button>
                <button className='note-edit-btn right-align' onClick={onEdit} disabled={!editorEnable}>編輯</button>
                <div className='note-title-container'>
                    <input type='text' placeholder='新筆記' className='note-title' value={current ? current.title : ''} onChange={titleChange} disabled={!editorEnable}/>
                    <button className='note-save-btn' onClick={onSave} disabled={!(editorEnable && saveEnable)}>儲存</button>
                </div>
            </div>
            <NoteEditor 
                enable={editorEnable}
                content={current ? current.content : ''} 
                loading={loading} 
                contentChange={contentChange} />
            <div className='recycle-bin'></div>
        </div>
    )
}

export default Note;