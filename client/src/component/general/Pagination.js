import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
    margin: 0 auto;

    > ul {
        display: flex;
        margin-top: 1.5rem;
    }

        > ul > li {
            cursor: pointer;
            padding: .3rem .5rem;
        }
`;
//
// 此組件是做分頁功能
// 傳入的屬性(props)：
// 資料(Array)
// 目前頁(Number)
// 每頁的資料筆數(Number)
// 產生資料的函式(function)
//
const Pagination = ({data, currentPage, perPage, dataListHelper}) => {
    const [page, setPage] = useState(currentPage);

    useEffect(() => {
        setPage(currentPage);
    }, [data, currentPage]);
    
    // 設定目前頁面的資料
    const lastIdx = page * perPage;
    const firstIdx = lastIdx - perPage;
    const currentData = data.slice(firstIdx, lastIdx);

    // 設定頁數
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / perPage); i++) {
        pageNumbers.push(i);
    }

    const onClick = e => {
        setPage(Number(e.target.id));
    }

    return (
        <Fragment>
            {dataListHelper(currentData)}
            <Container>
                <ul>
                    {pageNumbers.map(number => 
                        <li
                            key={number}
                            id={number}
                            className={page === number ? 'active' : null}
                            onClick={onClick}
                        >
                            {number}
                        </li>
                    )}
                </ul>
            </Container>
        </Fragment>
    );
}

Pagination.defaultProps = {
    data: [],
    currentPage: 1,
    perPage: 10,
    dataListHelper: currentData => {
        return <ul>
            {currentData.map((current, idx) => 
                <li key={idx}>{current}</li>
            )}
        </ul>
    }
};

Pagination.propTypes = {
    data: PropTypes.array,
    currentPage: PropTypes.number,
    perPage: PropTypes.number,
    dataListHelper: PropTypes.func
};

export default Pagination;