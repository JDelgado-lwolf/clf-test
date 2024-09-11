const toggleVisibilityForAdditionalInfo = (column, shouldHide) => {
    if (column.isAdditionalInfo) {
        return {
            ...column,
            hide: shouldHide
        };
    }
    return column;
}

export const getAdditionalColDefinitions = (colDefs, shouldShowAdditionalInfo) => {
    return colDefs.map(col => toggleVisibilityForAdditionalInfo(col, !shouldShowAdditionalInfo));
};
