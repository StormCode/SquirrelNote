import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

import RecycleFilter from '../recyclebin/RecycleFilter'
import RecycleSorter from '../recyclebin/RecycleSorter'
import RecycleList from '../recyclebin/RecycleList'

import '../../style/layout/SingleContent.css';
import '../../style/page/RecycleBin.css';

const RecycleBin = () => {
    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);
    const notebookId = notebookContext.current._id;

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    return (
        <div className='single-content-container'>
            <div className='recycle-content'>
                { notebookId ? 
                    <Link to={`/notebook/${notebookId}`}>回到筆記</Link> 
                    : <Link to='../'>回到筆記本</Link>}
                <h2>回收站</h2>
                <RecycleList />
            </div>
            <div className='right-panel'>
                <RecycleSorter />
                <RecycleFilter />
            </div>
        </div>
    )
}

export default RecycleBin;