import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

import RecycleFilter from '../recyclebin/RecycleFilter'
import RecycleSorter from '../recyclebin/RecycleSorter'
import RecycleList from '../recyclebin/RecycleList'

const RecycleBinContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: auto;
    width: 100%;
    height: 100%;

    .recycle-content {
        grid-column: 2 / 4;
        padding: 20px;
        background-color: azure;
    }

    .right-panel {
        grid-column: 4;
        padding-right: 5rem;
        background-color: cadetblue;
    }
`;

const RecycleBin = () => {
    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);
    const notebookId = notebookContext.current ? notebookContext.current._id : null;

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    return (
            <RecycleBinContainer>
                <div className='recycle-content'>
                    { notebookId !== null ? 
                        <Link to={`/notebook/${notebookId}`}>回到筆記</Link> 
                    : <Link to='../notebook'>回到筆記本</Link>
                    }
                    <h2>回收站</h2>
                    <RecycleList />
                </div>
                <div className='right-panel'>
                    <RecycleSorter />
                    <RecycleFilter />
                </div>
            </RecycleBinContainer>
    )
}

export default RecycleBin;