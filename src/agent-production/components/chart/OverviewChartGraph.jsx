import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getFormattedDate, getCompactDollars, getUngroupedMax1Decimals } from '../../helpers/dataFormatters';
import { chartModes, getOverviewGraphData } from '../../helpers/agentDataCalculators';
import { agentProductionTerms } from '../../../constants';
import { OverviewGraphLabelMaker } from '../../helpers/uiHelpers';
import { setStateData } from '../../../common/helpers/state';
import { dataPointMouseOverStyler } from '../../helpers/schemaTableHelpers';

export const OverviewChartGraph = props => {

    const {
        chartData, dataIndexes, dataPointFormatter, yAxisTitle, yAxisFormatter, graphMode, isShowColumnLabels,
        listMapper, sellMapper, countYAxisTicks, widthPixelsOutsideGraph, handleClickChartGraph,
    } = props;

    const CONTAINER_WIDTH_MAX = '100%';
    const MINIMUM_COLUMN_WIDTH_IN_PIXELS = 85;

    const [state, setState] = useState({
        windowWidth: window.innerWidth,
        widthGraph: CONTAINER_WIDTH_MAX,
        styleContainer: {}
    });

    const graphData = getOverviewGraphData({ chartData, dataIndexes, listMapper, sellMapper });
    const countColumns = graphData.xAxisLabels.length;
    const widthGraphContent = countColumns * MINIMUM_COLUMN_WIDTH_IN_PIXELS;

    useEffect(() => {
        const handleResize = e => setStateData('windowWidth', e.target.innerWidth, setState);
        window.addEventListener('resize', handleResize, true);
        return () => window.removeEventListener('resize', handleResize, true);
    }, []);

    useEffect(() => {

        if (state.windowWidth > (widthGraphContent + widthPixelsOutsideGraph)) {
            setState(prevState => ({
                ...prevState,
                widthGraph: CONTAINER_WIDTH_MAX,
                styleContainer: {
                    maxWidth: CONTAINER_WIDTH_MAX
                }
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                widthGraph: widthGraphContent.toString(),
                styleContainer: {
                    maxWidth: `${state.windowWidth - +widthPixelsOutsideGraph}px`
                }
            }));
        }
    }, [state.windowWidth, countColumns]);

    const dataPointGroups = [
        { name: agentProductionTerms.listSideSold, data: graphData.listSideSoldValues },
        { name: agentProductionTerms.sellSideSold, data: graphData.sellSideSoldValues }
    ];

    const COLOR_DARK_BLUE = '#1a3a73';
    const COLOR_LIGHT_BLUE = '#4282de';
    const colors = [COLOR_DARK_BLUE, COLOR_LIGHT_BLUE];
    const fontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,' +
        'sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"';

    const getToolTipHeader = (dataPointIndex, graphInfo) => {

        const labelColumnXAxis = graphInfo.globals.labels[dataPointIndex];
        const dateColumn = OverviewGraphLabelMaker.getDateMonthFromGraphLabel(labelColumnXAxis);
        return getFormattedDate(dateColumn, 'MMMM yyyy');
    };

    const getTooltipContent = (series, dataPointIndex, graphInfo) => {

        const amountList = series[0][dataPointIndex];
        const amountSell = series[1][dataPointIndex];
        const tooltipHeader = getToolTipHeader(dataPointIndex, graphInfo);

        return `<div class='arrow_box volume-chart-tooltip'>
		<div class='header'> 
			${tooltipHeader}
		</div> 
		<div class='body'>
			<div class='items'>
				<span class='bullet' style='background-color: ${COLOR_LIGHT_BLUE}'></span> 
					${dataPointFormatter(amountSell)} <br />
				<span class='bullet' style='background-color: ${COLOR_DARK_BLUE}'></span> 
					${dataPointFormatter(amountList)}
			</div>
		 	<div class='total'>Total: ${dataPointFormatter(amountSell + amountList)}</div>
			</div>
		</div>`;
    };

    const getColumnLabel = (graphMode, dataPointIndex) => {

        let value, formatter;

        if (graphMode === chartModes.UNITS) {
            value = graphData?.formattedData[dataPointIndex].totalUnits;
            formatter = getUngroupedMax1Decimals;
        } else {
            value = graphData?.formattedData[dataPointIndex].totalVolume;
            formatter = getCompactDollars;
        }

        if (value === 0) return '';

        return formatter(value);
    };

    const options = {
        chart: {
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
            },
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    const selectedChartIndex = config.dataPointIndex;
                    handleClickChartGraph(config.w.globals.labels[selectedChartIndex]);
                },
                dataPointMouseEnter: dataPointMouseOverStyler
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
                horizontal: false,
                borderRadius: 1,
                columnWidth: '40px',
                dataLabels: {
                    position: 'top',
                    hideOverflowingLabels: false
                }
            }
        },
        dataLabels: {
            enabled: isShowColumnLabels,
            enabledOnSeries: [1],
            textAnchor: 'middle',
            formatter: (_, { dataPointIndex }) => getColumnLabel(graphMode, dataPointIndex),
            style: {
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                colors: ['#212529']
            },
            offsetY: -30
        },
        xaxis: {
            type: 'category',
            categories: graphData.xAxisLabels
        },
        yaxis: {
            tickAmount: countYAxisTicks,
            labels: {
                formatter: yAxisFormatter
            },
            title: {
                text: yAxisTitle,
                style: {
                    fontSize: '24px',
                    fontWeight: 'normal'
                },
                offsetX: -5
            }
        },
        tooltip: {
            custom: ({ series, dataPointIndex, w: graphInfo }) => {
                return getTooltipContent(series, dataPointIndex, graphInfo);
            }
        },
        legend: {
            markers: {
                fillColors: colors,
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
            offsetX: 10,
            horizontalAlign: 'left'
        },
        fill: {
            opacity: 1,
            colors: colors
        }
    };

    const isShowEmptyState = chartData === undefined;
    const classContainer = state.widthGraph === CONTAINER_WIDTH_MAX ? '' : 'tableOverflow';
    const chartProps = {
        options,
        series: dataPointGroups,
        type: 'bar',
        height: 500,
        width: state.widthGraph
    };

    return <div style={state.styleContainer} className={classContainer}>
        {isShowEmptyState
            ? <div className={'mt-3'}>
                {agentProductionTerms.searchReturnedNoResults}
            </div>
            : <div id="production-chart-graph">
                <Chart {...chartProps} />
            </div>
        }
    </div>;
};
