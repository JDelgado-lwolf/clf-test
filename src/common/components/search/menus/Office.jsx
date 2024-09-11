import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'zustand/shallow';
import { components as ReactSelectComponents } from 'react-select';
import { isEqual, union } from 'lodash-es';
import Select from '@lwt-helix/select';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { pencil, search } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import { InputGroup } from '@lwt-helix/input-group';
import { Input } from '@lwt-helix/controls';
import { Button } from '@lwt-helix/buttons';
import Modal from '@lwt-helix/modal';
import { setStateData } from '../../../helpers/state';
import TransferList from './TransferList';
import {
    agentProductionTerms,
    buttonTerms,
    searchTerms,
    sortingTerms,
    toastMessages
} from '../../../../constants';
import { AddedOfficeTable, AvailableOfficeTable } from './AvailableOfficeTable';
import {
    deleteSavedOfficeList,
    getSearchesByOfficeListId,
    saveOfficeSearchList,
    updateSavedOfficeList
} from '../../../../service/service-gateway';
import EditListModal from './EditListModal';
import { modalKeys } from '../../../helpers/menu';
import AffectedSavedSearchesModal from './AffectedSavedSearchesModal';
import { useCommonStore, useSearchStore } from '../../../../store/store';
import { useAuthStore } from '../../../../store/auth/store';
import { ownerTypeByTokenType } from '../../../../constants/auth';
import { OverwriteModalContent } from '../OverwriteModalContent';
import { runningApp } from '../../../../constants/app';

const Office = (props) => {
    const {
        offices,
        officeLists,
        selectedOfficeCriteria,
        toggleListModal,
        showToast,
        mlsId,
        userId,
        module,
        closePopover,
        selectedSortOption,
        setSortOption,
        filterText,
        setFilterText,
        hasAvailableOffices,
        selectedSavedSearch
    } = props;

    const {
        listIsDirty,
        setSelectedOffices,
        setSelectedOfficeList,
        getSavedSearchList,
        resetSelectedOfficeList,
        resetSelectedOfficeListTitle
    } = useSearchStore(state => ({
        listIsDirty: state[module]?.listIsDirty,
        setSelectedOffices: state.setSelectedOffices,
        setSelectedOfficeList: state.setSelectedOfficeList,
        getSavedSearchList: state.getSavedSearchList,
        resetSelectedOfficeList: state.resetSelectedOfficeList,
        resetSelectedOfficeListTitle: state.resetSelectedOfficeListTitle
    }), shallow);

    const {
        getOfficeLists,
    } = useCommonStore(state => ({
        getOfficeLists: state.getOfficeLists,
    }), shallow);

    const {
        tokenType,
    } = useAuthStore(state => ({
        tokenType: state.tokenType,
    }), shallow);

    const nameSort = (a, b) => {
        return a.officeName.localeCompare(b.officeName);
    };
    const volumeSort = (a, b) => {
        return b.totalVolume - a.totalVolume;
    };

    const sortOptions = [
        { value: sortingTerms.officeNameValue, label: sortingTerms.alphaLabel },
        { value: sortingTerms.volumeValue, label: sortingTerms.volumeLabel }
    ];

    const defaultOption = { label: 'Office Name', options: [{ label: 'Office Name', value: '' }] };

    const [state, setState] = useState({
        addedOffices: undefined,
        availableOffices: undefined,
        initialSelectedOffices: undefined,
        initialSelectedList: undefined,
        selectedOfficeList: undefined,
        options: [defaultOption],
        filteredOffices: undefined,
        filteredAddedOffices: undefined,
        showEditModal: {
            [modalKeys.dropdown]: false,
            [modalKeys.transfer]: false
        }
    });

    useEffect(() => {
        setStateData('listIsDirty', !!listIsDirty, setState);
    }, [listIsDirty]);

    useEffect(() => {
        const nextState = {
            ...state,
            availableOffices: selectedOfficeCriteria?.idValues
                ? [...offices].filter(o => !selectedOfficeCriteria.idValues.includes(o.officeId))
                : [...offices],
            selectedOfficeList: state?.selectedOfficeList || selectedOfficeCriteria?.listId && officeLists?.find(list => list.officeListId === selectedOfficeCriteria.listId),
            addedOffices: selectedOfficeCriteria?.idValues ? offices?.filter(o => selectedOfficeCriteria.idValues.includes(o.officeId)) : [],
            initialSelectedOffices: selectedOfficeCriteria?.idValues ? offices?.filter(o => selectedOfficeCriteria.idValues.includes(o.officeId)) : [],
            filteredOffices: filterOffices(selectedOfficeCriteria?.idValues
                ? [...offices].filter(o => !selectedOfficeCriteria.idValues.includes(o.officeId))
                : [...offices]),
            filteredAddedOffices: filterOffices(selectedOfficeCriteria?.idValues ? offices?.filter(o => selectedOfficeCriteria.idValues.includes(o.officeId)) : [])
        };
        setState({ ...nextState });
    }, [selectedOfficeCriteria, hasAvailableOffices]);

    useEffect(() => {
        const nextOptions = [defaultOption];
        !!officeLists?.length && nextOptions.push({
            label: searchTerms.myOfficeLists,
            options: officeLists
                .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
                .map(list => ({
                    label: list.name,
                    value: list.officeListId
                }))
        });
        setStateData('options', nextOptions, setState);
    }, [officeLists]);

    useEffect(() => {
        if (selectedSortOption && state.availableOffices) {
            setState((prevState) => ({
                ...prevState,
                filteredOffices: sortList([...state.availableOffices])
            }));
        }
    }, [selectedSortOption, state.availableOffices]);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            filteredOffices: sortedAndFilteredList(state.availableOffices),
            filteredAddedOffices: sortedAndFilteredList(state.addedOffices)
        }));
    }, [filterText, selectedSortOption, state.availableOffices]);

    const sortedAndFilteredList = (list) => sortList(...[filterOffices(list)]);

    const filterOffices = list => {
        return list
            ? filterText
                ? [...list]?.filter(
                    (o) =>
                        o.officeId?.toString().startsWith(filterText) ||
                        o.officeName?.toLowerCase().includes(filterText?.toLowerCase()) ||
                        o.city?.toLowerCase().includes(filterText?.toLowerCase()) ||
                        o.streetName?.toLowerCase().includes(filterText?.toLowerCase()) ||
                        o.county?.toLowerCase().includes(filterText?.toLowerCase()) ||
                        o.zipCode?.toString().startsWith(filterText)
                )
                : [...list]
            : [];
    };

    const sortList = (list) => {
        const sortFunc = selectedSortOption?.value === 'volume' ? volumeSort : nameSort;
        return list && [...list].sort(sortFunc);
    };

    const selectOfficeList = (officeList) => {
        setSelectedOfficeList(officeList, selectedSavedSearch);
    };

    const refreshOfficeLists = async () => {
        await getOfficeLists(userId);
        await getSavedSearchList(userId, module);
    };

    const handleListChange = option => {
        setState(prevState => ({
            ...prevState,
            addedOffices: undefined,
            selectedOfficeList: undefined,
            initialSelectedList: undefined,
            initialSelectedOffices: undefined,
            availableOffices: [...offices],
            filteredOffices: [...offices],
            filteredAddedOffices: undefined,
            listIsDirty: false
        }));
        if (option.value) {
            const officeList = officeLists.find(list => list.officeListId === option.value);
            selectOfficeList(officeList);
        } else {
            resetSelectedOfficeList();
            setStateData('selectedOfficeList', undefined, setState);
        }
    };

    const handleSortChange = option => {
        setSortOption(option);
    };

    const addOffices = officesToAdd => {
        let listIsDirty = false;
        const addedOffices = state.addedOffices ? [...state.addedOffices] : [];
        const selectedOffices = union(addedOffices, [...officesToAdd]);
        if (state.selectedOfficeList && !isEqual(state.initialSelectedOffices, selectedOffices)) {
            listIsDirty = true;
            setState(prevState => ({
                ...prevState,
                initialSelectedList: state.selectedOfficeList,
                listIsDirty: true
            }));
        }
        setSelectedOffices(selectedOffices, listIsDirty, offices);
    };

    const addAll = () => {
        addOffices([...state.filteredOffices]);
    };

    const removeOffices = officesToRemove => {
        let listIsDirty = false;
        const selectedOffices = [...state.addedOffices];
        officesToRemove.forEach(o => {
            selectedOffices.splice(selectedOffices.findIndex(office => office.officeId === o.officeId), 1);
        });
        if (state.selectedOfficeList && !isEqual(state.initialSelectedOffices, selectedOffices)) {
            listIsDirty = true;
            setState(prevState => ({
                ...prevState,
                initialSelectedList: state.selectedOfficeList,
                listIsDirty: true
            }));
        }
        setSelectedOffices(selectedOffices, listIsDirty, offices);
    };

    const removeAll = () => {
        removeOffices([...state.addedOffices]);
    };

    const validateOfficeListNameAndSave = async (e, list, newName) => {
        // if name is not changed, ignore overwrite prompt
        const found =
            officeLists && officeLists.find(l =>
            l.mlsId === mlsId &&
            l.ownerId === userId &&
            l.name.toLowerCase() === list.name.toLowerCase()
            );
        const savedList = {
            ...list,
            application: runningApp,
            ownerType: ownerTypeByTokenType[tokenType],
            ownerId: userId,
            mlsId: mlsId,
            officeIds: state.editOfficeList
                ? [...state.editOfficeList.officeIds]
                : [...selectedOfficeCriteria.idValues]
        };

        if (newName && found) {
            setState((prevState) => ({
                ...prevState,
                showOverwriteModal: true,
                overwriteOfficeList: found
            }));
        } else {
            if (list.officeListId && newName) {
                if (e.id === buttonTerms.saveAsNewButtonId) {
                    await saveOfficeList({ ...savedList });
                } else if (e.id === buttonTerms.updateButtonId) {
                    await updateOfficeListWithSavedSearch(list, savedList);
                }
            } else if (list.officeListId && list.officeIds !== savedList.officeIds) {
                if (e.id === buttonTerms.updateButtonId) {
                    await updateOfficeListWithSavedSearch(list, savedList);
                }
            } else {
                await saveOfficeList({ ...savedList });
            }
        }
    };

    const updateOfficeListWithSavedSearch = async (list, savedList) => {
        const response = await getSearchesByOfficeListId(list.officeListId);
        if (!response.error) {
            if (response.savedSearches.length === 0) {
                await updateOfficeList({ ...savedList });
            } else {
                setState(prevState => ({
                    ...prevState,
                    affectedSavedSearches: response.savedSearches,
                    savedSearchesUpdatePrompt: 'save',
                    selectedOfficeList: savedList,
                    showAffectedSavedSearchesModal: true
                }));
            }
        } else {
            showToast('error', toastMessages.error.saveList(agentProductionTerms.office));
            closeEditModal();
        }
    };

    const saveOfficeList = async (officeList) => {
        const response = await saveOfficeSearchList(officeList);

        if (!response.error) {
            await refreshOfficeLists();
            selectOfficeList({ ...response });
            closeEditModal();
            closePopover();
            showToast('success', toastMessages.success.savedListConfirmation(response.name));
        } else if (response.error === 409) {
            showToast('error', toastMessages.error.duplicatedOfficeList);
        } else {
            showToast('error', toastMessages.error.saveList(agentProductionTerms.office));
        }
    };

    const toggleOverwriteModal = () => {
        setStateData('showOverwriteModal', !state.showOverwriteModal, setState);
    };

    const overwriteOfficeList = async () => {
        const updatedList = {
            ...state.overwriteOfficeList,
            officeIds: state.editOfficeList?.officeIds || selectedOfficeCriteria.idValues
        };
        const searchesByOfficeListIdResponse = await getSearchesByOfficeListId(updatedList.officeListId);
        if (!searchesByOfficeListIdResponse.error) {
            if (searchesByOfficeListIdResponse.savedSearches.length === 0) {
                const response = await updateSavedOfficeList(updatedList);
                if (!response.error) {
                    if (state.editOfficeList) {
                        await deleteSavedOfficeList(state.editOfficeList.officeListId);
                    }
                    await refreshOfficeLists();
                    selectOfficeList(updatedList);
                    closeEditModal();
                    closePopover();
                    showToast('success', toastMessages.success.savedListConfirmation(updatedList.name));
                } else {
                    showToast('error', toastMessages.error.saveList(agentProductionTerms.office));
                }
            } else {
                setState(prevState => ({
                    ...prevState,
                    affectedSavedSearches: searchesByOfficeListIdResponse.savedSearches,
                    savedSearchesUpdatePrompt: 'save',
                    selectedOfficeList: updatedList,
                    showAffectedSavedSearchesModal: true,
                    overwriteAffectedSavedSearches: true
                }));
            }
        } else {
            showToast('error', toastMessages.error.saveList(agentProductionTerms.office));
            closeEditModal();
        }
    };

    const updateOfficeList = async (list) => {
        let updatedList, showError;
        const response = await updateSavedOfficeList(list);
        if (!response.error) {
            updatedList = { ...response };
        } else {
            showError = true;
        }

        if (!showError) {
            if (state.overwriteAffectedSavedSearches && state.editOfficeList) {
                await deleteSavedOfficeList(state.editOfficeList.officeListId);
                setStateData('overwriteAffectedSavedSearches', false, setState);
            }
            await refreshOfficeLists();
            selectOfficeList(updatedList);
            setState(prevState => ({
                ...prevState,
                selectedOfficeList: updatedList,
                initialSelectedList: updatedList
            }));
            showToast('success', toastMessages.success.savedListConfirmation(list.name));
        } else {
            showToast('error', toastMessages.error.saveList(agentProductionTerms.office));
        }
        closeEditModal();
    };

    const validateSavedSearchAndDelete = async (officeList) => {
        const response = await getSearchesByOfficeListId(officeList.officeListId);
        if (!response.error) {
            if (response.savedSearches.length === 0) {
                await deleteOfficeList(officeList);
            } else {
                const savedSearchesWihoutOfficeListId = [];
                [...response.savedSearches].forEach(ss => {
                    ss.savedSearch.searchCriteria.criteria.realEstateDatasourceIdsWithFilters[0].idFiltering.forEach(f =>
                        delete f.listId
                    );
                    savedSearchesWihoutOfficeListId.push(ss);
                });
                setState(prevState => ({
                    ...prevState,
                    affectedSavedSearches: savedSearchesWihoutOfficeListId,
                    savedSearchesUpdatePrompt: 'delete',
                    selectedOfficeList: officeList,
                    showAffectedSavedSearchesModal: true
                }));
            }
        } else {
            showToast('error', toastMessages.error.deleteSavedList(agentProductionTerms.office));
            closeEditModal();
        }
    };

    const deleteOfficeList = async (officeList) => {
        const response = await deleteSavedOfficeList(officeList.officeListId);
        if (!response.error) {
            await refreshOfficeLists();
            if (state.selectedOfficeList?.officeListId === officeList.officeListId) {
                setStateData('selectedOfficeList', undefined, setState);
                resetSelectedOfficeListTitle(officeList, offices);
            }
            showToast('success', toastMessages.success.deletedListConfirmation(response.name));
        } else {
            showToast('error', toastMessages.error.deleteSavedList(agentProductionTerms.office));
        }
        closeEditModal();
    };

    const continueWithSavedSearchesUpdate = async () => {
        if (state.savedSearchesUpdatePrompt === 'save') {
            await updateOfficeList(state.selectedOfficeList);
        } else if (state.savedSearchesUpdatePrompt === 'delete') {
            await deleteOfficeList(state.selectedOfficeList);
        }
        setStateData('showAffectedSavedSearchesModal', false, setState);
    };

    const renderedAvailableItems = <AvailableOfficeTable
        availableOffices={state.filteredOffices}
        hasAvailableOffices={hasAvailableOffices}
        addOffices={addOffices}
    />;

    const getRenderedAddedItems = () => {
        if (!hasAvailableOffices) return;

        return !!state.filteredAddedOffices?.length
            ? <AddedOfficeTable addedOffices={state.filteredAddedOffices} removeOffices={removeOffices} />
            : <div style={{ height: '360px', position: 'relative' }}>
                <div style={{ top: '45%', position: 'absolute' }} className='w-100 text-center'>
                    <div className='font-weight-bold d-block'>{searchTerms.noneAdded}</div>
                    <p className='text-muted'>{searchTerms.selectItemsFromLeft('offices')}</p>
                </div>
            </div>;
    };

    const components = () => {
        return {
            Option: (props) => {
                return (
                    <>
                        <div {...props} className='d-flex flex-column'>
                            <div className='d-flex saved-list-option'>
                                <ReactSelectComponents.Option {...props} className='chip-option clickable'>
                                    <span className='flex-grow-1'
                                          style={{ whiteSpace: 'pre-wrap' }}>{props.data.label}</span>
                                </ReactSelectComponents.Option>
                                {props.data.label !== searchTerms.officeName && <Button
                                    dataLwtId='edit-office-list'
                                    size='xs'
                                    color='light'
                                    className='text-capitalize show-on-parent-hover'
                                    id='edit-office-list'
                                    onClick={() => showEditModal(modalKeys.dropdown, props.data)}
                                    style={{ marginBottom: 0, padding: 0, float: 'right' }}
                                >
                                    <HelixIcon icon={pencil} className='mr-1 align-top' title='edit icon' />
                                </Button>
                                }
                            </div>
                        </div>
                    </>
                );
            }
        };
    };

    const formatGroupLabel = data => {
        return (
            data.label === searchTerms.myOfficeLists && !!data.options.length && (
                <div className='border-bottom d-flex align-items-center'>
                    <span className='select-options-group-label'>{data.label}</span>
                </div>
            )
        );
    };

    const closeEditModal = () => {
        setState(prevState => ({
            ...prevState,
            showEditModal:
                {
                    [modalKeys.dropdown]: false,
                    [modalKeys.transfer]: false
                },
            showOverwriteModal: false,
            showAffectedSavedSearchesModal: false,
            editOfficeList: undefined
        }));
        setTimeout(() => toggleListModal(), 500);
    };

    const showEditModal = (key, office) => {
        if (office?.value) {
            const officeList = officeLists.find(list => list.officeListId === office.value);
            setStateData('editOfficeList', officeList, setState);
        }
        if (key) {
            setStateData('showEditModal', { [key]: true }, setState);
        }
        setTimeout(() => toggleListModal(), 500);
    };

    return (
        <div style={{ margin: '9px 5.5px' }}>
            <div className='w-100'>
                <div style={{ width: '80%', float: 'left' }}>
                    <Select
                        placeholder={
                            <>
                                <div className='d-inline-block mr-4 mt-1'>
                                    <HelixIcon icon={search} {...chipIconProps} title='search icon' />
                                </div>
                                <div className='float-right mt-1'>
                                    {searchTerms.searchOfficeLists}
                                </div>
                            </>
                        }
                        components={components()}
                        isClearable={false}
                        options={state.options}
                        formatGroupLabel={formatGroupLabel}
                        onChange={handleListChange}
                        onlySearchLabel={true}
                        value={
                            state.selectedOfficeList
                                ? { label: state.selectedOfficeList.name, value: state.selectedOfficeList.officeListId }
                                : state.options
                                ? selectedOfficeCriteria?.listId
                                    ? state.options[1]?.options.find(opt => opt.value === selectedOfficeCriteria.listId)
                                    : state.options[0].options[0]
                                : undefined
                        }
                        autoFocus={true}
                        isDisabled={!hasAvailableOffices}
                        classNamePrefix='office-list-search'
                        styles={{
                            option: (baseStyles) => ({
                                ...baseStyles,
                                textTransform: 'capitalize',
                                whiteSpace: 'pre'
                            }),
                            singleValue: (baseStyles) => ({
                                ...baseStyles,
                                textTransform: 'capitalize',
                                whiteSpace: 'pre'
                            })
                        }}
                    />
                </div>
                <div style={{ float: 'right', width: '19%' }}>
                    <Select
                        options={sortOptions}
                        onChange={handleSortChange}
                        isClearable={false}
                        isSearchable={false}
                        isDisabled={!hasAvailableOffices}
                        defaultValue={selectedSortOption || sortOptions[0]}
                        className='saved-search-sort'
                    />
                </div>
            </div>
            <div className='w-100 d-inline-block' style={{ marginTop: '5px' }}>
                <InputGroup
                    dataLwtId='InputGroup'
                    style={{ height: '38px' }}
                    prependAddonProps={[
                        {
                            textProps: {
                                children: (
                                    <HelixIcon icon={search} {...chipIconProps} title='search icon' />
                                )
                            }
                        }
                    ]}
                >
                    <Input
                        dataLwtId='saved-search-lookup'
                        onChange={e => setFilterText(e.target.value)}
                        placeholder={agentProductionTerms.officeLookupPlaceholder}
                        defaultValue={filterText}
                        disabled={!hasAvailableOffices}
                    />
                </InputGroup>
            </div>
            <TransferList
                isAddAllDisabled={!state.filteredOffices?.length}
                availableItems={state.filteredOffices}
                renderedAvailableItems={renderedAvailableItems}
                renderedAddedItems={getRenderedAddedItems()}
                addAll={addAll}
                removeAll={removeAll}
                showEditModal={() => showEditModal(modalKeys.transfer)}
                closeEditModal={closeEditModal}
                modalIsOpen={state.showEditModal[modalKeys.transfer]}
                selectedList={state.initialSelectedList || state.selectedOfficeList}
                selectedItems={state.filteredAddedOffices}
                saveList={validateOfficeListNameAndSave}
                updateList={validateOfficeListNameAndSave}
                availableWidth='71%'
                addedWidth='27%'
                disabled={!state.addedOffices || !state.addedOffices.length}
                editModalHeader={(state.initialSelectedList || state.selectedOfficeList) ? searchTerms.saveList : searchTerms.newOfficeList}
                idProperty='officeListId'
                isDirty={state.listIsDirty}
            />
            {state.overwriteOfficeList && <Modal
                key='overwrite'
                title={searchTerms.overwriteOfficeListHeader}
                show={state.showOverwriteModal}
                onClose={toggleOverwriteModal}
                buttons={
                    <>
                        <Button dataLwtId='cancel' color='secondary' onClick={toggleOverwriteModal}>
                            {buttonTerms.cancel}
                        </Button>
                        <Button dataLwtId='save' color='primary' onClick={overwriteOfficeList}>
                            {buttonTerms.ok}
                        </Button>
                    </>
                }
            >
                <OverwriteModalContent name={state.overwriteOfficeList?.name} />
            </Modal>}
            <AffectedSavedSearchesModal
                showModal={state.showAffectedSavedSearchesModal}
                onClose={() => setStateData('showAffectedSavedSearchesModal', false, setState)}
                onYes={continueWithSavedSearchesUpdate}
                savedSearches={state.affectedSavedSearches}
                list={state.selectedOfficeList}
                continuePrompt={state.savedSearchesUpdatePrompt}
                searchType='Office'
            />
            {state.editOfficeList && <EditListModal
                key={modalKeys.dropdown}
                closeEditModal={closeEditModal}
                modalIsOpen={state.showEditModal['dropdown-edit-list']}
                initialList={state.editOfficeList}
                idProperty='officeListId'
                onSaveNew={validateOfficeListNameAndSave}
                onUpdate={validateOfficeListNameAndSave}
                onDelete={validateSavedSearchAndDelete}
                headerContent={searchTerms.editList}
            />}
        </div>
    );
};

Office.propTypes = {
    closePopover: PropTypes.func,
    data: PropTypes.object,
    filterText: PropTypes.string,
    hasAvailableOffices: PropTypes.boolean,
    mlsId: PropTypes.number,
    module: PropTypes.string,
    officeLists: PropTypes.array,
    offices: PropTypes.array,
    selectedOfficeCriteria: PropTypes.object,
    selectedSavedSearch: PropTypes.object,
    selectedSortOption: PropTypes.object,
    setFilterText: PropTypes.func,
    setSortOption: PropTypes.func,
    showToast: PropTypes.func,
    toggleListModal: PropTypes.func,
    userId: PropTypes.number,
};

export default Office;
