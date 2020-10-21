import React, { useContext } from 'react';
import Sorter from '../component/layout/Sorter';

import NotedirContext from '../context/notedirs/notedirContext'

const NotedirSorter = () => {
    const notedirContext = useContext(NotedirContext);

    const { orderBy, sortBy, sortNotedir } = notedirContext;

    const onSortBy = e => {
        sortNotedir(orderBy, e.target.value)
    };

    const onToggleSort = e => {
        sortNotedir(e.target.value, sortBy);
    };

    const sortFields = [{text: '名稱', value: 'title'},
                        {text: '建立日期', value: 'date'}];

    return (
        <Sorter fields={sortFields}
            orderBy={orderBy}
            sortBy={sortBy}
            onSortBy={onSortBy}
            onToggleSort={onToggleSort}
            sorterStyle={{margin: '0 10px'}}
        />
    )
}

export default NotedirSorter;