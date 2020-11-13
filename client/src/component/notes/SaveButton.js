import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
    UNSAVE,
    SAVING,
    SAVED,
    DISABLESAVE
} from '../../saveState';

const Button = styled.button`
    text-align: center;

    p {
        display: ${props => props.state !== SAVED ? 'none' : 'inherit'};
        font-size: 8px;
    }
`;

//
// 此組件是儲存按鈕，依據儲存狀態控制按鈕文字、啟用/停用
// 共有四種狀態：未儲存、已儲存、儲存中、禁用
// 傳入的屬性：
// 儲存狀態(string)
// 儲存事件(function)
// 是否顯示上次儲存時間(boolean)
// 上次儲存時間(string)
// 儲存時間更新頻率(單位: 毫秒)(number)
//
const SaveButton = ({state, onSave, showUpdateTime, updateTime, updateInterval}) => {
    let btnText;
    let btnEnable;

    const [updateText, setUpdateText] = useState('');
    const [updateTimeToken, setUpdateTimeToken] = useState(null);

    useEffect(() => {
        updateTimeToken && clearInterval(updateTimeToken);
        
        if(showUpdateTime && updateTime !== null){
            let leastUpdateTime = new Date(updateTime);
            setUpdateText(getLeastUpdateTextHelper(leastUpdateTime));
            setUpdateTimeToken(setInterval(() => {
                setUpdateText(getLeastUpdateTextHelper(leastUpdateTime));
            },updateInterval));
        } else {
            clearInterval(updateTimeToken);
            setUpdateTimeToken(null);
            setUpdateText('');
        }
    }, [state, showUpdateTime, updateTime, updateInterval]);

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
        default:
            btnEnable = false;
            btnText = '儲存';
            break;
    }

    const getLeastUpdateTextHelper = (lastUpdateTime) => {
        let minuteTicks = 60 * 1000;
        let hourTicks = 60 * minuteTicks;
        let dayTicks = 24 * hourTicks;
        let datetimeDiff = new Date() - lastUpdateTime;
        let dayDiff = Math.floor(datetimeDiff / dayTicks);
        let hourDiff = Math.floor(datetimeDiff / hourTicks);
        let minuteDiff = Math.floor(datetimeDiff / minuteTicks);
        let secondDiff = Math.floor(datetimeDiff / 1000);
        return dayDiff > 0 ? 
            `${dayDiff}天前`
            : hourDiff > 0 ?
                `${hourDiff}小時前`
                : minuteDiff > 0 ?
                    `${minuteDiff}分鐘前`
                    : secondDiff > 0 ?
                        `${secondDiff}秒前`
                        : '剛剛';
    }

    return (
        <Button onClick={() => {onSave();}} disabled={!btnEnable} state={state}>{btnText}<p>{updateText}</p></Button>
    )
}

SaveButton.defaultProps = {
    state: DISABLESAVE,
    onSave: () => { },
    showUpdateTime: false,
    updateInterval: 60000
}

SaveButton.propTypes = {
    state: PropTypes.string.isRequired,
    onSave: PropTypes.oneOfType([PropTypes.func,PropTypes.object]),
    showUpdateTime: PropTypes.bool,
    updateInterval: PropTypes.number
}

export default SaveButton;