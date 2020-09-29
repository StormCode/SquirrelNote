import React, { useContext, useState, useEffect } from 'react';
import { Button } from 'reactstrap';
import Notebooks from '../../notebooks/Notebooks';
import NotebookFilter from '../../notebooks/NotebookFilter';
import NotebookSorter from '../../notebooks/NotebookSorter';
import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

const Home = () => {
    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            paddingTop: '3rem'
        }}>
            <Button color="primary" onClick={() => {
                notebookContext.enableAddNotebook();
            }}>新增筆記本</Button>
            <NotebookSorter />
            <NotebookFilter />
            <Notebooks />
        </div>
    )
}

export default Home;