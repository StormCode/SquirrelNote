import React, { useState, useContext } from 'react';
import { FunnelSimple } from "phosphor-react";
import styled from 'styled-components';
import Sorter from '../layout/Sorter';

// Import Style
import { defaultColor, orange } from '../../style/colors';

import NotebookContext from '../../context/notebooks/notebookContext'

const SorterContainer = styled.span`
    float: right;
    margin: 0 10px;
`;

const NotebookSorter = () => {
    const notebookContext = useContext(NotebookContext);

    const { orderBy, sortBy, sortNotebook } = notebookContext;

    const onSortBy = sortByParam => {
        sortNotebook(orderBy, sortByParam);
    };

    const onToggleSort = orderByParam => {
        sortNotebook(orderByParam, sortBy);
    };

    const [color, setColor] = useState(defaultColor);

    const hoverOn = () => {
        setColor(orange);
    }

    const hoverOff = () => {
        setColor(defaultColor);
    }

    return (
        <SorterContainer>
            <Sorter 
                orderBy={orderBy}
                sortBy={sortBy}
                onSortBy={onSortBy}
                onToggleSort={onToggleSort}
                color={color}
                hoverOn={hoverOn}
                hoverOff={hoverOff}
            >
                <Sorter.Title>
                    <FunnelSimple size={24} color={color} />
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

export default NotebookSorter;