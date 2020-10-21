import React, { Fragment, useContext, useState, useEffect } from 'react'
import Spinner from '../component/layout/Spinner'
import TextInput from '../component/layout/TextInput'
import Notedir from './NoteDir';

import NotebookContext from '../context/notebooks/notebookContext';
import NotedirContext from '../context/notedirs/notedirContext';

// Import Resource
import confirmImg from '../assets/general/confirm_32x32.png';
import cancelImg from '../assets/general/close_32x32.png';

const Notedirs = () => {
    const notebookContext = useContext(NotebookContext);
    const notedirContext = useContext(NotedirContext);
    
    const notebookId = notebookContext.current._id;
    const { notedirs, getNotedirs, setNotedir, addNotedir, loading, error } = notedirContext;

    const text = {
        addNewText: '新增筆記目錄',
        placeholder: '',
        applyText: '新增',
        cancelText: '取消'
    };

    const { addNewText, placeholder, applyText, cancelText } = text;

    useEffect(() => {
        const init = async () => {
            await getNotedirs(notebookId);
    
            // 設定預設的筆記目錄
            setNotedir(null);
        }
        init();
    
        // eslint-disable-next-line
    }, []);
    
    //目前正在使用的ToolPanel
    const [currentToolPanel, setCurrentToolPanel] = useState(null);

    const setToolPanel = id => {
        setCurrentToolPanel(id);
    }

    const setCurrent = id => {
        setNotedir(id);
    }

    const handleAddNotedir = async title => {
        let notedir = {
            title,
            notebook: notebookId
        };

        await addNotedir(notedir);
        return error ? false : true;
    }

    return (
        <Fragment>
            { notedirs && !loading ?
                (<div className='notedir-list'>
                    <TextInput 
                        defaultHtml={addNewText} 
                        placeholder={placeholder} 
                        applyHtml={<img src={confirmImg} alt={applyText} />} 
                        cancelHtml={<img src={cancelImg} alt={cancelText} /> }
                        applyEvent={handleAddNotedir} />
                    <ul>
                        {notedirs.map(notedir => {
                            return !notedir.default 
                            && (<Notedir 
                                key={notedir._id} 
                                notedir={notedir} 
                                toolPanel={currentToolPanel}
                                setCurrent={setCurrent}
                                setToolPanel={setToolPanel} />)
                        })}
                    </ul>
                </div>)
            : <Spinner /> }
        </Fragment>
    )
}

export default Notedirs;