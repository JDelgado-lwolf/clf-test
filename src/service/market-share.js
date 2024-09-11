import { cloneDeep } from 'lodash-es';
import { removeSearchAllMLSFlag } from '../common/helpers/api';
import { sendApiRequest } from './service-gateway';
import { getComparisonSetParams } from '../market-share/helpers/comparisonSets';
import { useComparisonSetsStore } from '../store/comparisonSets/store';

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

export const getTotalsOfficeSearch = async (criteria) => {
    return await sendApiRequest(
        'Market_share_office_search',
        searchCriteriaData(criteria),
        60000
    );
};

export const getTotalsBrokerSearch = async (criteria) => {
    return await sendApiRequest(
        'Market_share_broker_search',
        searchCriteriaData(criteria),
        60000
    );
};

export const getCoverageSearch = async (criteria) => {
    return await sendApiRequest(
        'Market_share_coverage',
        searchCriteriaData(criteria),
        60000
    );
};

export const getComparisonSetResults = async (receivedCriteria) => {
    const criteria = receivedCriteria.realEstateDatasourceIdsWithFilters[0];
    const comparisonSetIdFromCriteria = criteria?.mlsObjectId;
    const selectedComparisonSet = useComparisonSetsStore.getState().
        comparisonSets?.list.find(cs => cs.id === comparisonSetIdFromCriteria);

    const { params, transactionStatus } = getComparisonSetParams(receivedCriteria, selectedComparisonSet);
    if (!params.comparisonSet.length) return [];
    const inputParameters = [
        {
            parameter: 'comparisonSetParams',
            value: JSON.stringify(params)
        },
        {
            parameter: 'transactionStatus',
            value: transactionStatus
        }
    ];
    return await sendApiRequest(
        'Market_share_comparison_sets',
        inputParameters
    );
};
