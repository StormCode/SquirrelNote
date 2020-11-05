import React from 'react';
import PropTypes from 'prop-types';
import {
    UNSAVE,
    SAVING,
    SAVED,
    DISABLESAVE
} from '../../saveState';

//
// 此組件是儲存按鈕，依據儲存狀態控制按鈕文字、啟用/停用
// 共有四種狀態：未儲存、已儲存、儲存中、禁用
// 傳入的屬性：
// 儲存狀態(string)
// 儲存事件(function)
//
const SaveButton = ({state, onSave}) => {
    let btnText;
    let btnEnable;
    switch(state) {
        case UNSAVE:
            btnEnable = true;
            btnText = '儲存';
            break;
        case SAVING:
            btnEnable = false;
            btnText = '儲存中...'
            break;
        case SAVED:
            btnEnable = false;
            btnText = '已儲存';
            break;
        case DISABLESAVE:
            btnEnable = false;
            btnText = '儲存';
            break;
        default:
            btnText = '儲存';
            btnEnable = false;
    }

    return (
        <button className='note-save-btn' onClick={() => {onSave();}} disabled={!btnEnable}>{btnText}</button>
    )
}

SaveButton.defaultProps = {
    state: DISABLESAVE,
    onSave: () => { }
}

SaveButton.propTypes = {
    state: PropTypes.string.isRequired,
    onSave: PropTypes.oneOfType([PropTypes.func,PropTypes.object])
}

export default SaveButton;