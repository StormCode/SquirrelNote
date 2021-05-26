import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NoteDirContainer from '../../style/components/Notedir';

const AllNotedir = ({ 
    count, 
    setCurrent, 
    current,
    cacheMap
}) => {

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
    ]),
    cacheMap: PropTypes.object
};

const mapStateProps = state => ({
    current: state.notedirs.current,
    cacheMap: state.notes.cacheMap
});

export default connect(
    mapStateProps
)(AllNotedir);