import React, { Fragment } from 'react';
import styled from 'styled-components';
import { ReactComponent as UnsavedMark } from  '../../assets/general/unsaved_mark.svg';

const NoteContainer = styled.li`
    position: relative;
    padding: 10px;

    > svg {
        display: ${props => props.isUnsaved ? 'inline-block' : 'none'};
        position: absolute;
        top: 10px; 
        right: 10px;
    }
`;

const Note = ({ note, setCurrentNote, isUnsaved }) => {
    const onClick = e => {
        e.preventDefault();
        setCurrentNote(note);
    }

    return (
        <Fragment>
            { note !== null ?
                <NoteContainer 
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