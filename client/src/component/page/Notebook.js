import React, { useContext, useEffect } from 'react';
import { ReactComponent as AddNotebook } from  '../../assets/general/add_notebook.svg';
import styled from 'styled-components';
import makeResponsiveComponent from '../../utils/make-responsive-component'
import {
    MediumAndAbove,
    LargeAndAbove,
    SmallAndBelow,
    MediumAndBelow,
    MediumOnly,
} from '../../utils/breakpoints.jsx';

import Notebooks from '../notebooks/Notebooks';
import NotebookFilter from '../notebooks/NotebookFilter';
import NotebookSorter from '../notebooks/NotebookSorter';
import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

const MainSubPanel = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    padding: 3rem 5rem;
    overflow: hidden;
`;

const AddNotebookBtn = styled.button`
    position: relative;
    background: ${({theme}) => theme.orange};
    display: inline-flex;
    flex-wrap: nowrap;
    border: none;
    border-radius: 5px;
    float: left;
    padding: 5px 10px;
    color: #FFF;
    width: 50%;
    box-shadow: 3px 3px 5px rgba(0,0,0,.5);

        > span {
            display: block;
            flex-grow: 1;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            min-width: 0;
        }

        &:hover {
            background: ${({theme}) => theme.darkOrange};
        }
`;

const ResponsiveTool = () => {
    return makeResponsiveComponent([
        {
            constraint: 'min',
            width: '0px',
            rules: `
            `
        }, {
            constraint: 'min',
            width: '320px',
            rules: `
                font-size: 28px;
            `
        }
      ])
}

const Notebook = () => {
    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    const onEnableAddNotebook = e => {
        e.preventDefault();
        notebookContext.enableAddNotebook();
    }

    return (
        <MainSubPanel>
            {/* <ResponsiveTool> */}
                <AddNotebookBtn id='add-notebook-btn' onClick={onEnableAddNotebook}>
                    <AddNotebook alt='add notebook' style={{minWidth: '24px', maxWidth: '24px'}} /> <span>新增筆記本</span>
                </AddNotebookBtn>
                <NotebookSorter />
                <NotebookFilter />
                <Notebooks />
            {/* </ResponsiveTool> */}
        </MainSubPanel>
    )
}

export default Notebook;