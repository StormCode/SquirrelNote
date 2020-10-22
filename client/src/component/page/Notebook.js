import React, { useContext, useEffect } from 'react';
import { Button } from 'reactstrap';
import Notebooks from '../notebooks/Notebooks';
import NotebookFilter from '../notebooks/NotebookFilter';
import NotebookSorter from '../notebooks/NotebookSorter';
import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

// Import Style
import '../../style/page/Notebook.css';

// Import Resource
import addNotebookImg from '../../assets/notebook/add_notebook_32x32.png';

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
        <div className='main-subpanel'>
            <Button id='add-notebook-btn' color='primary' onClick={onEnableAddNotebook}>
                <img className='inline-img' src={addNotebookImg} />新增筆記本
            </Button>
            <NotebookSorter />
            <NotebookFilter />
            <Notebooks />
        </div>
    )
}

export default Notebook;