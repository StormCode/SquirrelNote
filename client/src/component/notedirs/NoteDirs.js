import React, { Fragment, useContext, useState, useEffect } from 'react'
import Spinner from '../../component/layout/Spinner'
import TextInput from '../../component/layout/TextInput'
import Notedir from './NoteDir';

import NotebookContext from '../../context/notebooks/notebookContext';
import NotedirContext from '../../context/notedirs/notedirContext';

// Import Resource
import confirmImg from '../../assets/general/confirm_32x32.png';
import cancelImg from '../../assets/general/close_32x32.png';

const Notedirs = ({notebookId}) => {
    const notebookContext = useContext(NotebookContext);
    const notedirContext = useContext(NotedirContext);
    const {
        notebooks,
        getNotebooks
     } = notebookContext;
    
    const { 
        notedirs, 
        getNotedirs, 
        clearNotedir,
        setCurrentNotedir, 
        addNotedir, 
        loading,
        error 
    } = notedirContext;

    const text = {
        addNewText: '新增筆記目錄',
        placeholder: '',
        applyText: '新增',
        cancelText: '取消'
    };

    const { addNewText, placeholder, applyText, cancelText } = text;

    useEffect(() => {
        !notebooks && getNotebooks();
        notebookId && getNotedirs(notebookId);

        return () => {
            clearNotedir();
        }
    
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(notebooks && notedirs) {
            // 設定預設的筆記目錄
            let currentNotebook = notebooks.find(notebook => notebook._id === notebookId);
            let defaultNotedir = currentNotebook.notedirs.find(notedir => notedir.default === true);
            
            setCurrentNotedir(defaultNotedir._id);
        }
    }, [notebooks, notedirs]);
    
    //目前正在使用的ToolPanel
    const [currentToolPanel, setCurrentToolPanel] = useState(null);

    const setToolPanel = id => {
        setCurrentToolPanel(id);
    }

    const setCurrent = id => {
        setCurrentNotedir(id);
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