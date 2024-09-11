import React from 'react';
import { terms } from '../../constants/savedAgents';
import { modules } from '../../../constants';
import PropTypes from 'prop-types';
import { useCommonStore, useSavedAgentsStore } from '../../../store/store';
import { SavedAgentsActions } from './SavedAgentsActions';

const SearchOptionsRow = (props) => {
    const {
        agentLists,
    } = useCommonStore(state => ({
        agentLists: state.agentLists,
    }));

    const hasResults = !!agentLists?.length;

    const {
        selectedList,
    } = useSavedAgentsStore(state => ({
        selectedList: state.selectedListByModule[modules.proficiencyMetrics.savedAgents],
    }));

    return (
        <div className='py-2 d-flex justify-content-between align-items-center'>

            <div className="d-flex align-items-center">
                <h4 className='title-row text-truncate text-capitalize mb-0 font-gray-primary'
                >
                    {terms.savedAgents}
                </h4>
                <h6 className="text-truncate mb-0 helix-body text-truncate text-capitalize">
                    {selectedList && selectedList.name}
                </h6>
            </div>

            {hasResults && <SavedAgentsActions {...props}/>}
        </div>
    )
};

SearchOptionsRow.propTypes = {
    selectedList: PropTypes.object.isRequired,
    currentColumns: PropTypes.array.isRequired,
    currentSearchDates: PropTypes.object.isRequired,
    growthAnalysisPeriod: PropTypes.string.isRequired,
    handleSelectedViewChange: PropTypes.func.isRequired,
    handleShowHideChange: PropTypes.func.isRequired,
    isPeriodLast12Months: PropTypes.bool.isRequired,
    selectedView: PropTypes.string.isRequired,
    selectedAgentsView: PropTypes.object.isRequired,
    setColumns: PropTypes.func.isRequired,
    setGrowthAnalysisPeriod: PropTypes.func.isRequired,
    exportCsv: PropTypes.func.isRequired,
    className: PropTypes.string
};

export default SearchOptionsRow;
