import React from 'react';
import PropTypes from 'prop-types';
import { isEqual, union } from 'lodash-es';
import { shallow } from 'zustand/shallow';
import Select from '@lwt-helix/select';
import { InputGroup } from '@lwt-helix/input-group';
import { Input } from '@lwt-helix/controls';
import { Button } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { search } from '@lwt-helix/helix-icon/outlined';
import Modal from '@lwt-helix/modal';
import { ListGroupItem } from '@lwt-helix/list-group';
import { setStateData } from '../../../../helpers/state';
import {
    agentProductionTerms,
    areaRequestTypes,
    buttonTerms,
    searchTerms,
    sortingTerms,
    toastMessages
} from '../../../../../constants';
import EditListModal from '../EditListModal';
import TransferList from '../TransferList';
import MarketAreasList from '../MarketAreasList';
import CustomMarketAreasList from '../CustomMarketAreasList';
import { modalKeys } from '../../../../helpers/menu';
import {
    deleteSavedMarketArea,
    getSearchesByAreaId,
    saveCustomArea,
    updateSavedMarketArea
} from '../../../../../service/service-gateway';
import AffectedSavedSearchesModal from '../AffectedSavedSearchesModal';
import { useMarketArea } from '../hooks/useMarketArea';
import AreaSelect from './components/AreaSelect';
import AreaLabel from './components/AreaLabel';
import AvailableItems from './components/AvailableItems';
import AddedItems from './components/AddedItems';
import { OverwriteModalContent } from '../../OverwriteModalContent';
import { useCommonStore, useSearchStore } from '../../../../../store/store';
import { useAuthStore } from '../../../../../store/auth/store';
import { ownerTypeByTokenType } from '../../../../../constants/auth';
import { runningApp } from '../../../../../constants/app';

const MarketArea = props => {
    const {
        mlsId,
        marketAreaLists,
        selectedMarketAreaCriteria,
        toggleListModal,
        userId,
        module,
        showToast,
        closePopover,
        allMls,
        selectedSortOption,
        setSortOption,
        filterText,
        setFilterText,
        toggleErrorModal,
        selectedSavedSearch,
        mappedAreas
    } = props;

    const {
        setSelectedMarketAreaList,
        getSavedSearchList
    } = useSearchStore(state => ({
        setSelectedMarketAreaList: state.setSelectedMarketAreaList,
        getSavedSearchList: state.getSavedSearchList
    }), shallow);

    const {
        getMarketAreaLists,
    } = useCommonStore(state => ({
        getMarketAreaLists: state.getMarketAreaLists,
    }), shallow);

    const {
        tokenType,
    } = useAuthStore(state => ({
        tokenType: state.tokenType,
    }), shallow);

    const [state, setState] = useMarketArea({
        ...props,
        editAreaList: undefined
    });

    const setMarketAreaType = useSearchStore(state => state.setMarketAreaType);
    const setAllMls = useSearchStore(state => state.setAllMls);
    const setSelectedAreas = useSearchStore(state => state.setSelectedAreas);

    const sortOptions = [
        { value: sortingTerms.alphaValue, label: sortingTerms.alphaLabel },
        { value: sortingTerms.soldCountValue, label: sortingTerms.soldCountLabel }
    ];

    const updateSelectedAreas = (selectedAreas, listIsDirty) => {
        setSelectedAreas({
            fieldName: state.selectedMarketAreaCriteria?.fieldName || state.editAreaList.elements.fieldName,
            selectedAreas,
            listIsDirty,
            marketAreaLists
        });
    };

    const selectMarketAreaList = (marketAreaList) => {
        if (marketAreaList) {
            setSelectedMarketAreaList(marketAreaList, selectedSavedSearch);
            setState(prevState => ({
                ...prevState,
                initialList: undefined,
                listIsDirty: false,
                selectedMarketAreaList: marketAreaList
            }));
        }
    };

    const refreshLists = async () => {
        await getMarketAreaLists(userId);
        await getSavedSearchList(userId, module);
    };

    const selectMarketAreaType = type => {
        setMarketAreaType(type);
    };

    const selectAllMls = () => {
        setAllMls();
        closePopover();
    };

    const selectType = (e, type) => {
        e.preventDefault();
        setStateData('selectedMarketAreaList', undefined, setState);
        if (type === agentProductionTerms.all) {
            selectAllMls();
        } else {
            selectMarketAreaType(type);
        }
    };

    const handleListChange = option => {
        const optionType = state.selectOptions.find(group => group.options.find(opt => opt.value === option.value));
        switch (optionType.label) {
            case searchTerms.areaOptions:
                selectMarketAreaType(Object.values(mappedAreas).find(mappedArea => areaRequestTypes[mappedArea.columnName] === option.value));
                break;
            case searchTerms.allMls:
                selectAllMls();
                break;
            case searchTerms.myMarketLists:
                selectMarketAreaList(marketAreaLists.find(list => list.id === option.value));
                break;
        }
        setState(prevState => ({
            ...prevState,
            initialSelectedList: undefined,
            selectedMarketAreaList: undefined
        }));
    };

    const handleSortChange = option => {
        setSortOption(option);
    };

    const addAreas = areasToAdd => {
        let listIsDirty = false;
        const addedAreas = state.addedAreas ? [...state.addedAreas] : [];
        const selectedAreas = union(addedAreas, [...areasToAdd]);
        if (selectedAreas.length <= 500) {
            if ((state.selectedMarketAreaCriteria.savedAreaId || state.selectedMarketAreaList) && !isEqual(state.initialSelectedAreas, selectedAreas)) {
                listIsDirty = true;
                setStateData('initialSelectedList', state.selectedMarketAreaList, setState);
            }
            updateSelectedAreas(selectedAreas, listIsDirty);
            setStateData('listIsDirty', listIsDirty, setState);
        } else {
            toggleErrorModal();
        }
    };

    const addAll = () => {
        addAreas([...state.filteredAreas]);
    };

    const removeAreas = areasToRemove => {
        let listIsDirty = false;
        const selectedAreas = [...state.addedAreas];
        areasToRemove.forEach(o => {
            selectedAreas.splice(selectedAreas.findIndex(area => area.areaValue === o.areaValue), 1);
        });
        if ((state.selectedMarketAreaCriteria.savedAreaId || state.selectedMarketAreaList) && !isEqual(state.initialSelectedAreas, selectedAreas)) {
            listIsDirty = true;
            setStateData('initialSelectedList', state.selectedMarketAreaList, setState);
        }
        updateSelectedAreas(selectedAreas, listIsDirty);
        setStateData('listIsDirty', listIsDirty, setState);
    };

    const removeAll = () => {
        removeAreas([...state.addedAreas]);
    };

    const AvailableAreaRow = ({ index, style }) => {
        return (
            <div style={style}>
                <ListGroupItem
                    tag='button'
                    className='btn-sm p-1'
                    onClick={() => addAreas([state.filteredAreas[index]])}
                    id={`available-${index}`}
                >
                    <AreaLabel area={state.filteredAreas[index]} key={`available-${index}`} />
                </ListGroupItem>
            </div>
        );
    };

    AvailableAreaRow.propTypes = {
        index: PropTypes.number,
        style: PropTypes.object
    };

    const AddedAreaRow = ({ index, style }) => (
        <div style={style}>
            <ListGroupItem
                tag='button'
                className='btn-sm p-1'
                onClick={() => removeAreas([state.filteredAddedAreas[index]])}
                id={`added-${index}`}
            >
                <AreaLabel area={state.filteredAddedAreas[index]} key={`added-${index}`} />
            </ListGroupItem>
        </div>
    );

    AddedAreaRow.propTypes = {
        index: PropTypes.number,
        style: PropTypes.object
    };

    const formatGroupLabel = data => {
        return (
            data.label !== searchTerms.allMls && data.options.length >= 1 && (
                <div className='border-bottom d-flex align-items-center'>
                    <span className='select-options-group-label'>{data.label}</span>
                </div>
            )
        );
    };

    const closeEditModal = () => {
        setState(prevState => ({
            ...prevState,
            showEditModal: {
                [modalKeys.dropdown]: false,
                [modalKeys.transfer]: false
            },
            showOverwriteModal: false,
            showAffectedSavedSearchesModal: false,
            listIsDirty: false
        }));
        setTimeout(() => toggleListModal(), 1000);
    };

    const showEditModal = (key, listId) => {
        if (listId) {
            const areaList = marketAreaLists.find(list => list.id === listId);
            setStateData('editAreaList', areaList, setState);
        }
        if (key) {
            setStateData('showEditModal', { [key]: true }, setState);
        }
        toggleListModal();
    };

    const validateAreaListNameAndSave = async (e, list, newName) => {
        // if name is not changed, ignore overwrite prompt
        const found =
            marketAreaLists && marketAreaLists.find(l =>
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
            elements: state.selectedMarketAreaCriteria || state.editAreaList?.elements
        };

        if (newName && found) {
            setState((prevState) => ({
                ...prevState,
                showOverwriteModal: true,
                overwriteMarketAreaList: found
            }));
        } else {
            if (list.id) {
                const response = await getSearchesByAreaId(list.id);
                if (!response.error) {
                    if (response.savedSearches.length === 0) {
                        if (e.id === buttonTerms.updateButtonId) {
                            await updateMarketAreaList(savedList, []);
                        }
                    } else {
                        const affectedSavedSearches = updateSavedSearches(response.savedSearches, list, state.selectedMarketAreaCriteria);
                        setState(prevState => ({
                            ...prevState,
                            affectedSavedSearches: affectedSavedSearches,
                            savedSearchesUpdatePrompt: 'save',
                            selectedMarketAreaList: savedList,
                            showAffectedSavedSearchesModal: true
                        }));
                    }
                } else {
                    showToast('error', toastMessages.error.saveList(searchTerms.marketArea));
                    closeEditModal();
                }
            } else {
                if (e.id === buttonTerms.saveAsNewButtonId) {
                    await saveMarketAreaList({ ...savedList });
                }
            }
        }
    };

    const saveMarketAreaList = async (marketAreaList) => {
        const savedList = {
            ...marketAreaList,
            elements: state.selectedMarketAreaCriteria
                ? JSON.stringify({ ...state.selectedMarketAreaCriteria })
                : JSON.stringify({ ...state.editAreaList.elements })
        };

        const response = await saveCustomArea(savedList);
        if (response.id) {
            await refreshLists();

            selectMarketAreaList({
                ...savedList,
                id: response.id,
                elements: state.selectedMarketAreaCriteria || state.editAreaList?.elements,
                areaLabel: state.selectedMarketAreaCriteria?.fieldTypeName || state.editAreaList?.elements.fieldTypeName
            });
            closeEditModal();
            closePopover();
            showToast('success', toastMessages.success.savedListConfirmation(searchTerms.marketArea));
        } else if (response.error) {
            console.error(response.error);
            showToast('error', toastMessages.error.saveList(searchTerms.marketArea));
        }
    };

    const removeSavedAreaIdFromAffectedSavedSearches = (response) => {
        const savedSearchesWithoutSavedAreaId = [];
        [...response.savedSearches].forEach(ss => {
                ss.savedSearch.searchCriteria.criteria.realEstateDatasourceIdsWithFilters[0].searchFields.forEach(searchField =>
                    delete searchField.savedAreaId
                );
                savedSearchesWithoutSavedAreaId.push(ss);
            }
        );
        setStateData('affectedSavedSearches', savedSearchesWithoutSavedAreaId, setState);
    };

    const validateSavedSearchesAndDelete = async (list) => {
        const response = await getSearchesByAreaId(list.id);
        if (!response.error) {
            if (response.savedSearches.length === 0) {
                await deleteMarketAreaList(list, []);
            } else {
                removeSavedAreaIdFromAffectedSavedSearches(response);
                setState(prevState => ({
                    ...prevState,
                    savedSearchesUpdatePrompt: 'delete',
                    selectedMarketAreaList: list,
                    showAffectedSavedSearchesModal: true
                }));
            }
        } else {
            showToast('error', toastMessages.error.deleteSavedList(searchTerms.marketArea));
            closeEditModal();
        }
    };

    const deleteMarketAreaList = async (list, savedSearches) => {
        const response = await deleteSavedMarketArea(list.id, savedSearches);
        if (!response.error) {
            let listIsDirty = false;
            if (state.selectedMarketAreaList?.id === list.id) {
                listIsDirty = true;
            }
            const selectedAreas = [...state.addedAreas];
            updateSelectedAreas(selectedAreas, listIsDirty);
            setStateData('selectOptions', undefined, setState);
            await refreshLists();
            showToast('success', toastMessages.success.deletedListConfirmation(list.name));
        } else {
            showToast('error', toastMessages.error.deleteSavedList(searchTerms.marketArea));
        }
        closeEditModal();
    };

    const toggleOverwriteModal = () => {
        setStateData('showOverwriteModal', !state.showOverwriteModal, setState);
    };

    const overwriteMarketAreaList = async () => {
        const elements = state.editAreaList?.elements ?? state.selectedMarketAreaCriteria;
        const overwriteMarketAreaList = {
            ...state.overwriteMarketAreaList,
            elements: elements
        };
        const response = await getSearchesByAreaId(state.overwriteMarketAreaList.id);
        if (!response.error) {
            if (response.savedSearches.length === 0) {
                await updateMarketAreaList(overwriteMarketAreaList, []);
            } else {
                const affectedSavedSearches = updateSavedSearches(response.savedSearches, state.overwriteMarketAreaList, elements);
                setState(prevState => ({
                    ...prevState,
                    affectedSavedSearches: affectedSavedSearches,
                    savedSearchesUpdatePrompt: 'save',
                    selectedMarketAreaList: overwriteMarketAreaList,
                    showAffectedSavedSearchesModal: true
                }));
            }
        } else {
            showToast('error', toastMessages.error.saveList(searchTerms.marketArea));
            closeEditModal();
        }
    };

    const updateMarketAreaList = async (list, savedSearches) => {
        const savedList = {
            ...list,
            elements: state?.selectedMarketAreaCriteria || list.elements
        };

        const response = await updateSavedMarketArea({
            ...savedList,
            elements: JSON.stringify(savedList.elements)
        }, savedSearches);

        if (!response.error) {
            if (state.overwriteMarketAreaList && state.editAreaList) {
                const responseEditedList = await getSearchesByAreaId(state.editAreaList?.id);
                const affectedSavedSearchesEditedList = updateSavedSearches(responseEditedList.savedSearches, state.editAreaList, state.overwriteMarketAreaList.elements);
                removeSavedAreaIdFromAffectedSavedSearches(responseEditedList);
                await deleteSavedMarketArea(state.editAreaList.id, affectedSavedSearchesEditedList);
                setStateData('overwriteAffectedSavedSearches', false, setState);
            }
            await refreshLists();
            selectMarketAreaList(savedList);
            closeEditModal();
            closePopover();
            showToast('success', toastMessages.success.savedListConfirmation(savedList.name));
        } else {
            showToast('error', toastMessages.error.saveList(searchTerms.marketArea));
        }
    };

    const updateSavedSearches = (savedSearches, list, criteria) => {
        const savedSearchesWithSavedAreaId = [];
        [...savedSearches].forEach(ss => {
            let searchFields = ss.savedSearch.searchCriteria.criteria.realEstateDatasourceIdsWithFilters[0].searchFields;
            const searchField = searchFields.find(field => field.savedAreaId === list.id);
            if (searchField.fieldName === criteria.fieldName) {
                searchField.fieldValues = criteria.fieldValues;
                if (searchField.fieldName === 'areaKey' || searchField.fieldName === 'area2Key') {
                    searchField.fieldValueDescriptions = criteria.fieldValueDescriptions;
                }
            }
            savedSearchesWithSavedAreaId.push(ss);
        });
        return savedSearchesWithSavedAreaId;
    };

    const continueWithSavedSearchesUpdate = async () => {
        if (state.savedSearchesUpdatePrompt === 'save') {
            await updateMarketAreaList(state.selectedMarketAreaList, state.affectedSavedSearches);
        } else if (state.savedSearchesUpdatePrompt === 'delete') {
            await deleteMarketAreaList(state.selectedMarketAreaList, state.affectedSavedSearches);
        }
        setStateData('showAffectedSavedSearchesModal', false, setState);
    };

    const filterOptions = (option, rawInput) => {
        const inputValueLowerCase = rawInput.toLowerCase();
        const regexFieldTypeName = /\((.*?)\)/;
        const matches = option.label.match(regexFieldTypeName);
        if (matches) {
            const fieldName = option.label.split('(')[0].toLowerCase();
            const fieldTypeName = matches[1].toLowerCase();
            return fieldName.includes(inputValueLowerCase) || fieldTypeName.startsWith(inputValueLowerCase);
        }
        return option.label.toLowerCase().includes(inputValueLowerCase);
    };

    const getSelectComponents = () => {
        return {
            Option: (props) => {
                return (
                    <AreaSelect {...props} showEditModal={showEditModal} marketAreaLists={marketAreaLists} />
                );
            }
        }
    };

    return <>
        {!selectedMarketAreaCriteria
            ? <>
                <MarketAreasList
                    mappedAreas={mappedAreas}
                    selectType={selectType}
                    allMls={allMls}
                />
                <CustomMarketAreasList
                    mlsId={mlsId}
                    marketAreaLists={marketAreaLists}
                    showEditModal={showEditModal}
                    setSelectedMarketAreaList={selectMarketAreaList}
                    mappedAreas={mappedAreas}
                    userId={userId}
                    module={module}
                    showToast={showToast}
                />

            </>
            : <div style={{ width: '620px', margin: '9 5.5' }}>
                <div className='w-100'>
                    <div style={{ width: '80%', float: 'left' }}>
                        <Select
                            placeholder={
                                <>
                                    <HelixIcon icon={search} className='align-top mr-1' title='search icon' />{' '}
                                    {searchTerms.searchMarketAreaLists}
                                </>
                            }
                            components={getSelectComponents()}
                            isClearable={false}
                            options={state.selectOptions}
                            onlySearchLabel={true}
                            formatGroupLabel={formatGroupLabel}
                            onChange={handleListChange}
                            filterOption={filterOptions}
                            value={
                                state.selectOptions
                                    ? state.selectedMarketAreaCriteria?.savedAreaId
                                    ? state.selectOptions[2]?.options.find(opt =>
                                        opt.value === state.selectedMarketAreaCriteria.savedAreaId
                                    )
                                    : state.selectedMarketAreaCriteria?.fieldName
                                        ? state.selectOptions[1]?.options.find(opt =>
                                            opt.value === state.selectedMarketAreaCriteria.fieldName
                                        )
                                        : allMls
                                            ? state.selectOptions[0][0]
                                            : undefined
                                    : undefined
                            }
                            autoFocus={true}
                            classNamePrefix='area-list-search'
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
                    {selectedMarketAreaCriteria &&
                    <div style={{ float: 'right', width: '19%' }}>
                        <Select
                            options={sortOptions}
                            onChange={handleSortChange}
                            isClearable={false}
                            isSearchable={false}
                            defaultValue={selectedSortOption || sortOptions[0]}
                            className='saved-search-sort'
                        />
                    </div>
                    }
                </div>
                <div className='w-100 d-inline-block' style={{ marginTop: '5px' }}>
                    <InputGroup
                        dataLwtId='InputGroup'
                        style={{ height: '38px' }}
                        prependAddonProps={[
                            {
                                textProps: {
                                    children: (
                                        <HelixIcon icon={search} className='align-top mr-1' title='search icon' />
                                    )
                                }
                            }
                        ]}
                    >
                        <Input
                            dataLwtId='saved-search-lookup'
                            onChange={e => setFilterText(e.target.value)}
                            placeholder='Filter by area name, city, zip code'
                            defaultValue={filterText}
                        />
                    </InputGroup>
                </div>
                <TransferList
                    isAddAllDisabled={!state.filteredAreas?.length}
                    availableItems={state.filteredAreas}
                    renderedAvailableItems={AvailableItems({ state, AvailableAreaRow })}
                    renderedAddedItems={AddedItems({ state, AddedAreaRow })}
                    addAll={addAll}
                    removeAll={removeAll}
                    showEditModal={() => showEditModal(modalKeys.transfer)}
                    closeEditModal={closeEditModal}
                    modalIsOpen={state.showEditModal[modalKeys.transfer]}
                    selectedList={state.initialSelectedList || state.selectedMarketAreaList}
                    selectedItems={state.filteredAddedAreas}
                    saveList={validateAreaListNameAndSave}
                    updateList={validateAreaListNameAndSave}
                    availableWidth='45%'
                    addedWidth='45%'
                    disabled={!state.addedAreas || !state.addedAreas.length}
                    editModalHeader={(state.initialSelectedList || state.selectedMarketAreaList)
                        ? searchTerms.saveList
                        : searchTerms.saveAsList
                    }
                    idProperty='id'
                    isDirty={state.listIsDirty}
                />
            </div>
        }
        {state.overwriteMarketAreaList && <Modal
            key='overwrite'
            title={searchTerms.overwriteMarketAreaHeader}
            // eslint-disable-next-line react/no-children-prop
            children={<OverwriteModalContent name={state.overwriteMarketAreaList?.name} />}
            show={state.showOverwriteModal}
            onClose={toggleOverwriteModal}
            buttons={
                <>
                    <Button dataLwtId='cancel' color='secondary' onClick={toggleOverwriteModal}>
                        {buttonTerms.cancel}
                    </Button>
                    <Button dataLwtId='save' color='primary' onClick={overwriteMarketAreaList}>
                        {buttonTerms.ok}
                    </Button>
                </>
            }
        />}
        <AffectedSavedSearchesModal
            showModal={state.showAffectedSavedSearchesModal}
            onClose={() => setStateData('showAffectedSavedSearchesModal', false, setState)}
            onYes={continueWithSavedSearchesUpdate}
            savedSearches={state.affectedSavedSearches}
            list={state.selectedMarketAreaList}
            continuePrompt={state.savedSearchesUpdatePrompt}
            searchType='Area'
        />
        {state.editAreaList && <EditListModal
            key={modalKeys.dropdown}
            closeEditModal={closeEditModal}
            modalIsOpen={state.showEditModal['dropdown-edit-list']}
            initialList={state.editAreaList}
            idProperty='id'
            onSaveNew={validateAreaListNameAndSave}
            onUpdate={validateAreaListNameAndSave}
            onDelete={validateSavedSearchesAndDelete}
            headerContent={searchTerms.editList}
        />
        }
    </>;
};

MarketArea.propTypes = {
    mlsId: PropTypes.number,
    marketAreaLists: PropTypes.array,
    selectedMarketAreaCriteria: PropTypes.object,
    toggleListModal: PropTypes.func,
    userId: PropTypes.number,
    module: PropTypes.string,
    areaTypes: PropTypes.array,
    showToast: PropTypes.func,
    closePopover: PropTypes.func,
    allMls: PropTypes.bool,
    selectedSortOption: PropTypes.object,
    setSortOption: PropTypes.func,
    filterText: PropTypes.string,
    setFilterText: PropTypes.func,
    toggleErrorModal: PropTypes.func,
    selectedSavedSearch: PropTypes.object,
    mappedAreas: PropTypes.array,
};

export default MarketArea;
