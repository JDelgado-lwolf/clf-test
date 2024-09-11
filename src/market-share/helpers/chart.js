import { formatPercentage } from '../../agent-production/helpers/dataFormatters';
import { marketShareTerms as t } from '../constants';

const MAX_BAR_STACK_COUNT = 2;

export const getBarHeight = (chartRowCount) => {
    return chartRowCount && `${chartRowCount * 5}%`;
};

export const getDataLabel = (seriesIndex, dataPointIndex, w, data) => {
    const series = w.config.series;
    const hasFullData = series.length === MAX_BAR_STACK_COUNT && series[0].data[dataPointIndex] > 0 && series[1].data[dataPointIndex] > 0;
    const hasPartialData = series.length === MAX_BAR_STACK_COUNT && (
        (series[0].data[dataPointIndex] > 0 && series[1].data[dataPointIndex] === 0) ||
        (series[0].data[dataPointIndex] === 0 && series[1].data[dataPointIndex] > 0)
    );

    if (
        (series.length === 1) ||
        (hasFullData && seriesIndex === 1) ||
        (hasPartialData && series[seriesIndex].data[dataPointIndex] > 0)
    ) {
        return `${t.mkt} ${formatPercentage(data[dataPointIndex]?.marketSharePct)}`;
    }

    return '';
};
