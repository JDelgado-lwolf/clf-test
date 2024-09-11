import { OverviewGraphLabelMaker } from './uiHelpers';
import { agentProductionTerms, TimePeriods } from '../../constants';
import { getCurrencyFormat, getFullNumbers } from './dataFormatters';

const getCountMonthsToPreviousQuarter = date => {
    const monthOfYear = new Date(date).getMonth() + 1;
    return (monthOfYear % 3) || 3;
};

export const getChartDataIndexes = ({ chartData, timePeriod }) => {

    let lastPeriodStart, lastPeriodFinish, prevPeriodStart, prevPeriodFinish;

    if (!chartData || chartData?.length === 0 || !timePeriod) return null;

    const indexLastItem = chartData.length - 1;
    lastPeriodFinish = indexLastItem;
    const dateLastItem = new Date(chartData[indexLastItem].month);
    const currentMonthIndex = dateLastItem.getMonth();

    switch (timePeriod) {

        case TimePeriods.MTD:

            lastPeriodStart = lastPeriodFinish;
            prevPeriodFinish = lastPeriodStart - 1;
            prevPeriodStart = prevPeriodFinish;
            break;

        case TimePeriods.QTD:

            const countMonthsToPreviousQuarter = getCountMonthsToPreviousQuarter(dateLastItem);
            prevPeriodFinish = lastPeriodFinish - countMonthsToPreviousQuarter;
            prevPeriodStart = prevPeriodFinish - 2;
            lastPeriodStart = prevPeriodStart + 3;
            break;

        case TimePeriods.YTD:

            lastPeriodStart = lastPeriodFinish - currentMonthIndex;
            prevPeriodStart = lastPeriodStart - 12;
            prevPeriodFinish = prevPeriodStart + currentMonthIndex;
            break;

        case TimePeriods[agentProductionTerms.lastMonth]:

            lastPeriodFinish = indexLastItem - 1;
            lastPeriodStart = lastPeriodFinish;
            prevPeriodStart = lastPeriodStart - 1;
            prevPeriodFinish = prevPeriodStart;
            break;

        case TimePeriods[agentProductionTerms.last6Months]:

            lastPeriodStart = lastPeriodFinish - 5;
            prevPeriodStart = lastPeriodStart - 6;
            prevPeriodFinish = prevPeriodStart + 5;
            break;

        case TimePeriods[agentProductionTerms.last12Months]:

            lastPeriodStart = lastPeriodFinish - 11;
            prevPeriodFinish = lastPeriodStart - 1;
            prevPeriodStart = prevPeriodFinish - 11;
            break;

        case TimePeriods[agentProductionTerms.last24Months]:

            lastPeriodStart = 0;
            break;
    }

    return { lastPeriodStart, lastPeriodFinish, prevPeriodStart, prevPeriodFinish };
};

export const getSumTotalVolume = (prev, current) => prev + current.totalVolume;
export const getSumTotalUnits = (prev, current) => prev + current.totalUnits;

export const getChartTotals = ({ chartData, dataIndexes, getSumTotal }) => {

    const totalLastPeriod = chartData?.slice(dataIndexes.lastPeriodStart, dataIndexes.lastPeriodFinish + 1)
        .reduce(getSumTotal, 0);
    const totalPrevPeriod = chartData?.slice(dataIndexes.prevPeriodStart, dataIndexes.prevPeriodFinish + 1)
        .reduce(getSumTotal, 0);

    const amountChange = totalLastPeriod - totalPrevPeriod;
    const percentChange = amountChange / totalPrevPeriod * 100;

    return { totalLastPeriod, totalPrevPeriod, amountChange, percentChange };
};

export const getOverviewGraphData = ({ chartData, dataIndexes, listMapper, sellMapper }) => {

    let xAxisLabels, listSideSoldValues, sellSideSoldValues, formattedData;

    const dataToMap = chartData?.slice(dataIndexes.lastPeriodStart, dataIndexes.lastPeriodFinish + 1);
    xAxisLabels = dataToMap?.map(d => OverviewGraphLabelMaker.getLabelDate(d));
    listSideSoldValues = dataToMap?.map(listMapper);
    sellSideSoldValues = dataToMap?.map(sellMapper);
    formattedData = dataToMap?.map(d => d);

    return { xAxisLabels, listSideSoldValues, sellSideSoldValues, formattedData };
};

export const chartModes = Object.freeze({ VOLUME: 'volume', UNITS: 'units' });

export const getOverviewGraphProps = props => {

    const { graphMode, chartData, timePeriod, dataIndexes, widthPixelsOutsideGraph } = props;

    let dataPointFormatter, yAxisTitle, yAxisFormatter, listMapper, sellMapper, countYAxisTicks;

    if (graphMode === chartModes.VOLUME) {
        dataPointFormatter = getCurrencyFormat;
        yAxisTitle = agentProductionTerms.dollarsInMillions;
        yAxisFormatter = value => getFullNumbers(value / 1000000);
        listMapper = d => d.listVolume;
        sellMapper = d => d.sellVolume;
        countYAxisTicks = 16;

    } else if (graphMode === chartModes.UNITS) {
        dataPointFormatter = getFullNumbers;
        yAxisTitle = agentProductionTerms.numberUnits;
        yAxisFormatter = getFullNumbers;
        listMapper = d => d.listUnits;
        sellMapper = d => d.sellUnits;
        countYAxisTicks = 12;
    }

    return {
        chartData: chartData || [], timePeriod, dataIndexes,
        dataPointFormatter, yAxisFormatter, yAxisTitle, listMapper, sellMapper, countYAxisTicks,
        widthPixelsOutsideGraph, graphMode
    };
};

export const getOverviewChartTableParams = chartMode => {

    let labelTotal, getSumTotal, getFormattedAmount, labelAmountChange;

    if (chartMode === chartModes.VOLUME) {

        getSumTotal = getSumTotalVolume;
        labelTotal = agentProductionTerms.totalVolume;
        getFormattedAmount = getCurrencyFormat;
        labelAmountChange = agentProductionTerms.dollarChange;

    } else if (chartMode === chartModes.UNITS) {

        getSumTotal = getSumTotalUnits;
        labelTotal = agentProductionTerms.totalUnits;
        getFormattedAmount = value => value;
        labelAmountChange = agentProductionTerms.unitsChange;
    }

    return { getSumTotal, labelTotal, getFormattedAmount, labelAmountChange };
};

export const calculateChartData = data => {

    if (!data?.monthlyProductions) return [];

    return [...data?.monthlyProductions].sort((a, b) => a.month > b.month ? 1 : -1);
};
