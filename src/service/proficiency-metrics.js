import { cloneDeep } from 'lodash-es';
import { sendApiRequest } from './service-gateway';
import { removeSearchAllMLSFlag } from '../common/helpers/api';

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

export const getProficiencyMetrics = async (criteria) => {
    const response = await sendApiRequest(
        'Recruiting_agent_sold',
        searchCriteriaData(criteria),
        120000
    );
    return {
        recruitingSoldResponse: response?.results,
        recruitingSoldTotals: response?.totals,
        error: response?.error
    };
};
