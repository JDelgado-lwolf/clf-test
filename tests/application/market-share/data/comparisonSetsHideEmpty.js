const comparisonSetsWithoutGroupOffices = [
    {
        "groups": [],
        "mlsId": 20,
    },
    {
        "groups": [],
        "mlsId": 268,
    },
    {
        "groups": [],
        "mlsId": 268,
    },
]

const comparisonSetsWithGroupOffices = [
    {
        "groups": [
            {
                "name": "test",
                "offices": [
                    {
                        "officeId": "3082"
                    },
                    {
                        "officeId": "3089"
                    },
                    {
                        "officeId": "1012"
                    }
                ]
            }
        ],
        "mlsId": 268,
    },
    {
        "groups": [
            {
                "name": "Test 2",
                "offices": [
                    { "officeId": "3162" },
                    { "officeId": "3259" }
                ]
            }
        ],
        "mlsId": 268,
    },
    {
        "groups": [
            {
                "name": "Test 3",
                "offices": [{ "officeId": "3162" }]
            }
        ],
        "mlsId": 268,
    }
];

export const comparisonSetsToCheckGroupOffices = [
    ...comparisonSetsWithGroupOffices,
    ...comparisonSetsWithoutGroupOffices
];
