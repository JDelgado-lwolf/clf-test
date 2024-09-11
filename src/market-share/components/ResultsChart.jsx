import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { agentProductionTerms } from '../../constants';
import { getTooltipContent } from '../helpers/helpers';
import { getBarHeight, getDataLabel } from '../helpers/chart';
import { marketShareTerms } from '../constants';

export const ResultsChart = props => {
    const { data, config: { rank, chart: chartConfig }, hasSelectedRows } = props;
    const [key, setKey] = useState(0);

    const yAxisLabels = data?.map(chartConfig.yAxisLabelMapper);

    const getDataPointGroups = (groups) => {
        return groups?.map(group => {
            const groupData = data?.map(group.dataMapper);
            return {
                name: group.label,
                data: groupData
            };
        });
    };

    const barColors = chartConfig?.dataPointGroups?.map(dataGroup => dataGroup.color);

    const dataPointGroups = getDataPointGroups(chartConfig?.dataPointGroups);

    const fontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,' +
        'sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"';

    const options = {
        rank,
        grid: {
            yaxis: { lines: { show: false } },
            xaxis: { lines: { show: true } },
            strokeDashArray: 3
        },
        chart: {
            background: '#fff',
            animations: {
                enabled: false
            },
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false
            },
            fontFamily,
            noData: {
                text: agentProductionTerms.noDataForSelectedAgent
            },
            zoom: {
                enabled: false
            }
        },
        tooltip: {
            custom: ({ series, dataPointIndex, w: graphInfo }) => {
                return getTooltipContent(series, dataPointIndex, graphInfo, barColors, chartConfig);
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'left',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 1,
                barHeight: getBarHeight(yAxisLabels?.length),
                dataLabels: {
                    position: 'top',
                    hideOverflowingLabels: false
                }
            },
        },
        dataLabels: {
            enabled: true,
            offsetX: 70,
            formatter: function (_, { seriesIndex, dataPointIndex, w }) {
                return getDataLabel(seriesIndex, dataPointIndex, w, data);
            },
            style: {
                colors: ['#000000']
            }
        },
        xaxis: {
            categories: yAxisLabels,
            labels: {
                formatter: chartConfig?.xAxisLabelFormatter,
                style: {
                    fontWeight: 400,
                    fontSize: '16px',
                    colors: '#9CA3AF'
                }
            }
        },
        yaxis: {
            title: {
                text: undefined
            },
            labels: {
                maxWidth: screen.width * 0.40,
                style: {
                    fontWeight: 400,
                    fontSize: '16px',
                    colors: '#4B5563'
                },
                offsetX: 10
            }
        },
        legend: {
            inverseOrder: false,
            markers: {
                fillColors: barColors,
                width: 15,
                height: 15,
                radius: 10
            },
            fontFamily,
            itemMargin: {
                horizontal: 10
            },
            onItemClick: {
                toggleDataSeries: false
            },
            position: 'bottom',
            horizontalAlign: 'left',
            showForSingleSeries: true,
            fontSize: '16px',
            labels: {
                colors: '#4B5563',
            }
        },
        fill: {
            opacity: 1,
            colors: barColors
        }
    };

    const isShowEmptyState = data === undefined;
    const chartProps = {
        key,
        options,
        series: dataPointGroups,
        type: 'bar',
        height: 372,
        width: '100%'
    };

    useEffect(() => {
        const incrementToForceChartReRender = prevKey => prevKey + 1;
        setKey(incrementToForceChartReRender);
    }, [data])

    return <div>
        {isShowEmptyState
            ? null
            : !hasSelectedRows
                ? <div className='content text-center'>
                    <p className='initial-search mb-5 mt-5'>{marketShareTerms.noRowsSelected}</p>
                </div>
                : <div id='market-share-chart-graph' className='raised-border mb-3 bg-white market-share-chart'>
                    <Chart {...chartProps} />
                </div>
        }
    </div>;
};

ResultsChart.propTypes = {
    data: PropTypes.array.isRequired,
    config: PropTypes.object.isRequired,
    hasSelectedRows: PropTypes.number.isRequired,
    rank: PropTypes.string
};
