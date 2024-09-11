import React from 'react';
import PropTypes from 'prop-types';
import { views } from '../../../constants/savedAgents';
import { agentProductionTerms } from '../../../../constants';
import { Dropdown } from '@lwt-helix/dropdown';

const GrowthAnalysisPeriodDropdown = ({ growthAnalysisPeriod, setGrowthAnalysisPeriod }) => {
    return <>
            <div className='mr-2 d-inline-block'>
                <Dropdown
                    dataLwtId='growth-analysis-period-dropdown'
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
                    toggleProps={{
                        dataLwtId: 'no-split-toggle',
                        id: 'caret',
                        color: 'secondary',
                        caret: true,
                        children: growthAnalysisPeriod,
                        className: 'btn btn-sm btn-secondary'
                    }}
                />
            </div>
        </>
};

export default GrowthAnalysisPeriodDropdown;

GrowthAnalysisPeriodDropdown.propTypes = {
    growthAnalysisPeriod: PropTypes.string.isRequired,
    setGrowthAnalysisPeriod: PropTypes.func.isRequired
};
