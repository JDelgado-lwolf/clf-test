import { useRef, useEffect } from 'react';
import { useQuery } from '../../common/hooks/location';
import { agentProductionTerms, modules } from '../../constants';
import { marketShareTerms as t, EXCLUDED_ROWS } from '../constants';
import { marketShareColumns } from '../constants/marketShareColumns';
import { listingViews } from '../constants/listingViews';

export const getListingTypes = (listingTypes, defaultType) => {

    const revisedListingTypes = [];

    for (const key in listingTypes) {

        const listingType = listingTypes[key];

        revisedListingTypes.push({
            label: listingType.label,
            id: listingType.id,
            isDefault: listingType.id === defaultType.id
        });
    }
    return revisedListingTypes;
};

export const getSum = (objects, fieldToSum) => {
    if (!objects) {
        return 0;
    }
    const result = objects?.reduce((sum, row) => {
        if (!row[fieldToSum]) return sum;
        return sum + row[fieldToSum];
    }, 0);
    return result
};

export const getSortedObjects = (objects, propertyToSort) => {
    return [...objects].sort((a, b) => (b[propertyToSort] > a[propertyToSort]) ? 1 : -1);
};

export const getSortedObjectByProp = (object, propertyToSort, order = 'ASC') => {
    return [...object].sort((a, b) => {
        if (order === 'ASC') {
            return (a[propertyToSort] > b[propertyToSort]) ? 1 : (a[propertyToSort] < b[propertyToSort]) ? -1 : 0;
        } else if (order === 'DESC') {
            return (a[propertyToSort] < b[propertyToSort]) ? 1 : (a[propertyToSort] > b[propertyToSort]) ? -1 : 0;
        }
    });
};

export const getSortedObjectsNumeric = (objects, propertyToSort) => {
    return [...objects].sort((a, b) => {

        let aValue = a[propertyToSort], bValue = b[propertyToSort];
        const LARGE_NEGATIVE_INTEGER = -99999999999;
        const LARGER_NEGATIVE_INTEGER = -999999999999;

        if (aValue === undefined) aValue = LARGER_NEGATIVE_INTEGER;
        if (bValue === undefined) bValue = LARGER_NEGATIVE_INTEGER;
        if (aValue === null) aValue = LARGE_NEGATIVE_INTEGER;
        if (bValue === null) bValue = LARGE_NEGATIVE_INTEGER;

        return bValue - aValue;
    });
};

export const MAX_COUNT_SELECTED_ROWS = 10;

const calculateClr = (isCoverageSearch, row) => {
    if (isCoverageSearch) {
        if (row?.listed === 0) return null;
        return row?.listUnits / row?.listed;
    }
    return row?.clr ? row?.clr : row?.listUnits / row?.listedUnits;
};

export const transformData = (rows, stats, columnToRankBy, isCoverageSearch) => {
    const sumOfColumnRows = stats.sumOfColumn;
    if (!sumOfColumnRows ||
        !rows) return rows;
    const revisedRows = getSortedObjectsNumeric(rows, columnToRankBy);

    for (let i = 0; i < revisedRows.length; i++) {

        const row = revisedRows[i];
        const marketSharePct = row[columnToRankBy] / sumOfColumnRows * 100;
        const rank = i + 1;
        const isSelected = rank <= MAX_COUNT_SELECTED_ROWS && !EXCLUDED_ROWS.includes(row.groupName);
        if (isCoverageSearch) {
            row.listSpop = row?.listSpop ? row.listSpop * 100 : (row?.listVolume / row?.listOrgPrice) * 100;
            row.sellSpop = row?.sellSpop ? row.sellSpop * 100 : (row?.sellVolume / row?.sellOrgPrice) * 100;
            row.unitSharePct = row[marketShareColumns.forSaleUnits.id] / stats?.sumOfUnitsColumn * 100;
            row.volumeSharePct = row[marketShareColumns.forSaleVolume.id] / stats?.sumOfVolumeColumn * 100;
            row.area = row?.area || agentProductionTerms.notSuppliedByMls;
        }
        row.clr = calculateClr(isCoverageSearch, row);
        row.marketSharePct = marketSharePct;
        row.isSelected = isSelected;
        row.rank = rank;
    }
    return revisedRows;
};

export const getRowCount = rows => rows?.length || 0;

export const getDataStats = (data, listingType, listingView) => {
    const dataRows = data[listingType.collectionKey];
    const rowCount = getRowCount(dataRows);
    const sumOfColumn = getSum(dataRows, listingView.keyField);

    return {
        rowCount,
        sumOfColumn
    };
};

export const getCoverageDataStats = (data, listingView) => {
    const rowCount = getRowCount(data);
    const sumOfColumn = getSum(data, listingView.keyField);
    let sumOfUnitsColumn = 0;
    let sumOfVolumeColumn = 0;
    if (listingView.id === listingViews.forSale$Volume.id) {
        sumOfUnitsColumn = getSum(data, marketShareColumns.forSaleUnits.id);
    }
    if (listingView.id === listingViews.forSaleNumUnits.id) {
        sumOfVolumeColumn = getSum(data, marketShareColumns.forSaleVolume.id);
    }
    return {
        rowCount,
        sumOfColumn,
        sumOfUnitsColumn,
        sumOfVolumeColumn
    };
};

export const getRevisedColumns = (listingView, listingType) => {
    return listingView.settings[listingType.id].columns.map(column => {
        return {
            ...column,
            sort: column.field === listingView.keyField ? 'desc' : ''
        };
    });
};

export const getSortedColumns = (columns, listingViewId, sortDirection) => {
    return columns?.map(column => {
        return {
            ...column,
            sort: column.field === listingViewId ? sortDirection || 'desc' : ''
        };
    });
};

export const getRevisedCoverageColumns = (listingView) => {
    return listingView.settings.columns.map(column => {
        return {
            ...column,
            sort: column.field === listingView.keyField ? 'desc' : ''
        };
    });
};

export const getSearchType = (module) => module === modules.marketShare.totals ? t.totals : t.coverage;

export const getChart = (listingType, listingViews, listingView) => {
    return {
        yAxisLabelMapper: listingType.yAxisLabelMapper,
        dataPointGroups: listingViews.find(lv => lv.id === listingView.id)?.dataPointGroups,
        xAxisLabelFormatter: listingView.xAxisLabelFormatter,
        popOverDataFormatter: listingView.popOverDataFormatter,
        popOverLabels: listingView.popOverLabels
    };
};

export const usePreviousState = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

export const getCoverageChart = (listingViews, listingView) => {
    return {
        yAxisLabelMapper: d => d['area'],
        dataPointGroups: listingViews.find(lv => lv.id === listingView.id)?.dataPointGroups,
        xAxisLabelFormatter: listingView.xAxisLabelFormatter,
        popOverDataFormatter: listingView.popOverDataFormatter,
        popOverLabels: listingView.popOverLabels
    };
};

export const uriEncode = value => encodeURIComponent(value);

export const useURIDecoder = paramName => {
    const query = useQuery();
    const value = query.get(paramName);

    return value === 'null'
        ? ''
        : decodeURIComponent(value?.replace(/%(?![0-9][0-9a-fA-F]+)/g, '%25'));
};

export const getTooltipContent = ( series, dataPointIndex, graphInfo, barColors, config ) => {
    const tooltipHeader = graphInfo.globals.labels[dataPointIndex];
    if (series.length > 1) {
        const series1 = series[0][dataPointIndex];
        const series2 = series[1][dataPointIndex];
        return `<div class='arrow_box volume-chart-tooltip'>
        <div class='header'>
            ${tooltipHeader}
        </div>
        <div class='body'>
            <div class='items'>
                <span class='bullet' style='background-color: ${barColors[0]}'></span>
                    ${config?.popOverLabels[0]}: ${config?.popOverDataFormatter(series1)} <br />
                    <span class='bullet' style='background-color: ${barColors[1]}'></span>
                    ${config?.popOverLabels[1]}: ${config?.popOverDataFormatter(series2)}
            </div>
            <div class='total font-weight-bold'>
                ${agentProductionTerms.totalSum}: ${config?.popOverDataFormatter(series2 + series1)}</div>
            </div>
        </div>`;
    }

    const series1 = series[0][dataPointIndex];
    return `<div class='arrow_box volume-chart-tooltip'>
    <div class='header'>
        ${tooltipHeader}
    </div>
    <div class='body'>
        <div class='items'>
            <span class='bullet' style='background-color: ${barColors[0]}'></span>
                ${config?.popOverLabels[0]}: ${config?.popOverDataFormatter(series1)} <br />
        </div>
        </div>
    </div>`;
};
