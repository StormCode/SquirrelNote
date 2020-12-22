import styled from 'styled-components';

// Import Style
import { theme } from '../themes';

const { orange, darkOrange, turquoise, gray } = theme;

const NotedirStyle = styled.li`
    cursor: pointer;
    background: ${props => props.isCurrent ? orange : 'none'};
    position: relative;
    padding: .5rem 0 .5rem .5rem;
    font-size: 1rem;
    color: ${props => props.isCurrent ? '#FFF' : gray};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: auto;
    &:hover {
        background: ${props => props.isCurrent ? darkOrange : 'none'};
        color: ${props => props.isCurrent ? '#FFF' : orange};
    }

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

        .note-count-badge {
            position: absolute;
            top: 0;
            right: 0;
            padding: .8rem .3rem 0 0;
            font-size: .8rem;
            color: ${gray};
        }

        .unsaved-count-badge {
            background: ${turquoise};
            border-radius: 10px;
            padding: 0 .3rem;
            margin-left: .3rem;
            font-size: .5rem;
            color: #FFF;
        }
`;

export default NotedirStyle;