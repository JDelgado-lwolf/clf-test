import { listingTypes } from '../constants/index'

export const getCurrentListingType = (listingTypeId, listingStatuses, isComparisonSetView) => {
    if (!listingTypeId && !isComparisonSetView) {
        return listingStatuses.listingTypes.find(lt => lt.isDefault);
    }
    if (!listingTypeId && isComparisonSetView) {
        return listingStatuses.listingTypes.find(lt => lt.id === listingTypes.comparisonSet.id);
    }
    return listingStatuses.listingTypes.find(lt => lt.id === listingTypeId);
};
