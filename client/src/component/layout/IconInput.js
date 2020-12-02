import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconInputContext = React.createContext({
    placeholder: '',
    onChange: () => {}
});

const InputContainer = styled.div`${props => props.containerStyle}`;

const Input = styled.input`${props => props.inputStyle}`;

//
// 此組件是一個文字輸入框，使用者輸入文字即呼叫onChange反應輸入的內容
// 當文字框有文字時會顯示清除圖示
// 輸入框前面可加上任意圖示，也可自訂清除圖示
// 傳入的屬性(props)：
// 整體的樣式(CSS)(string)
// 文字輸入框的樣式(CSS)(string)
// placeholder(string)
// 文字改變時的callback(function)
// 滑鼠移過時的callback(function)
// 滑鼠移出時的callback(function)
// 輸入框焦點callback(function)
// 子組件(children)：
// 文字輸入框前面的圖示
// 清除圖示
//
const IconInput = props => {
    const { 
        containerStyle, 
        inputStyle, 
        placeholder, 
        onChange, 
        hoverOn, 
        hoverOff,
        focusOn 
    } = props;
    const text = useRef('');

    const clearText = () => {
        text.current.value = '';
        onChange(text.current.value);
    };

    const inputChange = () => {
        onChange(text.current.value);
    };

    const inputFocus = () => {
        focusOn(true);
    };

    const inputBlur = () => {
        focusOn(false);
    }

    return (
        <IconInputContext.Provider
            value={{
                text,
                clearText
            }}>
            <InputContainer 
                containerStyle={containerStyle}
                onMouseEnter={hoverOn}
                onMouseLeave={hoverOff}>
                <Input inputStyle={inputStyle}
                    type='text' 
                    ref={text} 
                    placeholder={placeholder} 
                    onChange={inputChange}
                    onFocus={inputFocus}
                    onBlur={inputBlur} />
                {props.children}
            </InputContainer>
        </IconInputContext.Provider>
    )
}

IconInput.HeadIcon = ({children}) =>
    <Fragment>
        {children}
    </Fragment>

IconInput.ClearIcon = ({children}) =>
    <IconInputContext.Consumer>
        {contextValue =>
            contextValue.text.current.value 
            ? <span onClick={e => {
                    contextValue.clearText();
                }}>{children}</span>
            : null
        }
    </IconInputContext.Consumer>


IconInput.defaultProps = {
    containerStyle: '',
    inputStyle: '',
    placeholder: '',
    onChange: () => {},
    hoverOn: () => {},
    hoverOff: () => {},
    focusOn: () => {}
};

IconInput.propTypes = {
    containerStyle: PropTypes.string,
    inputStyle: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    hoverOn: PropTypes.func,
    hoverOff: PropTypes.func,
    focusOn: PropTypes.func
};

export default IconInput;