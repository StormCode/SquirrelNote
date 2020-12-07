import React, { Fragment, useContext, useState, useEffect } from 'react'
import styled from 'styled-components';
import { Check, X, FolderSimplePlus, ArrowLineLeft } from "phosphor-react";

import Spinner from '../../component/layout/Spinner'
import TextInput from '../../component/layout/TextInput'
import NotedirSorter from './NotedirSorter';
import Notedir from './NoteDir';

// Import Style
import { theme } from '../../style/themes';

import NotebookContext from '../../context/notebooks/notebookContext';
import NotedirContext from '../../context/notedirs/notedirContext';

const { orange, gray } = theme;

const NotedirList = styled.div`
    grid-area: notedir-list;
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

        ul {
            margin: 0;
            padding: 0;
        }

        .parlgrm {
            background: ${({theme}) => theme.orange};
            display: inline-block;
            width: .5rem;
            height: 1rem;
            margin-right: .5rem;
            transform: skew(-30deg);
        }
`;

const Notedirs = ({notebookId, toggleCollapse}) => {
    const notebookContext = useContext(NotebookContext);
    const notedirContext = useContext(NotedirContext);
    const {
        notebooks,
        getNotebooks
     } = notebookContext;
    
    const { 
        notedirs, 
        getNotedirs, 
        clearNotedir,
        setCurrentNotedir, 
        addNotedirVisible, 
        enableAddNotedir,
        disableAddNotedir,
        addNotedir, 
        loading
    } = notedirContext;

    useEffect(() => {
        return () => {
            clearNotedir();
        }
    
        // eslint-disable-next-line
    }, []);
    
    useEffect(() => {
        !notebooks && getNotebooks();
        notebookId && getNotedirs(notebookId);
    }, [notebookId]);

    useEffect(() => {
        if(notebooks && notedirs) {
            // 設定預設的筆記目錄
            let currentNotebook = notebooks.find(notebook => notebook._id === notebookId);
            let defaultNotedir = currentNotebook.notedirs.find(notedir => notedir.default === true);
            
            setCurrentNotedir(defaultNotedir._id);
        }
    }, [notebooks, notedirs]);

    const defaultColor = {
        confirm: gray,
        cancel: gray,
        notedir: gray,
        collapse: gray
    };

    const [color, setColor] = useState(defaultColor);

    const iconChange = {
        'confirm': () => {
            setColor({...defaultColor, ['confirm']: orange});
        },
        'cancel': () => {
            setColor({...defaultColor, ['cancel']: orange});
        },
        'notedir': () => {
            setColor({...defaultColor, ['notedir']: orange});
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
    
    //目前正在使用的ToolPanel
    const [currentToolPanel, setCurrentToolPanel] = useState(null);

    const setToolPanel = id => {
        setCurrentToolPanel(id);
    }

    const setCurrent = id => {
        setCurrentNotedir(id);
    }

    const onConfirm = title => {
        let notedir = {
            title,
            notebook: notebookId
        };

        addNotedir(notedir);
        disableAddNotedir();
    }

    const onCancel = () => {
        disableAddNotedir();
    }

    const onEnableAddNotedir = e => {
        e.preventDefault();
        enableAddNotedir();
    }

    const onToggleCollapse = e => {
        e.preventDefault();
        toggleCollapse();
    }

    return (
        <Fragment>
            { notedirs && !loading ?
                (<NotedirList className='notedir-list'>
                    <div className='header'>
                        <i className='parlgrm'></i>
                        <span className='title'>目錄</span>
                        <button alt='collapse/expand notedir' onClick={onToggleCollapse}>
                            <BtnContent onChange={iconChange.collapse} children={<ArrowLineLeft size={20} color={color.collapse} />} />
                        </button>
                        <NotedirSorter />
                        <button alt='add notedir' onClick={onEnableAddNotedir}>
                            <BtnContent onChange={iconChange.notedir} children={<FolderSimplePlus size={20} color={color.notedir} />} />
                        </button>
                        <TextInput  
                            visible={addNotedirVisible}
                            placeholder={'請輸入筆記目錄名稱'}
                            onConfirm={onConfirm}
                            onCancel={onCancel}>
                            <TextInput.ConfirmBtn>
                                <BtnContent onChange={iconChange.confirm} children={<Check size={20} color={color.confirm} weight='bold' />} />
                            </TextInput.ConfirmBtn>
                            <TextInput.CancelBtn>
                                <BtnContent onChange={iconChange.cancel} children={<X size={20} color={color.cancel} weight='bold' />} />
                            </TextInput.CancelBtn>
                        </TextInput>
                    </div>
                    <ul>
                        {notedirs.map(notedir => {
                            return !notedir.default 
                            && (<Notedir 
                                key={notedir._id} 
                                notedir={notedir} 
                                toolPanel={currentToolPanel}
                                setCurrent={setCurrent}
                                setToolPanel={setToolPanel} />)
                        })}
                    </ul>
                </NotedirList>)
            : <Spinner /> }
        </Fragment>
    )
}

export default Notedirs;