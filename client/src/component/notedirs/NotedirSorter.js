import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FunnelSimple } from "phosphor-react";
import styled from 'styled-components';
import Sorter from '../general/Sorter';
import {
    sortNotedir
} from '../../actions/notedirActions';

// Import Style
import { theme } from '../../style/themes';

const { orange, gray } = theme;

const SorterContainer = styled.span`
    cursor: pointer;
    margin: 0 5px;
`;

const NotedirSorter = ({ 
    orderBy, 
    sortBy, 
    sortNotedir 
}) => {

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

NotedirSorter.propTypes = { 
    orderBy: PropTypes.string.isRequired, 
    sortBy: PropTypes.string.isRequired,
    sortNotedir: PropTypes.func.isRequired
};

const mapStateProps = state => ({
    orderBy: state.notedirs.orderBy, 
    sortBy: state.notedirs.sortBy
});

export default connect(
    mapStateProps,
    { sortNotedir }
)(NotedirSorter);