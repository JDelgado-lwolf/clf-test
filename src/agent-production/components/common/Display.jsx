import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from '@lwt-helix/select';
import { Label } from '@lwt-helix/controls';
import { terms, viewOptions, showOptions } from '../../constants/savedAgents';
import { setStateData } from '../../../common/helpers/state';
import { popoverIds } from '../savedAgents/helpers/index'
import { useSearchStore } from '../../../store/store';
import { responseKeys } from '../../../constants/service';

const Display = ({
    handleSelectedViewChange,
    handleShowHideChange,
    selectedView,
    selectedAgentsView,
    togglePopover
}) => {

    const [state, setState] = useState({
        agentsView: viewOptions.find(view => view.value === selectedView)
    });

    const {
        setSummaryPinnedData,
    } = useSearchStore(state => ({
        setSummaryPinnedData: state.setSummaryPinnedData
    }));

    const handleAgentsViewChange = (view, dataLwtId) => {
        const selectedView = viewOptions.find(option => option.value === view.value);
        setStateData('agentsView', selectedView, setState);
        handleSelectedViewChange(view.value);
        setSummaryPinnedData(selectedView.value, responseKeys.recruitingSoldTotals);
        togglePopover(view, dataLwtId);
    };

    const handleAgentsShowChange = (show, dataLwtId) => {
        handleShowHideChange(show.value);
        togglePopover(show, dataLwtId);
    };

    return (
        <div className='py-2'>
            <Label
                dataLwtId='select-agents-view-label'
                for='select-agents-view'
                className='mb-1 helix-heading text-capitalize'
            >
                {terms.view}
            </Label>
            <Select
                id='select-agents-view'
                dataLwtId='select-agents-view'
                className='mb-2'
                isClearable={false}
                options={viewOptions}
                defaultValue={state.agentsView}
                matchFrom='start'
                value={state.agentsView}
                onChange={(view) => handleAgentsViewChange(view, popoverIds.display)}
            />

            <Label
                dataLwtId='select-agents-groups-label'
                for='select-agents-groups'
                className='mb-1 helix-heading text-capitalize'
            >
                {terms.agents}
            </Label>
            <Select
                id='select-agents-groups'
                dataLwtId='select-agents-groups'
                isClearable={false}
                options={showOptions}
                defaultValue={selectedAgentsView}
                matchFrom='start'
                value={showOptions.find(show => show.value === selectedAgentsView)}
                onChange={(view) => handleAgentsShowChange(view, popoverIds.display)}
            />
        </div>
    )
};

Display.propTypes = {
    handleSelectedViewChange: PropTypes.func.isRequired,
    handleShowHideChange: PropTypes.func.isRequired,
    selectedView: PropTypes.string.isRequired,
    selectedAgentsView: PropTypes.string.isRequired,
};

export default Display;
