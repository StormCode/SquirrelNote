import React from 'react'

const Note = ({ note, setCurrentNote }) => {
    const onClick = e => {
        e.preventDefault();
        setCurrentNote(note);
    }

    return (
        <li>
            { note !== null ?
                <div onClick={onClick}>
                    <p>{note.title}</p>
                    <p>{note.summary}</p>
                </div> 
            : null }
        </li>
    )
}

export default Note;