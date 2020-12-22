// Import Style
import { theme } from '../themes';

const { orange, darkOrange, gray, darkGray } = theme;

const deleteStyle = `
    width: 100%;

    .modal-body {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        border-radius: 20px;
        background: #FFF;
        padding: 30px 50px;
        box-shadow: 5px 5px 10px #000;
    }

        .modal-body > div {
            flex: 1 0 100%;
        }

    p {
        padding: 1.5rem 0;
        text-align: center;
    }

    .confirm-btn {
        background: ${orange};

        &:hover {
            background: ${darkOrange};
        }        
    }

    .confirm-btn:disabled {
        background: ${gray};

        &:hover {
            background: ${gray};
        }        
    }

    .cancel-btn {
        background: ${gray};

        &:hover {
            background: ${darkGray};
        }
    }

    .danger {
        color: rgb(255,0,0);
        font-size: 1.2rem;
        font-weight: bold;
    }
`;

export default deleteStyle;