import React from 'react';
import Modal from '@lwt-helix/modal';
import SearchOptionsRow from './common/SearchOptionsRow';
import { setStateData } from '../../common/helpers/state';
import { exportCsv } from './common/exportCsv';
import AddAgentListPopover from './common/AddAgentListPopover';
import { useSavedAgentsTable } from '../hooks/savedAgentsTable';
import { useSavedAgents } from '../hooks/savedAgents';
import { SavedAgentsContent } from './savedAgents/components/SavedAgentsContent';
import { agentProductionTerms as terms } from '../../constants';

const SavedAgents = () => {

    const { state, setState, gridRef } = useSavedAgents();

    const tableSettingsByView = useSavedAgentsTable(state, setState);

    const isGrowthAnalysisLast12MonthsPeriod = state.growthAnalysisPeriod ===  terms.last12Months;

    const handleSelectedViewChange = (view) => setStateData('selectedView', view, setState);

    const handleShowHideChange = (view) => setStateData('selectedAgentsView', view, setState);

    const setGrowthAnalysisPeriod = (period) => {
        setStateData('growthAnalysisPeriod', period, setState);
    };

    return (
        <>
            <Modal {...state.modalProps} show={state.showModal} />
            <SearchOptionsRow
                currentColumns={tableSettingsByView[state.selectedView]?.columns}
                currentSearchDates={state.currentSearchDates}
                isPeriodLast12Months={isGrowthAnalysisLast12MonthsPeriod}
                growthAnalysisPeriod={state.growthAnalysisPeriod}
                handleSelectedViewChange={handleSelectedViewChange}
                handleShowHideChange={handleShowHideChange}
                selectedView={state.selectedView}
                selectedAgentsView={state.selectedAgentsView}
                className={tableSettingsByView[state.selectedView].className}
                setColumns={tableSettingsByView[state.selectedView]?.setColumns}
                exportCsv={() => exportCsv(state, setState, state.selectedView, state.rowData)}
                setGrowthAnalysisPeriod={setGrowthAnalysisPeriod}
            />
            <SavedAgentsContent
                gridRef={gridRef}
                tableSettingsByView={tableSettingsByView}
                savedAgentState={state}
            />
            <AddAgentListPopover />
        </>
    )
};

export default SavedAgents;
