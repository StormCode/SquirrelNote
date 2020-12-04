import React, { Fragment, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as UnsavedMark } from  '../../assets/general/unsaved_mark.svg';

// Import Style
import { theme } from '../../style/themes';

import NoteContext from '../../context/notes/noteContext';

const { orange, darkOrange, gray } = theme;

const NoteContainer = styled.li`
    cursor: pointer;
    position: relative;
    color: ${props => props.isCurrent ? orange : gray};
    border-left: ${props => props.isCurrent ? '.5rem solid ' + orange : 'none'};
    padding: .5rem 0 .5rem ${props => props.isCurrent ? '.3rem' : '.8rem'};
    font-size: 1rem;
    line-height: 1.5rem;
    width: 100%;
    height: auto;
    min-height: 4rem;
    &:hover {
        padding-left: .3rem;
        color: ${props => props.isCurrent ? darkOrange : orange};
        border-left: .5rem solid ${props => props.isCurrent ? darkOrange : orange};
    };

    p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

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