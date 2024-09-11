import React, { useState } from 'react'
import PropTypes from 'prop-types';
import DropDownOption from './DropDownOption'
import { popoverIds } from '../savedAgents/helpers'
import { popoverTerms } from '../../constants/agentProductionConstants'
import { agentProductionTerms as apt, buttonTerms } from '../../../constants';
import Display from './Display';
import GrowthAnalysisPeriodDropdown from '../savedAgents/components/GrowthAnalysisPeriodDropdown';
import { views } from '../../constants/savedAgents';
import { HelixIcon } from '@lwt-helix/helix-icon';
import MetricsSelector from '../MetricsSelector';
import { columns, inbox } from '@lwt-helix/helix-icon/outlined';
import { getHeaderText } from '../../helpers/listingProficiencyHelpers';
import { Button } from '@lwt-helix/buttons';

export const SavedAgentsActions = (props) => {
    const {
        currentColumns,
        currentSearchDates,
        growthAnalysisPeriod,
        handleSelectedViewChange,
        handleShowHideChange,
        isPeriodLast12Months,
        selectedView,
        selectedAgentsView,
        className,
        setColumns,
        setGrowthAnalysisPeriod,
        exportCsv
    } = props;

    const [showDisplayPopover, setShowDisplayPopover] = useState(false);
    const [showMetricsPopover, setShowMetricsPopover] = useState(false);

    const togglePopover = (e, dataLwtId) => {
        if (dataLwtId === popoverIds.display) return setShowDisplayPopover(!showDisplayPopover);
        if (dataLwtId === popoverIds.metrics) return setShowMetricsPopover(!showMetricsPopover);
    };

    return (
        <div className='d-flex justify-content-center align-items-center px-2'>
            <DropDownOption
                dataLwtId={popoverIds.display}
                popoverInnerClassName='popover-menu-width-224'
                popoverPlacement={popoverTerms.bottomEnd}
                popoverIsOpen={showDisplayPopover}
                togglePopover={togglePopover}
                mainTitle={apt[selectedView]}
                popoverBody={<Display
                                handleSelectedViewChange={handleSelectedViewChange}
                                handleShowHideChange={handleShowHideChange}
                                selectedView={selectedView}
                                selectedAgentsView={selectedAgentsView}
                                togglePopover={togglePopover} />}
            />
            {selectedView === views.growthAnalysis &&
                <GrowthAnalysisPeriodDropdown
                    growthAnalysisPeriod={growthAnalysisPeriod}
                    setGrowthAnalysisPeriod={setGrowthAnalysisPeriod} />}
            <DropDownOption
                dataLwtId={popoverIds.metrics}
                popoverInnerClassName='popover-menu-width-800 helix-heading'
                popoverPlacement={popoverTerms.bottomEnd}
                popoverIsOpen={showMetricsPopover}
                popoverClassName={className}
                popoverHeader={selectedView === views.listingProficiency ? getHeaderText() : null}
                togglePopover={togglePopover}
                mainTitle={<HelixIcon icon={columns} className='mr-2' />}
                popoverBody={<MetricsSelector
                                columns={currentColumns}
                                customSettings={{currentSearchDates, isPeriodLast12Months}}
                                setColumns={setColumns}
                                tabMode={selectedView} />}
            />
            <Button
                color='secondary'
                dataLwtId='agents-download-btn'
                id='agents-download-btn'
                size='sm'
                onClick={exportCsv}
            >
                <div className='d-flex align-items-center'>
                    <HelixIcon icon={inbox} className='mr-2' />
                    <span className='text-capitalize'>
                        {buttonTerms.download}
                    </span>
                </div>
            </Button>
        </div>
    )
};

SavedAgentsActions.propTypes = {
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
