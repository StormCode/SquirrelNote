import React, { useContext, useEffect } from 'react'
import Spinner from '../layout/Spinner'
import Note from './Note';

import NoteContext from '../../context/notes/noteContext';

const Notes = ({ notedirId, addEvent, setCacheNoteContent, setNoteContent }) => {
    const noteContext = useContext(NoteContext);

    const { notes, 
        cacheNotes, 
        getNotes, 
        loading } = noteContext;

    useEffect(() => {
        notedirId && getNotes(notedirId);
    
        // eslint-disable-next-line
    }, [notedirId]);

    const enableAddNoteStyle = {
        cursor: 'pointer',
        paddingLeft: '10px',
        fontSize: '1.2rem'
    };

    const getSummary = data => {
        let element = Array.from( new DOMParser().parseFromString( data, 'text/html' )
                .querySelectorAll( 'p, h1, h2, h3, blockquote, q, cite, code' ) )[0];
        return element ? element.textContent.substring(0,10) : '';
    }

    return (
        <div className='note-list'>
            <div id='add-note' onClick={addEvent} style={enableAddNoteStyle}>
                新增筆記
            </div>
            {notes && !loading ?
                (notes.length == 0 && cacheNotes.length == 0) ? <p>還沒有東西~趕緊去新增筆記~</p>
                            : (<ul>
                                {cacheNotes.map(cacheNote => {
                                    return <Note key={cacheNote._id} 
                                        note= {{
                                            _id: cacheNote._id,
                                            title: cacheNote.title,
                                            type: 'cache',
                                            summary: getSummary(cacheNote.content)
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