import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AgentsTableControls from './AgentsTableControls';
import AgentChart from '../chart/AgentChart';
import { overviewToolTips, tabModes } from '../../constants/agentProductionConstants';
import Table from '../../../common/components/table/agGrid/Table';
import { tableViews } from '../../../common/components/table/agGrid/tableViews';
import { useSearchStore } from '../../../store/store';
import { getSummaryPinnedConfig } from '../../../common/components/table/agGrid/pinnedRowSettings';
import { views } from '../../constants/savedAgents';

const Overview = props => {
    const {
        agentData,
        chartOptions,
        chartSchema,
        currentAgentChart,
        additionalTableHeaders,
        columns,
        setColumns,
        module
    } = props;

    const gridRef = useRef();
    const [isTableSelected, setIsTableSelected] = useState(true);

    const selectedModule = useSearchStore(state => state.selectedModule);

    const {
        summaryPinnedData,
    } = useSearchStore(state => ({
        summaryPinnedData: state[selectedModule]?.summaryPinnedData,
    }));

    const summaryPinnedConfig = getSummaryPinnedConfig(views.overview);

    return (
        <>
            <AgentsTableControls
                isTableSelected={isTableSelected}
                setIsTableSelected={setIsTableSelected}
                tabMode={tabModes.OVERVIEW}
                columns={columns}
                setColumns={setColumns}
                hasShowHideColumnsButton={true}
                hasTableChartToggle={false}
            />
            {isTableSelected ? (
                <Table
                    gridRef={gridRef}
                    tableView={tableViews.overview}
                    rowData={agentData}
                    columns={columns}
                    additionalTableHeaders={additionalTableHeaders}
                    tableTitleWithTooltips={overviewToolTips}
                    pinnedBottomRowData={[{...summaryPinnedData}]}
                    externalParams={{summaryPinnedConfig}}
                />
            ) : (
                <AgentChart
                    options={chartOptions}
                    schema={chartSchema}
                    data={agentData}
                    currentAgentChart={currentAgentChart}
                    module={module}
                />
            )
            }
        </>
    );
};

Overview.propTypes = {
    agentData: PropTypes.arrayOf(PropTypes.object),
    tableOptions: PropTypes.object,
    chartOptions: PropTypes.object,
    chartSchema: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.object),
    setColumns: PropTypes.func,
    currentAgentChart: PropTypes.string,
    module: PropTypes.string
};

export default Overview;
