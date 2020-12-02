import styled from 'styled-components';

export const MainSubPanel = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    padding: 3rem 5rem;
    overflow: hidden;
`;

export const AddNotebookBtn = styled.button`
    position: relative;
    background: ${({theme}) => theme.orange};
    border: none;
    border-radius: 5px;
    float: left;
    padding: 5px 10px;
    color: #FFF;
    box-shadow: 3px 3px 5px rgba(0,0,0,.5);

        &:hover {
            background: ${({theme}) => theme.darkOrange};
        }
`;