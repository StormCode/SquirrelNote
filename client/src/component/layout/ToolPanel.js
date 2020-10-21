import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types';

//
// 此組件設定有兩個按鈕：編輯、刪除
// 從外部控制此組件顯示/隱藏
// 當編輯或刪除按鈕被按下後切換成完成、取消按鈕
// 傳入的屬性：
// 判斷目前是否正在使用此ToolPanel內部的功能(boolean)
// 可見性(boolean)
// 編輯按鈕圖片位置
// 刪除按鈕圖片位置
// 完成按鈕圖片位置
// 取消按鈕圖片位置
// 編輯事件(function)
// 刪除事件(function)
// 取消事件(function)
//
const ToolPanel = ({isEnter, visible, editImgSrc, deleteImgSrc, confirmImgSrc, cancelImgSrc, onEdit, onDelete, onEnter, onCancel }) => {
    const operator = {
        edit: 'edit',
        delete: 'delete',
        confirm: 'confirm',
        cancel: 'cancel'
    };
    
    const [operatorType, setOperatorType] = useState(null);

    const onClick = {
        edit: async e => {
            setOperatorType(operator.edit);
            onEnter(operator.edit);
        },
        delete: async e => {
            setOperatorType(operator.delete);
            onEnter(operator.delete);
        },
        confirm: async e => {
            let status = false;
            if(operatorType === operator.edit){
                status = onEdit(e);
            } else {
                status = onDelete(e);
            }
            status && setOperatorType(null);
        },
        cancel: async e => {
            setOperatorType(null);
            onCancel(e);
        }
    };

    return (
        <div className='tool-panel' style={{display: visible ? 'flex' : 'none'}}>
            {isEnter ? 
            (<Fragment>
                <button id='confirm-btn' onClick={onClick.confirm}><img src={confirmImgSrc} alt='完成' /></button>
                <button id='cancel-btn' onClick={onClick.cancel}><img src={cancelImgSrc} alt='取消' /></button>
            </Fragment>)
            : (<Fragment>
                <button id='edit-btn' onClick={onClick.edit}><img src={editImgSrc} alt='編輯' /></button>
                <button id='delete-btn' onClick={onClick.delete}><img src={deleteImgSrc} alt='刪除' /></button>
            </Fragment>)}
        </div>
    )
}

ToolPanel.defaultProps = {
    isEnter: null,
    visible: false,
    editImgSrc: '',
    deleteImgSrc: '',
    confirmImgSrc: '',
    cancelImgSrc: '',
    onEdit: e => { e.preventDefault();},
    onDelete: e => { e.preventDefault();},
    onConfirm: e => { e.preventDefault(); return true;},
    onCancel: e => { e.preventDefault();}
};

ToolPanel.propTypes = {
    isEnter: PropTypes.bool,
    visible: PropTypes.bool,
    editImgSrc: PropTypes.string,
    deleteImgSrc: PropTypes.string,
    confirmImgSrc: PropTypes.string,
    cancelImgSrc: PropTypes.string,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func
};

export default ToolPanel;