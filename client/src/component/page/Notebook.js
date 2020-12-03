import React, { useContext, useEffect } from 'react';
import { ReactComponent as AddNotebook } from  '../../assets/general/add_notebook.svg';
import styled from 'styled-components';

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
    border: none;
    border-radius: 5px;
    float: left;
    padding: 5px 10px;
    color: #FFF;
    box-shadow: 3px 3px 5px rgba(0,0,0,.5);

        &:hover {
            background: ${({theme}) => theme.darkOrange};
        }
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
            <AddNotebookBtn id='add-notebook-btn' onClick={onEnableAddNotebook}>
                <AddNotebook alt='add notebook' style={{maxWidth: '24px'}} /> 新增筆記本
            </AddNotebookBtn>
            <NotebookSorter />
            <NotebookFilter />
            <Notebooks />
        </MainSubPanel>
    )
}

export default Notebook;