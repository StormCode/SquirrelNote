import React, { Fragment, useContext, useState, useEffect } from 'react';
import Spinner from '../component/layout/Spinner';
import Notebook from './Notebook';
import NewNotebook from './NewNotebook';

import NotebookContext from '../context/notebooks/notebookContext';

import '../style/components/Notebooks.css';

const Notebooks = () => {
    const notebookContext = useContext(NotebookContext);
    
    const { notebooks, getNotebooks, filtered, loading } = notebookContext;
    
    useEffect(() => {
        getNotebooks();
    
        // eslint-disable-next-line
    }, []);
    
    //目前正在使用的ToolPanel
    const [currentToolPanel, setCurrentToolPanel] = useState(null);

    const setToolPanel = id => {
        setCurrentToolPanel(id);
    }

    return <Fragment>
            { notebooks != null && !loading ?
                <div className='notebook-container'>
                    <NewNotebook />
                    { filtered !== null ?
                    (filtered.map(notebook => 
                        <Notebook key={notebook._id} 
                            notebook={notebook} 
                            toolPanel={currentToolPanel} 
                            setToolPanel={setToolPanel} />
                    )) :
                    (notebooks.map(notebook => 
                        <Notebook key={notebook._id} 
                            notebook={notebook} 
                            toolPanel={currentToolPanel} 
                            setToolPanel={setToolPanel} />
                    ))}
                </div> : <Spinner />
            }
            </Fragment>
}

export default Notebooks;