import { marketShareListingStatuses } from '../../constants';
import {
    getListingTypes,
    getSearchType,
    getDataStats,
    getChart,
    getCoverageChart,
    getRevisedColumns,
    getRevisedCoverageColumns,
    getCoverageDataStats,
    getSum
} from './helpers';

import { getFullListingStatusDetails, listingStatuses, coverageListingStatuses } from '../constants/listingStatuses';
import { getCurrentListingType } from '../constants/listingTypes';
import { getCurrentListingView } from '../constants/listingViews';
import { coverageTransforms } from '../constants';

export const getConfig = ({ listingStatus, data, listingTypeId, listingViewId, module, isComparisonSetView }) => {
    if (listingStatus === marketShareListingStatuses.SoldBothSides
        || listingStatus === marketShareListingStatuses.New
        || listingStatus === marketShareListingStatuses.UnderContract
        || listingStatus === marketShareListingStatuses.ForSale
        || listingStatus === marketShareListingStatuses.SoldListSide
        || listingStatus === marketShareListingStatuses.SoldSellSide) {
        const currentListingStatus = getFullListingStatusDetails(listingStatuses, listingStatus, module);
        const listingType = getCurrentListingType(listingTypeId, currentListingStatus, isComparisonSetView);
        const listingTypesTemp = getListingTypes(currentListingStatus.listingTypes, listingType);
        const searchType = getSearchType(module);
        const listingView = getCurrentListingView(listingViewId, currentListingStatus.listingViews);
        const stats = getDataStats(data, listingType, listingView);
        const chart = getChart(listingType, currentListingStatus.listingViews, listingView);
        const tableSettingsColumns = getRevisedColumns(listingView, listingType);
        const transformData = listingType.getTransformData(stats, listingView.keyField);
        const sumOfColumns = { 
            byOffice: getSum(data.offices, listingView.keyField),
            byBrokerage: getSum(data.brokers, listingView.keyField),
            comparisonSet: getSum(data.comparisonSetData, listingView.keyField)
        };

        return {
            rowCount: stats.rowCount,
            searchType,
            rank: listingView.label,
            listingTypes: listingTypesTemp,
            listingViews: currentListingStatus.listingViews,
            chart,
            showHideOptions: listingView.settings[listingType.id].showHideOptions,
            tableSettings: { columns: tableSettingsColumns },
            dataTransforms: [transformData],
            sumOfColumns
        };
    }
    return null;
};

export const getCoverageConfig = ({ listingStatus, listingViewId, data, module }) => {
    if (listingStatus === marketShareListingStatuses.SoldBothSides
        || listingStatus === marketShareListingStatuses.ForSale) {
        const currentListingStatus = getFullListingStatusDetails(coverageListingStatuses, listingStatus, module);
        const rowCount = data?.length || 0;
        const listingView = getCurrentListingView(listingViewId, currentListingStatus.coverageListingViews);
        const stats = getCoverageDataStats(data, listingView);
        const chart = getCoverageChart(currentListingStatus.coverageListingViews, listingView);
        const searchType = getSearchType(module);
        const tableSettingsColumns = getRevisedCoverageColumns(listingView);
        const transformData = coverageTransforms.getTransformData(stats, listingView.keyField);

        return {
            sumOfColumn: stats.sumOfColumn,
            rowCount,
            searchType,
            rank: listingView.label,
            listingViews: currentListingStatus.coverageListingViews,
            chart,
            showHideOptions: listingView.settings.showHideOptions,
            tableSettings: { columns: tableSettingsColumns },
            dataTransforms: [transformData]
        };
    }
    return null;
};
