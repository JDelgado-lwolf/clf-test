export const removeSearchAllMLSFlag = criteriaObj => {
    criteriaObj.criteria?.realEstateDatasourceIdsWithFilters?.forEach(mls => {
        delete mls.searchAllMLS;
    });
    return criteriaObj;
};


export const getPostRequestObj = (url, token, data = undefined) => {

    return new Request(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }),
        mode: 'cors',
        cache: 'default',
        body: data ? JSON.stringify(data) : ''
    });

};

export const getGetRequestObj = (url, token, queryString = undefined) => {

    const requestUrl = queryString ? `${url}?${queryString}` : url;

    return new Request(requestUrl, {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }),
        mode: 'cors',
        cache: 'no-store'
    });

};

export const getDeleteRequestObj = (url, token, queryString = undefined) => {
    const requestUrl = queryString ? `${url}?${queryString}` : url;
    return new Request(requestUrl, {
        method: 'DELETE',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }),
        mode: 'cors'
    });
};

export const getPutRequestObj = (url, token, data) => {

    return new Request(url, {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }),
        mode: 'cors',
        body: JSON.stringify(data)
    });
};

export const getPostRequestObjNoToken = (url, data) => {
    return new Request(url, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
        }),
        mode: 'cors',
        cache: 'default',
        body: data
    });
};
