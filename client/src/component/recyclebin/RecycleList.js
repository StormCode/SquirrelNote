import React, { Fragment, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Table } from 'reactstrap';
import { Notebook, FolderOpen, Note } from "phosphor-react";
import { CustomShortDate } from '../../utils/date';

import RecyclebinContext from '../../context/recyclebin/recyclebinContext';

const RecycleList = () => {
    const recyclebinContext = useContext(RecyclebinContext);

    const {
        deletedItems,
        loading,
        getDeletedItems
    } = recyclebinContext;
    useEffect(() => {
        getDeletedItems();

        // eslint-disable-next-line
    },[]);

    const iconHelper = type => {
        switch(type) {
            case 'notebook':
                return <Notebook size={24} />
            case 'notedir':
                return <FolderOpen size={24} />
            case 'note':
                return <Note size={24} />
        }
    };

    return (
        <Fragment>
            {deletedItems != null && !loading ?
                deletedItems.length > 0 ?
                    <Table striped>
                        <thead>
                            <tr>
                                <th>類型</th>
                                <th>名稱</th>
                                <th>刪除日期</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deletedItems.map(deletedItem =>
                                <tr key={uuidv4()}>
                                    <th scope="row">{iconHelper(deletedItem.type)}</th>
                                    <td>{deletedItem.title}</td>
                                    <td>{CustomShortDate(new Date(deletedItem.date))}</td>
                                    <td><button>復原</button></td>
                                    <td><button>永久刪除</button></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                : <p>目前回收站查無資料</p>
            : null}
        </Fragment>
    )
}

export default RecycleList;