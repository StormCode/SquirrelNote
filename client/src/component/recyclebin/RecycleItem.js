import React, { useContext } from 'react';
import { Notebook, FolderOpen, Note } from "phosphor-react";
import { CustomShortDate } from '../../utils/date';

import RecyclebinContext from '../../context/recyclebin/recyclebinContext';

const RecycleItem = ({item}) => {
    const recyclebinContext = useContext(RecyclebinContext);
    
    const { restore, permanentlyDelete } = recyclebinContext;
    const {id, type, title, date, isRestoreable} = item;

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

    const onRestore = e => {
        e.preventDefault();
        restore(id);
    };

    const onPermanentlyDelete = e => {
        e.preventDefault();
        permanentlyDelete(id);
    }
    
    return (
        <tr>
            <th scope="row">{iconHelper(type)}</th>
            <td>{title}</td>
            <td>{CustomShortDate(new Date(date))}</td>
            <td>{isRestoreable ? 
                    <button onClick={onRestore}>復原</button> 
                : <button>!</button>}
            </td>
            <td><button onClick={onPermanentlyDelete}>永久刪除</button></td>
        </tr>
    )
}

export default RecycleItem;