import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Check } from "phosphor-react";
import styled from 'styled-components';
import { 
    Dropdown, 
    DropdownToggle, 
    DropdownMenu, 
    DropdownItem 
} from 'reactstrap';

const SorterItem = styled.div`
    padding: 5px 10px;
    font-size: 1rem;
    margin-left: 30px;

    &:hover {
        color: ${props => props.color};
    }

    > svg {
        position: absolute;
        left: 10px;
    }
`;

//
// 此組件可依自訂欄位做升冪或降冪排序
// 傳入的屬性(props)：
// 預設排序的方式：升冪/降冪排序(string)
// 預設排序的欄位：依某個欄位做排序(string)
// 排序欄位的callback
// 排序方式的callback
// 下拉選單的開啟狀態(boolean)
// 下拉選單切換開啟狀態的callback(function)
// 排序的欄位(任意數量)
// 下拉選單主色(string)
// 滑鼠移過時的callback(function)
// 滑鼠移出時的callback(function)
// 子組件(children)：
// 排序按鈕的顯示文字(也可以放任意Html)
//
const SorterContext = React.createContext({
    labelHtml: '排序',
    orderBy:'asc',
    sortBy:'',
    onSortBy: () => {},
    onToggleSort: () => {}
});

const Sorter = props => {
    const {
        orderBy, 
        sortBy, 
        onSortBy, 
        onToggleSort, 
        dropdownOpen,
        toggleDropdown,
        color,
        hoverOn, 
        hoverOff
    } = props;
    
    return (
        <SorterContext.Provider
            value={{
                orderBy: orderBy,
                sortBy: sortBy,
                onSortBy: onSortBy,
                onToggleSort: onToggleSort,
                color: color
            }}>
            <Dropdown 
                isOpen={dropdownOpen} 
                toggle={toggleDropdown}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}>
                {props.children}
            </Dropdown>
        </SorterContext.Provider>
    )
};

Sorter.Title = ({ children}) => 
    <DropdownToggle 
        tag="span"
        data-toggle="dropdown">
        {children}
    </DropdownToggle>;

Sorter.SortBy = props => 
    <SorterContext.Consumer>
        {contextValue =>
            <SorterItem 
                key={uuidv4()} 
                color={contextValue.color}
                onClick={() => {contextValue.onSortBy(props.value);}}>
                {contextValue.sortBy === props.value && <Check size={24} />}
                {props.children}
            </SorterItem>
        }
    </SorterContext.Consumer>;

Sorter.OrderBy = props => 
    <SorterContext.Consumer>
        {contextValue => 
            <SorterItem 
                key={uuidv4()} 
                color={contextValue.color}
                onClick={() => {contextValue.onToggleSort(props.value);}}>
                {contextValue.orderBy === props.value && <Check size={24} />}
                {props.children}
            </SorterItem>}
    </SorterContext.Consumer>;

Sorter.DropdownMenu = ({children}) => 
    <DropdownMenu>
        {children}
    </DropdownMenu>;

Sorter.Divider = () =>
    <DropdownItem divider />;

Sorter.defaultProps = {
    orderBy:'asc',
    sortBy:'',
    onSortBy: () => {},
    onToggleSort: () => {},
    hoverOn: () => {},
    hoverOff: () => {}
};

Sorter.propTypes = {
    orderBy: PropTypes.string,
    sortBy: PropTypes.string.isRequired,
    onSortBy: PropTypes.func.isRequired,
    onToggleSort: PropTypes.func.isRequired,
    hoverOn: PropTypes.func,
    hoverOff: PropTypes.func
};

export default Sorter;