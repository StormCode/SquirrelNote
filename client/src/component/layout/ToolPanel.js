import React from 'react';
import PropTypes from 'prop-types';

import ToolPanelStyled from '../../style/components/ToolPanel';

//
// 此組件設定有兩個按鈕：完成、取消
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
const ToolPanel = ({confirmImg, cancelImg, onConfirm, onCancel}) => {
    return (
        <ToolPanelStyled>
            <button id='add-confirm-btn' onClick={onConfirm}>
                <img src={confirmImg} alt='完成' />
            </button>
            <button id='cancel-btn' onClick={onCancel}>
                <img src={cancelImg} alt='取消' />
            </button>
        </ToolPanelStyled>
    )
}

ToolPanel.defaultProps = {
    confirmImgSrc: '',
    cancelImgSrc: '',
    onConfirm: e => { e.preventDefault(); return true;},
    onCancel: e => { e.preventDefault();}
};

ToolPanel.propTypes = {
    confirmImgSrc: PropTypes.string,
    cancelImgSrc: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func
};

export default ToolPanel;