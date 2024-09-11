import { MLS_PROPERTY_TYPE_CLASS_ID } from "../../../../constants";

export const getPropertyTypeValues = (propertyTypes, keyToMap) => {
    if (!propertyTypes.length) return;
    let revisedPropertyTypes = [];
    for (let obj of propertyTypes) {
        const properties = obj?.types
            .filter(obj => keyToMap in obj)
                .map(obj => String(obj[keyToMap]));
        revisedPropertyTypes = [...revisedPropertyTypes, ...properties];
    };
    return Array.from(new Set(revisedPropertyTypes));
};

export const getSearchCriteriaPropertyTypes = (propertyTypes) => {
    const propertyTypeCategories = MLS_PROPERTY_TYPE_CLASS_ID['RESIDENTIAL'];
    return propertyTypes.filter((obj) => obj.classId === propertyTypeCategories);
};

export const getSearchCriteria = (
    mlsId,
    propertyTypeIds,
    propertyTypeNames,
    agentIdsArray,
    listId
) => {
    return {
        "criteria": {
            "realEstateDatasourceIdsWithFilters": [
                {
                    "realEstateDatasourceId": mlsId,
                    "searchFields": [
                        {
                            "fieldName": "propertyType",
                            "fieldValues": propertyTypeIds,
                            "fieldValueDescriptions": propertyTypeNames
                        }
                    ],
                    "searchAllMLS": true,
                    "computedFields": [],
                    "idFiltering": [{
                        "idType": "agentId",
                        "idValues": agentIdsArray,
                        "listId": listId
                    }]
                }
            ],
            "timePeriod": {
                "intervalType": "Annually"
            }
        },
        "offset": 0,
        "size": 0
    }
};

export const popoverIds = Object.freeze({
    display: 'display-dropdown',
    metrics: 'metrics-dropdown'
});
