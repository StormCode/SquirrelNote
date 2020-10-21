import React, { Fragment, useState, useContext } from 'react';
import Note from './Note';

import NoteContext from '../context/notes/noteContext';

const NewNote = () => {
    const noteContext = useContext(NoteContext);

    const { addNoteVisible } = noteContext;

    const [newNoteContent, setNewNoteContent] = useState({
        title: '',
        content: ''
    });

    const setNoteContent = note => {
        setNewNoteContent(note);
    };

    return (
        <Fragment>
            {addNoteVisible ? (<Note key='newnote' note={newNoteContent} setCurrentNote={setNoteContent} />) : null}
        </Fragment>
    )
}

export default NewNote;