import styled from 'styled-components';
import {orange} from '../colors';

const AuthPanel = styled.div`
    padding: 0 5rem;
    width: 100%;

    > .title {
        text-align: center;
        padding: 20px 0;
    }

    input[type='submit'] {
        margin: 30px 0;
        background: ${orange};
    }

    > p > a {
        text-decoration: none;
        color: ${orange};
    }
`;

export default AuthPanel;