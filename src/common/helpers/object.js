import { moduleNames } from '../../constants';

export const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
};

export const getParentFromValue = (object, value) => {
    let parent;
    Object.keys(object).forEach(key => {
        if (Object.values(object[key]).find(childValue => childValue === value)) {
            parent = moduleNames[key];
        }
    });
    return parent;
};
