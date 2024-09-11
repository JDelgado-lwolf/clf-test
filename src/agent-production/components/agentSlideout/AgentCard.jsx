import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '@lwt-helix/card';
import Icon from '@lwt-helix/icon';
import { Button, ButtonGroup } from '@lwt-helix/buttons';
import AgentNameBlock from './AgentNameBlock';
import Loader from '@lwt-helix/loader';
import { OverviewChartGraph } from '../chart/OverviewChartGraph';
import {
    getChartDataIndexes,
    getChartTotals, getOverviewChartTableParams, chartModes
} from '../../helpers/agentDataCalculators';
import { OverviewChartTable } from '../chart/OverviewChartTable';
import { agentProductionTerms, buttonTerms, TimePeriods } from '../../../constants';
import { getAgentHistory } from '../../../service/service-gateway';

const AgentCard = (props) => {

    const [chartMode, setChartMode] = useState(chartModes.VOLUME);
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const sortChartData = data => data.sort((a, b) => a.month > b.month ? 1 : -1);

    useEffect(() => {

        if (!props.selectedAgent.agentId || !props.mlsId) {
            setChartData(undefined);
            return;
        }

        const loadChartData = async () => {
            setIsLoading(true);
            const data = await getAgentHistory({
                agentId: props.selectedAgent.agentId,
                mlsId: props.mlsId
            });
            sortChartData(data);
            setChartData(data);
            setIsLoading(false);
        };

        const handleErrorInFutureTicket = e => e; // todo - add error handling

        loadChartData().catch(handleErrorInFutureTicket);

    }, [props.selectedAgent.agentId, props.mlsId]);

    const bodyProps = {
        children: (
            <div className='d-flex h-100'>
                <AgentNameBlock {...props} className='px-0' />
                <Link
                    id={`agent-detail-link-${props.selectedAgent.agentId}`}
                    className='btn text-primary ml-auto p-0 d-flex align-items-center view-profile-icon bg-none'
                    to={`/agent-detail?id=${props.selectedAgent.agentId}&module=${props.module}`}
                >
                    <div className='d-flex flex-column'>
                        <Icon dataLwtId='profile-icon' iconName='person' />
                        <div className='mt-2'>View Profile</div>
                    </div>
                </Link>
            </div>
        )
    };

    const handleChartModeClick = modeToSet => {
        setChartMode(modeToSet);
    };

    const getTimePeriod = () => TimePeriods[agentProductionTerms.last12Months];

    let chartTable, chartGraph;

    if (isLoading) {

        chartTable = <Loader />;
        chartGraph = <Loader />;

    } else {

        const timePeriod = getTimePeriod();

        const dataIndexes = getChartDataIndexes({ timePeriod, chartData });
        const {
            getSumTotal,
            labelTotal,
            getFormattedAmount,
            labelAmountChange
        } = getOverviewChartTableParams(chartMode);

        const totals = getChartTotals({ chartData, dataIndexes, getSumTotal });
        const overviewChartTableProps = {
            totals, timePeriod, chartData, dataIndexes, labelTotal,
            getFormattedAmount, labelAmountChange
        };
        const graphProps = { chartData: chartData || [], timePeriod, dataIndexes };

        chartTable = <OverviewChartTable {...overviewChartTableProps} />;
        chartGraph = <OverviewChartGraph {...graphProps} />;
    }

    return (
        <>
            <Card
                dataLwtId='agent-card'
                bodyProps={bodyProps}
                className={`w-100 ${!!props.border && 'border-0'}`}
                raised={!!props.raised}
                rounded={true}
            />

            {chartTable}

            <div className='position-relative chart-container mt-3'>

                <ButtonGroup dataLwtId={'button-group-volume-units'}>
                    <Button dataLwtId={'btn-volume'} size='xs' color={chartMode === chartModes.VOLUME ? 'primary' : ''}
                            onClick={() => handleChartModeClick(chartModes.VOLUME)}> {buttonTerms.volume}</Button>
                    <Button dataLwtId={'btn-units'} size='xs' color={chartMode === chartModes.UNITS ? 'primary' : ''}
                            onClick={() => handleChartModeClick(chartModes.UNITS)}> {buttonTerms.units}</Button>
                </ButtonGroup>

                {chartGraph}
            </div>
        </>
    );
};

export default AgentCard;
