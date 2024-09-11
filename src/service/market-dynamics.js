import { cloneDeep } from "lodash-es";
import { removeSearchAllMLSFlag } from "../common/helpers/api";
import { newSendApiRequest } from "./service-gateway";

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

export const getMarketDynamicsSearch = async (criteria) => {
    return await newSendApiRequest(
        'Market_dynamics',
        searchCriteriaData(criteria),
        90000
    );
};

export const getMarketDynamicsOfficeBreakdown = async (searchCriteria) => {
    return await newSendApiRequest(
        'Market_dynamics_office_breakdown',
        [
            { parameter: 'aergo_search_criteria', value: `${JSON.stringify(searchCriteria)}` }
        ],
        120000
    );
};
