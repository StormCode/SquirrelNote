import React from 'react'

const makeResponsiveCSS = rulesets =>
    rulesets.reduce(
        (cssString, { constraint, width, rules }) =>
            `${cssString} @media (${constraint}-width: ${width}) { ${rules} }`
        ,''
    );

export const hideAt = breakpoints => {
    const rulesets = Object.entries(breakpoints).reduce(
        (rulesets, [constraint, width]) => [
            ...rulesets,
            {
                constraint,
                width,
                rules: `display: none;`,
            },
        ],
        [],
    )

    return makeResponsiveCSS(rulesets);
}

export const Breakpoint = ({ min, max, children }) => {
    const Component = hideAt({ min, max })
    return <Component>{children}</Component>
}

export default makeResponsiveCSS;
