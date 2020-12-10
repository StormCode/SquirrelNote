import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { FilePlus, ArrowLineLeft } from "phosphor-react";
import Spinner from '../layout/Spinner';
import NoteFilter from './NoteFilter';
import Note from './Note';
import makeResponsiveCSS from '../../utils/make-responsive-css'

// Import Style
import { theme } from '../../style/themes';

import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

const { orange, gray } = theme;

const NoteListBaseStyle = theme => {
    return `
        display: flex;
        flex-flow: column nowrap;
        border-left: 1px solid rgba(255,120,0,1);
        padding: .5rem;
        height: 100%;

        > .note-header {
            display: flex;
            flex-flow: row nowarp;
            border-bottom: 1px solid ${theme.orange};
            padding: .3rem;
            align-items: baseline;
            min-height: 2.5rem;
        }

            > .note-header > .title {
                flex: 1 0 auto;
                color: ${theme.gray};
                font-size: 1rem;
                font-weight: bold;
            }
            
            > .note-header > button {
                flex: 0 1 auto;
                position: relative;
                background: none;
                border: none;
            }

                > .note-header > button:first-child {
                    margin-left: auto;
                }

        > ul {
            flex: 1 1 auto;
            margin: 0;
            padding: 0;
            height: 0;
            overflow-y: auto;
        }

        .parlgrm {
            background: ${theme.orange};
            display: inline-block;
            min-width: .5rem;
            height: 1rem;
            margin-right: .5rem;
            transform: skew(-30deg);
        }
    `;
}

const NoteListResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                .collapse-btn {
                    display: none;
                }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                .collapse-btn {
                    display: block;
                }
            `
        }
    ])
}

const NoteList = styled.div`
    ${({theme}) => NoteListBaseStyle(theme)}
    ${NoteListResponsiveStyle()}
`;

const Notes = ({ notebookId, addEvent, setCacheNoteContent, setNoteContent, toggleCollapse }) => {
    const notedirContext = useContext(NotedirContext);
    const noteContext = useContext(NoteContext);

    const notedirId = notedirContext.current ? notedirContext.current._id : null;

    const { notes, 
        filtered,
        cacheNotes, 
        getNotes,
        getAllNotes,
        clearNote, 
        loading 
    } = noteContext;

    const defaultColor = {
        note: gray,
        collapse: gray
    };
    const [color, setColor] = useState(defaultColor);

    useEffect(() => {
        return () => {
            clearNote();
        }
    
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(notedirId) {
            getNotes(notedirId);
        } else if (notedirId === '' && notebookId) {
            getAllNotes(notebookId);
        }
    }, [notebookId, notedirId]);

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

    const onToggleCollapse = e => {
        e.preventDefault();
        toggleCollapse();
    }

    const iconChange = {
        'note': () => {
            setColor({...defaultColor, ['note']: orange});

        },
        'collapse': () => {
            setColor({...defaultColor, ['collapse']: orange});

        },
        'default': () => {
            setColor(defaultColor);
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
            <div className='note-header'>
                <i className='parlgrm'></i>
                <span className='title'>筆記</span>
                <NoteFilter />
                <button alt='add note' className='tiny-btn' onClick={addEvent}>
                    <BtnContent onChange={iconChange.note} children={<FilePlus size={22} color={color.note} />} />
                </button>
                <button alt='collapse/expand note' className='tiny-btn collapse-btn' onClick={onToggleCollapse}>
                    <BtnContent onChange={iconChange.collapse} children={<ArrowLineLeft size={22} color={color.collapse} />} />
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
                                { filtered != null && !loading ?
                                    (filtered.map(note => 
                                        <Note key={note._id} 
                                            note={{
                                                ...note,
                                                ['summary']: appendDot(note.summary)
                                            }} 
                                            setCurrentNote={setNoteContent}
                                        />
                                    )) :
                                    notes.filter(note => {
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
                                    })
                                }
                            </ul>)
            : <Spinner /> }
        </NoteList>
    )
}

export default Notes;