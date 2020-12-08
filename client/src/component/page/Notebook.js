import React, { useContext, useEffect } from 'react';
import { ReactComponent as AddNotebook } from  '../../assets/general/add_notebook.svg';
import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'
import {
    MediumAndAbove
} from '../../utils/breakpoints.jsx';

import Notebooks from '../notebooks/Notebooks';
import NotebookFilter from '../notebooks/NotebookFilter';
import NotebookSorter from '../notebooks/NotebookSorter';
import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

const MainSubPanel = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    padding: 3rem 5rem;
    overflow: hidden;
`;

const AddNotebookBtn = styled.button`
    position: relative;
    background: ${({theme}) => theme.orange};
    display: inline-flex;
    flex-wrap: nowrap;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    color: #FFF;
    height: 2.5rem;
    box-shadow: 3px 3px 5px rgba(0,0,0,.5);

        span {
            margin-left: .5rem;
            vertical-align: middle;
        }

        &:after {
            content: '';
            display: inline-block;
            width: 0;
            height: 100%;
        }

        &:hover {
            background: ${({theme}) => theme.darkOrange};
        }
`;

const NotebookBaseStyle = `
    .tool-header {
        display: flex;
        flex-flow: row nowrap;
    }
`;

const NotebookResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '320px',
            rules: `
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
            `
        }
      ])
}

const NotebookContainer = styled.div`
    ${NotebookBaseStyle}
`;

const Notebook = () => {
    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    const onEnableAddNotebook = e => {
        e.preventDefault();
        notebookContext.enableAddNotebook();
    }

    return (
        <MainSubPanel>
            <NotebookContainer>
                <div className='tool-header'>
                    <AddNotebookBtn id='add-notebook-btn' onClick={onEnableAddNotebook}>
                        <AddNotebook alt='add notebook' style={{minWidth: '24px', maxWidth: '24px'}} /> <MediumAndAbove><span>新增筆記本</span></MediumAndAbove>
                    </AddNotebookBtn>
                    <NotebookFilter />
                    <NotebookSorter />
                </div>
                <Notebooks />
            </NotebookContainer>
        </MainSubPanel>
    )
}

export default Notebook;