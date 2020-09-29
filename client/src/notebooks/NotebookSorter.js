import React, { useContext } from 'react'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import NotebookContext from '../context/notebooks/notebookContext'

const NotebookSorter = () => {
    const notebookContext = useContext(NotebookContext);

    const { sort, sortBy, sortNotebook } = notebookContext;

    const onSortBy = e => {
        sortNotebook(sort, e.target.value)
    }

    const onToggleSort = e => {
        sortNotebook(e.target.value, sortBy);
    }

    return (
        <UncontrolledDropdown>
            <DropdownToggle caret style={sorterStyle}>
                排序
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem value='title' onClick={onSortBy} active={sortBy === 'title'}>名稱</DropdownItem>
                <DropdownItem value='create-date' onClick={onSortBy} active={sortBy === 'create-date'}>建立日期</DropdownItem>
                <DropdownItem divider />
                <DropdownItem value='asc' onClick={onToggleSort} active={sort === 'asc'}>升冪</DropdownItem>
                <DropdownItem value='desc' onClick={onToggleSort} active={sort === 'desc'}>降冪</DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

const sorterStyle = {
    float: 'right',
    margin: '0 10px'
};

export default NotebookSorter;