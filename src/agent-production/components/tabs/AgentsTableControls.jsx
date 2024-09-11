import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup } from '@lwt-helix/buttons';
import { Button } from '@lwt-helix/buttons';
import Popover from '@lwt-helix/popover';
import { Dropdown } from '@lwt-helix/dropdown';
import MetricsSelector from '../MetricsSelector';
import { tabModes } from '../../constants/agentProductionConstants';
import { agentProductionTerms } from '../../../constants';
import { modifierNoFlip } from '../../helpers/popoverHelpers';

const AgentsTableControls = ({
                                 isTableSelected,
                                 setIsTableSelected,
                                 columns,
                                 setColumns,
                                 tabMode,
                                 popoverClassName = '',
                                 popoverHeader = agentProductionTerms.metrics,
                                 hasShowHideColumnsButton,
                                 hasTableChartToggle,
                                 isLeftSide,
                                 growthAnalysisPeriod,
                                 setGrowthAnalysisPeriod,
                                 customSettings
                             }) => {
    const [popoverIsOpen, setPopoverIsOpen] = useState(false);

    const togglePopover = () => {
        setPopoverIsOpen(!popoverIsOpen);
    };

    let popover;

    if (hasShowHideColumnsButton) {
        popover = (
            <Popover
                innerClassName='helix-heading'
                target={'btnShowHideMetrics' + tabMode}
                placement={'bottom-end'}
                trigger='legacy'
                size='auto'
                header={popoverHeader}
                toggle={togglePopover}
                isOpen={popoverIsOpen}
                {...modifierNoFlip}
                className={`metrics-selector ${popoverClassName}`}
                body={<MetricsSelector
                    columns={columns}
                    setColumns={setColumns}
                    tabMode={tabMode}
                    customSettings={customSettings}
                />
                }
            />
        );
    }

    return (
        <div className={`w-100 text-right agents-table-controls d-inline-block mb-1 ${popoverClassName}`}>
            {hasShowHideColumnsButton && isTableSelected &&
            <div className='d-inline-block'>
                <Button
                    dataLwtId='toggle-metrics-button'
                    size='sm'
                    className='ml-auto'
                    id={'btnShowHideMetrics' + tabMode}
                    onClick={togglePopover}
                >
                    {agentProductionTerms.showHideMetrics}
                </Button>
                {popover}
            </div>}

            {tabMode === tabModes.GROWTH_ANALYSIS &&
            <div className='ml-2 d-inline-block '>
                <Dropdown
                    dataLwtId='share-options'
                    toggleProps={{
                        dataLwtId: 'no-split-toggle',
                        id: 'caret',
                        color: 'secondary',
                        caret: true,
                        children: growthAnalysisPeriod,
                        className: 'btn btn-sm btn-secondary'
                    }}
                    items={[
                        {
                            dataLwtId: 'no-split-item1',
                            itemText: agentProductionTerms.last12Months,
                            key: 'item_1',
                            onClick: () =>
                                setGrowthAnalysisPeriod(agentProductionTerms.last12Months)
                        },
                        { dataLwtId: 'no-split-item2', divider: true, key: 'item_2' },
                        {
                            dataLwtId: 'no-split-item3',
                            itemText: agentProductionTerms.yearToDate,
                            key: 'item_3',
                            onClick: () =>
                                setGrowthAnalysisPeriod(agentProductionTerms.yearToDate)
                        }
                    ]}
                    menuProps={{
                        dataLwtId: 'share-menu',
                        right: true
                    }}
                />
            </div>}

            {hasTableChartToggle &&
            <ButtonGroup
                className={'mb-2' + (!isTableSelected && !isLeftSide ? ' ml-auto' : '')}
                dataLwtId='table-controls'
            >
                <Button
                    dataLwtId='table-button'
                    size='sm'
                    onClick={() => setIsTableSelected(true)}
                    className={`text-uppercase ${isTableSelected ? 'active' : ''}`}
                >
                    Table
                </Button>
                <Button
                    dataLwtId='chart-button'
                    size='sm'
                    onClick={() => setIsTableSelected(false)}
                    className={`text-uppercase ${isTableSelected ? '' : 'active'}`}
                >
                    Chart
                </Button>
            </ButtonGroup>}
        </div>
    );
};

AgentsTableControls.propTypes = {
    isTableShown: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.object),
    setColumns: PropTypes.func,
    tabMode: tabModes,
    popoverClassName: PropTypes.string,
    hasShowHideColumnsButton: PropTypes.bool,
    hasTableChartToggle: PropTypes.bool
};

export default AgentsTableControls;
