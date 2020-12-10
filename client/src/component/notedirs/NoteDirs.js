import React, { Fragment, useContext, useState, useEffect } from 'react'
import styled from 'styled-components';
import { Check, X, FolderSimplePlus, ArrowLineLeft } from "phosphor-react";

import Spinner from '../../component/layout/Spinner'
import TextInput from '../../component/layout/TextInput'
import NotedirSorter from './NotedirSorter';
import Notedir from './NoteDir';
import AllNotedir from './AllNotedir';
import makeResponsiveCSS from '../../utils/make-responsive-css'

// Import Style
import { theme } from '../../style/themes';

import NotebookContext from '../../context/notebooks/notebookContext';
import NotedirContext from '../../context/notedirs/notedirContext';

const { orange, gray } = theme;

const NotedirListBaseStyle = theme => {
    return `
        flex: 1 1 100%;
        display: flex;
        flex-flow: column nowrap;
        padding: .5rem;

            > .notedir-header {
                display: flex;
                flex-flow: row nowrap;
                border-bottom: 1px solid ${theme.orange};
                padding: .3rem;
                align-items: center;
                min-height: 2.5rem;
            }
        
                > .notedir-header > .title {
                    color: ${theme.gray};
                    font-size: 1rem;
                    font-weight: bold;
                }
                
                > .notedir-header > button {
                    flex: 0 1 auto;
                    position: relative;
                    background: none;
                    border: none;
                }

            ul {
                flex: 1 1 auto;
                margin: 0;
                padding: 0;
                width: 100%;
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

const NotedirListResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '320px',
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


const NotedirList = styled.div`
    ${({theme}) => NotedirListBaseStyle(theme)}
    ${NotedirListResponsiveStyle()}
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
            // 筆記目錄設定為全部
            setCurrentNotedir('');
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
                    <div className='notedir-header'>
                        <i className='parlgrm'></i>
                        <span className='title'>目錄</span>
                        <NotedirSorter />
                        <button alt='add notedir' className='tiny-btn' onClick={onEnableAddNotedir}>
                            <BtnContent onChange={iconChange.notedir} children={<FolderSimplePlus size={22} color={color.notedir} />} />
                        </button>
                        <button alt='collapse/expand notedir' className='tiny-btn collapse-btn' onClick={onToggleCollapse}>
                            <BtnContent onChange={iconChange.collapse} children={<ArrowLineLeft size={22} color={color.collapse} />} />
                        </button>
                        <TextInput  
                            visible={addNotedirVisible}
                            placeholder={'請輸入筆記目錄名稱'}
                            onConfirm={onConfirm}
                            onCancel={onCancel}>
                            <TextInput.ConfirmBtn>
                                <BtnContent onChange={iconChange.confirm} children={<Check size={22} color={color.confirm} weight='bold' />} />
                            </TextInput.ConfirmBtn>
                            <TextInput.CancelBtn>
                                <BtnContent onChange={iconChange.cancel} children={<X size={22} color={color.cancel} weight='bold' />} />
                            </TextInput.CancelBtn>
                        </TextInput>
                    </div>
                    <ul>
                        <Fragment>
                            <AllNotedir setCurrent={setCurrent} />
                            {notedirs.map(notedir => {
                                return !notedir.default 
                                && (<Notedir 
                                    key={notedir._id} 
                                    notedir={notedir} 
                                    toolPanel={currentToolPanel}
                                    setCurrent={setCurrent}
                                    setToolPanel={setToolPanel} />)
                            })}
                        </Fragment>
                    </ul>
                </NotedirList>)
            : <Spinner /> }
        </Fragment>
    )
}

export default Notedirs;