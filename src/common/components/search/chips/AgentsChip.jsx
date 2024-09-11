import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Popover from '@lwt-helix/popover';
import { Button } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { agent } from '@lwt-helix/helix-icon/outlined';
import Modal from '@lwt-helix/modal';
import { modalTitles, searchTerms, sortingTerms, toastMessages } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import Agents from '../menus/Agents';
import { showToast } from '../../../helpers/toast';
import ToastContainerPortal from '../menus/ToastContainerPortal';
import { toggleRunSearchButton } from '../../../helpers/search';
import { useCommonStore, useSavedAgentsStore, useSearchStore } from '../../../../store/store';
import { MAX_COUNT_AGENTS_RETURNED } from '../../../helpers/agents';
import { useCloseChip } from './hooks/closeChip';
import PopoverHeader from '../menus/Agents/Components/PopoverHeader';

const AgentsChip = props => {
    const { disabled, module, userId, selectedSavedSearch, selectedMls } = props;

    const { agentsSelectedList } = useSavedAgentsStore(state => ({
        agentsSelectedList: state.selectedListByModule[module]}));

    const {
        search,
        title,
        isLoading,
        setSelectedAgentList,
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.agentsTitle,
        isLoading: state.isLoading,
        setSelectedAgentList: state.setSelectedAgentList,
    }));

    const agentLists = useCommonStore(state => state.agentLists);

    const [state, setState] = useState({
        isPopoverOpen: false,
        toastProps: undefined,
        isListModalOpen: false,
        loadingAgents: false
    });
    const [agents, setAgents] = useState(undefined);
    const [isMaxAgentCountExceeded, setIsMaxAgentCountExceeded] = useState(false);

    useCloseChip(state.isPopoverOpen, setState, state.isListModalOpen);

    useEffect(() => {
        if (selectedMls) {
            const mls = {
                ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                    mls.realEstateDatasourceId === search.mlsId
                )
            };
            const selectedAgentCriteria = mls?.idFiltering?.find(f => f.idType === searchTerms.agentIdType);
            setStateData('selectedAgentCriteria', selectedAgentCriteria, setState);
        }
    }, [search]);

    useEffect(() => {
        agentLists && setStateData(
            'agentLists',
            [...agentLists].filter(list => list.mlsId === selectedMls?.mlsId),
            setState
        );
    }, [agentLists, selectedMls]);

    useEffect(() => {
        agents && setState(prevState => ({
            ...prevState,
            filteredAgents: agents
        }));
    }, [agents]);

    useEffect(() => {
        setStateData('isLoading', isLoading, setState);
    }, [isLoading]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const defaultOption = { label: searchTerms.savedAgentList, options: [{ label: searchTerms.savedAgentList, value: '' }] };

    useEffect(() => {
        if (!state.agentLists?.length) {
            setStateData('options', undefined, setState);
            return;
        }

        const options = [
            defaultOption,
            {
                label: searchTerms.myAgentLists,
                options: state.agentLists.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                    .map(list => ({
                        label: list.name,
                        value: list.agentListId
                    }))
            }
        ];
        setStateData('options', options, setState);
    }, [state.agentLists]);

    const toggleListModal = () => setStateData('isListModalOpen', !state.isListModalOpen, setState);

    const toggleErrorModal = () => {
        if (state.showErrorModal) {
            // delay closing the modal until the togglePopover is called
            setTimeout(() => {
                setStateData('showErrorModal', !state.showErrorModal, setState);
                setIsMaxAgentCountExceeded(false);
            }, 500);
        } else {
            setStateData('showErrorModal', !state.showErrorModal, setState);
        }
    };

    const togglePopover = () => {
        if (!state.showErrorModal && !state.isListModalOpen) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
            setFilteredAgents(undefined);
        }
    };

    const closePopover = () => {
        setState(prevState => ({
            ...prevState,
            showErrorModal: false,
            isListModalOpen: false,
            isPopoverOpen: false,
            filteredAgents: undefined
        }));
    };

    const setToastProps = (type, message) => {
        showToast(type, message, setState);
    };

    const setSelectedSortOption = option => {
        setStateData('selectedSortOption', option, setState);
    };

    const setFilteredAgents = agents => {
        setStateData('filteredAgents', agents, setState);
    };

    const sortOptions = [
        { value: sortingTerms.agentNameValue, label: sortingTerms.alphaLabel },
        { value: sortingTerms.volumeValue, label: sortingTerms.volumeLabel }
    ];

    const handleSortChange = (option) => {
        setSelectedSortOption(option);
    };

    const selectAgentList = (agentList) => {
        setSelectedAgentList(agentList, selectedSavedSearch);
    };

    return (<>
        <Button
            id='agents-chip'
            dataLwtId='agents-chip'
            size='sm'
            color='secondary'
            className='mb-1 text-capitalize text-truncate truncated-chip-button'
            onClick={togglePopover}
            disabled={disabled}
            style={{ whiteSpace: 'pre' }}
        >
            <HelixIcon icon={agent} className='align-bottom mr-1' title='agents icon' />
            {agentsSelectedList?.name ? agentsSelectedList.name : title?.mainTitle}
        </Button>

        <Popover
            innerClassName='helix-heading'
            target='agents-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={
                state.options
                    ? searchTerms.agents
                    : <PopoverHeader
                        sortOptions={sortOptions}
                        handleSortChange={handleSortChange}
                        selectedSortOption={state.selectedSortOption}/>}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            style={{ width: '1200px' }}
            modifiers={{
                flip: { enabled: false },
                preventOverflow: { boundariesElement: 'viewport' }
            }}
            body={
                <Agents
                    filteredAgents={state.filteredAgents}
                    setFilteredAgents={setFilteredAgents}
                    loadingAgents={isLoading}
                    selectedAgentCriteria={state.selectedAgentCriteria}
                    selectedSortOption={state.selectedSortOption}
                    setSortOption={setSelectedSortOption}
                    mlsId={selectedMls?.mlsId}
                    module={module}
                    userId={userId}
                    toggleListModal={toggleListModal}
                    showToast={setToastProps}
                    closePopover={closePopover}
                    toggleErrorModal={toggleErrorModal}
                    agentLists={state.agentLists}
                    selectedSavedSearch={selectedSavedSearch}
                    setAgents={setAgents}
                    setIsMaxAgentCountExceeded={setIsMaxAgentCountExceeded}
                    sortOptions={sortOptions}
                    selectAgentList={selectAgentList}
                    options={state.options}
                />
            }
        />
        <Modal
            title={isMaxAgentCountExceeded ? modalTitles.tooManyResults : modalTitles.tooManySelections}
            show={state.showErrorModal}
            onClose={toggleErrorModal}
        >
            {/* TODO: If you see this please create a reusable component and call it here and in src\common\components\search\chips\MarketAreaChip.jsx
            Also, please get rid of these inline styles */}
            <div style={{ padding: '0 30px' }}>
                    <div style={{ float: 'left', fontSize: '3rem', width: '20%' }}>
                        <i className='material-icons alert-icon text-danger'>
                            warning
                        </i>
                    </div>
                    <div>
                   { isMaxAgentCountExceeded ?
                        toastMessages.error.searchExceeded(MAX_COUNT_AGENTS_RETURNED)
                        :
                       <>
                        {toastMessages.error.tooManySelections}
                        <br />
                        {toastMessages.error.limitYourSelection}
                       </>
                    }
                    </div>
                </div>
        </Modal>
        <ToastContainerPortal toastProps={state.toastProps} />
    </>);
};

AgentsChip.propTypes = {
    disabled: PropTypes.bool,
    module: PropTypes.string,
    userId: PropTypes.number,
    selectedSavedSearch: PropTypes.obj,
    selectedMls: PropTypes.obj,
};

export default AgentsChip;
