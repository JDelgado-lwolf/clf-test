import React, { useEffect, useMemo, useState } from 'react';
import * as _ from 'lodash-es';
import Loader from '@lwt-helix/loader';
import Card, { CardContainer } from '@lwt-helix/card';
import { CustomInput } from '@lwt-helix/controls';
import Table from '../../../../../common/components/table/agGrid/Table';
import { tableViews } from '../../../../../common/components/table/agGrid/tableViews';
import { productionTableTabToolTips } from '../../../../constants/agentProductionConstants';
import { getCurrencyFormat } from '../../../../helpers/dataFormatters';
import { OverviewChartGraph } from '../../../chart/OverviewChartGraph';
import VolumeUnitsToggle from '../../../common/VolumeUnitsToggle';
import {
    calculateChartData,
    chartModes,
    getChartDataIndexes, getOverviewGraphProps
} from '../../../../helpers/agentDataCalculators';
import { tableChartModes } from '../../../common/TableChartToggle';
import { SummaryRow } from '../../../chart/SummaryRow';
import { formatTimePeriodInterval, getPropsSummary } from './productionSummaryHelpers';
import { getElementTooltip } from '../../../../helpers/uiHelpers';
import { getAgentHistory } from '../../../../../service/service-gateway';

const ProductionTab = props => {
    const {
        mlsId,
        agentId,
        timePeriod,
        tableChartMode,
        handleClickChartGraph,
        sendToParent,
        isActive,
        productionGraphMode,
        setProductionGraphView,
        productionIsLabelEnabled,
        setProductionLabels
    } = props;
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [graphMode, setGraphMode] = useState(productionGraphMode);
    const [summaryTimePeriodData, setSummaryTimePeriodData] = useState({});
    const [tableTimePeriodData, setTableTimePeriodData] = useState([]);
    const [currentIntervalTimePeriod, setCurrentIntervalTimePeriod] = useState('');
    const [isShowChartColumnLabels, setIsShowChartColumnLabels] = useState(productionIsLabelEnabled);

    const sortProductionTableData = (data) => {
        const dataSortedByYears = _.groupBy(data, ({ month }) => new Date(month).getFullYear());
        let result = [];
        for (let year in dataSortedByYears) {
            const sortedByMonths = _.groupBy(dataSortedByYears[year], ({ month }) => new Date(month).getMonth());
            for (let obj in sortedByMonths) {
                const arrayMonth = sortedByMonths[obj];
                let objectResult = {
                    id: '',
                    month: '',
                    listUnits: 0,
                    sellUnits: 0,
                    totalUnits: 0,
                    listVolume: 0,
                    sellVolume: 0,
                    totalVolume: 0
                };

                arrayMonth.forEach((el, index) => {
                    objectResult = {
                        ...objectResult,
                        id: el.month,
                        month: el.month,
                        listUnits: objectResult.listUnits + el.listUnits,
                        sellUnits: objectResult.sellUnits + el.sellUnits,
                        totalUnits: el.listUnits + el.sellUnits,
                        listVolume: objectResult.listVolume + el.listVolume,
                        sellVolume: objectResult.sellVolume + el.sellVolume,
                        totalVolume: el.listVolume + el.sellVolume
                    };
                    if (arrayMonth.length - 1 === index) result.push(objectResult);
                });
            }
        }
        return result;
    };

    const getSummaryTableData = (data) => {
        let summaryResult = {
            listVolume: 0,
            listUnits: 0,
            sellVolume: 0,
            sellUnits: 0,
            totalVolume: 0,
            totalUnits: 0
        };
        data.forEach(obj => {
            summaryResult = {
                ...summaryResult,
                listVolume: summaryResult.listVolume + obj.listVolume,
                listUnits: summaryResult.listUnits + obj.listUnits,
                sellVolume: summaryResult.sellVolume + obj.sellVolume,
                sellUnits: summaryResult.sellUnits + obj.sellUnits,
                totalVolume: summaryResult.totalVolume + obj.totalVolume,
                totalUnits: summaryResult.totalUnits + obj.totalUnits
            };
        });
        return summaryResult;
    };

    useEffect(() => {
        if (!agentId || !mlsId) return;

        const loadProductionData = async () => {
            setIsLoading(true);
            const data = await getAgentHistory({ mlsId, agentId });
            setChartData(data);
            setIsLoading(false);
        };

        const handleErrorInFutureTicket = e => e;  // todo - add error handling

        loadProductionData().catch(handleErrorInFutureTicket);

    }, [mlsId, agentId]);

    const handleVolumeUnitsModeChange = (mode) => {
        setProductionGraphView(mode);
        setGraphMode(mode);
    };
    const handleShowLabelsSelection = (mode) => {
        setProductionLabels(mode);
        setIsShowChartColumnLabels(mode);
    };

    const graphData = useMemo(() => calculateChartData(chartData || {}), [chartData]);

    const dataIndexes = useMemo(() => {
        return getChartDataIndexes({ timePeriod, chartData: graphData });
    }, [timePeriod, graphData]);

    const memoChartGraph = useMemo(() => {

        if (!timePeriod || !dataIndexes || !graphData) return null;

        const graphProps = getOverviewGraphProps({
            chartData: graphData || [],
            timePeriod,
            dataIndexes,
            widthPixelsOutsideGraph: 100,
            graphMode
        });
        const dataToMap = graphData?.slice(dataIndexes.lastPeriodStart, dataIndexes.lastPeriodFinish + 1);
        const timePeriodInterval = [dataToMap[0].month, dataToMap[dataToMap.length - 1].month];
        setSummaryTimePeriodData(getSummaryTableData(dataToMap));
        const sortedData = sortProductionTableData(dataToMap).map(term => ({
            ...term,
            agentId,
            chartMode: tableChartModes.TABLE
        }));
        setTableTimePeriodData(sortedData);
        setCurrentIntervalTimePeriod(formatTimePeriodInterval(timePeriodInterval, timePeriod));

        if (isActive) {
            const dataForParent = {
                data: sortedData,
                currentIntervalDates: timePeriodInterval,
                tableChartMode
            };
            sendToParent(dataForParent);
        }

        return <OverviewChartGraph {...graphProps} isShowColumnLabels={isShowChartColumnLabels}
                                   handleClickChartGraph={handleClickChartGraph} />;

    }, [timePeriod, graphMode, chartData, dataIndexes, tableChartMode, isActive, isShowChartColumnLabels]);

    const isDataNotLoaded = isLoading || !dataIndexes;

    const chartGraph = isDataNotLoaded
        ? <Loader />
        : memoChartGraph;

    const getSummaryDetails = (data, tips) => {

        const summaryDetails = [];

        summaryDetails.push({
            volume: data.listVolume,
            units: data.listUnits,
            tip: tips.summaryListSide,
            dataLwtId: 'list'
        });
        summaryDetails.push({
            volume: data.sellVolume,
            units: data.sellUnits,
            tip: tips.summarySellSide,
            dataLwtId: 'sell'
        });
        summaryDetails.push({
            volume: data.totalVolume,
            units: data.totalUnits,
            tip: tips.summaryTotal,
            dataLwtId: 'total'
        });

        return summaryDetails;
    };

    const summaryDetails = getSummaryDetails(summaryTimePeriodData, productionTableTabToolTips);
    const propsSummary = (graphData && dataIndexes && graphMode) ? getPropsSummary({
        graphData,
        dataIndexes,
        graphMode
    }) : null;
    const shouldShowSummaryRow = !isLoading && timePeriod;

    /* This 'bridge-purpose' component will force 'Table' to re-render all table rows and thereby all the
    * anchor tag urls will contain updated 'intervalType' query according to the timePeriod selected option.
    * When user clicks an updated anchor tag the triggered 'Recruiting_agent_listing_detail_drilldown' endpoint
    * will get data just for the selected timePeriod, e.g. Last6Months, Annually, Last24Months. */
    const TableBridge = ({tableView, rowData, externalParams, tableTitleWithTooltips}) => {
        return (
            <Table
                tableView={tableView}
                rowData={rowData}
                externalParams={externalParams}
                tableTitleWithTooltips={tableTitleWithTooltips}
            />
        )
    }

    return (
        <>
            <div className='d-flex w-100 justify-content-end mt-1 mb-3'>
                {tableChartMode === tableChartModes.CHART && <CustomInput
                    dataLwtId='areaPercentageCheckbox'
                    type='checkbox'
                    className='mr-2'
                    checked={isShowChartColumnLabels}
                    id='productionLabelsCheckbox'
                    label={graphMode === chartModes.UNITS
                        ? getElementTooltip(productionTableTabToolTips.unitsCheckBox)
                        : getElementTooltip(productionTableTabToolTips.volumeCheckBox)}
                    onChange={() => handleShowLabelsSelection(!isShowChartColumnLabels)}
                />}
                <VolumeUnitsToggle
                    parentSetMode={handleVolumeUnitsModeChange}
                    defaultMode={graphMode} />
            </div>
            {
                tableChartMode === tableChartModes.TABLE
                    ?
                    <>
                        <div className='mb-3'>
                            <CardContainer
                                dataLwtId='agent-profile-production-card-total'
                                type='group'>
                                <Card
                                    dataLwtId='title'
                                    className='rounded-0 text-center mb-0'
                                    bodyProps={{
                                        className: 'p-2',
                                        children: <>
                                            <div
                                                className='text-center w-100 py-2 mb-0 card-header border-0 super-header'>
                                                {currentIntervalTimePeriod}
                                            </div>
                                        </>
                                    }}
                                />
                            </CardContainer>
                            <CardContainer dataLwtId='agent-profile-production-card-detail' type='group'>
                                {summaryDetails?.map(({ volume, units, tip, dataLwtId }, index) =>
                                    <Card
                                        key={index}
                                        dataLwtId={`agent-profile-production-card-${dataLwtId}`}
                                        className='rounded-0 text-center col-sm mb-0'
                                        bodyProps={{
                                            className: 'p-2',
                                            children: <>
                                                <p className='mb-0 text-nowrap helix-display-x-small'>
                                                    {getCurrencyFormat(volume)}
                                                </p>
                                                <div className='helix-body'>
                                                    {`${units} Units`}<br />
                                                    {getElementTooltip(tip)}
                                                </div>
                                            </>
                                        }}
                                    />
                                )}
                            </CardContainer>
                        </div>
                        <TableBridge
                            tableView={tableViews.agentDetailProduction}
                            rowData={tableTimePeriodData}
                            externalParams={{ timePeriod: timePeriod, productionGraphMode: productionGraphMode }}
                            tableTitleWithTooltips={productionTableTabToolTips}
                        />
                    </>
                    :
                    <>
                        <div className={'mb-2'}>
                            {shouldShowSummaryRow && <SummaryRow {...propsSummary} />}
                        </div>
                        {chartGraph}
                    </>
            }
        </>
    );
};

export default ProductionTab;
