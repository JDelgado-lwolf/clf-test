export const savedSearchCriteriaWithCS = {
    "id": 1273,
    "metadata": {
        "createdTs": "2024-07-09T22:53:19"
    },
    "savedSearch": {
        "searchCriteria": {
            "criteria": {
                "realEstateDatasourceIdsWithFilters": [
                    {
                        "computedFields": [
                            {
                                "fieldName": "transactionStatus",
                            }
                        ],
                        "idFiltering": [],
                        "mlsObjectId": 449,
                        "searchAllMLS": true,
                        "searchFields": [
                            {
                                "fieldName": "propertyType",
                            }
                        ]
                    }
                ],
                "timePeriod": {
                    "intervalType": "LastCalendarYear"
                }
            },
            "offset": 0,
            "size": 0
        },
        "searchName": "LK",
    }
};

export const savedSearchCriteriaWithoutCS = {
    "id": 1273,
    "metadata": {
        "createdTs": "2024-07-09T22:53:19"
    },
    "savedSearch": {
        "searchCriteria": {
            "criteria": {
                "realEstateDatasourceIdsWithFilters": [
                    {
                        "computedFields": [
                            {
                                "fieldName": "transactionStatus",
                            }
                        ],
                        "idFiltering": [],
                        "mlsObjectId": undefined,
                        "searchAllMLS": true,
                        "searchFields": [
                            {
                                "fieldName": "propertyType",
                            }
                        ]
                    }
                ],
                "timePeriod": {
                    "intervalType": "LastCalendarYear"
                }
            },
            "offset": 0,
            "size": 0
        },
        "searchName": "LK",
    }
};

export const personObject = {
    firstname: 'John',
    lastname: 'Doe',
    subject: {
        math: {
            approved: true,
            score: 9.5,
            teacher: {
                private: true
            }
        },
        sport: {
            approved: false,
            score: 4.4,
            teacher: {
                private: false
            }
        }
    }
};

export const personObjectResult = {
    firstname: 'John',
    lastname: 'Doe',
    subject: {
        math: {
            approved: true,
            score: 9.5,
            teacher: {
                private: true
            }
        },
        sport: {
            approved: false,
            score: 10,
            teacher: {
                private: false
            }
        }
    }
};
