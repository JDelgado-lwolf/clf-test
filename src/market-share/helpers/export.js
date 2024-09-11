import { csvExportDateFormat } from '../../agent-production/helpers/dataFormatters';
import { exportFilenameTemplates} from '../constants';
import { getScrubbedFilenameForExport } from '../../common/helpers/agGrid';
import { marketShareListingStatuses as listingStatuses } from '../../constants';

export const listingViewIds = {
    totalVolume: {
        exportLabel: listingStatuses.SoldBothSides
    },
    totalUnits: {
        exportLabel: listingStatuses.SoldBothSides
    },
    listVolume: {
        exportLabel: listingStatuses.SoldListSide
    },
    listUnits: {
        exportLabel: listingStatuses.SoldListSide
    },
    sellVolume: {
        exportLabel: listingStatuses.SoldSellSide
    },
    sellUnits: {
        exportLabel: listingStatuses.SoldSellSide
    },
    soldVolume: {
        exportLabel: listingStatuses.SoldSellSide
    },
    soldUnits: {
        exportLabel: listingStatuses.SoldSellSide
    },
    actVolume: {
        exportLabel: listingStatuses.ForSale
    },
    actUnits: {
        exportLabel: listingStatuses.ForSale
    },
    ucVolume: {
        exportLabel: listingStatuses.UnderContract
    },
    ucUnits: {
        exportLabel: listingStatuses.UnderContract
    },
    newListVolume: {
        exportLabel: listingStatuses.New
    },
    newListUnits: {
        exportLabel: listingStatuses.New
    },
};

export const fieldMarkers = Object.freeze({
    SEARCH_TYPE: 'SEARCH_TYPE',
    LISTING_STATUS_FILTER: 'LISTING_STATUS_FILTER',
    LISTING_TYPE: 'LISTING_TYPE',
    DATE: 'DATE',
    OWNER: 'OWNER'
});

export const getMarketDynamicsFileName = (listingView) => {
    const date = csvExportDateFormat(new Date());

    return exportFilenameTemplates.marketDynamicsSearch
        .replace(fieldMarkers.LISTING_VIEW, listingView)
        .replace(fieldMarkers.DATE, date);
};

export const getMarketShareFileName = (searchType, listingStatus, listingType) => {
    const date = csvExportDateFormat(new Date());

    if (listingType) {
        return exportFilenameTemplates.totals
            .replace(fieldMarkers.SEARCH_TYPE, searchType)
            .replace(fieldMarkers.LISTING_STATUS_FILTER, listingStatus)
            .replace(fieldMarkers.LISTING_TYPE, listingType)
            .replace(fieldMarkers.DATE, date);
    }
    return exportFilenameTemplates.coverage
        .replace(fieldMarkers.SEARCH_TYPE, searchType)
        .replace(fieldMarkers.LISTING_STATUS_FILTER, listingStatus)
        .replace(fieldMarkers.DATE, date);
};

export const getOfficeBreakdownFilename = ({ tableName, listingViewId, listingStatusTitle }) => {

    const listingType = listingViewId ? listingViewIds[listingViewId]?.exportLabel : listingStatusTitle;

    return exportFilenameTemplates.officeBreakdown
        .replace(fieldMarkers.OWNER, tableName)
        .replace(fieldMarkers.LISTING_TYPE, listingType);
};

export const getListingBreakdownFilename = (tableName, listingType) => {
    return exportFilenameTemplates.listingBreakdown
        .replace(fieldMarkers.OWNER, tableName)
        .replace(fieldMarkers.LISTING_TYPE, listingType);
};

export const exportTypes = Object.freeze({
    marketShareSearchResults: 'marketShareSearchResults',
    marketDynamicsSearchResults: 'marketDynamicsSearchResults',
    officesBreakdown: 'officesBreakdown',
    listingsBreakdown: 'listingsBreakdown'
});

export const getFilename = exportDetails => {
    const filename = {
        [exportTypes.marketDynamicsSearchResults]:
            getMarketDynamicsFileName(exportDetails.listingView),
        [exportTypes.marketShareSearchResults]:
            getMarketShareFileName(exportDetails.searchType, exportDetails.listingStatus, exportDetails.listingType),

        [exportTypes.officesBreakdown]:
            getOfficeBreakdownFilename(exportDetails),

        [exportTypes.listingsBreakdown]:
            getListingBreakdownFilename(exportDetails.tableName, exportDetails.listingBreakdownStatus)
    }[exportDetails.exportType];

    return getScrubbedFilenameForExport(filename);
};
