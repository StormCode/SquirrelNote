import React, { useState, useContext, useEffect } from 'react';
import { FunnelSimple } from "phosphor-react";
import styled from 'styled-components';
import Sorter from '../general/Sorter';
import makeResponsiveCSS from '../../utils/make-responsive-css'

// Import Style
import { theme } from '../../style/themes';

import NotebookContext from '../../context/notebooks/notebookContext'

const { defaultColor, orange, gray } = theme;

const SorterContainerBaseStyle = `
    cursor: pointer;
    margin: 0 10px;
    height: 2.5rem;
`;

const SorterContainerResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                display: flex;
                align-items: center;
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                display: inline-block;
            `
        }
    ]);
}

const SorterContainer = styled.span`
    ${SorterContainerBaseStyle}
    ${SorterContainerResponsiveStyle()}
`;

const NotebookSorter = () => {
    const notebookContext = useContext(NotebookContext);

    const { orderBy, sortBy, sortNotebook } = notebookContext;

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
        sortNotebook(orderBy, sortByParam);
    };

    const onToggleSort = orderByParam => {
        sortNotebook(orderByParam, sortBy);
    };

    const hoverOn = () => {
        setColor(defaultColor);
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

export default NotebookSorter;