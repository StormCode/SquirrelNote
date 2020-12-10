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

const RecycleBinContainerBaseStyle = theme => {
    return `
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: 20% auto;
        width: 100%;
        height: 100%;

        .tool-header {
            grid-row: 1;
            grid-column: 1 / 5;
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            height: 100%;

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

        .recycle-content {
            grid-row: 2;
            grid-column: 2 / 4;
            padding: 3rem 0;
        }

            .recycle-content > h3 {
                margin: 1.5rem 0;
            }

        .right-panel {
            grid-column: 4;
            padding: 3rem 5rem 0 0;
        }`;
}

const RecycleBinResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                .tool-header {
                    padding-left: 0;
                }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                .tool-header {
                    padding-left: 5rem;
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
            <RecycleBinContainer>
                <div className='tool-header'>
                    { notebookId !== null ? 
                        <Link to={`/notebook/${notebookId}`}><ArrowUUpLeft size={22} /><MediumAndAbove><span>回到筆記</span></MediumAndAbove></Link> 
                        : <Link to='../notebook'><ArrowUUpLeft size={22} /><MediumAndAbove><span>回到筆記本</span></MediumAndAbove></Link>
                    }
                    <RecycleFilter />
                    <RecycleSorter />
                </div>
                <div className='recycle-content'>
                    <RecycleList />
                </div>
                <div className='right-panel'>
                </div>
            </RecycleBinContainer>
    )
}

export default RecycleBin;