import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import AgentsTableControls from './AgentsTableControls';
import { listingProficiencyTooltips, tabModes } from '../../constants/agentProductionConstants';
import { getHeaderText } from '../../helpers/listingProficiencyHelpers';
import Table from '../../../common/components/table/agGrid/Table';
import { tableViews } from '../../../common/components/table/agGrid/tableViews';
import { useSearchStore } from '../../../store/store';
import { getSummaryPinnedConfig } from '../../../common/components/table/agGrid/pinnedRowSettings';
import { views } from '../../constants/savedAgents';

const ListingProficiency = props => {

    const selectedModule = useSearchStore(state => state.selectedModule);

    const {
        summaryPinnedData,
    } = useSearchStore(state => ({
        summaryPinnedData: state[selectedModule]?.summaryPinnedData,
    }));

    const summaryPinnedConfig = getSummaryPinnedConfig(views.listingProficiency);

    const { agentData, additionalTableHeaders, setColumns, columns } = props;
    const popoverHeader = getHeaderText();

    const paramsTableControls = {
        columns,
        setColumns,
        tabMode: tabModes.LISTING_PROFICIENCY,
        popoverClassName: 'listing-proficiency',
        popoverHeader,
        hasShowHideColumnsButton: true,
        isTableSelected: true
    };

    const hasAdditionalTableHeaders = !!additionalTableHeaders.length;
    const classNameContainer = hasAdditionalTableHeaders ? '' : 'has-no-superheaders';
    const gridRef = useRef();

    return (
        <>
            <AgentsTableControls {...paramsTableControls} />
            <div className={classNameContainer}>
                <Table
                    gridRef={gridRef}
                    tableView={tableViews.listingProficiency}
                    rowData={agentData}
                    columns={columns}
                    additionalTableHeaders={additionalTableHeaders}
                    tableTitleWithTooltips={listingProficiencyTooltips}
                    pinnedBottomRowData={[{...summaryPinnedData}]}
                    externalParams={{summaryPinnedConfig}}
                />
            </div>
        </>
    );
};

ListingProficiency.propTypes = {
    agentData: PropTypes.arrayOf(PropTypes.object),
    additionalTableHeaders: PropTypes.arrayOf(PropTypes.object)
};

export default ListingProficiency;
