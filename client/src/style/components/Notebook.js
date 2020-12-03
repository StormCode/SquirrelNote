import styled from 'styled-components';

const Notebook = styled.div`
    flex: 1 1 auto;
    max-width: 15rem;
    margin: 30px 10px;

    .card {
        background: rgba(255,227,198,1);
        border: none;
        border-left: 1em solid rgba(255,132,0,1);
        border-radius: 15px 0 0 15px;
        padding: 20px;
        width: 100%;
        height: 20rem;
        max-height: 250px;
        box-shadow: 3px 3px 8px 0px rgba(0,0,0,0.5);
    }

        .card:hover {
            background: linear-gradient(45deg, rgba(255,120,0,1) 25%, 
                        rgba(255,227,198,1) 25%, 
                        rgba(255,227,198,1) 100%);
        }

        .card .card-body {
            display: flex;
            flex-flow: column wrap;
            justify-content: space-around;
            text-align: center;
            background: rgba(255, 245, 237, .8);
            box-shadow: 3px 3px 8px 0px rgba(0,0,0,0.5);
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

export default Notebook;