import React, { useEffect } from 'react'
import { Table } from 'reactstrap';

const RecycleList = () => {
    return (
        <Table striped>
            <thead>
                <tr>
                    <th>名稱</th>
                    <th>刪除日期</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">專案一</th>
                    <td>2020-11-25</td>
                </tr>
            </tbody>
        </Table>
    )
}

export default RecycleList;