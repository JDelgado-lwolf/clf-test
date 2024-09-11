export const activeMls = {
    "bankInvolvementStatus": "D",
    "firstAvailableDate": "",
    "isActive": true,
    "lastSuccessfulUpdate": "2024-06-23T23:07:44",
    "licensingStatement": "",
    "longDescription": "Aspen Glenwood MLS",
    "mlsId": 351,
    "shortDescription": "AGMLS",
    "supports13Quarters": false,
    "supportsBaths": true,
    "supportsBeds": true,
    "supportsCdom": false,
    "supportsDom": true,
    "supportsLotSizeAcres": true,
    "supportsLotSizeSqft": true,
    "supportsNewConstruction": false,
    "supportsSquareFootage": true,
    "supportsYearBuilt": true
};

const inactiveMls = {
    "bankInvolvementStatus": "B",
    "firstAvailableDate": "2009-08-20T18:18:54",
    "isActive": false,
    "lastSuccessfulUpdate": "2023-12-03T20:06:47",
    "licensingStatement": "",
    "longDescription": "Ann Arbor MLS",
    "mlsId": 78,
    "shortDescription": "AAABOR",
    "supports13Quarters": true,
    "supportsBaths": true,
    "supportsBeds": true,
    "supportsCdom": true,
    "supportsDom": true,
    "supportsLotSizeAcres": true,
    "supportsLotSizeSqft": true,
    "supportsNewConstruction": true,
    "supportsSquareFootage": true,
    "supportsYearBuilt": true
};

export const mlsList = [
    {...activeMls},
    {...inactiveMls}
];

export const expectedMlsToSet = {
    label: "(AGMLS) Aspen Glenwood MLS",
    value: { ...activeMls }
};
