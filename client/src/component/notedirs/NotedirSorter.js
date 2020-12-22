import React, { useState, useContext, useEffect } from 'react';
import { FunnelSimple } from "phosphor-react";
import styled from 'styled-components';
import Sorter from '../general/Sorter';

// Import Style
import { theme } from '../../style/themes';

import NotedirContext from '../../context/notedirs/notedirContext'

const { orange, gray } = theme;

const SorterContainer = styled.span`
    cursor: pointer;
    margin: 0 5px;
`;

const NotedirSorter = () => {
    const notedirContext = useContext(NotedirContext);

    const { orderBy, sortBy, sortNotedir } = notedirContext;

    // 下拉選單狀態
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [color, setColor] = useState(gray);

    useEffect(() => {
        dropdownOpen ? setColor(orange) : setColor(gray);
    }, [dropdownOpen]);

    const toggleDropdownOpen = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const onSortBy = sortByParam => {
        sortNotedir(orderBy, sortByParam);
    };

    const onToggleSort = orderByParam => {
        sortNotedir(orderByParam, sortBy);
    };

    const hoverOn = () => {
        setColor(orange);
    };

    const hoverOff = () => {
        setColor(gray);
        setDropdownOpen(false);
    };

    return (
        <SorterContainer>
            <Sorter 
                orderBy={orderBy}
                sortBy={sortBy}
                onSortBy={onSortBy}
                onToggleSort={onToggleSort}
                dropdownOpen={dropdownOpen}
                toggleDropdown={toggleDropdownOpen}
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

export default NotedirSorter;