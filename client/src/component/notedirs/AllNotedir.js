import React, { useContext } from 'react'
import NoteDirContainer from '../../style/components/Notedir';

import NotedirContext from '../../context/notedirs/notedirContext';
import NoteContext from '../../context/notes/noteContext';

const AllNotedir = ({count, setCurrent}) => {
    const notedirContext = useContext(NotedirContext);
    const noteContext = useContext(NoteContext);
    const {
        // cacheNotes
        cacheMap
    } = noteContext;

    const currentNotedirId = notedirContext.current !== '' ? notedirContext.current ? notedirContext.current._id : null : notedirContext.current;
    const currentCacheNotes = cacheMap.get('') || [];      // 目前目錄裡的快取筆記
    const currentCacheNoteLength = currentCacheNotes.length;

    const onClick = e => {
        e.preventDefault();
        setCurrent('');
    }

    return <NoteDirContainer
            isCurrent = {currentNotedirId === ''}>
                <div className='text-container' onClick={onClick}>
                    <p>(全部)
                    {currentCacheNoteLength > 0 ?
                        <b className='unsaved-count-badge'>{currentCacheNoteLength}</b>
                        : null
                    }
                    </p>
                </div>
                <p className='note-count-badge'>{count}</p>
            </NoteDirContainer>;
}

export default AllNotedir;