import React, { useState, useContext } from 'react'
import { MagnifyingGlass, X } from "phosphor-react";
import IconInput from '../layout/IconInput';
import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'

// Import Style
import { theme } from '../../style/themes';

import RecyclebinContext from '../../context/recyclebin/recyclebinContext';

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

const RecycleFilter = () => {
    const recycleContext = useContext(RecyclebinContext);

    const { filterRecycleList, clearFilterRecycleList } = recycleContext;

    const [color, setColor] = useState(gray);

    const onChange = val => {
        if(val !== '')
            filterRecycleList(val);
        else
            clearFilterRecycleList();
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
            placeholder='搜尋標題...' 
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

export default RecycleFilter;