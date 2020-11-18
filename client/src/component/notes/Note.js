import React, { Fragment, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as UnsavedMark } from  '../../assets/general/unsaved_mark.svg';

import NoteContext from '../../context/notes/noteContext';

// Import Style
import { lightGreen,lightGreenOnHover } from '../../style/colors';

const NoteContainer = styled.li`
    position: relative;
    padding: 10px;
    background-color: ${props => props.isCurrent ? lightGreen : '#ccc'};
    &:hover {
        background-color: ${props => props.isCurrent ? lightGreenOnHover: '#ccc'};
    };

    > svg {
        display: ${props => props.isUnsaved ? 'inline-block' : 'none'};
        position: absolute;
        top: 10px; 
        right: 10px;
    }
`;

const Note = ({ note, setCurrentNote, isUnsaved }) => {
    const noteContext = useContext(NoteContext);
    const currentNoteId = noteContext.current ? noteContext.current._id : null;

    const onClick = e => {
        e.preventDefault();
        setCurrentNote(note);
    }

    return (
        <Fragment>
            { note !== null ?
                <NoteContainer 
                    isCurrent={currentNoteId === note._id}
                    isUnsaved={isUnsaved} 
                    onClick={onClick}>
                    <p>{note.title}</p>
                    <p>{note.summary}</p>
                    <UnsavedMark alt='unsaved' />
                </NoteContainer>
            : null }
        </Fragment>
    )
}

export default Note;