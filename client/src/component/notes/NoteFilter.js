import React, { useState, useContext } from 'react';
import { MagnifyingGlass, X } from "phosphor-react";
import IconInput from '../general/IconInput';
import styled from 'styled-components';

// Import Style
import { theme } from '../../style/themes';

import NoteContext from '../../context/notes/noteContext';

const { orange, gray } = theme;

const HeadIcon = styled.span`
    float: left;
    transform: translate(3px,-120%);
`;

const ClearIconStyle = `
    cursor: pointer;
    float: right;
    transform: translate(-150%, -120%);
`;

const NoteFilter = ({setKeyword}) => {
    const noteContext = useContext(NoteContext);

    const { filterNote, clearFilterNote } = noteContext;

    const [color, setColor] = useState(gray);

    const onChange = val => {
        if(val !== '') {
            setKeyword(val);
            filterNote(val);
        }
        else {
            setKeyword(null);
            clearFilterNote();
        }
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
                <HeadIcon>
                    <MagnifyingGlass size={16} color={color} weight='bold'/>
                </HeadIcon>
                <IconInput.ClearIcon iconStyle={ClearIconStyle}>
                    <X size={14} color={color} weight='bold'/>
                </IconInput.ClearIcon>
        </IconInput>
    )
}

export default NoteFilter;