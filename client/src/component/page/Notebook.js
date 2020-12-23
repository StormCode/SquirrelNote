import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as AddNotebook } from  '../../assets/general/add_notebook.svg';
import { ArrowsCounterClockwise } from "phosphor-react";
import styled from 'styled-components';
import {
    MediumAndAbove
} from '../../utils/breakpoints.jsx';

import Notebooks from '../notebooks/Notebooks';
import NotebookFilter from '../notebooks/NotebookFilter';
import NotebookSorter from '../notebooks/NotebookSorter';
import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

// Import Style
import TopPanelAndContent from '../../style/layout/TopPanelAndContent';

const NotebookContainer = styled.div`
    .title {
        border-bottom: 1px solid ${({theme}) => theme.orange};
        margin-bottom: 2.5rem;
        font-size: 1.5rem;
        text-indent: .5rem;
    }

    .add-notebook-btn {
        position: relative;
        background: ${({theme}) => theme.orange};
        display: inline-flex;
        flex-wrap: nowrap;
        border: none;
        border-radius: 5px;
        padding: .2rem 1rem;
        color: #FFF;
        height: 2.5rem;
        box-shadow: 3px 3px 5px rgba(0,0,0,.5);

            span {
                margin-left: .5rem;
                vertical-align: middle;
            }

            &:after {
                content: '';
                display: inline-block;
                width: 0;
                height: 100%;
            }

            &:hover {
                background: ${({theme}) => theme.darkOrange};
            }
    }

    .float-panel {
        position: absolute;
        bottom: 5%;
        left: 0;
        padding: 0;
        
        li {
            background-color: #FFF !important;
            display: block;
            position: relative;
            margin-left: -2px;
            margin-bottom: 1em;
            border: 2px solid #000;
            border-color: ${({theme}) => theme.green};
            border-radius: 0 25px 25px 0;
            color: ${({theme}) => theme.green};
            font-size: 1.2rem;
            line-height: 60px;
            transition: all .4s ease;
            width: 60px;
            height: 60px;

                &:hover {
                    cursor: pointer;
                    background-color: ${({theme}) => theme.green} !important;
                    width: 150px;
                    color: #FFF;

                    span {
                        left: 0;
                    }
                }

                span {
                    padding: 0 30px 0 15px;
                    position: absolute;
                    left: -120px;
                    transition: left .4s ease;
                }

                i {
                    position: absolute;
                    top: 50%;
                    right: 1rem;
                    transform: translateY(-55%);
                }
        }
    }
`;

const Notebook = () => {
    const history = useHistory();

    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    const [notebookFilterKeyword, setNotebookFilterKeyword] = useState(null);

    const onEnableAddNotebook = e => {
        e.preventDefault();
        notebookContext.enableAddNotebook();
    }

    const setKeyword = keyword => {
        setNotebookFilterKeyword(keyword);
    }

    const LoadRecycleBin = () => {
        history.push('/recyclebin');
    };

    return (
        <NotebookContainer>
            <TopPanelAndContent>
                <p className='title'>筆記本</p>
                <div className='tool-header'>
                    <button className='add-notebook-btn' onClick={onEnableAddNotebook}>
                        <AddNotebook alt='add notebook' style={{minWidth: '24px', maxWidth: '24px'}} /> <MediumAndAbove><span>新增筆記本</span></MediumAndAbove>
                    </button>
                    <NotebookFilter setKeyword={setKeyword} />
                    <NotebookSorter />
                </div>
                <div className='content'>
                    <Notebooks keyword={notebookFilterKeyword}/>
                </div>
            </TopPanelAndContent>
            <ul className='float-panel'>
                <li onClick={LoadRecycleBin}>
                    <span>回收站</span><i><ArrowsCounterClockwise size={28} /></i>
                </li>
            </ul>
        </NotebookContainer>
    )
}

export default Notebook;