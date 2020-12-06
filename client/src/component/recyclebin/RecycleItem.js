import React, { Fragment, useState, useContext } from 'react';
import { Notebook, FolderOpen, Note } from "phosphor-react";
import { CustomShortDate } from '../../utils/date';
import Models from '../layout/Models';

import RecyclebinContext from '../../context/recyclebin/recyclebinContext';

// Import Style
import { deleteStyle } from '../../style/model/delete';

const RecycleItem = ({item}) => {
    const recyclebinContext = useContext(RecyclebinContext);
    
    const { restore, permanentlyDelete } = recyclebinContext;
    const {id, type, title, date, isRestoreable} = item;
    const [deleteVisible, setDeleteVisible] = useState(false);

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

    const textHelper = type => {
        switch(type) {
            case 'notebook':
                return '筆記本';
            case 'notedir':
                return '筆記目錄';
            case 'note':
                return '筆記';
        }
    }

    const toggleDeleteOpen = () => {
        setDeleteVisible(!deleteVisible);
    }

    const onCancelDelete = () => {
        setDeleteVisible(false);
    }

    const onRestore = e => {
        e.preventDefault();
        restore(id);
    };

    const onPermanentlyDelete = e => {
        e.preventDefault();
        permanentlyDelete(id);
    }
    
    return (
        <Fragment>
            <tr>
                <th scope="row">{iconHelper(type)}</th>
                <td>{title}</td>
                <td>{CustomShortDate(new Date(date))}</td>
                <td>{isRestoreable ? 
                        <button onClick={onRestore}>復原</button> 
                    : <button>!</button>}
                </td>
                <td><button onClick={toggleDeleteOpen}>永久刪除</button></td>
            </tr>
            <Models
                isOpen={deleteVisible}
                toggleOpen={toggleDeleteOpen}
                onConfirm={onPermanentlyDelete}
                onCancel={onCancelDelete}
                modelStyle={deleteStyle}>
                <Models.Content>
                    <p>你將永久失去這個{textHelper(type)}，確定永久刪除嗎？</p>
                </Models.Content>
                <Models.ConfirmBtn enable={true}>永久刪除</Models.ConfirmBtn>
                <Models.CancelBtn>取消</Models.CancelBtn>
            </Models>
        </Fragment>
    )
}

export default RecycleItem;