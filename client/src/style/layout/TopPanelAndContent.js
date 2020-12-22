import styled from 'styled-components';
import makeResponsiveCSS from '../../utils/make-responsive-css'

const TopPanelAndContentBaseStyle = `
    position: relative;
    width: 100%;
    height: 100%;
    padding: 5rem;
    overflow: hidden;

        .content {
            flex: 1 0 auto;
            display: flex;
            flex-flow: wrap row;
            align-items: center;
            margin-top: 5rem;
        }

        .tool-header {
            display: flex;
            flex-flow: row nowrap;
        }
    `;

const TopPanelAndContentResponsiveStyle = () => {
    return makeResponsiveCSS([
        {
            constraint: 'min',
            width: '0px',
            rules: `
                .content {
                    justify-content: center;
                }
            `
        }, {
            constraint: 'min',
            width: '768px',
            rules: `
                .content {
                    justify-content: normal;
                }
            `
        }
    ])
}

const TopPanelAndContent = styled.div`
    ${TopPanelAndContentBaseStyle}
    ${TopPanelAndContentResponsiveStyle()}
`;

export default TopPanelAndContent;