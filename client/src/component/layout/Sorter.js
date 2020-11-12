import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

//
// 此組件可依自訂欄位做升冪或降冪排序
// 傳入的屬性(props)：
// 預設排序的方式：升冪/降冪排序(string)
// 預設排序的欄位：依某個欄位做排序(string)
// 排序欄位的callback
// 排序方式的callback
// 子組件(children)：
// 排序按鈕的顯示文字(也可以放任意Html)
// 排序的欄位(任意數量)
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
        onToggleSort} = props;
    
    return (
        <SorterContext.Provider
            value={{
                orderBy: orderBy,
                sortBy: sortBy,
                onSortBy: onSortBy,
                onToggleSort: onToggleSort
            }}>
            <UncontrolledDropdown>
                {props.children}
            </UncontrolledDropdown>
        </SorterContext.Provider>
    )
};

Sorter.Title = ({ children}) => 
    <DropdownToggle caret>
        {children}
    </DropdownToggle>;

Sorter.Field = props => 
    <SorterContext.Consumer>
        {contextValue =>
            <DropdownItem key={uuidv4()} value={props.value} onClick={contextValue.onSortBy} active={contextValue.sortBy === props.value}>{props.children}</DropdownItem>
        }
    </SorterContext.Consumer>;

Sorter.Asc = ({ children}) => 
    <SorterContext.Consumer>
        {contextValue => 
            <DropdownItem value='asc' onClick={contextValue.onToggleSort} active={contextValue.orderBy === 'asc'}>
                {children}
            </DropdownItem>}
    </SorterContext.Consumer>;

Sorter.Desc = ({children}) => 
    <SorterContext.Consumer>
        {contextValue =>
            <DropdownItem value='desc' onClick={contextValue.onToggleSort} active={contextValue.orderBy === 'desc'}>
                {children}
            </DropdownItem>}
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
    onToggleSort: () => {}
};

Sorter.propTypes = {
    orderBy: PropTypes.string,
    sortBy: PropTypes.string.isRequired,
    onSortBy: PropTypes.func.isRequired,
    onToggleSort: PropTypes.func.isRequired
};

export default Sorter;