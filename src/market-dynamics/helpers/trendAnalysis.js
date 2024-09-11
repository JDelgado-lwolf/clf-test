import { linearRegression } from 'simple-statistics';

export const writeOutput = ({ totalChange, slope, totalPercentChange, keyField, periodPercentChange,
    coordinates }) => {
    console.log('')
    console.log('status is', keyField)
    console.log('coordinates are', coordinates)
    console.log('totalChange is', totalChange)
    console.log('periodChange is', slope)
    console.log('totalPercentChange is', totalPercentChange * 100)
    console.log('periodPercentChange is', periodPercentChange * 100)
    console.log('')
};

export const getTrendAnalysis = ({ filteredSearchResults, id, statusLabel, keyField, featureToggles, formatter }) => {
    const coordinates = getCoordinates(filteredSearchResults, keyField);

    const slope = linearRegression(coordinates).m;

    const periodCount = coordinates.length - 1;
    const totalChange = slope * periodCount;
    const totalPercentChange = (totalChange / coordinates[0][1]);
    const periodPercentChange = totalPercentChange / periodCount;

    if (featureToggles.trendAnalysisDebugOutput.isEnabled) {
        writeOutput({ totalChange, keyField, slope, totalPercentChange, periodPercentChange,
            coordinates} );
    }

    return {
        id,
        status: statusLabel,
        totalChange: formatter(totalChange),
        periodChange: formatter(slope),
        totalPercentChange,
        periodPercentChange
    };
};

export const getCoordinates = (searchResults, keyField) => {
    return searchResults.slice().reverse().map((item, index) => {
        if (keyField in item) {
            return [index + 1, item[keyField]];
        }
        return [index + 1, 0];
    });
};
