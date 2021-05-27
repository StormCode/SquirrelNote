import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NoteDirContainer from '../../style/components/Notedir';

const AllNotedir = ({ 
    current,
    notedirs,
    cacheMap,
    setCurrent
}) => {
    const [count, setCount] = useState(0);

    const currentNotedirId = current !== '' ? current ? current._id : null : current;
    const currentCacheNotes = cacheMap.get('') || [];      // 目前目錄裡的快取筆記
    const currentCacheNoteLength = currentCacheNotes.length;

    const onClick = e => {
        e.preventDefault();
        setCurrent('');
    }

    useEffect(() => {
        // 計算全部筆記數量
        let _count = 0;
        notedirs.forEach(notedir => {
            _count += notedir.note_count;
        });
        setCount(_count);

        // eslint-disable-next-line
    }, []);

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
    notedirs: PropTypes.array,
    cacheMap: PropTypes.object,
    setCurrent: PropTypes.func.isRequired
};

const mapStateProps = state => ({
    current: state.notedirs.current,
    notedirs: state.notedirs.notedirs,
    cacheMap: state.notes.cacheMap
});

export default connect(
    mapStateProps
)(AllNotedir);