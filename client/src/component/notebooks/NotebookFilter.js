import React, { useState, useContext, useEffect } from 'react';
import { MagnifyingGlass, X } from "phosphor-react";
import IconInput from '../layout/IconInput';
import styled from 'styled-components';

// Import Style
import { theme } from '../../style/themes';

import NotebookContext from '../../context/notebooks/notebookContext';

const { defaultColor, orange, gray } = theme;

const HeadIconStyled = styled.span`
    float: left;
    transform: translate(3px,-125%);
`;

const ClearIconStyled = styled.span`
    cursor: pointer;
    float: right;
    transform: translate(-150%, -125%);
`;

const NotebookFilter = () => {
    const notebookContext = useContext(NotebookContext);

    const { filterNotebook, clearFilterNotebook } = notebookContext;

    const [focus, setFocus] = useState(false);
    const [color, setColor] = useState(gray);

    useEffect(() => {
        !focus && setColor(gray);
    }, [focus]);

    const onChange = val => {
        if(val !== '')
            filterNotebook(val);
        else
            clearFilterNotebook();
    }

    const hoverOn = () => {
        setColor(focus ? orange : defaultColor);
    }

    const hoverOff = () => {
        setColor(gray);
    }

    const focusOn = state => {
        setFocus(state);
        setColor(orange);
    }

    return (
        <IconInput 
            containerStyle={`
                float: right;
                width: 40%;
                max-width: 200px;`
            }
            inputStyle={`
                border: 1px solid ${color};
                text-indent: 24px;
                color: ${color};
                ::placeholder{
                    color: ${color};
                }
                &:focus {
                    outline: none;
                    border: 1px solid ${color};
                }`
            }
            placeholder='搜尋...' 
            onChange={onChange}
            hoverOn={hoverOn}
            hoverOff={hoverOff}
            focusOn={focusOn}>
                <IconInput.HeadIcon>
                    <HeadIconStyled>
                        <MagnifyingGlass size={20} color={color} weight='bold'/>
                    </HeadIconStyled>
                </IconInput.HeadIcon>
                <IconInput.ClearIcon>
                    <ClearIconStyled>
                        <X size={14} color={color} weight='bold'/>
                    </ClearIconStyled>
                </IconInput.ClearIcon>
        </IconInput>
        // <form>
        //     <input type='text' ref={text} placeholder='搜尋...' onChange={onChange} style={searchStyle}/>
        // </form>
    )
}

export default NotebookFilter;