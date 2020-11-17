import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
`;

const Banner = styled.div`
    background-color: #0080FF;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 500px;
`;

const HeaderText = styled.p`
    font-size: 1.5rem;
    color: 3380FF;
`;

const StartButton = styled.button`
    border: none;
    border-radius: 10px;
    font-size: 2rem;
    color: #3300FF;
    padding: 20px;
    &:hover {
        color: #8080FF;
    }
    &:focus {
        outline: none;
    }
`;

const FeatureContainer = styled.div`
    background-color: #808080;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
`;

const Feature = styled.div`
    border: 1px solid #00FF00;
    flex: 1 1 50%;
    height: 250px;
`;

const Index = () => {
    return (
        <Container>
            <Banner>
                <HeaderText>輕量的筆記應用</HeaderText>
                <StartButton>開始使用</StartButton>
            </Banner>
            <FeatureContainer>
                <Feature>img</Feature>
                <Feature>所見即所得</Feature>
                <Feature>豐富的文字編輯功能</Feature>
                <Feature>img</Feature>
                <Feature>img</Feature>
                <Feature>自動儲存</Feature>
                <Feature>隱私安全</Feature>
                <Feature>img</Feature>
            </FeatureContainer>   
        </Container>
    )
}

export default Index;