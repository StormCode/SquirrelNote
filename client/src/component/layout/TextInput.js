import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

//
// 此組件是用來切換文字/文字輸入框
// 初始狀態下顯示文字(也可以放任意Html)、被點擊後顯示文字輸入框、完成、取消按鈕(string)
// 傳入的屬性：
// 初始狀態下顯示的內容(string or object)
// 被點擊後顯示的placeholder(string)
// 完成按鈕的內容(string or object)
// 取消按鈕的內容(string or object)
// 完成事件(function)
//
const TextInput = ({defaultHtml, placeholder, applyHtml, cancelHtml, applyEvent}) => {

    const styles = {
        textInputStyle: {
            display: 'flex',
            flexFlow: 'row nowrap',
            padding: '5px 10px'
        },
        textStyle: {
            background: 'none',
            border: 'none',
            outline: 'none',
            width: '80%'
        },
        defaultStyle: {
            cursor: 'pointer',
            paddingLeft: '10px',
            fontSize: '1.2rem'
        }
    };
    const { textInputStyle, textStyle, defaultStyle } = styles;

    const [visible, setVisible] = useState(false);
    const text = useRef('');

    useEffect(() => {
        if(visible) 
            text.current.focus();

        // 清除文字內容
        if(text.current)
            text.current.value = '';
    }, [visible]);

    const hideInput = e => {
        e.preventDefault();
        setVisible(false);
    }

    const toggleVisible = e => {
        e.preventDefault();
        setVisible(!visible);
    }

    const onApply = async e => {
        e.preventDefault();
        let status = await applyEvent(text.current.value);
        if(status) {
            text.current.value = '';
            setVisible(false);
        }
    }

    return (
        <Fragment>
            {visible ? (<div style={textInputStyle}>
                    <input type='text' placeholder={placeholder} ref={text} style={textStyle} />
                    <Button onClick={onApply} outline color='primary' size='sm'>{applyHtml}</Button>
                    <Button onClick={hideInput} outline color='danger' size='sm'>{cancelHtml}</Button>
                </div>) 
            : defaultHtml ? <div style={defaultStyle} onClick={toggleVisible}>{defaultHtml}</div> : null}
        </Fragment>
    )
};

TextInput.defaultProps = {
    defaultHtml: '點擊輸入文字',
    placeholder: '請輸入文字',
    applyHtml: 'OK',
    cancelHtml: '取消',
    applyEvent: () => { return true }
}

TextInput.propTypes = {
    defaultHtml: PropTypes.oneOfType([PropTypes.string,PropTypes.object]),
    placeholder: PropTypes.string,
    applyHtml: PropTypes.oneOfType([PropTypes.string,PropTypes.object]),
    cancelHtml: PropTypes.oneOfType([PropTypes.string,PropTypes.object]),
    applyEvent: PropTypes.func.isRequired
}

export default TextInput;