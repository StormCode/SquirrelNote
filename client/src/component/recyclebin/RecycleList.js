import React, { Fragment, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Table } from 'reactstrap';
import RecycleItem from './RecycleItem';

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
                                <RecycleItem key={uuidv4()} item ={deletedItem} />
                            )}
                        </tbody>
                    </Table>
                : <p>目前回收站查無資料</p>
            : null}
        </Fragment>
    )
}

export default RecycleList;