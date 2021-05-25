import React, { useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NoteDirContainer from '../../style/components/Notedir';

import NoteContext from '../../context/notes/noteContext';

const AllNotedir = ({ 
    count, 
    setCurrent, 
    current
}) => {
    const noteContext = useContext(NoteContext);
    const {
        // cacheNotes
        cacheMap
    } = noteContext;

    const currentNotedirId = current !== '' ? current ? current._id : null : current;
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

AllNotedir.propTypes = {
    current: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ])
};

const mapStateProps = state => ({
    current: state.notedirs.current
});

export default connect(
    mapStateProps
)(AllNotedir);