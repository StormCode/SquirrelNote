export const RwdTableBaseStyle = `
    display: table;
    table-layout: fixed;
    white-space: nowrap;
    width: 100%;
`;

export const RwdTableForDestopStyle = `
    /*Table樣式*/

    thead > tr > th {
        display: table-cell;
    }

    th, td {
        display: table-cell;
        padding: 1em !important;
        margin: 0;
        text-align: center;
    }

        th, td:before {
            font-weight: normal;
            min-width: inherit;
        }

        th:first-child,
        td:first-child {
            padding-left: 0;
        }

        th:last-child,
        td:last-child {
            padding-right: 0;
        }
        
    th:before,
    td:before {
        display: none;
    }
`;
export const RwdTableForPhoneStyle = `
    /*Table樣式*/
    min-width: 100%;

    thead > tr > th {
        display: none;
    }

    th, td {
        margin: 3px 5px;
    }

    th, td {
        display: block;
        text-align: left;
    }

        th, td:before {
            font-weight: bold;
            min-width: 40%;
        }

        th:before, 
        td:before {
            content: attr(data-th) " : ";
            font-weight: bold;
            min-width: 50px;
            display: inline-block;
        }
`;