import React, { useContext } from 'react'
import styled from 'styled-components';
import Sorter from '../layout/Sorter'

import RecyclebinContext from '../../context/recyclebin/recyclebinContext';

const RecycleSorter = () => {
    const recyclebinContext = useContext(RecyclebinContext);
    const {
        orderBy,
        sortBy,
        sortRecycleList
    } = recyclebinContext;

    const onSortBy = e => {
        sortRecycleList(orderBy, e.target.value);
        console.log('onSortBy');
        
    };

    const onToggleSort = e => {
        sortRecycleList(e.target.value, sortBy);
        console.log('onToggleSort');
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
                    <Sorter.Field value='date'>刪除日期</Sorter.Field>
                    <Sorter.Divider></Sorter.Divider>
                    <Sorter.Asc>升冪</Sorter.Asc>
                    <Sorter.Desc>降冪</Sorter.Desc>
                </Sorter.DropdownMenu>
            </Sorter>
        </SorterContainer>
    )
}

export default RecycleSorter;