import { marketShareListingStatuses, marketShareListingStatusesCoverage } from '../../constants/index';
import { modules } from '../../constants';

export const getListingStatus = (module, searchCriteria) => {
    const selectedListingStatus = searchCriteria?.realEstateDatasourceIdsWithFilters[0].computedFields.find(
        field => field.fieldName === 'transactionStatus')?.fieldValues[0];
    const listingStatuses = module === modules.marketShare.totals
        ? marketShareListingStatuses
        : marketShareListingStatusesCoverage;
    return listingStatuses[selectedListingStatus];
};
