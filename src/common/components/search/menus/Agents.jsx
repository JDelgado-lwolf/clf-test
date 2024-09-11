import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual, unionBy } from 'lodash-es';
import { Button } from '@lwt-helix/buttons';
import { Input, Label } from '@lwt-helix/controls';
import Form, { FormGroup } from '@lwt-helix/form';
import { Col, Row } from '@lwt-helix/layout';
import Modal from '@lwt-helix/modal';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { circle_info } from '@lwt-helix/helix-icon/outlined';
import {
    agentFilter,
    agentProductionTerms,
    buttonTerms,
    searchTerms,
    status,
    toastMessages
} from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import TransferList from './TransferList';
import { AddedAgentsTable, AvailableAgentTable } from './AvailableAgentTable';
import EditListModal from './EditListModal';
import {
    deleteSavedAgentList,
    getSearchesByAgentListId,
    updateSavedAgentList
} from '../../../../service/service-gateway';
import { modalKeys } from '../../../helpers/menu';
import AffectedSavedSearchesModal from './AffectedSavedSearchesModal';
import { useCommonStore, useSearchStore, useSavedAgentsStore } from '../../../../store/store';
import { getMlsAgents, getMlsAgentsByIds } from '../../../../service/mlsInfo';
import { MAX_COUNT_AGENTS_RETURNED } from '../../../helpers/agents';
import AgentListsSelectRow from './Agents/Components/AgentListsSelectRow';
import { OverwriteModalContent } from '../OverwriteModalContent';

const Agents = (props) => {
    const {
        filteredAgents,
        loadingAgents,
        setFilteredAgents,
        selectedSortOption,
        mlsId,
        userId,
        module,
        toggleListModal,
        closePopover,
        showToast,
        selectedAgentCriteria,
        toggleErrorModal,
        agentLists,
        selectedSavedSearch,
        setAgents,
        setIsMaxAgentCountExceeded,
        sortOptions,
        handleSortChange,
        selectAgentList,
        options,
    } = props;

    const {
        setSelectedAgents,
        listIsDirty,
        resetSelectedAgentList,
        resetSelectedAgentListTitle,
        setAgentsTitle
    } = useSearchStore(state => ({
        setSelectedAgents: state.setSelectedAgents,
        listIsDirty: state[module]?.listIsDirty,
        resetSelectedAgentList: state.resetSelectedAgentList,
        resetSelectedAgentListTitle: state.resetSelectedAgentListTitle,
        setAgentsTitle: state.setAgentsTitle,
    }));

    const {
        closeEditModal,
        validateAgentListNameAndSave,
        validateSavedSearchAndDelete,
        toggleOverwriteModal,
        continueWithSavedSearchesUpdate,
        selectedList,
        updateAgentChipTitle,
    } = useSavedAgentsStore(state => ({
        closeEditModal: state.closeEditModal,
        validateAgentListNameAndSave: state.validateAgentListNameAndSave,
        validateSavedSearchAndDelete: state.validateSavedSearchAndDelete,
        toggleOverwriteModal: state.toggleOverwriteModal,
        continueWithSavedSearchesUpdate: state.continueWithSavedSearchesUpdate,
        selectedList: state.selectedListByModule[module],
        updateAgentChipTitle: state.updateAgentChipTitle,
    }));

    const {
        getAgentLists,
    } = useCommonStore(state => ({
        getAgentLists: state.getAgentLists
    }));

    const setIsLoading = useSearchStore(state => state.setIsLoading);

    const nameSort = (a, b) => {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    };

    const volumeSort = (a, b) => {
        return (b.volume ?? 0) - (a.volume ?? 0);
    };

    const [state, setState] = useState({
        addedAgents: undefined,
        isLoadingAddedItems: false,
        availableAgents: undefined,
        initialSelectedAgents: undefined,
        initialSelectedList: undefined,
        selectedAgentList: undefined,
        agentSearchFilters: undefined,
        showEditModal: {
            [modalKeys.dropdown]: false,
            [modalKeys.transfer]: false
        }
    });

    const updateAgentSearchFilters = (e, property) => {
        setStateData('agentSearchFilters', {
            ...state.agentSearchFilters,
            [property]: e.target.value.trim()
        }, setState);
    };

    useEffect(() => {
        const nextState = {
            ...state,
            selectedAgentList: state?.selectedAgentList || selectedAgentCriteria?.listId && agentLists?.find(list =>
                list.agentListId === selectedAgentCriteria.listId
            )
        };
        if (filteredAgents) {
            nextState.availableAgents = selectedAgentCriteria?.idValues && !!filteredAgents?.length
                ? [...filteredAgents].filter(a => a && !selectedAgentCriteria.idValues.includes(a.agentId))
                : filteredAgents;
            nextState.initialSelectedAgents = selectedAgentCriteria?.idValues && !!filteredAgents?.length
                ? [...filteredAgents].filter(a => a && !selectedAgentCriteria.idValues.includes(a.agentId))
                : filteredAgents;
        }
        setState(nextState);
    }, [filteredAgents, selectedAgentCriteria]);

    useEffect(() => {
        const fetchAgents = async () => {
            if (selectedAgentCriteria?.idValues?.length) {
                setStateData('isLoadingAddedItems', true, setState);
                const addedAgents = await getMlsAgentsByIds(mlsId, selectedAgentCriteria.idValues);
                setState(prevState => ({
                    ...prevState,
                    addedAgents: addedAgents,
                    isLoadingAddedItems: false
                }));
            } else {
                setAgents(undefined);
                setStateData('addedAgents', undefined, setState);
            }
        };

        fetchAgents();
    }, [selectedAgentCriteria]);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            sortedAgents: sortList(state.availableAgents),
            sortedAddedAgents: sortList(state.addedAgents)
        }));
        setAgentsTitle(sortList(state.addedAgents))
    }, [selectedSortOption, state.availableAgents, state.addedAgents]);

    useEffect(() => {
        setStateData('listIsDirty', !!listIsDirty, setState);
    }, [listIsDirty]);

    const sortList = (list) => {
        const sortFunc = selectedSortOption?.value === 'volume' ? volumeSort : nameSort;
        return list && Array.isArray(list) && [...list].sort(sortFunc);
    };

    const handleValidateAgentListNameAndSave = (event, list, newName) => {
        const args = {
            event,
            list,
            newName,
            mlsId,
            selectedAgentCriteria,
            state,
            setState,
            toggleListModal,
            userId,
            selectedSavedSearch,
            showToast,
            closePopover
        };
        validateAgentListNameAndSave(args);
    };

    const overwriteAgentList = async () => {
        const updatedList = {
            ...state.overwriteAgentList,
            agentIds: state.editAgentList?.agentIds || selectedAgentCriteria.idValues
        };
        const searchesByAgentListIdResponse = await getSearchesByAgentListId(updatedList.agentListId);
        if (!searchesByAgentListIdResponse.error) {
            if (searchesByAgentListIdResponse.savedSearches.length === 0) {
                const response = await updateSavedAgentList(updatedList);
                if (!response.error) {
                    if (state.editAgentList) {
                        await deleteSavedAgentList(state.editAgentList.agentListId);
                    }
                    await getAgentLists(userId);
                    selectAgentList(updatedList);
                    closeEditModal(setState, toggleListModal);
                    closePopover();
                    showToast('success', toastMessages.success.savedListConfirmation(updatedList.name));
                    updateAgentChipTitle(updatedList);
                } else {
                    showToast('error', toastMessages.error.saveList(agentProductionTerms.agent));
                }
            } else {
                setState(prevState => ({
                    ...prevState,
                    affectedSavedSearches: searchesByAgentListIdResponse.savedSearches,
                    savedSearchesUpdatePrompt: 'save',
                    selectedAgentList: updatedList,
                    showAffectedSavedSearchesModal: true,
                    overwriteAffectedSavedSearches: true
                }));
                updateAgentChipTitle(updatedList);
            }
        } else {
            showToast('error', toastMessages.error.saveList(agentProductionTerms.agent));
            closeEditModal(setState, toggleListModal);
        }
    };

    const addAgents = agentsToAdd => {
        let listIsDirty = false;
        const addedAgents = state.addedAgents ? [...state.addedAgents] : [];
        const selectedAgents = unionBy(addedAgents, [...agentsToAdd], 'agentId');
        if (selectedAgents.length <= 2000) {
            if (state.selectedAgentList && !isEqual(state.initialSelectedAgents, selectedAgents)) {
                listIsDirty = true;
                setFilteredAgents(unionBy(filteredAgents || [], [...selectedAgents], 'agentId'));
                setState(prevState => ({
                    ...prevState,
                    listIsDirty: true
                }));
            }
            setSelectedAgents(selectedAgents, listIsDirty);
        } else {
            toggleErrorModal();
        }
    };

    const addAll = () => {
        const activeAgents = [];
        [...state.availableAgents].map(a => {
            if (a.status === status.ACTIVE) {
                activeAgents.push(a);
            }
        });
        addAgents([...activeAgents]);
    };

    const removeAgents = agentsToRemove => {
        let listIsDirty = false;
        const selectedAgents = [...state.addedAgents];
        const availableAgents = state.availableAgents && [...state.availableAgents];
        agentsToRemove.forEach(a => {
            selectedAgents.splice(selectedAgents.findIndex(agent => agent.agentId === a.agentId), 1);
            availableAgents && availableAgents.push(a);
        });
        availableAgents && setStateData('availableAgents', availableAgents, setState);
        if (state.selectedAgentList && !isEqual(state.initialSelectedAgents, selectedAgents)) {
            listIsDirty = true;
            setState(prevState => ({
                ...prevState,
                initialSelectedList: state.selectedAgentList,
                listIsDirty: true
            }));
        }
        setSelectedAgents(selectedAgents, listIsDirty);
    };

    const removeAll = () => {
        removeAgents([...state.addedAgents]);
    };

    const renderedAvailableItems = <AvailableAgentTable
        addAgents={addAgents}
        availableAgents={state.sortedAgents}
        loadingAgents={loadingAgents}
    />;

    const renderedAddedItems = state.sortedAddedAgents?.length
        ? <AddedAgentsTable addedAgents={state.sortedAddedAgents} removeAgents={removeAgents} />
        : <div style={{ height: '360px', position: 'relative' }}>
            <div style={{ top: '45%', position: 'absolute' }} className='w-100 text-center'>
                <div className='font-weight-bold d-block'>{searchTerms.none}</div>
                <p className='text-muted'>{searchTerms.selectItemsFromLeft('agents')}</p>
            </div>
        </div>;

    const showEditModal = (key, list) => {
        if (list?.value) {
            setStateData(
                'editAgentList',
                agentLists.find(agentList => agentList.agentListId === list.value),
                setState
            );
        }
        if (key) {
            setStateData('showEditModal', { [key]: true }, setState);
        }
        setTimeout(() => toggleListModal(), 500);
    };

    const lookupAgents = async (e) => {
        e.preventDefault();
        if (state?.agentSearchFilters) {
            const agentObj = [];
            const searchCriteria = { ...state.agentSearchFilters };
            Object.keys(searchCriteria).forEach(key => {
                searchCriteria[key] && agentObj.push({
                    fieldType: key,
                    value: searchCriteria[key]
                });
            });
            setIsLoading(true)
            const response = await getMlsAgents(mlsId, agentObj);
            if (!response.error) {
                setAgents(undefined);
                if (response.length > MAX_COUNT_AGENTS_RETURNED) {
                    setIsMaxAgentCountExceeded(true)
                    state.availableAgents && setStateData('availableAgents', undefined, setState);
                    toggleErrorModal();
                } else {
                    setAgents(response);
                }
            }
            setIsLoading(false);
        }
    };

    return (
        <div style={{ margin: '9px 0px' }}>
            {options && (
                <AgentListsSelectRow
                    setState={setState}
                    sortOptions={sortOptions}
                    handleSortChange={handleSortChange}
                    setFilteredAgents={setFilteredAgents}
                    agentLists={agentLists}
                    selectAgentList={selectAgentList}
                    showEditModal={showEditModal}
                    options={options}
                    selectedSortOption={selectedSortOption}
                />
            )}
            <Row form
                 className='w-100 d-inline-block'
                 style={{ marginTop: '5px' }}
            >
                <Col style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Form style={{ display: 'contents' }} class='w-100' autoComplete='off'>
                        {agentFilter.map((item) => (
                                <FormGroup key={item.label} style={{ width: '158.5px', display: 'inline-block' }}>
                                    <Label dataLwtId={`${item.label}-label`}>{item.value}</Label>
                                    <Input
                                        onChange={e => updateAgentSearchFilters(e, item.label)}
                                        defaultValue={state.agentSearchFilters?.[item.label] || ''}
                                        dataLwtId={`${item.label}-filter`}
                                        key={item.label}
                                    />
                                </FormGroup>
                        ))}
                        <Button
                            type='submit'
                            dataLwtId='find-agent'
                            color='outline-primary'
                            size='sm'
                            style={{ height: '36px', alignSelf: 'center', marginTop: '5px' }}
                            disabled={!state.agentSearchFilters || Object.values(state?.agentSearchFilters).every(elem => elem === '')}
                            onClick={lookupAgents}
                        >
                            {agentProductionTerms.findAgent}
                        </Button>
                    </Form>
                </Col>
            </Row>
            <div>
                <HelixIcon icon={circle_info} className='align-bottom mr-1' title='info icon' />
                {agentProductionTerms.agentsFields}
            </div>
            <TransferList
                isAddAllDisabled={!state.sortedAgents?.length || state.sortedAgents.every(elem => elem.status === status.INACTIVE)}
                availableItems={state.sortedAgents}
                renderedAvailableItems={renderedAvailableItems}
                renderedAddedItems={renderedAddedItems}
                addAll={addAll}
                removeAll={removeAll}
                showEditModal={() => showEditModal(modalKeys.transfer)}
                closeEditModal={() => closeEditModal(setState, toggleListModal)}
                modalIsOpen={state.showEditModal[modalKeys.transfer]}
                selectedList={selectedList}
                selectedItems={state.sortedAddedAgents}
                saveList={handleValidateAgentListNameAndSave}
                updateList={handleValidateAgentListNameAndSave}
                availableWidth='70%'
                addedWidth='27%'
                disabled={!state.addedAgents || !state.addedAgents.length}
                editModalHeader={(selectedList) ? searchTerms.saveList : searchTerms.newAgentList}
                idProperty='agentListId'
                isDirty={state.listIsDirty}
                isLoadingAddedItems={state.isLoadingAddedItems}
            />
            <AffectedSavedSearchesModal
                showModal={state.showAffectedSavedSearchesModal}
                onClose={() => setStateData('showAffectedSavedSearchesModal', false, setState)}
                onYes={() => continueWithSavedSearchesUpdate(state.selectedAgentList, userId, selectedSavedSearch,
                    resetSelectedAgentList, state, setState, showToast, toggleListModal)}
                savedSearches={state.affectedSavedSearches}
                list={state.selectedAgentList}
                continuePrompt={state.savedSearchesUpdatePrompt}
                searchType='Agent'
            />
            {state.overwriteAgentList && <Modal
                key='overwrite'
                title={searchTerms.overwriteAgentListHeader}
                show={state.showOverwriteModal}
                onClose={() => toggleOverwriteModal(state, setState)}
                buttons={
                    <>
                        <Button
                            dataLwtId='cancel'
                            color='secondary'
                            onClick={() => toggleOverwriteModal(state, setState)}
                        >
                            {buttonTerms.cancel}
                        </Button>
                        <Button dataLwtId='save' color='primary' onClick={overwriteAgentList}>
                            {buttonTerms.ok}
                        </Button>
                    </>
                }
            >
                <OverwriteModalContent name={state.overwriteAgentList?.name} />
            </Modal>}
            {<EditListModal
                key={modalKeys.dropdown}
                closeEditModal={() => closeEditModal(setState, toggleListModal)}
                modalIsOpen={state.showEditModal?.['dropdown-edit-list']}
                initialList={state.editAgentList}
                idProperty='agentListId'
                onSaveNew={handleValidateAgentListNameAndSave}
                onUpdate={handleValidateAgentListNameAndSave}
                onDelete={(list) => validateSavedSearchAndDelete(list, state, setState,
                    userId, showToast, toggleListModal, resetSelectedAgentListTitle)}
                headerContent={searchTerms.editList}
            />}
        </div>
    );
};

Agents.propTypes = {
    agentLists: PropTypes.array,
    closePopover: PropTypes.func,
    filteredAgents: PropTypes.array,
    loadingAgents: PropTypes.boolean,
    mlsId: PropTypes.number,
    module: PropTypes.string,
    selectedAgentCriteria: PropTypes.object,
    selectedSavedSearch: PropTypes.object,
    selectedSortOption: PropTypes.object,
    setAgents: PropTypes.func,
    setFilteredAgents: PropTypes.func,
    setIsMaxAgentCountExceeded: PropTypes.func,
    showToast: PropTypes.func,
    toggleErrorModal: PropTypes.func,
    toggleListModal: PropTypes.func,
    userId: PropTypes.number,
    sortOptions: PropTypes.array,
    handleSortChange: PropTypes.func,
    selectAgentList: PropTypes.func,
    options: PropTypes.array,
};

export default Agents;
