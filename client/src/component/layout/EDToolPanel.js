import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import ToolPanel from './ToolPanel';
import styled from 'styled-components';

// Import Style
import ToolPanelStyled from '../../style/components/ToolPanel';

const Button = styled.span`
    ${props => props.btnStyle}
`;

//
// 此組件設定有兩個按鈕：編輯、刪除
// 從外部控制此組件顯示/隱藏
// 當編輯或刪除按鈕被按下後切換成完成、取消按鈕
// 傳入的屬性：
// 判斷目前是否正在使用此ToolPanel內部的功能(boolean)
// 可見性(boolean)
// 執行編輯事件(function)
// 執行刪除事件(function)
// 取消事件(function)
// 進行編輯、刪除事件(function)
// 按鈕的樣式(string)
// 子組件(children)：
// 編輯按鈕內容(string or object)
// 刪除按鈕內容(string or object)
// 完成按鈕內容(string or object)
// 取消按鈕內容(string or object)
// 相依的組件：
// ToolPanel
//
const EDToolPanelContext = React.createContext({
    onEdit: () => {},
    onDelete: () => {},
    onEnter: () => {},
    onCancel: () => {}
});

const EDToolPanel = props => {
    const {
        isEnter, 
        visible, 
        onEdit, 
        onDelete, 
        onEnter, 
        onCancel,
        btnStyle
    } = props;
    
    const operator = {
        edit: 'edit',
        delete: 'delete',
        confirm: 'confirm',
        cancel: 'cancel'
    };
    
    const [operatorType, setOperatorType] = useState(null);

    const onClick = {
        edit: async e => {
            e.preventDefault();
            setOperatorType(operator.edit);
            onEnter(operator.edit);
        },
        delete: async e => {
            e.preventDefault();
            setOperatorType(operator.delete);
            onEnter(operator.delete);
        },
        confirm: async e => {
            e.preventDefault();
            if(operatorType === operator.edit){
                onEdit();
            } else {
                onDelete();
            }
            setOperatorType(null);
        },
        cancel: async e => {
            e.preventDefault();
            setOperatorType(null);
            onCancel();
        }
    };

    const children = props.children;

    return (
        <EDToolPanelContext.Provider
            value={{
                isEnter: isEnter,
                onEdit: onClick.edit,
                onDelete: onClick.delete,
                btnStyle: btnStyle
            }}>
            <Fragment>
                {visible?
                    isEnter ? 
                    <ToolPanel 
                        onConfirm={onClick.confirm}
                        onCancel={onClick.cancel}
                        btnStyle={btnStyle}>
                            {children}
                    </ToolPanel>
                    : <ToolPanelStyled>
                        {children}
                    </ToolPanelStyled>
                : null}
            </Fragment>
        </EDToolPanelContext.Provider>
    )
};

EDToolPanel.ConfirmBtn = (props) =>
    <EDToolPanelContext.Consumer>
        {contextValue =>
            contextValue.isEnter ? 
                React.cloneElement(props.container, 
                    {},
                    <ToolPanel.ConfirmBtn container={props.container}>
                        {props.children}
                    </ToolPanel.ConfirmBtn>)
            : null
        }
    </EDToolPanelContext.Consumer>;

EDToolPanel.CancelBtn = (props) =>
    <EDToolPanelContext.Consumer>
        {contextValue =>
            contextValue.isEnter ? 
                React.cloneElement(props.container, 
                    {},
                    <ToolPanel.CancelBtn container={props.container}>
                        {props.children}
                    </ToolPanel.CancelBtn>)
            : null
        }
    </EDToolPanelContext.Consumer>;

EDToolPanel.EditBtn = (props) =>
    <EDToolPanelContext.Consumer>
        {contextValue =>
            contextValue.isEnter ?
                null 
            : React.cloneElement(props.container, 
                {},
                <Button id='edit-btn' 
                    onClick={contextValue.onEdit}
                    btnStyle={contextValue.btnStyle}>
                    {props.children}
                </Button>)
        }
    </EDToolPanelContext.Consumer>;

EDToolPanel.DeleteBtn = (props) =>
    <EDToolPanelContext.Consumer>
        {contextValue =>
            contextValue.isEnter ?
                null
            : React.cloneElement(props.container, 
                {},
                <Button id='delete-btn'
                    onClick={contextValue.onDelete}
                    btnStyle={contextValue.btnStyle}>
                    {props.children}
                </Button>)
        }
    </EDToolPanelContext.Consumer>;

EDToolPanel.defaultProps = {
    isEnter: null,
    visible: false,
    onEdit: () => {},
    onDelete: () => {},
    onEnter: () => {},
    onCancel: () => {},
    btnStyle: `
        margin: 0 5px;
        padding: 0;
        border: none;
        background: none;`
};

EDToolPanel.propTypes = {
    isEnter: PropTypes.bool,
    visible: PropTypes.bool,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEnter: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    btnStyle: PropTypes.string
};

export default EDToolPanel;