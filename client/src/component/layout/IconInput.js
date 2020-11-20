import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';

const IconInputContext = React.createContext({
    placeholder: '',
    onChange: () => {}
});

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
        hoverOff 
    } = props;
    const text = useRef('');

    const clearText = () => {
        text.current.value = '';
        onChange(text.current.value);
    };

    const inputChange = () => {
        onChange(text.current.value);
    };

    const inputHoverOn = () => {
        hoverOn();
    };

    const inputHoverOff = () => {
        hoverOff();
    };

    return (
        <IconInputContext.Provider
            value={{
                text,
                clearText
            }}>
            <div style={containerStyle}
                onMouseEnter={inputHoverOn}
                onMouseLeave={inputHoverOff}>
                <input type='text' 
                    ref={text} 
                    placeholder={placeholder} 
                    onChange={inputChange}
                    style={inputStyle} />
                {props.children}
            </div>
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
    containerStyle: {},
    inputStyle: {},
    placeholder: '',
    onChange: () => {},
    hoverOn: () => {},
    hoverOff: () => {}
};

IconInput.propTypes = {
    containerStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    hoverOn: PropTypes.func,
    hoverOff: PropTypes.func
};

export default IconInput;