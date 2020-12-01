import styled from 'styled-components';

const AuthPanel = styled.div`
    padding: 0 5rem;
    width: 100%;

    > .title {
        text-align: center;
        padding: 20px 0;
    }

    input[type='submit'] {
        margin: 30px 0;
        background: ${({theme}) => theme.orange};
    }

    p {
        text-align: center;
    }

        p > a {
            text-decoration: none;
            color: ${({theme}) => theme.orange};
        }

    > .column {
        column-count: 2;
    }
    
        > .column > a {
            display: block;
        }

    > .tip {
        margin-bottom: 10px;
        font-size: .75rem;
        color: ${({theme}) => theme.gray};
    }
`;

export default AuthPanel;