import React, { Fragment, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import Spinner from '../../component/layout/Spinner';
import Notebook from './Notebook';
import NewNotebook from './NewNotebook';

import NotebookContext from '../../context/notebooks/notebookContext';

const NotebookContainer = styled.div`
    flex: 1 0 auto;
    display: flex;
    flex-flow: wrap row;
    align-items: center;
    margin-top: 5rem;
`;

const Notebooks = () => {
    const notebookContext = useContext(NotebookContext);
    
    const { 
        notebooks, 
        getNotebooks, 
        clearNotebook, 
        filtered, 
        loading 
    } = notebookContext;
    
    useEffect(() => {
        getNotebooks();

        return () => {
            clearNotebook();
        }
    
        // eslint-disable-next-line
    }, []);
    
    //目前正在使用的ToolPanel
    const [currentToolPanel, setCurrentToolPanel] = useState(null);

    const setToolPanel = id => {
        setCurrentToolPanel(id);
    }

    return <Fragment>
            { notebooks != null && !loading ?
                <NotebookContainer className='notebook-container'>
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
                </NotebookContainer> : <Spinner />
            }
            </Fragment>
}

export default Notebooks;