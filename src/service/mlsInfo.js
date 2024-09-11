import { newSendApiRequest, sendApiRequest } from './service-gateway';
import { areaRequestTypes } from '../constants';

export const getAgentInfo = async (agentList) => {
    return await sendApiRequest(
        'Agent_info',
        [
            { parameter: 'agentList', value: JSON.stringify(agentList) }
        ]
    );
};

export const getOfficeInfo = async (officeList) => {
    return await sendApiRequest(
        'Office_info',
        [
            { parameter: 'officeList', value: JSON.stringify(officeList) }
        ],
        5000
    );
};

export const getMlsMembership = async (mlsIdList) => {
    return await sendApiRequest(
        'Multiple_MLS_info',
        [
            { parameter: 'mlsId_list', value: `[${mlsIdList}]` }
        ]
    );
};

export const getPropertyTypes = async (mlsId) => {
    return await sendApiRequest(
        'Mls_property_types',
        [
            { parameter: 'mlsId', value: `${mlsId}` }
        ],
        5000
    );
};

export const getAreasMap = async (mlsId) => {
    const response = await sendApiRequest(
        'MLS_areas_map',
        [
            { parameter: 'mlsId', value: `${mlsId}` }
        ],
        5000
    );

    if (response.error) return response;
    let mappedAreas = {};
    //TODO: implement combinedServices call here
    await Promise.all(
        response.map(async mappedArea => {
            const areasByType = await getAreasByType(mlsId, areaRequestTypes[mappedArea.columnName]);
            if (!areasByType.error) {
                mappedAreas[areaRequestTypes[mappedArea.columnName]] = {
                    ...mappedArea,
                    mappedAreas: areasByType
                };
            }
        })
    );

    return mappedAreas;
};

export const getAreasByType = async (mlsId, areaType) => {
    return await sendApiRequest(
        'MLS_areas',
        [
            { parameter: 'mlsId', value: `${mlsId}` },
            { parameter: 'areaType', value: `${areaType}` }
        ]
    );
};

export const getOffices = async (mlsId) => {
    return await newSendApiRequest(
        'Get_mls_offices',
        [
            { parameter: 'mlsId', value: `${mlsId}` }
        ],
        20000
    );
};

export const getCoverageOffices = async (mlsId) => {
    return await newSendApiRequest(
        'Get_coverage_offices',
        [
            { parameter: 'mlsId', value: `${mlsId}` }
        ],
        20000
    );
};

export const getMlsAgents = async (mlsId, searchFields) => {
    return await sendApiRequest(
        'Get_mls_agents',
        [
            { parameter: 'mlsId', value: `${mlsId}` },
            { parameter: 'searchFields', value: `${JSON.stringify(searchFields)}` }
        ],
        20000
    );
};

/*AGENTS LIST*/
export const getMlsAgentsByIds = async (mlsId, agentIds) => {
    return await sendApiRequest(
        'Get_mls_agents_by_ids',
        [
            { parameter: 'mlsId', value: `${mlsId}` },
            { parameter: 'agentIds', value: `${JSON.stringify(agentIds)}` }
        ],
        10000
    );
};

