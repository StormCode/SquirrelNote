const Sort = (sort, sortBy, a, b) => {
    if(sortBy === 'title'){
        if(sort === 'asc')
            return a.title < b.title ? -1 : 1
        else
            return a.title > b.title ? -1 : 1
    }
    else {
        if(sort === 'asc')
            return a.date < b.date ? -1 : 1
        else
            return a.date > b.date ? -1 : 1
    }
}

export default Sort;