import React, { useContext, useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import Notebooks from '../../notebooks/Notebooks';
import NotebookFilter from '../../notebooks/NotebookFilter';
import NotebookSorter from '../../notebooks/NotebookSorter';
import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

import '../../style/page/Home.css';
import addNotebookImg from '../../assets/notebook/add_notebook_32x32.png';

const Home = () => {
    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    return (
        <div className='main-subpanel'>
            <Button id='add-notebook-btn' color='primary' onClick={() => {
                notebookContext.enableAddNotebook();
            }}><img className='inline-img' src={addNotebookImg} />新增筆記本</Button>
            <NotebookSorter />
            <NotebookFilter />
            <Notebooks />
        </div>
    )
}

export default Home;