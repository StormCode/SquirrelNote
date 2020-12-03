import React, { Fragment, useContext, useState, useEffect } from 'react'
import styled from 'styled-components';
import { Check, X } from "phosphor-react";

import Spinner from '../../component/layout/Spinner'
import TextInput from '../../component/layout/TextInput'
import NotedirSorter from './NotedirSorter';
import Notedir from './NoteDir';

// Import Style
import { theme } from '../../style/themes';

import NotebookContext from '../../context/notebooks/notebookContext';
import NotedirContext from '../../context/notedirs/notedirContext';

const { orange, gray } = theme;

const AddNotedirBtn = styled.button`
    position: relative;
    background: ${({theme}) => theme.orange};
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    color: #FFF;
    box-shadow: 3px 3px 5px rgba(0,0,0,.5);

        &:hover {
            background: ${({theme}) => theme.darkOrange};
        }
`;

const Notedirs = ({notebookId}) => {
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
        !notebooks && getNotebooks();
        notebookId && getNotedirs(notebookId);

        return () => {
            clearNotedir();
        }
    
        // eslint-disable-next-line
    }, []);

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
        cancel: gray
    };

    const [color, setColor] = useState(defaultColor);

    const iconChange = {
        'confirm': () => {
            setColor({...defaultColor, ['confirm']: orange});
        },
        'cancel': () => {
            setColor({...defaultColor, ['cancel']: orange});
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

    return (
        <Fragment>
            { notedirs && !loading ?
                (<div className='notedir-list'>
                    <AddNotedirBtn alt='add notedir' onClick={onEnableAddNotedir}>
                        新增筆記目錄
                    </AddNotedirBtn>
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
                    <NotedirSorter />
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
                </div>)
            : <Spinner /> }
        </Fragment>
    )
}

export default Notedirs;