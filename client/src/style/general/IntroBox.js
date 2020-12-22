import styled from 'styled-components';

const IntroBox = styled.span`
    flex: 1 1 auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    margin: 5rem auto;
    text-align: center;
    height: 100%;

    > p {
        margin-top: 1rem;
        font-size: 1.2rem;
        color: ${({theme}) => theme.gray};
    }

    > img {
        width: 100%;
        max-width: 12rem;
    }
`;

export default IntroBox;