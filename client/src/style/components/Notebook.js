import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'

const NotebookBaseStyle = `
    min-width: 15rem;
    margin: 1.2rem 1rem;

    .card {
        background: rgba(255,227,198,1);
        border: none;
        border-left: 1em solid rgba(255,132,0,1);
        border-radius: 15px 0 0 15px;
        padding: 1rem;
        width: 100%;
        height: 16rem;
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
            width: 100%;
        }
        
            .card .card-text,
            .card .card-title p {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 100%;
            }

        .card .card-text {
            font-size: 1rem;
        }

    &:hover > .card {
        cursor: pointer;
        background-color: rgba(173, 216, 230, 0.8);
    }

    .danger-alert {
        border: 2px solid #FF0000;
    }`;

const NotebookResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                flex: 1 0 100%;
                max-width: 60%;
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                flex: 0 0 15rem;
                max-width: none;
            `
        }
    ])
}

const Notebook = styled.div`
    ${NotebookBaseStyle}
    ${NotebookResponsiveStyle()}
`;

export default Notebook;