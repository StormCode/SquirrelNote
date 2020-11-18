import styled from 'styled-components';

const ToolPanelStyled = styled.div`
    position: absolute;
    right: 0;
    display: flex;
    flex-flow: nowrap row;
    justify-content: flex-end;

    > button {
        margin: 0 5px;
        border: 0;
        border-radius: 5px;
        width: 32px;
        height: 32px;
    }
`;

export default ToolPanelStyled;