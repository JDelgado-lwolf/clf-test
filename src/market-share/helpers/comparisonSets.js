import { getFilteredListByKeyField } from "../../common/helpers/chips";
import { filterItemByKeyfieldValue } from "../../common/helpers/utilities";
import { marketShareTerms, searchTerms } from "../../constants";

export const NAME_MAX_LENGTH = 55;

export const buildInitialAvailableOffices = (selectedComparisonSet, selectedComparisonSetOfficesList) => {
    const takenOfficeIds = selectedComparisonSet?.groups?.reduce((officeIds, group) => {
        return [...officeIds, ...group.offices.map(office => office.officeId)];
    }, []);
    return selectedComparisonSetOfficesList?.filter(office => !takenOfficeIds.includes(office.officeId));
};

export const getComparisonSetParams = (receivedCriteria, selectedComparisonSet) => {
    const criteria = receivedCriteria.realEstateDatasourceIdsWithFilters[0];
    const revisedSearchFields = filterItemByKeyfieldValue(criteria.searchFields, 'fieldName', searchTerms.comparisonSetFilter);
    const groups = selectedComparisonSet?.groups;
    if (!groups) return [];
    const transactionStatus = criteria.computedFields[0].fieldValues[0];
    const searchCriteria = {
        criteria: {
            ...receivedCriteria,
            realEstateDatasourceIdsWithFilters: [
                {
                    ...receivedCriteria.realEstateDatasourceIdsWithFilters[0],
                    searchFields: revisedSearchFields
                }
            ]
        }
    };
    return {
        params: { comparisonSet: groups, search: searchCriteria },
        transactionStatus
    };
};

export const getCompSetsByMLsWithOfficeGroup = (comparisonSets, selectedMls) => {
    const comparisonSetsByMls = getFilteredListByKeyField(
        comparisonSets,
        marketShareTerms.comparisonSetMlsIdField,
        selectedMls?.mlsId
    );
    return comparisonSetsByMls?.filter(comparisonSet => comparisonSet?.groups.length > 0) ?? [];
};

export const getMlsToSet = (mlsList, selectedComparisonSet) => {
    return mlsList?.filter(mls => mls?.mlsId === selectedComparisonSet?.mlsId)
    .map(mls => ({label: `(${mls?.shortDescription}) ${mls?.longDescription}`, value: mls}))[0];
};
