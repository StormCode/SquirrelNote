import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MagnifyingGlass, X } from "phosphor-react";
import IconInput from '../general/IconInput';
import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'

// Import Style
import { theme } from '../../style/themes';

import { 
    filterRecycleList, 
    clearFilterRecycleList 
} from '../../actions/recyclebinActions';

const { defaultColor, orange, gray } = theme;

const HeadIconBaseStyle = `
    float: left;
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
                transform: translate(120%, 2px);
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
    transform: translate(-150%, 2px);
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
                transform: translate(-150%, 2px);
            `
        }
    ]);
}

const ClearIconStyle = ClearIconBaseStyle.concat(ClearIconResponsiveStyle());

const IconInputContainerBaseStyle = `
    width: 100%;
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
            `
        }
    ]);
}

const IconInputContainerStyle = IconInputContainerBaseStyle.concat(IconInputContainerResponsiveStyle());

const RecycleFilter = ({ filterRecycleList, clearFilterRecycleList }) => {

    const [focus, setFocus] = useState(false);
    const [color, setColor] = useState(gray);

    useEffect(() => {
        !focus && setColor(gray);
    }, [focus]);

    const onChange = val => {
        if(val !== '')
            filterRecycleList(val);
        else
            clearFilterRecycleList();
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
            placeholder='搜尋標題...' 
            onChange={onChange}
            hoverOn={hoverOn}
            hoverOff={hoverOff}
            focusOn={focusOn}>
                <HeadIcon>
                    <MagnifyingGlass size={16} color={color} weight='bold'/>
                </HeadIcon>
                <IconInput.ClearIcon iconStyle={ClearIconStyle}>
                    <X size={14} color={color} weight='bold'/>
                </IconInput.ClearIcon>
        </IconInput>
    )
}

RecycleFilter.propTypes = {
    filterRecycleList: PropTypes.func.isRequired, 
    clearFilterRecycleList: PropTypes.func.isRequired
};

export default connect(
    null,
    { filterRecycleList, clearFilterRecycleList }
)(RecycleFilter);