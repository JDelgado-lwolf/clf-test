import React, { useRef, useState, useEffect } from 'react';
import Loader from '@lwt-helix/loader';
import Table from '../../../components/table/agGrid/Table';
import { searchTerms, agentProductionTerms, statusMap } from '../../../../constants';
import { tableViews } from '../../table/agGrid/tableViews';
import { addedAgentsTooltips, availableAgentsTooltips } from '../../../../agent-production/constants/agentProductionConstants';

const AvailableAgentTable = props => {
    const { availableAgents, addAgents, loadingAgents } = props;
    const [state, setState] = useState({
        availableAgents: []
    });

    const gridRef = useRef();

    useEffect(() => {
        if (!!availableAgents?.length && availableAgents?.length > 0) {
            setState((prevState) => ({
                ...prevState,
                availableAgents: availableAgents.map((agent) => {
                    return {
                        ...agent,
                        agentName: `${agent.firstName} ${agent.lastName}`,
                        agentStatus: statusMap[agent.status],
                    }
                })
            }));
        }
    }, [availableAgents]);

    if (loadingAgents) {
        return (
            <div className="h-50">
                <Loader />
            </div>
        );
    }

    if (availableAgents?.length) {
        return (
            <Table
                gridRef={gridRef}
                tableView={tableViews.availableAgents}
                rowData={state.availableAgents}
                tableTitleWithTooltips={availableAgentsTooltips}
                onRowClicked={(agent) => addAgents([agent])}
            />
        );
    }

    return (
        <div className='d-flex justify-content-center align-items-center h-100 pt-3'>
            <div className="w-100 text-center">
                <div className="font-weight-bold d-block">{searchTerms.none}</div>
                <p className="text-muted">{agentProductionTerms.findAgents}</p>
            </div>
        </div>
    );
};

const AddedAgentsTable = props => {
    const { addedAgents, removeAgents } = props;
    const [state, setState] = useState({
        addedAgents: []
    });

    const gridRef = useRef();

    useEffect(() => {
        if (!!addedAgents?.length && addedAgents?.length > 0) {
            setState((prevState) => ({
                ...prevState,
                addedAgents: addedAgents.map((agent) => {
                    return {...agent, agentName: `${agent.firstName} ${agent.lastName}`}
                })
            }));
        }
    }, [addedAgents]);

    return (
        <Table
            gridRef={gridRef}
            tableView={tableViews.addedAgents}
            rowData={state.addedAgents}
            tableTitleWithTooltips={addedAgentsTooltips}
            onRowClicked={(agent) => removeAgents([agent])}
        />
    );
};

export {
    AvailableAgentTable,
    AddedAgentsTable
};
