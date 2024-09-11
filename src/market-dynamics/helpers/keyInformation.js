import { marketDynamicsTerms as mdt } from '../../constants';
import { marketDynamicsTimePeriods as tp } from '../../constants';
import { terms as t, periodKeys as key, marketDynamicsColors as colors } from '../constants';
import {
    blankEmptyFormatPercentage,
    formatVolume,
    getQuarterFormatted,
    longQuarterNumberAndYear,
    monthAndYearFormat,
    quarterNumberAndYear
} from '../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../constants/marketDynamicsColumns';
import { listingViews as lv } from '../constants/listingViews';
import { marketDynamicsTooltips } from '../constants/tooltipDefinitions.js';
import { getHeaderAndTooltip } from './helpers.js';
import { getQuarterlyOrMonthlyData, getWeeklyData } from './helpers.js';

export const findDataByDate = (data, date) => {
    return data?.find((obj) => obj.timePeriodStart === date);
};

const filterDataByCheckedOptions = (statusOptions, data) => {
    const checkedOptions = statusOptions?.filter(option => !option.isRadio && option.checked === true).map(o => o.id);
    return data?.filter((obj) => checkedOptions.includes(obj.id));;
};

const timePeriodSearchType = (timeInterval) => ({
    monthly: timeInterval === tp[mdt.years2Monthly] || timeInterval === tp[mdt.years1Monthly],
    weekly: timeInterval === tp[mdt.months6Weekly],
    quarterly: timeInterval === tp[mdt.years3Quarterly]
});

const getWholeTimePeriodTitle = (timeInterval) => {
    if (timePeriodSearchType(timeInterval).monthly) return t.monthly;
    if (timePeriodSearchType(timeInterval).weekly) return t.weekly;
    if (timePeriodSearchType(timeInterval).quarterly) return t.quarterly;
};

const getTooltipTimePeriodTitle = (timeInterval) => {
    if (timePeriodSearchType(timeInterval).monthly) return t.month;
    if (timePeriodSearchType(timeInterval).quarterly) return t.quarter;
};

export const getColumnDefs = (props) => {
    const { listingConfig, timeInterval, beginPeriodDate, endPeriodDate, selectedPeriodComparison } = props;
    const isUnitStatus = !!listingConfig?.listingConfig?.keyInformation?.headerTooltipUnitType;
    const changeValueHeader =
        listingConfig.listingConfig?.keyInformation?.changeColumnHeaderName || t.change$;
    const columnDefs = listingConfig?.groupConfig?.keyInfo[selectedPeriodComparison];
    const dateFormatter = timePeriodSearchType(timeInterval).monthly ? monthAndYearFormat : getQuarterFormatted;
    const timePeriodTitle = getTooltipTimePeriodTitle(timeInterval);
    columnDefs?.map((column) => {

        const endPeriodHeaderComponentParam = () => {
            if (timePeriodSearchType(timeInterval).monthly && endPeriodDate) {
                const baseTooltip = {
                    ...marketDynamicsTooltips.endPeriod,
                    label: dateFormatter(endPeriodDate)
                };
                return getHeaderAndTooltip(
                    baseTooltip,
                    timePeriodTitle,
                    dateFormatter(endPeriodDate)
                );
            }
            if (timePeriodSearchType(timeInterval).quarterly) {
                const baseTooltip = {
                    ...marketDynamicsTooltips.endPeriod,
                    label: dateFormatter(endPeriodDate, longQuarterNumberAndYear)
                };
                return getHeaderAndTooltip(
                    baseTooltip,
                    timePeriodTitle,
                    dateFormatter(endPeriodDate, quarterNumberAndYear)
                );
            }

        };

        const beginPeriodHeaderComponentParam = () => {
            if (timePeriodSearchType(timeInterval).monthly && beginPeriodDate) {
                const baseTooltip = {
                    ...marketDynamicsTooltips.beginPeriod,
                    label: dateFormatter(beginPeriodDate)
                };
                return getHeaderAndTooltip(
                    baseTooltip,
                    timePeriodTitle,
                    dateFormatter(beginPeriodDate)
                );
            }
            if (timePeriodSearchType(timeInterval).quarterly) {
                const baseTooltip = {
                    ...marketDynamicsTooltips.beginPeriod,
                    label: dateFormatter(beginPeriodDate, longQuarterNumberAndYear)
                };
                return getHeaderAndTooltip(
                    baseTooltip,
                    timePeriodTitle,
                    dateFormatter(beginPeriodDate, quarterNumberAndYear)
                );
            }
        };

        const columnHeaderComponentParamsByField = ({
            [mdCols.status.id]: getHeaderAndTooltip(marketDynamicsTooltips.status),
            [mdCols.previousWeeksAvg.id]: getHeaderAndTooltip(marketDynamicsTooltips.previousWeeksAvg),
            [mdCols.previousWeeksAvg.id]: getHeaderAndTooltip(marketDynamicsTooltips.previousWeeksAvg),
            [mdCols.lastWeeksAvg.id]: getHeaderAndTooltip(marketDynamicsTooltips.lastWeeksAvg),
            [mdCols.changeAvg.id]: getHeaderAndTooltip({
                ...marketDynamicsTooltips.changeAvg,
                label: changeValueHeader
            }),
            [mdCols.changeAvgPercentage.id]: getHeaderAndTooltip(marketDynamicsTooltips.changeAvgPercentage),
            [mdCols.changeValue.id]: getHeaderAndTooltip(
                {
                    ...marketDynamicsTooltips.changeValue,
                    label: changeValueHeader
                },
                dateFormatter(beginPeriodDate, quarterNumberAndYear),
                dateFormatter(endPeriodDate, quarterNumberAndYear),
                timePeriodTitle
            ),
            [key.endPeriodValue]: endPeriodHeaderComponentParam(),
            [key.beginPeriodValue]: beginPeriodHeaderComponentParam(),
            [mdCols.periodChange.id]: getHeaderAndTooltip(
                {
                    ...marketDynamicsTooltips[isUnitStatus ? mdCols.periodChange.id : mdCols.periodChangeVolume.id],
                    label: t.periodChange(getWholeTimePeriodTitle(timeInterval))
                },
                timePeriodTitle,
                listingConfig?.listingConfig.keyInformation?.headerTooltipUnitType
            ),
            [mdCols.periodPercentChange.id]: getHeaderAndTooltip(
                {
                    ...marketDynamicsTooltips[isUnitStatus ? mdCols.periodPercentChangeUnits.id : mdCols.periodPercentChange.id],
                    label: t.periodPercentChange(getWholeTimePeriodTitle(timeInterval))
                },
                timePeriodTitle,
                listingConfig?.listingConfig.keyInformation?.headerTooltipUnitType
            ),
            [mdCols.totalChange.id]: getHeaderAndTooltip(
                { ...marketDynamicsTooltips[isUnitStatus ? mdCols.totalChangeUnits.id : mdCols.totalChange.id] },
                listingConfig?.listingConfig.keyInformation?.headerTooltipUnitType
            ),
            [mdCols.totalPercentChange.id]: getHeaderAndTooltip(
                { ...marketDynamicsTooltips[isUnitStatus ? mdCols.totalPercentChangeUnits.id : mdCols.totalPercentChange.id] },
                listingConfig?.listingConfig.keyInformation?.headerTooltipUnitType
            ),
            [mdCols.changeValuePercentage.id]: getHeaderAndTooltip(
                marketDynamicsTooltips.changeValuePercentage,
                timePeriodTitle,
                dateFormatter(beginPeriodDate, quarterNumberAndYear)
            )
        });

        column.headerComponentParams = columnHeaderComponentParamsByField[column.field];

        return column;
    });
    return columnDefs;
};

export const getCalculatedRows = (props) => {
    const {
        timeInterval,
        endPeriodData,
        beginPeriodData,
        previousWeeksData,
        lastWeeksData,
        featureToggles,
        listingConfig,
        statusOptions,
        searchResults,
        selectedPeriodComparison
    } = props;

    const calculateRows = statusOptions?.map((row) => {
        const { id, label, keyField, keyInfoLabel } = row;

        const statusLabel = keyInfoLabel || label
        const formatter = listingConfig?.listingConfig?.keyInformation?.formatter || formatVolume;

        const listingsWithPercentageValues = [ lv.avgSpLpComparison.value, 
            lv.avgSpOpComparison.value, lv.avgSpOpAllProperties.value ];
        const isPercentageListing = listingsWithPercentageValues.includes(listingConfig.listingConfig.value);
        const changeFormatter = isPercentageListing ? blankEmptyFormatPercentage : formatter

        if (timePeriodSearchType(timeInterval).weekly) {
            return getWeeklyData(formatter, previousWeeksData, lastWeeksData, keyField, changeFormatter,
                id, label);
        }

        return getQuarterlyOrMonthlyData({ selectedPeriodComparison, beginPeriodData, endPeriodData, searchResults, featureToggles,
            id, statusLabel, keyField, formatter, changeFormatter });
    });

    const rows = filterDataByCheckedOptions(statusOptions, calculateRows);
    for (let i = 0; i < rows?.length; i++) {
        rows[i].color = colors.bars[i];
    }
    return rows;
};
