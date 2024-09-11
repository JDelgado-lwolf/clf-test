import { listingViews } from './listingViews';
import { coverageListingViews } from './coverageListingViews';
import { marketShareListingStatuses, modules } from '../../constants';
import { listingTypes, searchTypes } from './index';

export const listingStatuses = Object.freeze({

    [marketShareListingStatuses.SoldBothSides]: {
        listingTypes: [
            { ...listingTypes.byOffice, isDefault: true },
            listingTypes.byBrokerage,
            listingTypes.comparisonSet
        ],
        listingViews: [
            { ...listingViews.total$Volume, isDefault: true },
            { ...listingViews.totalNumUnits },
            { ...listingViews.listSide$Volume },
            { ...listingViews.listSideNumUnits },
            { ...listingViews.sellSide$Volume },
            { ...listingViews.sellSideNumUnits }
        ]
    },
    [marketShareListingStatuses.ForSale]: {
        listingTypes: [
            { ...listingTypes.byOffice, isDefault: true },
            listingTypes.byBrokerage,
            listingTypes.comparisonSet
        ],
        listingViews: [
            { ...listingViews.forSale$Volume, isDefault: true },
            { ...listingViews.forSaleNumUnits }
        ]
    },
    [marketShareListingStatuses.UnderContract]: {
        listingTypes: [
            { ...listingTypes.byOffice, isDefault: true },
            listingTypes.byBrokerage,
            listingTypes.comparisonSet
        ],
        listingViews: [
            { ...listingViews.underContract$Volume, isDefault: true },
            { ...listingViews.underContractNumUnits }
        ]
    },
    [marketShareListingStatuses.New]: {
        listingTypes: [
            { ...listingTypes.byOffice, isDefault: true },
            listingTypes.byBrokerage,
            listingTypes.comparisonSet
        ],
        listingViews: [
            { ...listingViews.newListing$Volume, isDefault: true },
            { ...listingViews.newListingNumUnits }
        ]
    },
    [marketShareListingStatuses.SoldListSide]: {
        listingTypes: [
            { ...listingTypes.byOffice, isDefault: true },
            listingTypes.byBrokerage,
            listingTypes.comparisonSet
        ],
        listingViews: [
            { ...listingViews.listSide$Volume, isDefault: true },
            { ...listingViews.listSideNumUnits }
        ]
    },
    [marketShareListingStatuses.SoldSellSide]: {
        listingTypes: [
            { ...listingTypes.byOffice, isDefault: true },
            listingTypes.byBrokerage,
            listingTypes.comparisonSet
        ],
        listingViews: [
            { ...listingViews.sellSide$Volume, isDefault: true },
            { ...listingViews.sellSideNumUnits }
        ]
    }
});

export const coverageListingStatuses = Object.freeze({
    [marketShareListingStatuses.SoldBothSides]: {
        coverageListingViews: [
            { ...coverageListingViews.total$Volume, isDefault: true },
            { ...coverageListingViews.totalNumUnits },
            { ...coverageListingViews.listSide$Volume },
            { ...coverageListingViews.listSideNumUnits },
            { ...coverageListingViews.sellSide$Volume },
            { ...coverageListingViews.sellSideNumUnits }
        ]
    },
    [marketShareListingStatuses.ForSale]: {
        coverageListingViews: [
            { ...coverageListingViews.forSale$Volume, isDefault: true },
            { ...coverageListingViews.forSaleNumUnits }
        ]
    }
});

export const getListingStatusForSearchType = searchType => {
    return marketShareListingStatuses[searchTypes[searchType]];
};

export const getFullListingStatusDetails = (listingStatuses, listingStatusId, module) => {
    if (module === modules.marketShare.totals) {
        return listingStatuses[listingStatusId];
    }
    return coverageListingStatuses[listingStatusId];
};
