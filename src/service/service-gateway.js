import { cloneDeep } from 'lodash-es';
import { getEndpoint, SERVICE_GATEWAY } from '../providers/endpoint.provider';
import { getPostRequestObj, removeSearchAllMLSFlag } from '../common/helpers/api';
import { useAuthStore } from '../store/auth/store';
import { useCommonStore } from '../store/store';

const defaultRequestTimeout = 10000;

/**
 * @deprecated Please use newSendApiRequest instead since this one is combining await with .then
 */
export const sendApiRequest = async (endpoint, inputParameters, requestTimeout, propsToken) => {
    let response;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout ?? defaultRequestTimeout);
    const token = propsToken || useAuthStore.getState().token;

    if (token) {
        response = await fetch(
            getPostRequestObj(
                `${getEndpoint(SERVICE_GATEWAY)}/service/${endpoint}/data`,
                token,
                {
                    inputParameters
                }
            ),
            { signal: controller.signal }
        )
            .then(response => {
                // This is expired keycloak token
                if (response.status === 403) {
                    useAuthStore.getState().handleExpiredToken();
                    return { error: response.status };
                }
                return response.ok ? response.json() : { error: response.status }
            })
            .catch(error => {
                // When LWA token expires it doesn't provide a specific error code
                useAuthStore.getState().handleExpiredToken();
                return { error }
            });
        clearTimeout(timeoutId);
    } else {
        response = { error: 'No token has been provided. Unable to process request.' };
    }
    return response;
};

// TODO: Slowly move from the method above to this one
export const newSendApiRequest = async (endpoint, inputParameters, requestTimeout, propsToken) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, requestTimeout ?? defaultRequestTimeout);
    const token = propsToken || useAuthStore.getState().token;

    if (!token) return { error: 'No token has been provided. Unable to process request.' };
    try {
        const response = await fetch(
            getPostRequestObj(
                `${getEndpoint(SERVICE_GATEWAY)}/service/${endpoint}/data`,
                token,
                {
                    inputParameters
                }
            ),
            { signal: controller.signal }
        );

        if (response.status === 403 || response.status == 401) {
            useAuthStore.getState().handleExpiredToken();
            return { error: response.status };
        }

        if (!response.ok) return response.status;

        return response.json();
    } catch (error) {
        return ({ error });
    } finally {
        clearTimeout(timeoutId);
    }
};

const searchCriteriaData = (criteria, parameters = []) => {
    const cleanCriteria = removeSearchAllMLSFlag(cloneDeep(criteria));
    return [
        {
            parameter: 'aergo_search_criteria',
            value: JSON.stringify(cleanCriteria)
        },
        ...parameters
    ];
};

export const getAgentInfoDetail = async (mlsId, agent) => {
    return await sendApiRequest(
        'Agent_information',
        [
            { parameter: 'mlsId', value: JSON.stringify(mlsId) },
            { parameter: 'agentId', value: agent }
        ]
    );
};

export const getOfficeInfoDetail = async (mlsId, office) => {
    return await sendApiRequest(
        'Office_information_details',
        [
            { parameter: 'mlsId', value: JSON.stringify(mlsId) },
            { parameter: 'officeId', value: office }
        ]
    );
};

/* SAVED SEARCHES */
export const saveSavedSearch = async (searchObj) => {
    const id = useCommonStore.getState()?.userInfo?.id;
    const modifiedSearchObj = !id ? searchObj : { ...searchObj, userId: id }
    return await sendApiRequest(
        'Save_Search',
        [
            { parameter: 'saved_search', value: JSON.stringify(modifiedSearchObj) }
        ]
    );
};

export const updateSavedSearch = async (searchObj) => {
    const id = useCommonStore.getState()?.userInfo?.id;
    const { savedSearch } = searchObj;
    const modifiedSearchObj = !id ? savedSearch : { ...savedSearch, userId: id }
    return await sendApiRequest(
        'Update_Search',
        [
            { parameter: 'id', value: `${searchObj.id}` },
            { parameter: 'saved_search', value: JSON.stringify(modifiedSearchObj) }
        ]
    );
};

export const deleteSavedSearch = async (id) => {
    return await sendApiRequest(
        'Delete_Search',
        [
            { parameter: 'id', value: `${id}` }
        ]
    );
};

/* MARKET AREA LISTS */
export const saveCustomArea = async (areaObj) => {
    const id = useCommonStore.getState()?.userInfo?.id;
    const modifiedAreaObj = !id ? areaObj : { ...areaObj, userId: id }
    return await sendApiRequest(
        'Save_Area',
        [
            { parameter: 'saved_area', value: JSON.stringify(modifiedAreaObj) }
        ]
    );
};

export const updateSavedMarketArea = async (areaObj, savedSearches) => {
    const id = useCommonStore.getState()?.userInfo?.id;
    const modifiedAreaObj = !id ? areaObj : { ...areaObj, userId: id }
    const updateObj = {
        sa: modifiedAreaObj,
        ss: savedSearches ? savedSearches : []
    };

    return await sendApiRequest(
        'Areas_update',
        [
            { parameter: 'id', value: `${areaObj.id}` },
            { parameter: 'area_update', value: `${JSON.stringify(updateObj)}` }
        ]
    );
};

export const getSearchesByAreaId = async (id) => {
    return await sendApiRequest(
        'Searches_by_areaid',
        [
            { parameter: 'id', value: `${id}` }
        ]
    );
};

export const deleteSavedMarketArea = async (id, savedSearches) => {
    const deleteObj = {
        ss: savedSearches
    };
    return await sendApiRequest(
        'Areas_delete',
        [
            { parameter: 'id', value: `${id}` },
            { parameter: 'ss', value: `${JSON.stringify(deleteObj)}` }
        ]
    );
};

/*OFFICE SAVE SEARCH*/

export const saveOfficeSearchList = async (officeListObj) => {
    const id = useCommonStore.getState()?.userInfo?.id;
    const modifiedOfficeListObj = !id ? officeListObj : { ...officeListObj, userId: id }
    return await sendApiRequest(
        'Save_office_list',
        [
            { parameter: 'mlsId', value: `${officeListObj.mlsId}` },
            { parameter: 'office_list', value: `${JSON.stringify(modifiedOfficeListObj)}` }
        ],
        20000
    );
};

export const updateSavedOfficeList = async (officeListObj) => {
    const id = useCommonStore.getState()?.userInfo?.id;
    const modifiedOfficeListObj = !id ? officeListObj : { ...officeListObj, userId: id }
    return await sendApiRequest(
        'OfficeList_update',
        [
            { parameter: 'officeList', value: `${JSON.stringify(modifiedOfficeListObj)}` }
        ]
    );
};

export const deleteSavedOfficeList = async (listId) => {
    return await sendApiRequest(
        'OfficeList_delete',
        [
            { parameter: 'id', value: `${listId}` }
        ]
    );
};

export const getSearchesByOfficeListId = async (listId) => {
    return await sendApiRequest(
        'searches_by_office_list_id',
        [
            { parameter: 'officeListId', value: `${listId}` }
        ]
    );
};

export const saveAgentSearchList = async (agentListObj) => {
    const id = useCommonStore.getState()?.userInfo?.id;
    const modifiedAgentListObj = !id ? agentListObj : { ...agentListObj, userId: id }
    return await sendApiRequest(
        'Save_agent_list',
        [
            { parameter: 'mlsId', value: `${agentListObj.mlsId}` },
            { parameter: 'agent_list', value: `${JSON.stringify(modifiedAgentListObj)}` }
        ]
    );
};

export const updateSavedAgentList = async (agentListObj) => {
    const id = useCommonStore.getState()?.userInfo?.id;
    const modifiedAgentListObj = !id ? agentListObj : { ...agentListObj, userId: id }
    return await sendApiRequest(
        'AgentList_update',
        [
            { parameter: 'agentList', value: `${JSON.stringify(modifiedAgentListObj)}` }
        ]
    );
};

export const getSearchesByAgentListId = async (listId) => {
    return await sendApiRequest(
        'searches_by_agent_list_id',
        [
            { parameter: 'agentListId', value: `${listId}` }
        ]
    );
};

export const getSearchesByAreaListId = async (listId) => {
    return await sendApiRequest(
        'searches_by_agent_list_id',
        [
            { parameter: 'agentListId', value: `${listId}` }
        ]
    );
};

export const deleteSavedAgentList = async (listId) => {
    return await sendApiRequest(
        'AgentList_delete',
        [
            { parameter: 'id', value: `${listId}` }
        ]
    );
};

export const getCoverageOfficeBreakdownList = async (areaId, searchCriteria) => {
    if (!searchCriteria) return;
    const aergoSearchCriteria = {
        criteria: {
            ...searchCriteria, realEstateDatasourceIdsWithFilters: [
                {
                    ...searchCriteria.realEstateDatasourceIdsWithFilters[0],
                    searchFields: [
                        {
                            fieldName: searchCriteria.realEstateDatasourceIdsWithFilters[0].computedFields.find(f =>
                                f.fieldName === 'areaType'
                            )?.fieldValues[0],
                            fieldValues: [areaId]
                        },
                        {
                            fieldName: 'propertyType',
                            fieldValues: searchCriteria.realEstateDatasourceIdsWithFilters[0].searchFields[0].fieldValues
                        }
                    ]
                }
            ]
        }
    };

    const inputParameters = [
        { parameter: 'aergo_search_criteria', value: `${JSON.stringify(aergoSearchCriteria)}` }
    ];
    return await sendApiRequest('Market_share_coverage_office_breakdown', inputParameters, 3000);
};

export const getOfficeBreakdownList = async (brokerageId, searchCriteria) => {

    if (!searchCriteria) return;

    const aergoSearchCriteria = { criteria: searchCriteria };

    const inputParameters = [
        { parameter: 'aergo_search_criteria', value: `${JSON.stringify(aergoSearchCriteria)}` },
        { parameter: 'brokerId', value: brokerageId }
    ];
    return await sendApiRequest('Broker_office_breakdown', inputParameters, 3000);
};

export const getCompSetOfficeBreakdownList = async (officesIdList, searchCriteria, isAllOther) => {
    if (!searchCriteria) return;

    const GET_ALL_OFFICES_NOT_COVERED_BY_OFFICE_GROUPS = 'isAllOther';
    const { realEstateDatasourceIdsWithFilters, timePeriod } = searchCriteria;
    const { realEstateDatasourceId, searchFields, computedFields } = realEstateDatasourceIdsWithFilters[0];
    const idFiltering = [{ idType: 'officeId', idValues: officesIdList }];
    const modifiedAergoSearchCriteria = {
        criteria: {
            realEstateDatasourceIdsWithFilters: [{
                realEstateDatasourceId,
                searchFields: [searchFields[0]],
                computedFields: [],
                idFiltering,
            }],
            timePeriod,
        },
    };
    const inputParameters = [
        { parameter: 'aergo_search_criteria', value: JSON.stringify(modifiedAergoSearchCriteria) },
        { parameter: computedFields[0]?.fieldName, value: computedFields[0]?.fieldValues[0] }
    ];
    if (isAllOther) inputParameters.push({parameter: GET_ALL_OFFICES_NOT_COVERED_BY_OFFICE_GROUPS, value: isAllOther.toString()});
    return await newSendApiRequest('Comparison_set_office_breakdown', inputParameters, 20000);
};

export const getListingBreakdown = async (officeId, searchCriteria, transactionStatus) => {
    if (!searchCriteria) return;
    const timePeriod = searchCriteria.timePeriod.intervalType;
    const aergoSearchCriteria = {
        criteria: {
            realEstateDatasourceIdsWithFilters: [{
                ...searchCriteria.realEstateDatasourceIdsWithFilters[0],
                ...searchCriteria.realEstateDatasourceIdsWithFilters[0].searchFields,
                computedFields: [
                    { fieldName: 'transactionStatus', fieldValues: [transactionStatus] }
                ]
            }],
            timePeriod: { intervalType: timePeriod }
        }
    };
    const inputParameters = [
        { parameter: 'aergo_search_criteria', value: `${JSON.stringify(aergoSearchCriteria)}` },
        { parameter: 'officeId', value: officeId }
    ];
    return await sendApiRequest('Office_listings', inputParameters, 20000);
};

export const getCoverageListingBreakdown = async (officeId, searchCriteria, transactionStatus, areaId) => {

    if (!searchCriteria) return;

    const aergoSearchCriteria = {
        criteria: {
            ...searchCriteria, realEstateDatasourceIdsWithFilters: [
                {
                    ...searchCriteria.realEstateDatasourceIdsWithFilters[0],
                    searchFields: [
                        {
                            fieldName: searchCriteria.realEstateDatasourceIdsWithFilters[0].computedFields.find(f =>
                                f.fieldName === 'areaType'
                            )?.fieldValues[0],
                            fieldValues: [areaId]
                        },
                        {
                            fieldName: 'propertyType',
                            fieldValues: searchCriteria.realEstateDatasourceIdsWithFilters[0].searchFields[0].fieldValues
                        }
                    ],
                    idFiltering: [
                        {
                            idType: 'officeId',
                            idValues: [officeId]
                        }
                    ],
                    computedFields: [
                        { fieldName: 'transactionStatus', fieldValues: [transactionStatus] }
                    ]
                }
            ]
        }
    };

    const inputParameters = [
        { parameter: 'aergo_search_criteria', value: `${JSON.stringify(aergoSearchCriteria)}` }
    ];
    return await sendApiRequest('Market_share_coverage_office_listings', inputParameters, 20000);
};

export const getBreakdownOfficeDetails = async (mlsId, officeId) => {
    return await sendApiRequest(
        'Office_information_details',
        [
            { parameter: 'mlsId', value: `${mlsId}` },
            { parameter: 'officeId', value: `${officeId}` }
        ]
    );
};

export const getListingDetailRequest = async (mlsNum, mlsId) => {
    return await sendApiRequest(
        'Listing_information_detail',
        [
            { parameter: 'mlsId', value: `${mlsId}` },
            { parameter: 'mlsNum', value: `${mlsNum}` }
        ]
    );
};

export const getListingHistoryRequest = async (mlsNum, mlsId) => {
    return await sendApiRequest(
        'Listing_information_history',
        [
            { parameter: 'mlsId', value: `${mlsId}` },
            { parameter: 'mlsNum', value: `${mlsNum}` }
        ]);
};

export const getAgentListingDetailDrillDown = async ({
                                                         agentId,
                                                         realEstateDatasourceId,
                                                         intervalType,
                                                         listingType
                                                     }) => {
    return await sendApiRequest(
        'Recruiting_agent_listing_detail_drilldown',
        [
            {
                parameter: 'aergo_search_criteria',
                value: JSON.stringify({
                    'criteria': {
                        'realEstateDatasourceIdsWithFilters': [
                            {
                                'realEstateDatasourceId': realEstateDatasourceId,
                                'searchFields': [],
                                'computedFields': []
                            }
                        ],
                        'timePeriod': {
                            'intervalType': `${intervalType}`
                        }
                    },
                    'offset': 0,
                    'size': 0
                })
            },
            {
                parameter: 'agentId',
                value: `${agentId}`
            },
            {
                parameter: 'transactionStatus',
                value: `${listingType}`
            }
        ]
    );
};

export const getAgentHistory = async ({ mlsId, agentId }) => {
    return await sendApiRequest(
        'Recruiting_agent_production',
        [
            { parameter: 'mlsId', value: `${mlsId}` },
            { parameter: 'agentId', value: `${agentId}` }
        ]
    );
};

export const getAgentInventoryHistory = async ({ agentId, mlsId }) => {
    return await sendApiRequest(
        'Recruiting_agent_inventory',
        [
            { parameter: 'mlsId', value: `${mlsId}` },
            { parameter: 'agentId', value: `${agentId}` }
        ]
    );
};

export const getAgentTransactionCoverage = async (criteria, agentId, areaType, statusType, timeInterval) => {
    let newCriteria = cloneDeep(criteria);
    newCriteria.realEstateDatasourceIdsWithFilters[0].searchFields = [];
    newCriteria.realEstateDatasourceIdsWithFilters[0].searchFields
        .push({ 'fieldName': `${areaType}`, 'fieldValues': [''] });

    // Date interval is not considered for A or C deal status types
    newCriteria.timePeriod = { intervalType: timeInterval };

    return await sendApiRequest(
        'Recruiting_coverage',
        searchCriteriaData({ criteria: newCriteria }, [
            { parameter: 'agentId', value: `${agentId}` },
            { parameter: 'statusCode', value: `${statusType}` }
        ])
    );
};

export const getAgentTransactionCoverageDrillDown = async ({
                                                               criteria,
                                                               agentId,
                                                               areaType,
                                                               areaName,
                                                               statusCode,
                                                               intervalType
                                                           }) => {
    let newCriteria = cloneDeep(criteria);
    newCriteria.realEstateDatasourceIdsWithFilters[0].searchFields = [];
    newCriteria.realEstateDatasourceIdsWithFilters[0].searchFields
        .push({ 'fieldName': `${areaType}`, 'fieldValues': [`${areaName}`] });
    // Date interval is not considered for A or C deal status types
    newCriteria.timePeriod = { intervalType: intervalType };

    return await sendApiRequest(
        'Recruiting_agent_listing_detail_drilldown',
        searchCriteriaData({ criteria: newCriteria }, [
            { parameter: 'agentId', value: `${agentId}` },
            { parameter: 'transactionStatus', value: `${statusCode}` }
        ])
    );
};

export const saveComparisonSet = async (comparisonSetName, userId, mlsId) => {
    return await sendApiRequest(
        'MlsObject_create',
        [
            { parameter: "ownerId", value: `${userId}` },
            { parameter: "ownerType", value: "userId" },
            { parameter: "objectType", value: "comparison_set" },
            { parameter: "mlsData", value: JSON.stringify({ groups: [], mlsId, name: comparisonSetName }) }
        ]
    );
};

export const updateComparisonSet = async (comparisonSet, groups) => {
    return await sendApiRequest(
        'MlsObject_update',
        [
            { parameter: "mlsObjectId", value: `${comparisonSet.id}` },
            { parameter: "objectType", value: "comparison_set" },
            { parameter: "mlsData", value: JSON.stringify({ groups, mlsId: comparisonSet.mlsId, name: comparisonSet.name }) }
        ]
    );
};

export const deleteComparisonSet = async (comparisonSet) => {
    return await sendApiRequest(
        'MlsObject_delete',
        [
            { parameter: "objectId", value: `${comparisonSet.id}` },
            { parameter: "objectType", value: "comparison_set" },
        ],
        30000
    );
};
