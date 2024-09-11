import React from 'react';
import PropTypes from 'prop-types';
import { useCommonStore, useSavedAgentsStore, useSearchStore } from "../../../../store/store";
import { views } from '../../../constants/savedAgents';
import Loader from '@lwt-helix/loader';
import { NoSavedAgentsMessage } from './common/NoSavedAgentsMessage';
import { agentProductionTerms as terms } from '../../../../constants';
import Table from '../../../../common/components/table/agGrid/Table';
import { getLast12MonthDates } from '../../helpers/savedAgents';
import Footer from './common/Footer';
import { getSummaryPinnedConfig } from '../../../../common/components/table/agGrid/pinnedRowSettings';

export const SavedAgentsContent = ({
    savedAgentState,
    gridRef,
    tableSettingsByView
}) => {
    const { rowData, selectedView } = savedAgentState;
    const {
        isAgentDataLoading,
        agentLists,
        timeIntervals,
    } = useCommonStore(state => ({
        isAgentDataLoading: state.isLoading,
        agentLists: state.agentLists,
        timeIntervals: state.timeIntervals,
    }));

    const {
        isLoading,
        propertyTypeNames,
    } = useSavedAgentsStore(state => ({
        isLoading: state.isLoading,
        propertyTypeNames: state.propertyTypeNames,
    }));

    const selectedModule = useSearchStore(state => state.selectedModule);

    const {
        summaryPinnedData,
    } = useSearchStore(state => ({
        summaryPinnedData: state[selectedModule]?.summaryPinnedData,
    }));

    const summaryPinnedConfig = getSummaryPinnedConfig(selectedView);

    const shouldShowPinnedRow = [
        views.overview,
        views.listingProficiency,
    ].includes(selectedView);

    const isPageLoading = isLoading || isAgentDataLoading;

    const last12MonthsDates = timeIntervals?.length && getLast12MonthDates(timeIntervals, terms.annually);

    // TODO: If you see this, please create a component for this and use it everywere we have this same code
    if (isPageLoading) return (<div className='py-3'><Loader /></div>);

    const hasResults = !!agentLists?.length;

    if (!hasResults) return (
        <div className='mt-5'>
            <NoSavedAgentsMessage isDropdown={false} />
        </div>);

    if (!rowData.length) return (
        <div className='py-5 d-flex justify-content-center'>
            <p className='no-search-results-suggestion'>{terms.viewOnlyMyAgentsNoData}</p>
        </div>);

    return (
        <div className='px-2'>
            <Table
                additionalTableHeaders={tableSettingsByView[selectedView]?.additionalTableHeaders}
                columns={tableSettingsByView[selectedView]?.columns}
                gridRef={gridRef}
                rowData={rowData}
                tableTitleWithTooltips={tableSettingsByView[selectedView]?.tableTitleWithTooltips}
                tableView={tableSettingsByView[selectedView]?.tableView}
                pinnedBottomRowData={shouldShowPinnedRow && [{...summaryPinnedData}]}
                externalParams={shouldShowPinnedRow && {summaryPinnedConfig}}
            />
            <Footer
                timeInterval={last12MonthsDates}
                propertyTypeNames={propertyTypeNames}
            />
        </div>);
};

SavedAgentsContent.propTypes = {
    savedAgentState: PropTypes.object,
    gridRef: PropTypes.object,
    tableSettingsByView: PropTypes.object,
};
