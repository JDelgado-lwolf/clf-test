export const searchCriteria = {
    "realEstateDatasourceIdsWithFilters": [
      {
        "computedFields": [
          {
            "fieldName": "transactionStatus",
            "fieldValues": [
              "SoldListSide"
            ]
          }
        ],
        "idFiltering": [],
        "mlsObjectId": 387,
        "realEstateDatasourceId": 10,
        "searchAllMLS": true,
        "searchFields": [
          {
            "fieldName": "propertyType",
            "fieldValueDescriptions": [
              "Detached",
              "Condominium",
              "Manufactured Home",
              "Villa",
              "Townhouse",
              "Detached",
              "Commercial",
              "Agriculture",
              "Other",
              "Manufactured Home",
              "Unimproved Land",
              "Boat Slip",
              "Deeded Parking",
              "Retail",
              "Duplex",
              "Triplex",
              "Quadruplex",
              "Commercial/Business"
            ],
            "fieldValues": [
              "5",
              "10",
              "15",
              "20",
              "25",
              "305",
              "310",
              "315",
              "320",
              "325",
              "330",
              "335",
              "340",
              "345",
              "505",
              "510",
              "515",
              "905"
            ]
          },
        ]
      }
    ],
    "timePeriod": {
      "intervalType": "LastCalendarYear"
    }
};
export const expectedParams = {
    params: {
        "comparisonSet": [
            {
                "name": "O-offices (2)",
                "offices": [
                    {
                        "officeId": "WW"
                    },
                    {
                        "officeId": "AGS.OPENDOORS"
                    }
                ]
            }
        ],
        "search": {
            "criteria": {
                "realEstateDatasourceIdsWithFilters": [
                    {
                        "computedFields": [
                            {
                                "fieldName": "transactionStatus",
                                "fieldValues": [
                                    "SoldListSide"
                                ]
                            }
                        ],
                        "idFiltering": [],
                        "realEstateDatasourceId": 10,
                        "searchAllMLS": true,
                        "mlsObjectId": 387,
                        "searchFields": [
                            {
                                "fieldName": "propertyType",
                                "fieldValueDescriptions": [
                                    "Detached",
                                    "Condominium",
                                    "Manufactured Home",
                                    "Villa",
                                    "Townhouse",
                                    "Detached",
                                    "Commercial",
                                    "Agriculture",
                                    "Other",
                                    "Manufactured Home",
                                    "Unimproved Land",
                                    "Boat Slip",
                                    "Deeded Parking",
                                    "Retail",
                                    "Duplex",
                                    "Triplex",
                                    "Quadruplex",
                                    "Commercial/Business"
                                ],
                                "fieldValues": [
                                    "5",
                                    "10",
                                    "15",
                                    "20",
                                    "25",
                                    "305",
                                    "310",
                                    "315",
                                    "320",
                                    "325",
                                    "330",
                                    "335",
                                    "340",
                                    "345",
                                    "505",
                                    "510",
                                    "515",
                                    "905"
                                ]
                            }
                        ]
                    }
                ],
                "timePeriod": {
                    "intervalType": "LastCalendarYear"
                }
            }
        }
    },
    transactionStatus: searchCriteria.realEstateDatasourceIdsWithFilters[0].computedFields[0].fieldValues[0]
};

export const selectedCompSet = {
  groups: [
     {
         "name": "O-offices (2)",
         "offices": [
             {
                 "officeId": "WW"
             },
             {
                 "officeId": "AGS.OPENDOORS"
             }
         ]
     }
  ],
  id: 387,
  mlsId: 351,
  name: "AGMLS-comp-set-01 v1.0",
  createdTs: "2024-06-24T19:18:21",
  updatedTs: "2024-06-24T19:20:09",
  label: "AGMLS-comp-set-01 v1.0 (AGMLS)",
  shortDescription: "AGMLS",
  value: 387
};

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
