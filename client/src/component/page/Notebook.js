import React, { useContext, useEffect } from 'react';
import { ReactComponent as AddNotebook } from  '../../assets/general/add_notebook.svg';
import Notebooks from '../notebooks/Notebooks';
import NotebookFilter from '../notebooks/NotebookFilter';
import NotebookSorter from '../notebooks/NotebookSorter';
import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

// Import Style
import { MainSubPanel, AddNotebookBtn } from '../../style/page/Notebook';

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