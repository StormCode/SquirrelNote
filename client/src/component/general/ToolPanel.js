import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from "@material-ui/core/Tooltip";
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
        btnStyle
    } = props;

    return (
        <ToolPanelContext.Provider
            value={{
                onConfirm: onConfirm,
                onCancel: onCancel,
                btnStyle: btnStyle
            }}>
            <ToolPanelStyled>
                {props.children}
            </ToolPanelStyled>
        </ToolPanelContext.Provider>
    )
};

ToolPanel.ConfirmBtn = (props) =>
    <ToolPanelContext.Consumer>
        {contextValue =>
            <Tooltip
                    title='完成'
                    placement='top'
                >
                    <Button className='confirm-btn'
                        onClick={contextValue.onConfirm}
                        btnStyle={contextValue.btnStyle}>
                        {props.children}
                </Button>
            </Tooltip>
        }
    </ToolPanelContext.Consumer>;

ToolPanel.CancelBtn = (props) =>
    <ToolPanelContext.Consumer>
        {contextValue =>
        <Tooltip
                title='取消'
                placement='top'
            >
                <Button className='cancel-btn' 
                    onClick={contextValue.onCancel}
                    btnStyle={contextValue.btnStyle}>
                    {props.children}
            </Button>
            </Tooltip>
        }
    </ToolPanelContext.Consumer>;

ToolPanel.defaultProps = {
    onConfirm: () => {},
    onCancel: () => {},
    btnStyle: `
        cursor: pointer;
        margin: 0 5px;
        padding: 0;
        border: none;
        background: none;`
};

ToolPanel.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    btnStyle: PropTypes.string
};

export default ToolPanel;