import React from 'react';
import { parse } from 'date-fns';
import Icon from '@lwt-helix/icon';
import Tooltip from '@lwt-helix/tooltip';
import { getFormattedDate, longDateTwoDigitsFormat, yearFormat } from './dataFormatters';
import { agentProductionTerms, TimePeriods } from '../../constants';
import { getTimeIntervalData, getTimePeriodData } from './browserStorageHelper';

export const getTrendArrow = difference => {

    if (difference === 0) return null;

    if (difference > 0)
        return <Icon dataLwtId={'icon-yoy-change'} iconName='north_east' className='text-success' />;

    return <Icon dataLwtId={'icon-yoy-change'} iconName='south_east' className='text-danger' />;
};

const getTimePeriodLabels = timePeriod => {

    let labelLastPeriod, labelPrevPeriod;

    if (timePeriod === TimePeriods.QTD) {
        labelLastPeriod = agentProductionTerms.QTD;
        labelPrevPeriod = agentProductionTerms.previousQuarterToDate;

    } else if (timePeriod === TimePeriods.YTD) {
        labelLastPeriod = agentProductionTerms.YTD;
        labelPrevPeriod = agentProductionTerms.previousYearToDate;

    } else if (timePeriod === TimePeriods.MTD) {
        labelLastPeriod = agentProductionTerms.MTD;
        labelPrevPeriod = agentProductionTerms.previousMonthToDate;

    } else if (timePeriod === TimePeriods[agentProductionTerms.lastMonth]) {
        labelLastPeriod = agentProductionTerms.lastMonth;
        labelPrevPeriod = agentProductionTerms.previousMonth;

    } else if (timePeriod === TimePeriods[agentProductionTerms.last6Months]) {
        labelLastPeriod = agentProductionTerms.last6Months;
        labelPrevPeriod = agentProductionTerms.previous6Months;

    } else if (timePeriod === TimePeriods[agentProductionTerms.last12Months]) {
        labelLastPeriod = agentProductionTerms.last12Months;
        labelPrevPeriod = agentProductionTerms.previous12Months;
    }

    return { labelLastPeriod, labelPrevPeriod };
};

export const getOverviewChartTableLabels = ({ timePeriod, chartData, dataIndexes }) => {

    let labelLastPeriod = '', dateRangeLast = '', labelPrevPeriod = '', dateRangePrev = '';

    if (!chartData) return { labelLastPeriod, dateRangeLast, labelPrevPeriod, dateRangePrev };

    const dateLastStart = getFormattedDate(chartData[dataIndexes.lastPeriodStart].month, 'MMM yyyy');
    const dateLastFinish = getFormattedDate(chartData[dataIndexes.lastPeriodFinish].month, 'MMM yyyy');
    const datePrevStart = getFormattedDate(chartData[dataIndexes.prevPeriodStart].month, 'MMM yyyy');
    const datePrevFinish = getFormattedDate(chartData[dataIndexes.prevPeriodFinish].month, 'MMM yyyy');

    const isDateRangeCoversOneMonth = (start, finish) => start === finish;

    dateRangeLast = isDateRangeCoversOneMonth(dataIndexes.lastPeriodStart, dataIndexes.lastPeriodFinish)
        ? `${dateLastStart}`
        : `${dateLastStart} - ${dateLastFinish}`;

    dateRangePrev = isDateRangeCoversOneMonth(dataIndexes.prevPeriodStart, dataIndexes.prevPeriodFinish)
        ? `${datePrevStart}`
        : `${datePrevStart} - ${datePrevFinish}`;

    const labels = getTimePeriodLabels(timePeriod);

    return {
        labelLastPeriod: labels.labelLastPeriod,
        dateRangeLast,
        labelPrevPeriod: labels.labelPrevPeriod,
        dateRangePrev
    };
};

export const getLabelTextWithDate = (value) => {
    if (!value?.hasDate) return value?.label;
    const timePeriods = getTimeIntervalData();
    if (!timePeriods) return;
    const lastYear = timePeriods?.find(value => value.intervalType === 'YTD')?.last.from;
    const previousYear = timePeriods?.find(value => value.intervalType === 'YTD')?.previous.from;
    return value?.label
        .replace('[currentYearNumber]', `${yearFormat(lastYear)}`)
        .replace('[previousYearNumber]', `${yearFormat(previousYear)}`);
};

export const getTooltipText = (value) => {
    if (!value?.hasDate) return value?.tip;
    const timePeriods = getTimeIntervalData();
    if (!timePeriods) return;
    const Last12Months = timePeriods?.find(value => value.intervalType === 'Annually')?.last;
    const previous12Months = timePeriods?.find(value => value.intervalType === 'Annually')?.previous;
    const lastYear = timePeriods?.find(value => value.intervalType === 'YTD')?.last.from;
    const previousYear = timePeriods?.find(value => value.intervalType === 'YTD')?.previous.from;
    return value?.tip.replace('[last12Months]', `(${longDateTwoDigitsFormat(Last12Months?.from)} - ${longDateTwoDigitsFormat(Last12Months.to)})`)
        .replace('[previous12Months]', `(${longDateTwoDigitsFormat(previous12Months?.from)} - ${longDateTwoDigitsFormat(previous12Months.to)})`)
        .replace('[currentYear]', `${yearFormat(lastYear)}`)
        .replace('[previousYear]', `${yearFormat(previousYear)}`)
        .replace('[currentYearNumber]', `${yearFormat(lastYear)}`)
        .replace('[previousYearNumber]', `${yearFormat(previousYear)}`);
};

export class OverviewGraphLabelMaker {

    static getLabelDate = dataItem => getFormattedDate(dataItem.month, 'MMM yy');

    static getDateMonthFromGraphLabel = label => {

        const partsLabel = label.split(' ');
        const month = partsLabel[0];
        const year = `20${partsLabel[1]}`;
        const dateToAvoidIncorrectConversionToMonth = `${year}-${month}-15`;
        return parse(dateToAvoidIncorrectConversionToMonth, 'yyyy-MMM-dd', new Date());
    };
}

export const selectMouseoverStyle = base => ({
    ...base,
    cursor: 'pointer'
});

export const getElementTooltip = (tooltip) => {
    const storedTimePeriod = getTimePeriodData();
    const currentTimePeriod = getTimePeriodLabels(storedTimePeriod)?.labelLastPeriod;
    return <>
        <Tooltip target={tooltip?.id}>
            {tooltip?.tip.replace('[Time Period]',
                currentTimePeriod ? currentTimePeriod : storedTimePeriod)}
        </Tooltip>
        <span id={tooltip?.id}>
			{tooltip?.label}
		</span>
    </>;
};
