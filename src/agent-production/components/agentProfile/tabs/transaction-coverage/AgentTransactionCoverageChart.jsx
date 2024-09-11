import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import {
    percentChangeFormatter, getNumberWithComas, formatUnitOrPercentage, getCurrencyFormat
} from '../../../../helpers/dataFormatters';
import { agentProductionTerms } from '../../../../../constants';
import {
    dealStatusCodes,
    mlsAreaTypes,
    agentCoverageListingTabs
} from '../../../../constants/agentProductionConstants';
import { dataPointMouseOverStyler } from '../../../../helpers/schemaTableHelpers';
import { tableChartModes } from '../../../common/TableChartToggle';
import { Routes } from '../../../../../common/routes/routes';
import { useAgentProfileStore } from '../../../../../store/store';

const AgentTransactionCoverageChart = props => {
    const {
        agentData,
        isUnits,
        statusType,
        areaType,
        shouldDisplayAreaPercentage,
        agent,
        tableType,
        timePeriod
    } = props;

    const {
        setAreaList,
        setSelectedMlsId,
        setSelectedArea,
        setAreaType,
        setTableType,
        setIsUnits,
        setAgentCoverageListingTab,
        setTimePeriod
    } = useAgentProfileStore(state => ({
        setAreaList: state.setAreaList,
        setSelectedAgentId: state.setSelectedAgentId,
        setSelectedMlsId: state.setSelectedMlsId,
        setSelectedArea: state.setSelectedArea,
        setAreaType: state.setAreaType,
        setTableType: state.setTableType,
        setIsUnits: state.setIsUnits,
        setAgentCoverageListingTab: state.setAgentCoverageListingTab,
        setTimePeriod: state.setTimePeriod
    }));

    const history = useHistory();
    const CONTAINER_WIDTH_MAX = '100vh';
    const MINIMUM_COLUMN_WIDTH_IN_PIXELS = 85;
    const ONE_MILLION = 1000000;

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [widthGraph, setWidthGraph] = useState(CONTAINER_WIDTH_MAX);
    const refGraphContainer = useRef(null);

    useEffect(() => {
        const handleResize = (e) => {
            setWindowWidth(e.target.innerWidth);
        };
        window.addEventListener('resize', handleResize, true);
        return () => window.removeEventListener('resize', handleResize, true);
    }, [agentData]);

    const countColumns = agentData ? agentData.length : null;
    const widthGraphContent = countColumns * MINIMUM_COLUMN_WIDTH_IN_PIXELS;
    const widthContainer = refGraphContainer.current?.clientWidth ?? 0;

    useEffect(() => {
        if (widthGraphContent > widthContainer) {
            setWidthGraph(`${widthGraphContent}`);
        } else {
            setWidthGraph(window.innerWidth - 110 + 'px');
        }
    }, [windowWidth, countColumns, widthContainer]);

    const xAxisLabels = agentData?.map((d) => d.area);

    const dataPointGroups = [];
    if (statusType === dealStatusCodes.SOLD.value) {
        const listSideSoldVolume = agentData?.map(
            (d) => d.listVolume
        );
        const sellSideSoldVolume = agentData?.map(
            (d) => d.sellVolume
        );
        const listSideSoldUnits = agentData?.map(
            (d) => d.listUnits
        );
        const sellSideSoldUnits = agentData?.map(
            (d) => d.sellUnits
        );

        dataPointGroups.push({
            name: 'List Side (Sold)',
            data: isUnits
                ? listSideSoldUnits
                : listSideSoldVolume
        });
        dataPointGroups.push({
            name: 'Sell Side (Sold)',
            data: isUnits
                ? sellSideSoldUnits
                : sellSideSoldVolume
        });
    } else {
        const chartName = isUnits ? 'Total #' : 'Total $';
        const dataPoints = isUnits
            ? agentData?.map(d => d.totalUnits)
            : agentData?.map((d) => d.totalVolume);

        dataPointGroups.push({
            name: chartName,
            data: dataPoints
        });
    }

    const getTooltipContent = (series, dataPointIndex) => {
        const data = agentData[dataPointIndex];
        const percentage = isUnits
            ? percentChangeFormatter(data.totalUnitsPct)
            : percentChangeFormatter(data.totalVolumePct);
        const percentageElement = statusType === dealStatusCodes.SOLD.value
            ? `<div class='total-percent'>
                <span>${percentage}</span>
            </div>`
            : `<span>${percentage}</span>`;
        const soldTooltipInfo = statusType === dealStatusCodes.SOLD.value
            ? `<div class='items'>
                <span class='bullet' style='background-color: ${COLOR_LIGHT_BLUE}'></span>
                ${isUnits ? getNumberWithComas(data.sellUnits) : getCurrencyFormat(data.sellVolume)} <br />
                <span class='bullet' style='background-color: ${COLOR_DARK_BLUE}'></span>
                ${isUnits ? getNumberWithComas(data.listUnits) : getCurrencyFormat(data.listVolume)}
            </div>`
            : '';

        return `<div class='arrow_box volume-chart-tooltip'>
            <div class='header'>
                ${data.area}
            </div>
            <div class='body'>
                ${percentageElement}
                ${soldTooltipInfo}
                <div class='total'>
                    <span>Total:</span>
                    <span>${isUnits ? getNumberWithComas(data.totalUnits) : getCurrencyFormat(data.totalVolume)}</span>
                </div>
            </div>
        </div>`;
    };

    const yAxisLabel = isUnits ? '# Units' : '$ in Millions';
    const COLOR_DARK_BLUE = '#1a3a73';
    const COLOR_LIGHT_BLUE = '#4282de';
    const COLOR_LIGHT_AMBER = '#e3a649';
    const COLOR_GREEN = '#3f8f84';
    const colors = [];
    statusType === dealStatusCodes.SOLD.value && colors.push(COLOR_LIGHT_BLUE, COLOR_DARK_BLUE);
    statusType === dealStatusCodes.UNDER_CONTRACT.value && colors.push(COLOR_LIGHT_AMBER);
    statusType === dealStatusCodes.ACTIVE.value && colors.push(COLOR_GREEN);
    const radius = 1;
    const fontFamily =
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,' +
        'sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"';

    const options = {
        chart: {
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
                mounted: (chart) => {
                    chart.windowResizeHandler();
                },
                dataPointSelection: (event, chartContext, config) => {
                    setAgentCoverageListingTab(agentCoverageListingTabs.TOTAL_SOLD);
                    setSelectedMlsId(agent.mlsSid);
                    setAreaList(xAxisLabels);
                    setSelectedArea(xAxisLabels[config.dataPointIndex]);
                    setAreaType(areaType);
                    setTableType(tableType);
                    setTimePeriod(timePeriod);
                    setIsUnits(isUnits);

                    history.push({
                        pathname: `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.COVERAGE_LISTING}`,
                        state: {
                            agent,
                            selectedArea: xAxisLabels[config.dataPointIndex],
                            displayMode: tableChartModes.CHART
                        }
                    });
                },
                dataPointMouseEnter: dataPointMouseOverStyler
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'left',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: radius,
                columnWidth: '40px',
                dataLabels: {
                    position: 'top',
                    hideOverflowingLabels: false
                }
            }
        },
        dataLabels: {
            enabled: shouldDisplayAreaPercentage,
            enabledOnSeries: statusType === dealStatusCodes.SOLD.value ? [1, 2] : [0],
            textAnchor: 'middle',
            formatter: function(value, { seriesIndex, dataPointIndex, w }) {
                const totalPercentage = isUnits
                    ? percentChangeFormatter(agentData[dataPointIndex].totalUnitsPct)
                    : percentChangeFormatter(agentData[dataPointIndex].totalVolumePct);
                return totalPercentage ?? 0;
            },
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
            categories: xAxisLabels,
            labels: {
                formatter: function(value) {
                    if (areaType === mlsAreaTypes.MLS_AREAS) return value.split(' ', 1);
                    return value;
                },
                trim: true,
                hideOverlappingLabels: false
            }
        },
        yaxis: {
            labels: {
                formatter: function(value) {
                    if (isUnits) {
                        return formatUnitOrPercentage(value);
                    } else {
                        return formatUnitOrPercentage((parseInt(value) / ONE_MILLION), false, true);
                    }
                }
            },
            tickAmount: 16,
            title: {
                text: yAxisLabel,
                style: {
                    cssClass: 'agent-coverage-chart-y-label'
                }
            }
        },
        tooltip: {
            custom: ({ series, _, dataPointIndex }) =>
                getTooltipContent(series, dataPointIndex)
        },
        legend: {
            inverseOrder: false,
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
            position: 'bottom',
            offsetX: 10,
            horizontalAlign: 'left'
        },
        fill: {
            opacity: 1,
            colors: colors.reverse()
        }
    };

    const classContainer = widthGraph === CONTAINER_WIDTH_MAX ? null : 'tableOverflow';

    let outputToShow;

    if (!agentData || agentData.length === 0) {
        outputToShow = (
            <div className={'mt-3'}>Your search returned no results</div>
        );
    } else if (widthContainer === 0) {
        outputToShow = null;
    } else {
        outputToShow = (
            <Chart
                options={options}
                series={dataPointGroups}
                type='bar'
                height={400}
                width={widthGraph}
            />
        );
    }

    return (
        <div
            ref={refGraphContainer}
            className={classContainer}
            style={{ maxWidth: window.innerWidth - 100 + 'px' }}
            id='agent-coverage-chart-container'
        >
            {outputToShow}
        </div>
    );
};

AgentTransactionCoverageChart.propTypes = {
    agentId: PropTypes.string
};

export default AgentTransactionCoverageChart;
