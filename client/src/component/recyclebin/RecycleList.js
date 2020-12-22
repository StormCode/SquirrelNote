import React, { useContext, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'
import Pagination from '../general/Pagination';
import RecycleItem from './RecycleItem';
import Spinner from '../layout/Spinner';

// Import Style
import { RwdTableBaseStyle, RwdTableForDestopStyle, RwdTableForPhoneStyle } from '../../style/general/RwdTable';

import RecyclebinContext from '../../context/recyclebin/recyclebinContext';
import AlertContext from '../../context/alert/alertContext';

const RecycleListContainerBaseStyle = theme => {
    return `
        margin: 0 auto;

        button {
            background: ${theme.orange};
            border: none;
            padding: .3rem .5rem;
            color: #FFF;
            font-size: 1rem;
            box-shadow: 2px 2px 3px rgba(0,0,0,.5);

                &:hover {
                    background: ${theme.darkOrange};
                }
        }

        table > tbody {
            > tr:nth-of-type(2n) {
                background: ${theme.lightGray};
            }

            > tr > td {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        > div > ul > li {
            background: #FFF;
            margin: 0 .3rem;
            color: ${theme.orange};

                &:hover {
                    background: ${theme.orange};
                    color: #FFF;
                }
        }

        > div > ul > li.active {
            background: ${theme.orange};
            color: #FFF;

                &:hover {
                    background: ${theme.darkOrange};
                }
        }
    `;
}

const RecycleListContainerResponsiveStyle = theme => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                table > thead {
                    > tr > th:nth-of-type(1) {
                        width: auto;
                    }
                }

                table > tbody {
                    > tr > td {
                        max-width: none;
                    }

                    th, td:before {
                        color: ${theme.orange};
                    }

                    > tr > th:nth-of-type(1) {
                        width: auto;
                    }
                }`
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                table > thead {
                    > tr > th:nth-of-type(1) {
                        width: 5%;
                    }
                }

                table > tbody {
                    > tr > td {
                        max-width: 20%;
                    }

                    th, td:before {
                        color: #000;
                    }

                    > tr > th:nth-of-type(1) {
                        width: 5%;
                    }
                }`
        }
    ]);
}

const RecycleListContainer = styled.div`
    ${({theme}) => RecycleListContainerBaseStyle(theme)}
    ${({theme}) => RecycleListContainerResponsiveStyle(theme)}
`;

const TableResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: RwdTableForPhoneStyle
        }, {
            constraint: 'min',
            width: '768px',
            rules: RwdTableForDestopStyle
        }
    ]);
}

const Table = styled.table`
    ${RwdTableBaseStyle}
    ${TableResponsiveStyle()}
`;

const RecycleList = () => {
    const recyclebinContext = useContext(RecyclebinContext);
    const alertContext = useContext(AlertContext);

    const {
        deletedItems,
        filtered, 
        loading,
        getDeletedItems,
        clearRecyclebin,
        success,
        error
    } = recyclebinContext;

    const {
        setAlert
    } = alertContext;
    
    useEffect(() => {
        getDeletedItems();

        return () => {
            clearRecyclebin();
        }

        // eslint-disable-next-line
    },[]);

    useEffect(() => {
        success && setAlert(success, 'success');

        // eslint-disable-next-line
    }, [success]);

    useEffect(() => {
        error && setAlert(error, 'danger');

        // eslint-disable-next-line
    }, [error]);

    const RecycleListHelper = useCallback(data => {
        return <Table>
            <thead>
                <tr>
                    <th>類型</th>
                    <th>名稱</th>
                    <th>刪除日期</th>
                </tr>
            </thead>
            <tbody>
                {(data.map(item =>
                    <RecycleItem key={uuidv4()} item ={item} />
                ))}
            </tbody>
        </Table>

        // eslint-disable-next-line
    }, [filtered, deletedItems]);

    const PaginationHelper = data => {
        return <Pagination
            data={data}
            dataListHelper={RecycleListHelper} />;
    }

    return (
        <RecycleListContainer>
            {!loading ?
                deletedItems && deletedItems.length > 0 ?
                    PaginationHelper(filtered !== null ? filtered : deletedItems)
                : !error ? <p>目前回收站查無資料</p> : null 
            : <Spinner />}
        </RecycleListContainer>
    )
}

export default RecycleList;