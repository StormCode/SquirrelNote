import React, { useContext } from 'react';
import { FunnelSimple } from "phosphor-react";
import styled from 'styled-components';
import Sorter from '../layout/Sorter';

import NotedirContext from '../../context/notedirs/notedirContext'

const SorterContainer = styled.span`
    float: left;
    margin: 0 10px;
`;

const NotedirSorter = () => {
    const notedirContext = useContext(NotedirContext);

    const { orderBy, sortBy, sortNotedir } = notedirContext;

    const onSortBy = sortByParam => {
        sortNotedir(orderBy, sortByParam);
    };

    const onToggleSort = orderByParam => {
        sortNotedir(orderByParam, sortBy);
    };

    // const sortFields = [{text: '名稱', value: 'title'},
    //                     {text: '建立日期', value: 'date'}];

    return (
        <SorterContainer>
            <Sorter 
                orderBy={orderBy}
                sortBy={sortBy}
                onSortBy={onSortBy}
                onToggleSort={onToggleSort}
            >
                <Sorter.Title>
                    <FunnelSimple size={24} />
                </Sorter.Title>
                <Sorter.DropdownMenu>
                    <Sorter.SortBy value='title'>名稱</Sorter.SortBy>
                    <Sorter.SortBy value='date'>建立日期</Sorter.SortBy>
                    <Sorter.Divider></Sorter.Divider>
                    <Sorter.OrderBy value='asc'>升冪</Sorter.OrderBy>
                    <Sorter.OrderBy value='desc'>降冪</Sorter.OrderBy>
                </Sorter.DropdownMenu>
            </Sorter>
        </SorterContainer>
    )
}

export default NotedirSorter;