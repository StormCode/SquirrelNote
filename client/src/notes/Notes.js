import React, { useContext, useEffect } from 'react'
import Spinner from '../component/layout/Spinner'
import Note from './Note';

import NoteContext from '../context/notes/noteContext';

const Notes = ({ notedirId }) => {
    const noteContext = useContext(NoteContext);

    const { notes, 
        cacheNotes, 
        current, 
        getNotes, 
        getNoteDetail, 
        loading, 
        enableEditor, 
        appendCacheNote,
        modifyCacheNote, 
        setCurrentNote } = noteContext;

    useEffect(() => {
        notedirId && getNotes(notedirId);
    
        // eslint-disable-next-line
    }, [notedirId]);

    const getId = () => {
        return cacheNotes.length == 0 ? 1 : Math.max(...cacheNotes.map(cacheNote => cacheNote._id)) + 1;
    }

    const onAddNote = e => {
        e.preventDefault();
        let newNote = {
            _id: getId(),
            title: '',
            content: ''
        };
        setCurrentNote(newNote);
        appendCacheNote(newNote);
        enableEditor();
    };

    const setCacheNoteContent = note => {
        let currentNote = {
            _id: note._id,
            title: note.title,
            content: cacheNotes.find(cacheNote => {
                return cacheNote._id == note._id
            }).content
        };
        setCurrentNote(currentNote);
        modifyCacheNote(currentNote)
        enableEditor();
    }

    const setNoteContent = async note => {
        let currentNote = cacheNotes.map(cacheNote => cacheNote._id).indexOf(note._id) == -1 ?
            await getNoteDetail(note._id) 
            : cacheNotes.find(cacheNote => {
                return cacheNote._id == note._id
            });
        setCurrentNote({
            _id: note._id,
            title: note.title,
            content: currentNote.content
        });
        enableEditor();
    };

    const enableAddNoteStyle = {
        cursor: 'pointer',
        paddingLeft: '10px',
        fontSize: '1.2rem'
    };

    return (
        <div className='note-list'>
            <div id='add-note' onClick={onAddNote} style={enableAddNoteStyle}>
                新增筆記
            </div>
            { notes && !loading ?
                (notes.length == 0 && cacheNotes.length == 0) ? <p>還沒有東西~趕緊去新增筆記~</p>
                            : (<ul>
                                {cacheNotes.map(note => {
                                    return <Note key={note._id} 
                                        note= {{
                                            _id: note._id,
                                            title: note.title,
                                            summary: note.content.substring(0,10)
                                        }} 
                                        setCurrentNote={setCacheNoteContent} />
                                })}
                                {notes.filter(note => {
                                    return cacheNotes.map(cacheNote => cacheNote._id).indexOf(note._id) == -1;
                                }).map(note => {
                                    return <Note key={note._id} 
                                        note= {note} 
                                        setCurrentNote={setNoteContent} />
                                })}
                            </ul>)
            : <Spinner /> }
        </div>
    )
}

export default Notes;