import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowUUpLeft } from "phosphor-react";
import makeResponsiveCSS from '../../utils/make-responsive-css';
import {
    MediumAndAbove
} from '../../utils/breakpoints.jsx';

import AuthContext from '../../context/auth/authContext';
import NotebookContext from '../../context/notebooks/notebookContext';

import RecycleFilter from '../recyclebin/RecycleFilter'
import RecycleSorter from '../recyclebin/RecycleSorter'
import RecycleList from '../recyclebin/RecycleList'

// Import Style
import TopPanelAndContent from '../../style/layout/TopPanelAndContent';

const RecycleBinContainerBaseStyle = theme => {
    return `
        width: 100%;
        height: 100%;
        overflow: hidden;

        .title {
            border-bottom: 1px solid ${theme.orange};
            margin-bottom: 2.5rem;
            font-size: 1.5rem;
            text-indent: .5rem;
        }

        .tool-header {
            align-items: center;

            > a {
                position: relative;
                background: ${theme.orange};
                display: inline-flex;
                flex-wrap: nowrap;
                border-radius: .3rem;
                padding: .5rem 1rem;
                color: #FFF;
                text-decoration: none;
                box-shadow: 3px 2px 5px rgba(0, 0, 0, .5);
                height: 2.5rem;

                span {
                    margin-left: .5rem;
                }
        
                &:hover {
                    background: ${theme.darkOrange};
                }
            }
        }
    `;
}

const RecycleBinResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                .tool-header {
                    padding: 0;
                }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                .tool-header {
                    padding: 0 2.5rem;
                }
            `
        }
      ])
}

const RecycleBinContainer = styled.div`
    ${({theme}) => RecycleBinContainerBaseStyle(theme)}
    ${RecycleBinResponsiveStyle()}
`;

const RecycleBin = () => {
    const authContext = useContext(AuthContext);
    const notebookContext = useContext(NotebookContext);
    const notebookId = notebookContext.current ? notebookContext.current._id : null;

    useEffect(() => {
        authContext.loadUser();

        // eslint-disable-next-line
    }, []);

    return (
            <TopPanelAndContent>
                <RecycleBinContainer>
                    <p className='title'>回收站</p>
                    <div className='tool-header'>
                        { notebookId !== null ? 
                            <Link to={`/notebook/${notebookId}`}><ArrowUUpLeft size={22} /><MediumAndAbove><span>回到筆記</span></MediumAndAbove></Link> 
                            : <Link to='../notebook'><ArrowUUpLeft size={22} /><MediumAndAbove><span>回到筆記本</span></MediumAndAbove></Link>
                        }
                        <RecycleFilter />
                        <RecycleSorter />
                    </div>
                    <div className='content'>
                        <RecycleList />
                    </div>
                </RecycleBinContainer>
            </TopPanelAndContent>
    )
}

export default RecycleBin;