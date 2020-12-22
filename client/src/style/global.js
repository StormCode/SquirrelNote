import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    html,
    body {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: 'Microsoft Jhenghei', 'Arial', 'Segoe UI';
    }

    p {
        margin: 0;
    }

    li {
        list-style: none;
    }

    input[type='text'] {
        border-radius: 5px;
        padding: 3px !important;
    }

    input:focus,
    button:focus {
        outline: none;
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

    .modal-dialog {
        margin: 20rem auto;
    }

        .modal-content {
            border: none;
            background: none;
        }

    /**************/
    /* 自訂捲軸樣式 */
    /**************/
    
    ::-webkit-scrollbar {
        width: 8px;
    }
     
    ::-webkit-scrollbar-track {
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0,0,0,.5); 
    }
     
    ::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #ccc;
        box-shadow: inset 0 0 5px rgba(0,0,0,.5); 
    }
`;