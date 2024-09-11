import React, { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { cloneDeep } from 'lodash-es';
import { agentProductionTerms, buttonTerms, searchStatuses, searchTerms, toastMessages } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { toggleRunSearchButton } from '../../../helpers/search';
import { useCommonStore, useSavedAgentsStore, useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';
import { getOwnerIdByTokenInfo } from '../../../../constants/auth';
import { useAuthStore } from '../../../../store/auth/store';
import SavedItemDropdown from '../SavedItemDropdown';
import { deleteSavedSearch, updateSavedSearch } from '../../../../service/service-gateway';
import { showToast } from '../../../helpers/toast';
import EditModalForm from '../menus/EditModalForm';
import Modal from '@lwt-helix/modal';
import { Button } from '@lwt-helix/buttons';
import { ToastContainer } from '@lwt-helix/toast';
import Tooltip from '@lwt-helix/tooltip';
import { OverwriteModalContent } from '../OverwriteModalContent';

const SavedSearchesChip = props => {
    const { disabled, module, hidden, userId } = props;
    const initialState = {
        isPopoverOpen: false,
        mlsId: undefined,
        savedSearchGroups: undefined,
        isEditMode: false,
        editableSearch: false,
        originalSearch: undefined,
        savedSearch: undefined,
        showOverwriteModal: false,
    };
    const [state, setState] = useState({ ...initialState });
    const [showConfirm, setShowConfirm] = useState(false);

    const toggleConfirm = () => {
        setShowConfirm(!showConfirm);
    };

    const {
        savedSearches,
        getSavedSearchList,
        selectedSavedSearch,
        setIsLoading,
        setIsLoadingSearchData,
        setSelectedSavedSearch,
        setSearchStatus,
        resetSearchCriteria
    } = useSearchStore(state => ({
        savedSearches: state[module]?.savedSearchList,
        getSavedSearchList: state.getSavedSearchList,
        selectedSavedSearch: state[module]?.selectedSavedSearch,
        setIsLoading: state.setIsLoading,
        setIsLoadingSearchData: state.setIsLoadingSearchData,
        setSelectedSavedSearch: state.setSelectedSavedSearch,
        setSearchStatus: state.setSearchStatus,
        resetSearchCriteria: state.resetSearchCriteria,
    }));

    useCloseChip(state.isPopoverOpen, setState);

    const {
        timeIntervals,
        accountInfo,
        marketAreaLists,
        officeLists,
        agentLists,
        mlsProviders,
    } = useCommonStore(state => ({
        timeIntervals: state.timeIntervals,
        accountInfo: state.accountInfo,
        marketAreaLists: state.marketAreaLists,
        officeLists: state.officeLists,
        agentLists: state.agentLists,
        mlsProviders: state.mlsProviders,
    }));

    const { setSelectedListByModule } = useSavedAgentsStore(state => ({
        setSelectedListByModule: state.setSelectedListByModule,
    }));

    const {
        tokenInfo,
        tokenType,
    } = useAuthStore(state => ({
        tokenInfo: state.tokenInfo,
        tokenType: state.tokenType,
    }));

    const ownerId = tokenType && getOwnerIdByTokenInfo[tokenType](tokenInfo);

    useEffect(() => {
        if (!module || !ownerId) return;

        const getSavedSearchListAsync = async () => {
            await getSavedSearchList(ownerId, module);
        }
        getSavedSearchListAsync();
    }, [module, ownerId]);

    useEffect(() => {
        if (savedSearches?.length > 0 && mlsProviders?.length > 0) {
            const savedSearchGroups = savedSearches.reduce((group, ss) => {
                const getMlsName = mlsId => {
                    return mlsProviders.find(mls => mls.mlsId === mlsId)?.shortDescription;
                };
                const key = getMlsName(ss.savedSearch.mlsId);
                if (!key) {
                    // Assume if MLS name is not found, user no longer has perms to
                    // the MLS, so don't display saved searches for that MLS
                    return group;
                }
                if (!group[key]) {
                    group[key] = [];
                }
                group[key].push(ss);
                return group;
            }, {});
            setStateData('savedSearchGroups', savedSearchGroups, setState);
        }
    }, [savedSearches, mlsProviders]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const openEditModal = savedSearch => {
        setState(prevState => ({
            ...prevState,
            showEditModal: true,
            editableSearch: { ...savedSearch },
            originalSearch: { ...savedSearch }
        }));
        toggleEditMode();
    };

    const RenderTooltip = (savedSearch) =>{
        return (savedSearch?.savedSearch.notes?.length > 40 || savedSearch?.savedSearch.searchName?.length > 40) &&
        <>
            <Tooltip
                target={`saved-search-${savedSearch?.id}-tooltip`}
                autohide={false}
                innerClassName="saved-search-tooltip"
                boundariesElement="window"
            >
                <div className="text-left">
                    <div className="w-100"><span className='font-weight-bold'>{savedSearch?.savedSearch.searchName}</span></div>
                    <div className="w-100 saved-search-tooltip-notes">{savedSearch?.savedSearch.notes}</div>
                </div>
            </Tooltip>
        </>};

    const togglePopover = () => {
        if (!state.isEditMode) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
    };

    const applySearch = async savedSearchId => {
        if (savedSearchId) {
            togglePopover();
            const savedSearch = cloneDeep(savedSearches?.find(ss => ss.id === savedSearchId));
            const selectedMls = { ...mlsProviders.find(mls => mls.mlsId === savedSearch?.savedSearch?.mlsId) };
            setIsLoading(true);
            setIsLoadingSearchData(true);
            setSelectedListByModule(module, undefined);
            await setSelectedSavedSearch({
                search: savedSearch,
                accountId: accountInfo?.id,
                selectedMls: selectedMls,
                timeIntervals,
                marketAreaLists,
                officeLists,
                agentLists
            });
            setSearchStatus(searchStatuses.run);
        }
    };

    const NoSavedSearches = () => (<div className='text-center py-3'>
        You don’t have any Saved Searches.
    </div>);

    const getSavedSearchName = (search) => search.savedSearch.searchName;
    const getSavedSearchMlsId = (search) => search.savedSearch.mlsId;
    const getSavedItemNotes  = (search) => search.savedSearch.notes;

    const toggleEditMode = () => {
        // hack to ensure the togglePopover is called before the editMode is changed
        setTimeout(() => setStateData('isEditMode', !state.isEditMode, setState), 1000);
    };

    const toggleEditModal = () => {
        setStateData('showEditModal', !state.showEditModal, setState);
        toggleEditMode();
    };

    const saveSearch = async () => {
        const editableSearch = state.editableSearch;
        const found = savedSearches && savedSearches.find(ss =>
            ss.savedSearch.mlsId === state.editableSearch.savedSearch.mlsId
            && ss.savedSearch.ownerId === userId
            && ss.savedSearch.searchName.toLowerCase() ===
            state.editableSearch.savedSearch.searchName.toLowerCase());

        if (found) {
            setState(prevState => ({
                ...prevState,
                showOverwriteModal: true,
                overwriteSearch: found
            }));
        } else {
            const response = await updateSavedSearch(editableSearch);
            if (!response.error) {
                await getSavedSearchList(userId);
                if (state.selectedSavedSearchId === editableSearch.id) {
                    //update the selectedSearch to show the updated name
                    const selectedMls = { ...mlsProviders.find(mls => mls.mlsId === editableSearch.savedSearch.mlsId) };
                    await setSelectedSavedSearch({
                        search: editableSearch,
                        selectedMls: selectedMls,
                        timeIntervals,
                        marketAreaLists,
                        officeLists,
                        agentLists
                    });
                }
                showToast('success', toastMessages.success.searchSaved, setState);
                toggleEditModal();
            } else {
                showToast('error', toastMessages.error.saveSearch, setState);
            }
        }
    };

    const updateSearchDetails = (property, value) => {
        const updatedSavedSearch = {
            ...state.editableSearch.savedSearch,
            [property]: value
        };
        setStateData(
            'editableSearch',
            {
                ...state.editableSearch,
                savedSearch: updatedSavedSearch
            },
            setState
        );
    };

    const overwriteSearchModalHeader = searchTerms.overwriteSearchHeader;

    const handleOverwriteSearch = async () => {
        const savedSearch = {
            ...state.overwriteSearch,
            savedSearch: {
                ...state.overwriteSearch.savedSearch,
                mlsIs: state.editableSearch.savedSearch.mlsId,
                searchCriteria: { ...state.editableSearch.savedSearch.searchCriteria },
                searchName: state.editableSearch.savedSearch.searchName,
                notes: state.editableSearch.savedSearch.notes
            }
        };

        setState(prevState => ({
            ...prevState,
            showEditModal: false,
            showOverwriteModal: false
        }));

        const updateResponse = await updateSavedSearch(savedSearch);
        let deleteResponse;

        if (state.editableSearch.id !== savedSearch.id) {
            deleteResponse = await deleteSavedSearch(state.editableSearch.id);
        }
        if (!(updateResponse.error && deleteResponse?.error)) {
            await getSavedSearchList(userId);

            const selectedMls = { ...mlsProviders.find(mls => mls.mlsId === savedSearch.savedSearch.mlsId) };
            await setSelectedSavedSearch({
                search: savedSearch,
                selectedMls: selectedMls,
                timeIntervals,
                marketAreaLists,
                officeLists,
                agentLists
            });
            showToast('success', toastMessages.success.searchSaved, setState);
            toggleEditModal();
        } else {
            showToast('error', toastMessages.error.saveSearch, setState);
        }
    };

    const toggleOverwriteModal = () => {
        setStateData('showOverwriteModal', !state.showOverwriteModal, setState);
    };

    const ConfirmationContent = () => (
        <div className='w-100 text-left pl-2 helix-heading'>
            {searchTerms.confirmDelete}
        </div>
    );

    const handleDeleteClick = async () => {
        const savedSearch = state.editableSearch;
        const response = await deleteSavedSearch(savedSearch.id);
        if (!response.error) {
            const filteredKeys = Object.keys(state.savedSearchGroups).filter(mls =>
                state.savedSearchGroups[mls].some(ss => ss.id !== savedSearch.id)
            );
            const filteredSearches = filteredKeys.reduce((obj, key) => ({
                ...obj,
                [key]: state.savedSearchGroups[key].filter(ss => ss.id !== savedSearch.id)
            }), {});

            setState(prevState => ({
                    ...prevState,
                    savedSearchGroups: filteredSearches
                }
            ));
            if (selectedSavedSearch?.id === savedSearch.id) {
                resetSearchCriteria();
            }

            toggleEditModal();
            setStateData('isPopoverOpen', false, setState);
            await getSavedSearchList(userId);
        } else {
            showToast('error', toastMessages.error.deleteSearch);
        }
    };

    const confirmDelete = async () => {
        toggleConfirm();
        await handleDeleteClick();
    };

    const ConfirmationModal = () => (
        <Modal
            title='Delete Saved Search?'
            show={showConfirm}
            onClose={toggleConfirm}
            buttons={<>
                <Button dataLwtId='cancel' color='secondary' onClick={toggleConfirm}>Cancel</Button>
                <Button dataLwtId='ok' color='danger' style={{ color: 'white' }} onClick={confirmDelete}>Delete</Button>
            </>}
        >
            <ConfirmationContent />
        </Modal>
    );

    return !hidden && (
        <>
            <SavedItemDropdown
                id='saved-searches-chip'
                isDisabled={disabled}
                label={searchTerms.savedSearches}
                selectedName={selectedSavedSearch?.savedSearch?.searchName}
                currentTitle={agentProductionTerms.currentSearch}
                listTitle={searchTerms.savedSearches}
                NoItemsComponent={NoSavedSearches}
                getSavedItemName={getSavedSearchName}
                getSavedItemMls={getSavedSearchMlsId}
                getSavedItemNotes={getSavedItemNotes}
                savedGroups={state.savedSearchGroups}
                initialSelectedItemId={selectedSavedSearch?.id}
                onSelectItem={applySearch}
                toggleEditMode={toggleEditMode}
                handleOpenEditModal={openEditModal}
                togglePopover={togglePopover}
                isPopoverOpen={state.isPopoverOpen}
                renderTooltip={RenderTooltip}
                filterPlaceholder={searchTerms.savedItemsFilterPlaceholder}
            />
            {state.editableSearch && <Modal
            title='Edit Saved Search'
            show={state.showEditModal}
            onClose={toggleEditModal}
            buttons={<div className='w-100'>
                <div className='float-left' style={{ width: '30%', padding: '5px 0 5px 10px' }}>
                    <Button
                        dataLwtId={`delete-saved-search-${state.editableSearch?.id}`}
                        onClick={toggleConfirm}
                        id='delete-link'
                        className='btn-danger'
                    >
                        {buttonTerms.delete}
                    </Button>
                </div>
                <div className='float-right'>
                    <Button dataLwtId='cancel' color='secondary'
                            onClick={toggleEditModal}>{buttonTerms.cancel}</Button>
                    <Button
                        dataLwtId='save'
                        color='primary'
                        onClick={saveSearch}
                        disabled={
                            !state.originalSearch.savedSearch.notes
                                ? !(state.editableSearch.savedSearch.notes && state.editableSearch.savedSearch.notes !== ''
                                || (state.originalSearch.savedSearch.searchName !== state.editableSearch.savedSearch.searchName))
                                : !(state.originalSearch.savedSearch.notes !== state.editableSearch.savedSearch.notes
                                || (state.originalSearch.savedSearch.searchName !== state.editableSearch.savedSearch.searchName))
                        }
                    >
                        {buttonTerms.save}
                    </Button>
                </div>
            </div>}
            >
                <EditModalForm search={state.editableSearch} updateSavedSearch={updateSearchDetails} />
            </Modal>}
            {state.overwriteSearch && <Modal
                title={overwriteSearchModalHeader}
                show={state.showOverwriteModal}
                onClose={toggleOverwriteModal}
                buttons={<>
                    <Button dataLwtId='cancel' color='secondary'
                            onClick={toggleOverwriteModal}>{buttonTerms.cancel}</Button>
                    <Button dataLwtId='save' color='primary' onClick={handleOverwriteSearch}>{buttonTerms.ok}</Button>
                </>}
            >
                <OverwriteModalContent name={state.editableSearch?.savedSearch?.searchName}/>
            </Modal>}
            <ConfirmationModal />
            <ToastContainer position='toast-bottom-right' dataLwtId='save-search-toasts'
                        toastProps={state.toastProps} />
        </>
    );
};

SavedSearchesChip.propTypes = {
    disabled: PropTypes.bool,
    module: PropTypes.string,
    hidden: PropTypes.bool,
    userId: PropTypes.number,
};

export default SavedSearchesChip;
