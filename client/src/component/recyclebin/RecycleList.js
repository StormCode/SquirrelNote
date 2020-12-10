import React, { useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// import { Table } from 'reactstrap';
import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'
import RecycleItem from './RecycleItem';

// Import Style
import { RwdTableForDestopStyle, RwdTableForPhoneStyle } from '../../style/general/RwdTable';

import RecyclebinContext from '../../context/recyclebin/recyclebinContext';

const RecycleListContainer = styled.div`
    button {
        background: ${({theme}) => theme.orange};
        border: none;
        padding: .3rem .5rem;
        color: #FFF;
        font-size: 1rem;
        box-shadow: 2px 2px 3px rgba(0,0,0,.5);
    }

        button:hover {
            background: ${({theme}) => theme.darkOrange};
        }

    table > tbody > tr > td {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 200px;
    }
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
    ${TableResponsiveStyle()}
`;

const RecycleList = () => {
    const recyclebinContext = useContext(RecyclebinContext);

    const {
        deletedItems,
        filtered, 
        loading,
        getDeletedItems,
        clearRecyclebin
    } = recyclebinContext;
    
    useEffect(() => {
        getDeletedItems();

        return () => {
            clearRecyclebin();
        }

        // eslint-disable-next-line
    },[]);

    return (
        <RecycleListContainer>
            {deletedItems != null && !loading ?
                deletedItems.length > 0 ?
                    <Table>
                        <thead>
                            <tr>
                                <th>類型</th>
                                <th>名稱</th>
                                <th>刪除日期</th>
                            </tr>
                        </thead>
                        <tbody>
                            { filtered !== null ? 
                            (filtered.map(deletedItem => 
                                <RecycleItem key={deletedItem._id} 
                                    item={deletedItem} />
                            )) :
                            (deletedItems.map(deletedItem =>
                                <RecycleItem key={uuidv4()} item ={deletedItem} />
                            ))}
                        </tbody>
                    </Table>
                : <p>目前回收站查無資料</p>
            : null}
        </RecycleListContainer>
    )
}

export default RecycleList;