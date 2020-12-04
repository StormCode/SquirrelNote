import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { FilePlus } from "phosphor-react";
import Spinner from '../layout/Spinner';
import Note from './Note';

// Import Style
import { theme } from '../../style/themes';

import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

const { orange, gray } = theme;

const NoteList = styled.div`
    grid-area: note-list;
    border-left: 1px solid rgba(255,120,0,1);
    padding: .5rem;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;

    > .header {
        border-bottom: 1px solid ${({theme}) => theme.orange};
        padding: .3rem;
    }

        > .header > .title {
            color: ${({theme}) => theme.gray};
            font-size: 1rem;
            font-weight: bold;
        }
        
        > .header > button {
            float: right;
            position: relative;
            background: none;
            border: none;
        }

    > ul {
        margin: 0;
        padding: 0;
    }
`;

const Notes = ({ addEvent, setCacheNoteContent, setNoteContent }) => {
    const notedirContext = useContext(NotedirContext);
    const noteContext = useContext(NoteContext);

    const notedirId = notedirContext.current ? notedirContext.current._id : null;

    const { notes, 
        cacheNotes, 
        getNotes,
        clearNote, 
        loading 
    } = noteContext;
    const [color, setColor] = useState(gray);

    useEffect(() => {
        return () => {
            clearNote();
        }
    
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        notedirId && getNotes(notedirId);
    }, [notedirId]);

    const appendDot = data => {
        return data.length >= 10 ? 
                    data.substring(0,10).concat('...') 
                : data;
    }

    const getSummary = data => {
        let element = Array.from( new DOMParser().parseFromString( data, 'text/html' )
                .querySelectorAll( 'p, h1, h2, h3, blockquote, q, cite, code' ) )[0];
        return element ? appendDot(element.textContent) : '';
    }

    const iconChange = {
        'note': () => {
            setColor(orange);
        },
        'default': () => {
            setColor(gray);
        }
    }

    const BtnContent = ({onChange, children}) => {
        return <span
                onMouseEnter={onChange}
                onMouseLeave={iconChange.default}>
                    {children}
                </span>};

    return (
        <NoteList>
            <div className='header'>
                <span className='title'>筆記</span>
                <button alt='add note' onClick={addEvent}>
                    <BtnContent onChange={iconChange.note} children={<FilePlus size={20} color={color} />} />
                </button>
            </div>
            {notes && !loading ?
                (notes.length == 0 && cacheNotes.length == 0) ? <p>還沒有東西~趕緊去新增筆記~</p>
                            : (<ul>
                                {cacheNotes.map(cacheNote => {
                                    return <Note 
                                                key={cacheNote._id} 
                                                isUnsaved={true}
                                                note= {{
                                                    _id: cacheNote._id,
                                                    title: cacheNote.title,
                                                    summary: getSummary(cacheNote.content)
                                                }} 
                                                setCurrentNote={setCacheNoteContent} 
                                            />
                                })}
                                {notes.filter(note => {
                                    return cacheNotes.map(cacheNote => cacheNote._id).indexOf(note._id) == -1;
                                }).map(note => {
                                    return <Note 
                                                key={note._id}
                                                isUnsaved={false}
                                                note= {{
                                                    ...note,
                                                    ['summary']: appendDot(note.summary)
                                                }} 
                                                setCurrentNote={setNoteContent} 
                                            />
                                })}
                            </ul>)
            : <Spinner /> }
        </NoteList>
    )
}

export default Notes;