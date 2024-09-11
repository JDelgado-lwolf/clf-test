import * as _ from 'lodash-es';
import { areaSearchTypes, modules, searchTerms } from '../../constants';
import { useCommonStore } from '../../store/store';
import { getCoverageOffices, getOffices } from '../../service/mlsInfo';

export const hasRequiredCriteria = (search, module) => {
    let hasCriteria = false;
    const mlsId = search?.mlsId;
    if (mlsId) {
        const mls = _.find(search.searchCriteria.criteria?.realEstateDatasourceIdsWithFilters, (i) => i.realEstateDatasourceId === mlsId);
        if (mls) {
            const foundPropTypes = _.find(mls.searchFields, f => f.fieldName === 'propertyType');
            const foundMarketAreas = _.find(mls.searchFields, f => areaSearchTypes.includes(f.fieldName));
            const hasPropTypes = foundPropTypes ? !!foundPropTypes.fieldValues?.length : false;
            const hasTimePeriod = search.searchCriteria.criteria?.hasOwnProperty('timePeriod');
            const hasMarketAreas = foundMarketAreas
                ? !!foundMarketAreas?.fieldValues?.length
                : mls.searchAllMLS;
            const hasAreaType = _.find(mls.computedFields, f => f.fieldName === searchTerms.areaTypeFilter);
            const foundListingStatus = _.find(mls.computedFields, f => f.fieldName === searchTerms.transactionStatus);
            const hasListingStatus = foundListingStatus ? !!foundListingStatus.fieldValues?.length : false;
            const foundOffices = _.find(mls.idFiltering, f => f.idType === searchTerms.officeIdType);
            const hasOffices = foundOffices ? !!foundOffices.idValues?.length : false;
            const foundAgents = _.find(mls.idFiltering, f => f.idType === searchTerms.agentIdType);
            const hasAgents = foundAgents ? foundAgents.idValues?.length > 0 : false;
            switch (module) {
                case modules.proficiencyMetrics.transactions:
                    hasCriteria = !!hasPropTypes && !!hasTimePeriod && !!hasMarketAreas;
                    break;
                case modules.proficiencyMetrics.offices:
                    hasCriteria = !!hasTimePeriod && !!hasOffices;
                    break;
                case modules.proficiencyMetrics.agents:
                    hasCriteria = !!hasPropTypes && !!hasTimePeriod && !!hasAgents;
                    break;
                case modules.marketShare.totals:
                    hasCriteria = !!hasPropTypes && !!hasTimePeriod && !!hasMarketAreas && !!hasListingStatus;
                    break;
                case modules.marketShare.coverage:
                    hasCriteria = !!hasAreaType && !!hasPropTypes && !!hasTimePeriod && !!hasListingStatus && !!hasOffices;
                    break;
                case modules.marketDynamics.marketDynamics:
                    hasCriteria = !!hasMarketAreas && !!hasPropTypes && !!hasTimePeriod;
                    break;
                default:
                    hasCriteria = false;
                    break;
            }
        }
    }
    return hasCriteria;
};

export const popoverModifiers = {
    modifiers: {
        flip: {
            enabled: false
        }
    }
};

export const toggleRunSearchButton = (menuIsOpen) => {
    useCommonStore.getState().toggleMenuIsOpen(menuIsOpen);
};

export const getOfficesByModule = (searchMlsId) => Object.freeze({
    [modules.proficiencyMetrics.offices]: async () => await getOffices(searchMlsId),
    [modules.marketShare.coverage]: async () => await getCoverageOffices(searchMlsId),
});
