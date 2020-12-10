import React, { useContext } from 'react'
import NoteDirContainer from '../../style/components/Notedir';

import NotedirContext from '../../context/notedirs/notedirContext';

const AllNotedir = ({setCurrent}) => {
    const notedirContext = useContext(NotedirContext);

    const currentNotedirId = notedirContext.current !== '' ? notedirContext.current ? notedirContext.current._id : null : '';

    const onClick = e => {
        e.preventDefault();
        setCurrent('');
    }

    return <NoteDirContainer
            isCurrent = {currentNotedirId === ''}>
                <div className='text-container' onClick={onClick}>
                    <p>(全部)</p>
                </div>
            </NoteDirContainer>;
}

export default AllNotedir;