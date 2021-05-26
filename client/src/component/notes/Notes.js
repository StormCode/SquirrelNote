import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from "@material-ui/core/Tooltip";
import { FilePlus, ArrowLineLeft } from "phosphor-react";
import NoteFilter from './NoteFilter';
import Note from './Note';
import makeResponsiveCSS from '../../utils/make-responsive-css';

// Import Resource
import NoteSmallImage from '../../assets/note/note_300w.png';
import NoteMediumImage from '../../assets/note/note_1000w.png';
import NoteLargeImage from '../../assets/note/note_2000w.png';

// Import Style
import { theme } from '../../style/themes';
import IntroBox from '../../style/general/IntroBox';

import {
    getNotes,
    getAllNotes,
    clearNote
} from '../../actions/noteActions';

const { orange, gray } = theme;

const NoteListBaseStyle = theme => {
    return `
        flex: 1 1 100%;
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

const Notes = ({ 
    notebookId,
    currentNotedir,
    note, 
    addEvent, 
    setCacheNoteContent, 
    setNoteContent, 
    setKeyword, 
    toggleCollapse,
    getNotes,
    getAllNotes,
    clearNote, 
}) => {

    const { 
        notes, 
        filtered,
        cacheMap, 
        loading,
        error 
    } = note;
    
    const defaultColor = {
        note: gray,
        collapse: gray
    };
    const notedirId = currentNotedir !== '' ? currentNotedir ? currentNotedir._id : null : currentNotedir;
    const allCacheNotes = [...cacheMap.values()].flat();
    const currentCacheNotes = cacheMap.get(notedirId) || [];      // 目前目錄裡的快取筆記
    
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

        // eslint-disable-next-line
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
            setColor({...defaultColor, 'note': orange});

        },
        'collapse': () => {
            setColor({...defaultColor, 'collapse': orange});

        },
        'default': () => {
            setColor(defaultColor);
        }
    }

    const BtnContent = ({onChange, children, tooltip}) => {
        return <Tooltip
            title={tooltip}
            placement='top'
        >
            <span
                onMouseEnter={onChange}
                onMouseLeave={iconChange.default}>
                {children}
            </span>
        </Tooltip>};

    return (
        <NoteList>
            <div className='note-header'>
                <i className='parlgrm'></i>
                <span className='title'>筆記</span>
                <NoteFilter setKeyword={setKeyword} />
                <button alt='add note' className='tiny-btn' onClick={addEvent}>
                    <BtnContent onChange={iconChange.note} children={<FilePlus size={22} color={color.note} />} tooltip='新增筆記' />
                </button>
                <button alt='collapse/expand note' className='tiny-btn collapse-btn' onClick={onToggleCollapse}>
                    <BtnContent onChange={iconChange.collapse} children={<ArrowLineLeft size={22} color={color.collapse} />} tooltip='隱藏清單' />
                </button>
            </div>
            {!loading ?
                notes && !error ? 
                    ((notes.length === 0 && allCacheNotes.length === 0) ? 
                        <IntroBox>
                            <img alt='note-bg' src={NoteSmallImage}
                                srcSet={`
                                    ${NoteSmallImage} 300w, 
                                    ${NoteMediumImage} 1000w, 
                                    ${NoteLargeImage} 2000w
                                `}
                            />
                            <p>別猶豫了，開始動手寫下你的第一個筆記吧</p>
                        </IntroBox>
                    : (<ul>
                        {currentCacheNotes
                            .map(cacheNote => {
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
                        {filtered !== null ?
                            (filtered.map(note => 
                                <Note key={note._id} 
                                    note={{
                                        ...note,
                                        'summary': appendDot(note.summary)
                                    }} 
                                    setCurrentNote={setNoteContent}
                                />
                            )) :
                            notes.filter(note => {
                                return currentCacheNotes.map(cacheNote => cacheNote._id).indexOf(note._id) === -1;
                            }).map(note => {
                                return <Note 
                                            key={note._id}
                                            isUnsaved={false}
                                            note= {{
                                                ...note,
                                                'summary': appendDot(note.summary)
                                            }} 
                                            setCurrentNote={setNoteContent} 
                                        />
                            })
                        }
                    </ul>))
                : null
            : null }
        </NoteList>
    )
}

Notes.propTypes = {
    notebookId: PropTypes.string.isRequired,
    currentNotedir: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    note: PropTypes.object.isRequired,
    addEvent: PropTypes.func.isRequired,
    setCacheNoteContent: PropTypes.func.isRequired,
    setNoteContent: PropTypes.func.isRequired,
    setKeyword: PropTypes.func.isRequired,
    toggleCollapse: PropTypes.func.isRequired
}

const mapStateProps = state => ({
    currentNotedir: state.notedirs.current,
    note: { 
        notes: state.notes.notes, 
        filtered: state.notes.filtered,
        cacheMap: state.notes.cacheMap, 
        loading: state.notes.loading,
        error: state.notes.error
    }
});

export default connect(
    mapStateProps,
    {
        getNotes,
        getAllNotes,
        clearNote
    }
)(Notes);