import React, { useContext } from 'react';
import Sorter from '../layout/Sorter';

import NotebookContext from '../../context/notebooks/notebookContext'

const NotebookSorter = () => {
    const notebookContext = useContext(NotebookContext);

    const { orderBy, sortBy, sortNotebook } = notebookContext;

    const onSortBy = e => {
        sortNotebook(orderBy, e.target.value)
    };

    const onToggleSort = e => {
        sortNotebook(e.target.value, sortBy);
    };

    const sortFields = [{text: '名稱', value: 'title'},
                        {text: '建立日期', value: 'date'}];

    return (
        <Sorter fields={sortFields}
            orderBy={orderBy}
            sortBy={sortBy}
            onSortBy={onSortBy}
            onToggleSort={onToggleSort}
        />
    )
}

export default NotebookSorter;