import React from "react";
import { terms } from "../constants";
import { listingViews as lv } from "../constants/listingViews";
import { dayFirstDateFormat, quarterNumYearFormat, shortMonthAndShortYearFormat } from "../../agent-production/helpers/dataFormatters";
import { getISOWeek } from "date-fns";
import CustomHeaderKeyInfo from "../../common/components/table/agGrid/CustomHeaderKeyInfo";
import { marketDynamicsColumns as mdCols } from '../constants/marketDynamicsColumns';
import { periodKeys } from "../constants";
import { getTrendAnalysis } from "./trendAnalysis";
import { useMarketDynamicsStore } from "../../store/marketDynamics/store";
import { views } from "../../agent-production/constants/savedAgents";
import { agentProductionTerms, searchTerms } from "../../constants";
import { agentsColumns } from "../../agent-production/constants/agentProductionConstants";

export const hasAllZeroValues = (data, keysToDisregard) => {
    return data?.every(obj => {
        for (let key in obj) {
            if (!keysToDisregard.includes(key)) {
                if (typeof obj[key] === 'number' && !isNaN(obj[key]) && obj[key] !== 0) {
                    return false;
                }
            }
        }
        return true;
    });
};

export const getConfigData = (listing, config) => {
    let listingConfig, groupConfig;
    config?.find((item) => {
        groupConfig = item;
        listingConfig = item.options.find((option) => option.value === listing);
        return listingConfig;
    });
    return { listingConfig, groupConfig };
};

const calculatePercentChange = (start, end) => {
    if (start === 0) return 0;
    return Math.abs(((end - start) / start)) * 100;
};

export const getTransformData = (searchResults) => {
    return searchResults?.map(searchResult => {
        const { forSaleUnits, forSaleLastDayUnits } = searchResult;
        return {
            ...searchResult,
            forSaleLastDayChangeVolume: forSaleUnits - forSaleLastDayUnits,
            forSaleLastDayPercentage: calculatePercentChange(forSaleUnits, forSaleLastDayUnits)
        };
    });
};

export const getTransformKeyFields = (options, listingViewId) => {
    if (listingViewId !== lv.cdomBreakout.value) return options;
    const checkedWithRadio = options?.find(obj => obj?.checked && obj?.isRadio);
    if (!checkedWithRadio) return [];

    const revisedOptions = [];

    options.forEach(obj => {
        if (obj?.checked && !obj?.isRadio) {
            revisedOptions.push({
                ...obj,
                keyField: checkedWithRadio.keyField + obj.keyFieldComplement,
                keyInfoLabel: `${checkedWithRadio.label} ${obj.label} ${terms.cdom}`
            });
        } else {
            revisedOptions.push({ ...obj });
        }
    });

    return revisedOptions;
};

export const getChartTooltipContent = (data, series, dataPointIndex, barColors, config) => {
    const checkedStatusOptions = useMarketDynamicsStore.getState().checkedStatusOptions;
    const tooltipHeadersByPeriod = {
        [terms.weekOf]: `Week ${getISOWeek(new Date(data[dataPointIndex].timePeriodStart))} <br />
            ${dayFirstDateFormat(data[dataPointIndex].timePeriodStart)} - ${dayFirstDateFormat(data[dataPointIndex].timePeriodEnd)}`,
        [terms.month]: shortMonthAndShortYearFormat(data[dataPointIndex].timePeriodStart),
        [terms.quarter]: quarterNumYearFormat(data[dataPointIndex].timePeriodStart)
    };

    const tooltipHeader = tooltipHeadersByPeriod[config.groupConfig.columnSettings.label];

    const popOverDataFormatter = config?.listingConfig?.chart?.popOverDataFormatter;
    if (!popOverDataFormatter) return `<div />`;

    const tooltipBody = checkedStatusOptions.map((option, index) =>
        `<span class='bullet' style='background-color: ${barColors[index]}'}></span>
                ${option?.label}: ${popOverDataFormatter(series[index][dataPointIndex])} <br />`
    );

    return `<div class='arrow_box volume-chart-tooltip'>
                <div class='header'>
                    ${tooltipHeader}
                </div>
                <div class='body'>
                <div class='items'>
                    ${tooltipBody.join('')}
                </div>
                </div>
            </div>`;
};

export const getHeaderAndTooltip = (baseTooltip, ...params) => {
    if (typeof baseTooltip?.tip !== "function") {
        const headerDetails = {
            ...baseTooltip,
            tip: baseTooltip?.tip
        };
        return { titleWithTooltip: <CustomHeaderKeyInfo isStatus={baseTooltip.label === mdCols.status.label} headerDetails={headerDetails} /> };
    }

    const tooltip = baseTooltip.tip(...params);

    const headerDetails = {
        ...baseTooltip,
        tip: tooltip
    };

    return { titleWithTooltip: <CustomHeaderKeyInfo isStatus={baseTooltip.label === mdCols.status.label} headerDetails={headerDetails} /> };
};

const getPercentageChange = (changeVolume, beginValue) => {
    if (changeVolume.data === 0) return '0';
    if (!beginValue) return '';
    return changeVolume.data / beginValue;
};

const getAvg = (data, keyField) => {
    const dataForAvg = data?.map((x) => x[keyField]).filter((x) => x !== undefined);
    return dataForAvg?.reduce((acc, curr) => acc + curr, 0) / dataForAvg?.length;
};

const getChange = (beginValue, endValue, formatter) => {
    if (!endValue || !beginValue) return '';
    return {
        formatter,
        data: endValue - beginValue
    };
};

const getCleanedValue = (value) => value && parseFloat(value.replace(/[$,%]/g, ''));

export const getQuarterlyOrMonthlyData = ({ selectedPeriodComparison, beginPeriodData, endPeriodData, searchResults,
    featureToggles, id, statusLabel, keyField, formatter, changeFormatter
}) => {

    if (selectedPeriodComparison === periodKeys.wholeTimePeriod) {
        if (beginPeriodData && endPeriodData) {
            const filteredSearchResults = searchResults?.filter(searchResult => new Date(searchResult.timePeriodStart)
                >= new Date(beginPeriodData?.timePeriodStart)
                && new Date(searchResult.timePeriodStart) <= new Date(endPeriodData?.timePeriodStart));
            return getTrendAnalysis({ filteredSearchResults, id, statusLabel, keyField, featureToggles, formatter });
        }
    }
    const endValue = formatter(endPeriodData?.[keyField]) ?? 0;
    const beginValue = formatter(beginPeriodData?.[keyField]) ?? 0;
    const changeValue = getChange(getCleanedValue(beginValue), getCleanedValue(endValue), changeFormatter);
    const changeValuePercentage = getPercentageChange(changeValue, getCleanedValue(beginValue));
    return {
        id,
        status: statusLabel,
        beginPeriodValue: beginValue,
        endPeriodValue: endValue,
        changeValue,
        changeValuePercentage
    };
};

export const getWeeklyData = (formatter, previousWeeksData, lastWeeksData, keyField, changeFormatter, id, label) => {

    const previousWeeksAvg = formatter(getAvg(previousWeeksData, keyField));
    const lastWeeksAvg = formatter(getAvg(lastWeeksData, keyField));
    const changeAvg = getChange(getCleanedValue(previousWeeksAvg), getCleanedValue(lastWeeksAvg), changeFormatter);
    const changeAvgPercentage = getPercentageChange(changeAvg, getCleanedValue(previousWeeksAvg));
    return {
        id,
        status: label,
        previousWeeksAvg,
        lastWeeksAvg,
        changeAvg,
        changeAvgPercentage
    };
};

export const getBreakdownPinnedRowColumns = (columns) => {
    return columns.map(col => {
        if (col.col.id === mdCols.timePeriodStart.id) return mdCols.officeName.id;
        return col.col?.keyField || col.col.id;
    });
};

const viewsToReplaceAgentName = [
    views.overview,
    views.listingProficiency
];

const viewsToReplaceOfficeName = [
    lv.medianPrice.value,
    lv.soldAvgVsMedianPrice.value,
    lv.avg$Sqft.value,
    lv.avgSpOpComparison.value,
    lv.avgSpLpComparison.value,
    lv.avgSpOpAllProperties.value
];

export const getPinnedRowTitle = (view) => {
    if (viewsToReplaceAgentName.includes(view)) return {[agentsColumns.agentName.id]: agentProductionTerms.summary};
    if (viewsToReplaceOfficeName.includes(view)) return {[agentsColumns.officeName.id]: searchTerms.totals};
    return {};
};
