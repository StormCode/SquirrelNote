import styled from 'styled-components';

const NotebookContainer = styled.div`
    flex: 1 1 auto;
    max-width: 15rem;
    margin: 30px 10px;

    .card {
        background: radial-gradient(circle, rgba(255,229,206,1) 0%, 
                    rgba(255,180,99,0.969625350140056) 80%, 
                    rgba(255,160,77,1) 100%);
        border: none;
        padding: 10px;
        width: 100%;
        height: 20rem;
        max-height: 250px;
        box-shadow: 3px 3px 8px 0px rgba(0,0,0,0.5);
    }

        .card .card-body {
            margin-top: 32px;
        }

        .card .card-title {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
        }

        .card .card-text {
            font-size: 1rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

    &:hover > .card {
        cursor: pointer;
        background-color: rgba(173, 216, 230, 0.8);
    }

    .danger-alert {
        border: 2px solid #FF0000;
    }`;

export default NotebookContainer;