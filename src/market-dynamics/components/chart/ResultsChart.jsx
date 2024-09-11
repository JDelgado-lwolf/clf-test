import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { chartLabelStyles, chartFontFamily as fontFamily, marketDynamicsColors } from '../../constants';
import { getDataPoints, getBarWidth, getBeginVsEndMonthColors } from '../../helpers/chart';
import PeriodComparison from '../common/PeriodComparison';
import { getChartTooltipContent } from '../../helpers/helpers';
import { dataPointMouseOverStyler } from '../../../agent-production/helpers/schemaTableHelpers';

const ResultsChart = ({ data, checkedStatusOptions, config, setSelectedPeriodComparison,
    selectedPeriodComparison, agentData, selectedBeginIndex, selectedEndIndex, handleBarClick }) => {

    const intervalType = config?.groupConfig?.columnSettings?.label;
    const isStacked = config?.listingConfig?.chart?.isStacked
    const options = {
        chart: {
            borderRadiusWhenStacked: 'last',
            fontFamily,
            toolbar: { show: false },
            stacked: isStacked,
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    handleBarClick(config.dataPointIndex);
                },
                dataPointMouseEnter: dataPointMouseOverStyler,
            },
        },
        dataLabels: { enabled: false },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRaidusApplication: 'end',
                borderRadius: 3,
                columnWidth: getBarWidth(data?.length, checkedStatusOptions?.length ?? [], isStacked)
            }
        },
        xaxis: {
            categories: config?.groupConfig?.chart?.xaxis.categories(data) ?? [],
            labels: { style: chartLabelStyles }
        },
        yaxis: {
            ...config?.listingConfig?.chart?.yAxis,
            labels: {
                ...config?.listingConfig?.chart?.yAxis.labels,
                style: chartLabelStyles
            }
        },
        fill: {
            colors: [function ({ dataPointIndex, seriesIndex, w }) {
                return getBeginVsEndMonthColors(dataPointIndex, seriesIndex, w, selectedPeriodComparison,
                    selectedBeginIndex, selectedEndIndex, intervalType);
            }]
        },
        legend: { show: false },
        stroke: {
            colors: ['transparent'],
            width: 5
        },
        tooltip: {
            custom: ({ series, dataPointIndex }) => {
                return getChartTooltipContent(data, series, dataPointIndex, marketDynamicsColors.bars, config);
            }
        },
        grid: { yaxis: { lines: { show: false } } }
    };

    const series = getDataPoints(checkedStatusOptions, data);
    const keyIncrement = 1;
    const [key, setKey] = useState(keyIncrement);
    const chartProps = {
        key,
        options,
        series,
        type: 'bar',
        height: 390,
        width: '100%'
    };

    const shouldShowChart = data !== undefined;

    useEffect(() => {
        setKey((prevKey) => prevKey + keyIncrement);
    }, [selectedBeginIndex, selectedEndIndex, selectedPeriodComparison])

    return (
        shouldShowChart && (
            <div id="market-share-chart-graph" className="raised-border mb-3 bg-white">
                {config?.groupConfig?.periodSelection &&
                    <PeriodComparison
                        setSelectedPeriodComparison={setSelectedPeriodComparison}
                        selectedPeriodComparison={selectedPeriodComparison}
                        agentData={agentData}
                        intervalType={config?.groupConfig?.columnSettings?.label}
                    />
                }
                <Chart {...chartProps} />
            </div>
        )
    );
};

ResultsChart.propTypes = {
    data: PropTypes.array.isRequired,
    checkedStatusOptions: PropTypes.array,
    config: PropTypes.object,
    setSelectedPeriodComparison: PropTypes.func,
    selectedPeriodComparison: PropTypes.string,
    agentData: PropTypes.array,
    selectedBeginIndex: PropTypes.number,
    selectedEndIndex: PropTypes.number,
    handleBarClick: PropTypes.func,
};

export default ResultsChart;
