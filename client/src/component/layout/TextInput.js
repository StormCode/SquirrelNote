import React, { Fragment, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = styled.span`
    ${props => props.btnStyle}
`;

const InputContainer = styled.div`
    display: flex;
    flexFlow: row nowrap;
    padding: 5px 10px;
`;

const Input = styled.input`
    background: none;
    border: none;
    width: 80%;
    &:focus {
        outline: none;
    }
`;

//
// 此組件是帶有確認、取消功能的文字輸入框
// 預設顯示文字輸入框、完成、取消按鈕
// 傳入的屬性：
// 可見性(boolean)
// placeholder(string)
// 完成事件(function)
// 按鈕的樣式(string)
// 子組件(children)：
// 完成按鈕內容(string or object)
// 取消按鈕內容(string or object)
//
const TextInputContext = React.createContext({
    placeholder: '請輸入文字',
    onConfirm: () => {},
    onCancel: () => {},
    btnStyle: `
        margin: 0 5px;
        padding: 0;
        border: none;
        background: none;`
});

const TextInput = (props) => {
    const {
        visible,
        placeholder, 
        onConfirm, 
        onCancel,
        btnStyle
    } = props;
    const text = useRef('');

    useEffect(() => {
        return () => {
            if(text.current)
                text.current.value = '';
        }

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(visible) 
            text.current.focus();
    }, [visible]);

    const inputCancel = e => {
        e.preventDefault();
        onCancel();
        text.current.value = '';
    }

    const inputConfirm = e => {
        e.preventDefault();
        onConfirm(text.current.value);
        text.current.value = '';
    }

    return (
        <TextInputContext.Provider
            value={{
                inputConfirm: inputConfirm,
                inputCancel: inputCancel,
                btnStyle: btnStyle
            }}>
            <Fragment>
                {visible ? 
                    (<InputContainer>
                        <Input type='text' placeholder={placeholder} ref={text} />
                        {props.children}
                    </InputContainer>) 
                : null}
            </Fragment>
        </TextInputContext.Provider>
    )
};

TextInput.ConfirmBtn = ({children}) =>
    <TextInputContext.Consumer>
        {contextValue =>
            <Button 
                onClick={contextValue.inputConfirm}
                btnStyle={contextValue.btnStyle}>
                {children}
            </Button>
        }
    </TextInputContext.Consumer>;

TextInput.CancelBtn = ({children}) =>
    <TextInputContext.Consumer>
        {contextValue =>
            <Button 
                onClick={contextValue.inputCancel}
                btnStyle={contextValue.btnStyle}>
                {children}
            </Button>
        }
    </TextInputContext.Consumer>

TextInput.defaultProps = {
    placeholder: '請輸入文字',
    onConfirm: () => {},
    onCancel: () => {},
    btnStyle: `
        margin: 0 5px;
        padding: 0;
        border: none;
        background: none;`
}

TextInput.propTypes = {
    placeholder: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    btnStyle: PropTypes.string
}

export default TextInput;