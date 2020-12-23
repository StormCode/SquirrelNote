import React, { Fragment, useContext, useState, useEffect } from 'react';
import Spinner from '../../component/layout/Spinner';
import Notebook from './Notebook';
import NewNotebook from './NewNotebook';

// Import Resource
import NotebookSmallImage from '../../assets/notebook/notebook_300w.png';
import NotebookMediumImage from '../../assets/notebook/notebook_1000w.png';
import NotebookLargeImage from '../../assets/notebook/notebook_2000w.png';

// Import Style
import IntroBox from '../../style/general/IntroBox';

import NotebookContext from '../../context/notebooks/notebookContext';
import AlertContext from '../../context/alert/alertContext';

const Notebooks = ({keyword}) => {
    const notebookContext = useContext(NotebookContext);
    const alertContext = useContext(AlertContext);
    
    const { 
        notebooks, 
        getNotebooks, 
        clearNotebook, 
        addNotebookVisible,
        filtered, 
        addNotebook, 
        updateNotebook, 
        deleteNotebook,
        loading,
        success,
        error 
    } = notebookContext;

    const {
        setAlert
    } = alertContext;
    
    useEffect(() => {
        getNotebooks();

        return () => {
            clearNotebook();
        }
    
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        success && setAlert(success, 'success');

        // eslint-disable-next-line
    }, [success]);

    useEffect(() => {
        error && setAlert(error, 'danger');

        // eslint-disable-next-line
    }, [error]);
    
    //目前正在使用的ToolPanel
    const [currentToolPanel, setCurrentToolPanel] = useState(null);

    const setToolPanel = id => {
        setCurrentToolPanel(id);
    }

    const onAddNotebook = notebook => {
        addNotebook(notebook, keyword);
    }

    const onUpdateNotebook = (id, notebook) => {
        updateNotebook(id, notebook, keyword);
    }

    const onDeleteNotebook = id => {
        deleteNotebook(id);
    }

    return <Fragment>
                { !loading ?
                    <Fragment>
                        <NewNotebook visible={addNotebookVisible} addNotebook={onAddNotebook} />
                        {notebooks ?
                            (notebooks.length === 0 && !addNotebookVisible ? 
                                    <IntroBox>
                                        <img alt='notebook-bg' src={NotebookSmallImage}
                                            srcSet={`
                                                ${NotebookSmallImage} 300w, 
                                                ${NotebookMediumImage} 1000w, 
                                                ${NotebookLargeImage} 2000w
                                            `}
                                        />
                                        <p>從現在開始建立你的第一本筆記本吧</p>
                                    </IntroBox>
                            : <Fragment>
                                { filtered !== null ?
                                (filtered.map(notebook => 
                                    <Notebook key={notebook._id} 
                                        notebook={notebook} 
                                        toolPanel={currentToolPanel} 
                                        setToolPanel={setToolPanel}
                                        updateNotebook={onUpdateNotebook}
                                        deleteNotebook={onDeleteNotebook} />
                                )) :
                                (notebooks.map(notebook => 
                                    <Notebook key={notebook._id} 
                                        notebook={notebook} 
                                        toolPanel={currentToolPanel} 
                                        setToolPanel={setToolPanel}
                                        updateNotebook={onUpdateNotebook}
                                        deleteNotebook={onDeleteNotebook} />
                                ))}
                            </Fragment>) 
                        : null}
                    </Fragment>
                : <Spinner />}
            </Fragment>
}

export default Notebooks;