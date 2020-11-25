import styled from 'styled-components';
import {orange, gray} from '../colors';

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

    p {
        text-align: center;
    }

        p > a {
            text-decoration: none;
            color: ${orange};
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
        color: ${gray};
    }
`;

export default AuthPanel;