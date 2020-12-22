import React from 'react';
import styled from 'styled-components';
import spinner from '../../assets/general/spinner.gif';

const SpinnerContainer = styled.span`
    background: #FFF;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -100px;
    margin-left: -100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, .5);
    width: 200px;
    height: 200px;
    z-index: 9999;
`;

const Spinner = () =>
    <SpinnerContainer>
        <img src={spinner} alt='Loading...' />
    </SpinnerContainer>

export default Spinner
