import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    p {
        margin: 0;
    }

    input[type='text'] {
        border-radius: 5px;
        padding: 3px !important;
    }

    button > img:not(.inline-img) {
        width: 100%;
    }

    .warning {
        color: #FF0000;
    }

    .right-align {
        float: right;
    }

    .modal-content {
        border: none;
        background: none;
    }
`;