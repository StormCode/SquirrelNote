import React, { useState, useContext, useEffect } from 'react';
import { MagnifyingGlass, X } from "phosphor-react";
import IconInput from '../layout/IconInput';
import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'

// Import Style
import { theme } from '../../style/themes';

import NotebookContext from '../../context/notebooks/notebookContext';

const { defaultColor, orange, gray } = theme;

const HeadIconBaseStyle = `
    float: left;
    transform: translate(3px,-125%);
`;

const HeadIconResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                transform: translate(3px,-140%);
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                transform: translate(3px,-125%);
            `
        }
    ]);
}

const HeadIcon = styled.span`
    ${HeadIconBaseStyle}
    ${HeadIconResponsiveStyle()}
`;

const ClearIconBaseStyle = `
    cursor: pointer;
    float: right;
    height: 2.5rem;
    transform: translate(-150%, -75%);
`;

const ClearIconResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                transform: translate(-150%, -85%);
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                transform: translate(-150%, -75%);
            `
        }
    ]);
}

const ClearIconStyle = ClearIconBaseStyle.concat(ClearIconResponsiveStyle());

const IconInputContainerBaseStyle = `
    height: 2.5rem;
`;

const IconInputContainerResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                flex: 1 0 auto;
                display: inline-block;
                margin-left: 10px;
                margin-bottom: -4px;
                float: none;
                width: auto;
                max-width: unset;
                overflow: hidden;
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                flex: none;
                margin-left: auto;
                width: 40%;
                max-width: 200px;
            `
        }
    ]);
}

const IconInputContainerStyle = IconInputContainerBaseStyle.concat(IconInputContainerResponsiveStyle());

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
    
    const IconInputBaseStyle = `
        border: 1px solid ${color};
        text-indent: 24px;
        color: ${color};

        ::placeholder{
            color: ${color};
        }

        &:focus {
            border: 1px solid ${color};
        }
    `;

    const IconInputResponsiveStyle = () => {
        return makeResponsiveCSS([
            {
                constraint: 'min',
                width: '0px',
                rules: `
                    width: 100%;
                    height: 100%;
                `
            }, {
                constraint: 'min',
                width: '768px',
                rules: `
                    width: auto;
                    height: auto;
                `
            }
        ]);
    }

    const IconInputStyle = IconInputBaseStyle.concat(IconInputResponsiveStyle());


    return (
        <IconInput 
            containerStyle={IconInputContainerStyle}
            inputStyle={IconInputStyle}
            placeholder='搜尋...' 
            onChange={onChange}
            hoverOn={hoverOn}
            hoverOff={hoverOff}
            focusOn={focusOn}>
                {/* <IconInput.HeadIcon iconStyle={HeadIconStyled}>
                    <MagnifyingGlass size={20} color={color} weight='bold'/>
                </IconInput.HeadIcon>
                <IconInput.ClearIcon iconStyle={ClearIconStyled}>
                    <X size={14} color={color} weight='bold'/>
                </IconInput.ClearIcon> */}
                <HeadIcon>
                    <MagnifyingGlass size={20} color={color} weight='bold'/>
                </HeadIcon>
                <IconInput.ClearIcon iconStyle={ClearIconStyle}>
                    <X size={14} color={color} weight='bold'/>
                </IconInput.ClearIcon>
        </IconInput>
    )
}

export default NotebookFilter;