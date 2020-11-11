import React from 'react';
import { ReactComponent as Unsaved } from  '../../assets/general/unsaved.svg';

const Note = ({ note, setCurrentNote }) => {
    const onClick = e => {
        e.preventDefault();
        setCurrentNote(note);
    }

    return (
        <li>
            { note !== null ?
                <div onClick={onClick} style={{position: 'relative'}}>
                    <p>{note.title}</p>
                    <p>{note.summary}</p>
                    {note.type == 'cache' && <Unsaved style={{position: 'absolute', top: '0', right: '0'}} alt='unsaved' />}
                </div> 
            : null }
        </li>
    )
}

export default Note;