export const removeDuplicates = (arr) => {
    return arr.filter((item, index) => {
        return index === arr.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item));
    });
};

export const msToDays = (ms) => ms / (1000 * 60 * 60 * 24);

export const filterItemByKeyfieldValue = (list, keyfield, keyfieldValueToRemove) => {
    return list.filter(item => item[keyfield] !== keyfieldValueToRemove);
};

export const getCriteriaObject = (searchCriteria) => searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.[0];

export const searchForKeyfieldInProperties = (obj, keyfieldToUpdate, valueToUpdate) => {
    for (let key in obj) {
        if (key === keyfieldToUpdate) {
            obj[keyfieldToUpdate] = valueToUpdate;
            return;
        }
        if (Array.isArray(obj[key])) {
            obj[key].forEach((nestedObj) => {
                if (typeof obj[key] === 'object' && obj[key] !== undefined) {
                    searchForKeyfieldInProperties(nestedObj, keyfieldToUpdate, valueToUpdate);
                }
            });
        }
        if (typeof obj[key] === 'object' && obj[key] !== undefined) {
            searchForKeyfieldInProperties(obj[key], keyfieldToUpdate, valueToUpdate);
        }
    }
};

export const getUpdatedObjectByKeyfield = (object, keyfieldToUpdate, valueToUpdate) => {
    const parsedObject = JSON.parse(JSON.stringify(object));
    searchForKeyfieldInProperties(parsedObject, keyfieldToUpdate, valueToUpdate);
    return parsedObject;
};
