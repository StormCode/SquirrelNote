import styled from 'styled-components';

// Import Style
import { theme } from '../themes';

const { orange, darkOrange, gray } = theme;

const NotedirStyle = styled.li`
    cursor: pointer;
    background: ${props => props.isCurrent ? orange : 'none'};
    color: ${props => props.isCurrent ? '#FFF' : gray};
    padding: .5rem 0 .5rem .5rem;
    font-size: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: auto;
    &:hover {
        background: ${props => props.isCurrent ? darkOrange : 'none'};
        color: ${props => props.isCurrent ? '#FFF' : orange};
    };

        .text-container,
        .toolpanel-container {
            position: relative;
        }

        .text-container {
            width: 20ch;
            max-width: 100%;
        }

            .text-container p {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

        .toolpanel-container {
            width: 100%;
            z-index: 1;
        }
`;

export default NotedirStyle;