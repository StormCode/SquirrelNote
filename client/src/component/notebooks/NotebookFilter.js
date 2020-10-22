import React, { useContext, useRef, useEffect } from 'react';

import NotebookContext from '../../context/notebooks/notebookContext';

const NotebookFilter = () => {
    const notebookContext = useContext(NotebookContext);

    const { filterNotebook, clearFilterNotebook, filtered } = notebookContext;

    const text = useRef('');

    useEffect(() => {
        if(filtered === null)
            text.current.value = '';
    });

    const onChange = e => {
        if(text.current.value !== '')
            filterNotebook(e.target.value);
        else
            clearFilterNotebook();
    }

    return (
        <form>
            <input type='text' ref={text} placeholder='搜尋...' onChange={onChange} style={searchStyle}/>
        </form>
    )
}

const searchStyle = {
    float: 'right',
    width: '40%',
    maxWidth: '200px'
}

export default NotebookFilter;