import React, { useContext } from 'react';

import Editor from '../layout/Editor';

import NoteContext from '../../context/notes/noteContext';

const NoteEditor = ({note, enable, loading }) => {
    const noteContext = useContext(NoteContext);

    const { 
        cacheNotes,
        setCurrentNote,
        appendCacheNote,
        modifyCacheNote } = noteContext;

    const editorContentChange = data => {
        (async (_note, _data) => {
            let noteData = {
                _id: _note._id,
                title: _note.title,
                content: _data
            };
            
            await setCurrentNote(noteData);
            cacheNotes.map(cacheNote => cacheNote._id).indexOf(noteData._id) !== -1 ?
                modifyCacheNote(noteData) : appendCacheNote(noteData);
        })(note, data);
        // let noteData = {
        //     _id: note._id,
        //     title: note.title,
        //     content: data
        // };
        
        // await setCurrentNote(noteData);
        // cacheNotes.map(cacheNote => cacheNote._id).indexOf(noteData._id) !== -1 ?
        //     modifyCacheNote(noteData) : appendCacheNote(noteData);
    }

    return (
        <Editor 
            enable={enable}
            content={note ? note.content : ''} 
            loading={loading} 
            contentChange={editorContentChange} />
    )
}

export default NoteEditor;