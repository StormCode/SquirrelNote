import React from 'react';
import PropTypes from 'prop-types';
import { 
    Modal, 
    ModalBody
} from 'reactstrap';
import styled from 'styled-components';

const ModelContainer = styled.div`
    ${props => props.modelStyle}
`;

const Button = styled.button`
    ${props => props.btnStyle}
`;

const ModelsContext = React.createContext({
    model: null,
    toggleOpen: () => {},
    toggleModel: () => {}
});

//
// 此組件設定有兩個按鈕：完成、取消
// 傳入的屬性：
// 開啟/關閉狀態(boolean)
// 切換開啟/關閉狀態(function)
// 完成事件的callback(function)
// 取消事件的callback(function)
// Model的樣式(string)
// 按鈕的樣式(string)
// 子組件(children)：
// 完成按鈕內容(string or object)
// 取消按鈕內容(string or object)
//
const Models = props => {
    const { 
        isOpen, 
        toggleOpen,
        onConfirm,
        onCancel,
        modelStyle,
        btnStyle
    } = props;

    return (
        <ModelsContext.Provider
            value={{
                toggleOpen: toggleOpen,
                onConfirm: onConfirm,
                onCancel: onCancel,
                btnStyle: btnStyle
            }}>
                {isOpen ? <Modal isOpen={isOpen} toggle={toggleOpen}>
                    <ModelContainer modelStyle={modelStyle}>
                        <ModalBody>
                            {props.children}
                        </ModalBody>
                    </ModelContainer>
                </Modal> : null}
        </ModelsContext.Provider>
    )
}

Models.Content = ({children}) =>
    <div>
        {children}
    </div>;

Models.ConfirmBtn = (props) =>
    <ModelsContext.Consumer>
        {contextValue =>
            <Button className='confirm-btn'
                onClick={contextValue.onConfirm}
                btnStyle={contextValue.btnStyle}
                disabled={!props.enable}>
                {props.children}
            </Button>
        }
    </ModelsContext.Consumer>;


Models.CancelBtn = ({children}) =>
    <ModelsContext.Consumer>
        {contextValue =>
            <Button className='cancel-btn' 
                onClick={contextValue.onCancel}
                btnStyle={contextValue.btnStyle}>
                {children}
            </Button>
        }
    </ModelsContext.Consumer>;

Models.defaultProps = {
    isOpen: false,
    toggleModel: () => {},
    onConfirm: () => {},
    onCancel: () => {},
    modelStyle: `
        width: 100%;

        .modal-body {
            border-radius: 20px;
            background: #FFF;
            padding: 30px 50px;
            box-shadow: 5px 5px 10px #000;
        }`,
    btnStyle: `
        margin: 0 5px;
        border: none;
        border-radius: 5px;
        padding: .5rem 1rem;
        color: #FFF;
        box-shadow: 3px 3px 5px rgba(0,0,0,.5);

        &:disabled {
            color: #ccc;
        }`
};

Models.protoTypes = {
    isOpen: PropTypes.bool.isRequired, 
    toggleModel: PropTypes.func.isRequired, 
    onConfirm : PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    modelStyle: PropTypes.string,
    btnStyle: PropTypes.string
};

export default Models;