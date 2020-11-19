import React, { useState, useContext } from 'react';
import { MagnifyingGlass, X } from "phosphor-react";
import IconInput from '../layout/IconInput';
import styled from 'styled-components';

// Import Style
import { defaultColor, orange } from '../../style/colors';

import NotebookContext from '../../context/notebooks/notebookContext';

const HeadIconStyled = styled.span`
    float: left;
    transform: translate(120%,15%);
`;

const ClearIconStyled = styled.span`
    float: right;
    transform: translate(-75%, -125%);
`;

const NotebookFilter = () => {
    const notebookContext = useContext(NotebookContext);

    const { filterNotebook, clearFilterNotebook } = notebookContext;

    const [color, setColor] = useState(defaultColor);

    const onChange = val => {
        if(val !== '')
            filterNotebook(val);
        else
            clearFilterNotebook();
    }

    const hoverOn = () => {
        setColor(orange);
    }

    const hoverOff = () => {
        setColor(defaultColor);
    }

    return (
        <IconInput 
            containerStyle={{
                float: 'right',
                width: '40%',
                maxWidth: '200px'
            }}
            inputStyle={{textIndent: '24px'}}
            placeholder='搜尋...' 
            onChange={onChange}
            hoverOn={hoverOn}
            hoverOff={hoverOff}>
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