import React, { useState, useContext, useEffect } from 'react';
import { MagnifyingGlass, X } from "phosphor-react";
import IconInput from '../layout/IconInput';
import styled from 'styled-components';

// Import Style
import { theme } from '../../style/themes';

import NoteContext from '../../context/notes/noteContext';

const { orange, gray } = theme;

const HeadIconStyled = styled.span`
    float: left;
    transform: translate(3px,-120%);
`;

const ClearIconStyled = styled.span`
    cursor: pointer;
    float: right;
    transform: translate(-150%, -120%);
`;

const NoteFilter = () => {
    const noteContext = useContext(NoteContext);

    const { filterNote, clearFilterNote } = noteContext;

    const [color, setColor] = useState(gray);

    const onChange = val => {
        if(val !== '')
            filterNote(val);
        else
            clearFilterNote();
    }

    const hoverOn = () => {
        setColor(orange);
    }

    const hoverOff = () => {
        setColor(gray);
    }

    return (
        <IconInput 
            containerStyle={`
                flex: 1 1 auto;
                height: 0;`
            }
            inputStyle={`
                border: none;
                background: none;
                text-indent: 20px;
                color: ${color};
                width: 100%;
                ::placeholder{
                    color: ${color};
                    font-size: 16px;
                }`
            }
            placeholder='搜尋筆記標題...' 
            onChange={onChange}
            hoverOn={hoverOn}
            hoverOff={hoverOff}>
                <IconInput.HeadIcon>
                    <HeadIconStyled>
                        <MagnifyingGlass size={16} color={color} weight='bold'/>
                    </HeadIconStyled>
                </IconInput.HeadIcon>
                <IconInput.ClearIcon>
                    <ClearIconStyled>
                        <X size={14} color={color} weight='bold'/>
                    </ClearIconStyled>
                </IconInput.ClearIcon>
        </IconInput>
    )
}

export default NoteFilter;