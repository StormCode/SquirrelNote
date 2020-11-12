import React, { useContext } from 'react';
import styled from 'styled-components';
import Sorter from '../layout/Sorter';

import NotebookContext from '../../context/notebooks/notebookContext'

const NotebookSorter = () => {
    const notebookContext = useContext(NotebookContext);

    const { orderBy, sortBy, sortNotebook } = notebookContext;

    const onSortBy = e => {
        sortNotebook(orderBy, e.target.value);
    };

    const onToggleSort = e => {
        sortNotebook(e.target.value, sortBy);
    };

    const SorterContainer = styled.span`
        float: right;
        margin: 0 10px;
    `;

    return (
        <SorterContainer>
            <Sorter 
                orderBy={orderBy}
                sortBy={sortBy}
                onSortBy={onSortBy}
                onToggleSort={onToggleSort}
            >
                <Sorter.Title>排序</Sorter.Title>
                <Sorter.DropdownMenu>
                    <Sorter.Field value='title'>名稱</Sorter.Field>
                    <Sorter.Field value='date'>建立日期</Sorter.Field>
                    <Sorter.Divider></Sorter.Divider>
                    <Sorter.Asc>升冪</Sorter.Asc>
                    <Sorter.Desc>降冪</Sorter.Desc>
                </Sorter.DropdownMenu>
            </Sorter>
        </SorterContainer>
    )
}

export default NotebookSorter;