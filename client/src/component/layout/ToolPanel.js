import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ToolPanelStyled from '../../style/components/ToolPanel';

const Button = styled.button`
    ${props => props.btnStyle}
`;

//
// 此組件設定有兩個按鈕：完成、取消
// 傳入的屬性：
// 完成事件的callback(function)
// 取消事件的callback(function)
// 滑鼠移過時的callback(function)
// 滑鼠移出時的callback(function)
// 按鈕的樣式(string)
// 子組件(children)：
// 完成按鈕內容(string or object)
// 取消按鈕內容(string or object)
//
const ToolPanelContext = React.createContext({
    onConfirm: () => {},
    onCancel: () => {}
});

const ToolPanel = props => {
    const {
        onConfirm,
        onCancel,
        hoverOn, 
        hoverOff,
        btnStyle
    } = props;

    return (
        <ToolPanelContext.Provider
            value={{
                onConfirm: onConfirm,
                onCancel: onCancel,
                hoverOn: hoverOn,
                hoverOff: hoverOff,
                btnStyle: btnStyle
            }}>
            <ToolPanelStyled>
                {props.children}
            </ToolPanelStyled>
        </ToolPanelContext.Provider>
    )
};

ToolPanel.ConfirmBtn = ({children}) =>
    <ToolPanelContext.Consumer>
        {contextValue =>
            <Button id='confirm-btn' 
                name='confirm'
                onMouseEnter={contextValue.hoverOn}
                onMouseLeave={contextValue.hoverOff}
                onClick={contextValue.onConfirm} btnStyle={contextValue.btnStyle}>
                {children}
            </Button>
        }
    </ToolPanelContext.Consumer>;

ToolPanel.CancelBtn = ({children}) =>
    <ToolPanelContext.Consumer>
        {contextValue =>
            <Button id='cancel-btn' 
                name='cancel'
                onMouseEnter={contextValue.hoverOn}
                onMouseLeave={contextValue.hoverOff}
                onClick={contextValue.onCancel} btnStyle={contextValue.btnStyle}>
                {children}
            </Button>
        }
    </ToolPanelContext.Consumer>;

ToolPanel.defaultProps = {
    onConfirm: () => {},
    onCancel: () => {},
    hoverOn: () => {},
    hoverOff: () => {},
    btnStyle: `
        border: none;
        background: none;
        padding: 0;
        &:focus {
            outline: none;
        }`
};

ToolPanel.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    hoverOn: PropTypes.func,
    hoverOff: PropTypes.func,
    btnStyle: PropTypes.string
};

export default ToolPanel;