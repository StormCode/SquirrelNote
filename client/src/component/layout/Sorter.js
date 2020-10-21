import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

//
// 此組件可依自訂欄位做升冪或降冪排序
// 傳入的屬性：
// 排序按鈕的顯示文字(也可以放任意Html)(string)
// 排序的欄位(array)
// 預設排序的方式：升冪/降冪排序(string)
// 預設排序的欄位：依某個欄位做排序(string)
// 排序欄位的callback
// 排序方式的callback
// 自訂樣式
//
const Sorter = ({labelHtml, fields, orderBy, sortBy, onSortBy, onToggleSort, sorterStyle}) => {
    return (
        <UncontrolledDropdown>
            <DropdownToggle caret style={sorterStyle}>
                {labelHtml}
            </DropdownToggle>
            <DropdownMenu>
                {fields.length !== 0 && fields.map((field,idx) => 
                    <DropdownItem key={idx} value={field.value} onClick={onSortBy} active={sortBy === field.value}>{field.text}</DropdownItem>
                )}
                <DropdownItem divider />
                <DropdownItem value='asc' onClick={onToggleSort} active={orderBy === 'asc'}>升冪</DropdownItem>
                <DropdownItem value='desc' onClick={onToggleSort} active={orderBy === 'desc'}>降冪</DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
};

Sorter.defaultProps = {
    labelHtml: '排序',
    fields: [],
    orderBy:'asc',
    sortBy:'',
    onSortBy: () => {},
    onToggleSort: () => {},
    sorterStyle: {
        float: 'right',
        margin: '0 10px'
    }
};

Sorter.propTypes = {
    labelHtml: PropTypes.string,
    fields: PropTypes.array.isRequired,
    orderBy: PropTypes.string,
    sortBy: PropTypes.string.isRequired,
    onSortBy: PropTypes.func.isRequired,
    onToggleSort: PropTypes.func.isRequired,
    sorterStyle: PropTypes.object
};

export default Sorter;