import React from 'react';
import { useLocation } from 'react-router-dom';
import { Dropdown } from '@lwt-helix/dropdown';
import { searchTerms, searchTypes } from '../../../constants';
import ExportShareButtons from './ExportShareButtons';
import { viewHideAgentsDropdownLabels } from '../../constants/agentProductionConstants';
import { useSearchStore } from '../../../store/store';

const TitleRow = props => {
    const {
        title,
        module,
        showHideAgentsDropdown,
        viewHideAgentsDropdownValue,
        setViewHideAgentsDropdownValue,
        ...exportProps
    } = props;

    const selectedSavedSearch = useSearchStore(state => state[module]?.selectedSavedSearch);

    const location = useLocation();

    return (
        <div className='row w-100 ml-2 my-2 pr-1 py-0'>
            <div className='mr-auto' style={{ width: '70%' }}>
                {selectedSavedSearch
                    ? (
                        <h2 className='text-truncate mb-0 my-3 helix-display-small' style={{ whiteSpace: 'pre' }}>
                            {selectedSavedSearch.savedSearch?.searchName}
                        </h2>
                    ) : (
                        <>
                            <h2 className='text-truncate mb-0 helix-display-small' style={{ whiteSpace: 'pre' }}>
                                {searchTerms.newSearch}
                            </h2>
                            <h5 className='text-truncate mb-0 helix-heading' style={{ whiteSpace: 'pre' }}>
                                {searchTypes[location.pathname].title} Search
                            </h5>
                        </>
                    )}
            </div>
            <div className='d-flex flex-row-reverse align-items-center'>
                <ExportShareButtons {...exportProps} />
                {showHideAgentsDropdown ?
                    <Dropdown
                        dataLwtId='share-options'
                        toggleProps={{
                            dataLwtId: 'no-split-toggle',
                            id: 'caret',
                            caret: true,
                            children: viewHideAgentsDropdownValue,
                            className: 'bg-dark btn btn-sm btn-secondary mr-2'
                        }}
                        items={[
                            {
                                dataLwtId: 'no-split-item1',
                                itemText: viewHideAgentsDropdownLabels.viewHideAgents,
                                key: 'item_1',
                                onClick: () =>
                                    setViewHideAgentsDropdownValue(viewHideAgentsDropdownLabels.viewHideAgents)
                            },
                            { dataLwtId: 'no-split-item2', divider: true, key: 'item_2' },
                            {
                                dataLwtId: 'no-split-item3',
                                itemText: viewHideAgentsDropdownLabels.viewOnlyMyAgents,
                                key: 'item_3',
                                onClick: () =>
                                    setViewHideAgentsDropdownValue(viewHideAgentsDropdownLabels.viewOnlyMyAgents)
                            },
                            {
                                dataLwtId: 'no-split-item4',
                                divider: true,
                                key: 'item_4'
                            },
                            {
                                dataLwtId: 'no-split-item5',
                                itemText: viewHideAgentsDropdownLabels.hideMyAgents,
                                key: 'item_5',
                                onClick: () => setViewHideAgentsDropdownValue(viewHideAgentsDropdownLabels.hideMyAgents)
                            }
                        ]}
                        menuProps={{
                            dataLwtId: 'share-menu',
                            right: true
                        }}
                    />
                    : <></>}
            </div>
        </div>
    );
};

export default TitleRow;
