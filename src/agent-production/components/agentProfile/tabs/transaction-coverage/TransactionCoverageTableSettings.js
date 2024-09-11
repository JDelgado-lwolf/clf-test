import React from 'react';
import {
    agentCoverageListingTabs,
} from '../../../../constants/agentProductionConstants';
import { useHistory } from 'react-router-dom';
import { tableChartModes } from '../../../common/TableChartToggle';
import { Routes } from '../../../../../common/routes/routes';
import { useAgentProfileStore } from '../../../../../store/store';

export default (props) => {
    const {
        areaType,
        agent,
        tableType,
        timePeriod,
        isUnits
    } = props;

    const {
        setSelectedMlsId,
        setAreaType,
        setTableType,
        setIsUnits,
        setAgentCoverageListingTab,
        setTimePeriod
    } = useAgentProfileStore(state => ({
        setSelectedAgentId: state.setSelectedAgentId,
        setSelectedMlsId: state.setSelectedMlsId,
        setAreaType: state.setAreaType,
        setTableType: state.setTableType,
        setIsUnits: state.setIsUnits,
        setAgentCoverageListingTab: state.setAgentCoverageListingTab,
        setTimePeriod: state.setTimePeriod
    }));

    const history = useHistory();

    const goToCoverageListingsPage = (value) => {
        setAgentCoverageListingTab(agentCoverageListingTabs.TOTAL_SOLD);
        setSelectedMlsId(agent.mlsSid);
        setAreaType(areaType);
        setTableType(tableType);
        setTimePeriod(timePeriod);
        setIsUnits(isUnits);

        history.push({
            pathname: `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.COVERAGE_LISTING}`,
            state: {
                agent: agent,
                selectedArea: value,
                displayMode: tableChartModes.TABLE
            }
        });
    };

    return { goToCoverageListingsPage };
};
