export const chipIconProps = { className: 'align-top mr-1' };

export const getFilteredListByKeyField = (list, keyField, valueToFilter) => list?.filter(i => i[keyField] === valueToFilter);
