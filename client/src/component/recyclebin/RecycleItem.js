import React, { Fragment, useState, useContext } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Notebook, FolderOpen, Note, Warning } from "phosphor-react";
import Tooltip from "@material-ui/core/Tooltip";
import { CustomShortDate } from '../../utils/date';
import Models from '../general/Models';
import { 
    restore, 
    permanentlyDelete 
} from '../../actions/recyclebinActions';
import { setAlert } from '../../actions/alertActions';

// Import Style
import deleteStyle from '../../style/model/delete';

const RecycleItem = ({ item, restore, permanentlyDelete, setAlert }) => {

    const {
        id, 
        type, 
        title, 
        date, 
        isRestoreable, 
        parent_info, 
        child_count
    } = item;

    const [deleteVisible, setDeleteVisible] = useState(false);

    const iconHelper = (type) => {
        switch(type) {
            case 'notebook':
                return <Tooltip
                            title='筆記本'
                            placement='top'
                        >
                            <Notebook size={24} />
                        </Tooltip>
            case 'notedir':
                return <Tooltip
                            title='筆記目錄'
                            placement='top'
                        >
                            <FolderOpen size={24} />
                        </Tooltip>
            case 'note':
                return <Tooltip
                            title='筆記'
                            placement='top'
                        >
                            <Note size={24} />
                        </Tooltip>
            case 'warning':
                return <Tooltip
                            title='點擊查看詳細訊息'
                            placement='top'
                        >
                            <Warning size={24} />
                        </Tooltip>
            default:
                return null;

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
            default:
                return null;
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

    const onShowWarning = e => {
        e.preventDefault();
        const defaultWarning = '上層目錄或筆記本已經被刪除，請先復原上層目錄或筆記本';
        const typeTxt = textHelper(parent_info.type);
        const warning = `此${textHelper(type)}的上層${typeTxt}: ${parent_info.title}已經被刪除，復原${parent_info.title}後才能復原此${textHelper(type)}`;
        setAlert(parent_info.title ? warning : defaultWarning, 'warning', 10000);
    }

    const onPermanentlyDelete = e => {
        e.preventDefault();
        permanentlyDelete(id);
    }
    
    return (
        <Fragment>
            <tr>
                <th data-th='類型'>{iconHelper(type)}</th>
                <td data-th='名稱'>{title}</td>
                <td data-th='刪除日期'>{CustomShortDate(new Date(date))}</td>
                <td>{isRestoreable ? 
                    <button onClick={onRestore}>復原</button> 
                    : <button onClick={onShowWarning}>{iconHelper('warning')}</button>}
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
                    {child_count > 0 ? 
                        <p className='danger'>你曾經在刪除此{textHelper(type)}前刪除了裡面的目錄/筆記，若你刪除此{textHelper(type)}，將會連帶刪除之前{child_count}個目錄/筆記，確定永久刪除嗎？</p>
                        : <p>你將永久失去這個{textHelper(type)}，確定永久刪除嗎？</p>}
                </Models.Content>
                <Models.ConfirmBtn enable={true}>永久刪除</Models.ConfirmBtn>
                <Models.CancelBtn>取消</Models.CancelBtn>
            </Models>
        </Fragment>
    )
}

RecycleItem.propTypes = {
    item: PropTypes.object.isRequired,
    restore: PropTypes.func.isRequired, 
    permanentlyDelete: PropTypes.func.isRequired,
    setAlert: PropTypes.func.isRequired
}

export default connect(
    null,
    { restore, permanentlyDelete, setAlert }
)(RecycleItem);