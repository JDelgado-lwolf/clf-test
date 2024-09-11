import { format, getMonth, getYear } from 'date-fns';
import {
    getMonthlyFormatted,
    getQuarterFormatted,
    getWeeklyFormatted,
    quarterNumber,
    formattedQuarterWithYear,
    formattedWeekWithMonthAndYear,
    getTwoDigitDayOfMonth,
    formatPercent
} from '../../agent-production/helpers/dataFormatters';
import { marketDynamicsColors, periodKeys, terms } from '../constants';

const STACKED_BAR_WIDTH = 2;

export const getDataPoints = (checkedStatusOptions, data) => {
    const radioRemoved = checkedStatusOptions.filter(x => !x.isRadio);
    return radioRemoved.map(({ keyField }) => ({
        data: data?.map((item) => item[keyField] ?? 0) ?? []
    }));
};

export const getMonthlyCategories = (data) =>
    data?.map((item, index) => {
        const date = new Date(item.timePeriodStart);
        const month = format(date, 'MM');
        const shouldRenderYear = index === 0 || index === data.length - 1 || month === '01';
        return item && getMonthlyFormatted(date, shouldRenderYear);
    }) ?? [];

export const getQuarterlyCategories = (data) =>
    data?.map(
        (item, index) =>
            item &&
            getQuarterFormatted(
                item.timePeriodStart,
                getIsFirstOrLastItem(index, data) ? formattedQuarterWithYear : quarterNumber
            )
    ) ?? [];

export const getFormattedDateObj = (date) => ({
    dayOfMonth: getTwoDigitDayOfMonth(date),
    month: getMonth(date),
    year: getYear(date),
    formattedMonth: format(date, 'MMM'),
    formattedYear: format(date, 'yy')
});

export const getIsFirstOrLastItem = (index, data) => index === 0 || index === data.length - 1;

export const getWeeklyCategories = (data) =>
    data?.map((item, index) => {
        const prevDate = index !== 0 && new Date(data[index - 1].timePeriodStart);
        const date = new Date(item.timePeriodStart);

        const isFirstOrLastItem = getIsFirstOrLastItem(index, data);

        const dateObject = getFormattedDateObj(date);
        const { month: prevMonth, year: prevYear } = prevDate && getFormattedDateObj(prevDate);

        const hasChangedMonth = dateObject.month !== prevMonth;
        const hasChangedYear = dateObject.year !== prevYear;
        const shouldShowYear = hasChangedYear || isFirstOrLastItem;

        if (isFirstOrLastItem || hasChangedMonth)
            return formattedWeekWithMonthAndYear(dateObject, shouldShowYear);
        return item && getWeeklyFormatted(date);
    }) ?? [];

export const getBeginVsEndMonthColors = (dataPointIndex, seriesIndex, w, selectedPeriodComparison,
    selectedBeginIndex, selectedEndIndex, intervalType) => {

    const data = w.config.series[0].data;
    if (intervalType === terms.weekOf) {
        if (getIsFirstOrLastItem(dataPointIndex, data)) return marketDynamicsColors.bars[seriesIndex];
        return marketDynamicsColors.barsTransparency[seriesIndex];
    }
    if (selectedPeriodComparison === periodKeys.wholeTimePeriod) {
        if (dataPointIndex >= selectedBeginIndex && dataPointIndex <= selectedEndIndex)
            return marketDynamicsColors.bars[seriesIndex];

        return marketDynamicsColors.barsTransparency[seriesIndex];
    }

    if (dataPointIndex === selectedBeginIndex || dataPointIndex === selectedEndIndex)
        return marketDynamicsColors.bars[seriesIndex];

    return marketDynamicsColors.barsTransparency[seriesIndex];
}  

export const getBarWidth = (chartRowCount, barCount, isStacked) => {
    if (isStacked) return formatPercent(chartRowCount * STACKED_BAR_WIDTH);
    return formatPercent(chartRowCount * barCount);
};
