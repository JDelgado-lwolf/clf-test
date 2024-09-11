import React, { useEffect, useState } from 'react';
import { popoverTerms } from '../../constants/agentProductionConstants';
import { terms } from '../../constants/savedAgents';
import { useCommonStore, useSavedAgentsStore } from '../../../store/store';
import SavedItemDropdown from '../../../common/components/search/SavedItemDropdown';
import { setStateData } from '../../../common/helpers/state';
import EditListModal from '../../../common/components/search/menus/EditListModal';
import { modalKeys } from '../../../common/helpers/menu';
import { showToast } from '../../../common/helpers/toast';
import { modules, searchTerms } from '../../../constants';
import ToastContainerPortal from '../../../common/components/search/menus/ToastContainerPortal';
import AffectedSavedSearchesModal from '../../../common/components/search/menus/AffectedSavedSearchesModal';
import { useCloseChip } from '../../../common/components/search/chips/hooks/closeChip';

export const SearchBar = () => {
    const savedAgentsModule = modules.proficiencyMetrics.savedAgents;
    const {
        selectedList,
        closeEditModal,
        validateAgentListNameAndSave,
        validateSavedSearchAndDelete,
        continueWithSavedSearchesUpdate,
        setSelectedListByModule
    } = useSavedAgentsStore(state => ({
        selectedList: state.selectedListByModule[savedAgentsModule],
        closeEditModal: state.closeEditModal,
        validateAgentListNameAndSave: state.validateAgentListNameAndSave,
        validateSavedSearchAndDelete: state.validateSavedSearchAndDelete,
        continueWithSavedSearchesUpdate: state.continueWithSavedSearchesUpdate,
        setSelectedListByModule: state.setSelectedListByModule,
    }));
    const {
        agentLists,
        mlsProviders,
    } = useCommonStore(state => ({
        agentLists: state.agentLists,
        mlsProviders: state.mlsProviders,
    }));

    const [state, setState] = useState({
        isPopoverOpen: false,
        isEditMode: false,
        savedAgentGroups: {},
        showEditModal: false,
        isListModalOpen: false,
        editAgentList: null,
        selectedAgentList: undefined,
        showAffectedSavedSearchesModal: false,
        affectedSavedSearches: [],
        savedSearchesUpdatePrompt: false,
    });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        let savedAgentGroups = {};
        if (!agentLists?.length > 0 && !mlsProviders?.length > 0) {
            setStateData('savedAgentGroups', savedAgentGroups, setState)
            return;
        };
        const getMlsName = mlsId => mlsProviders.find(mls => mls.mlsId === mlsId)?.shortDescription;
        savedAgentGroups = agentLists?.reduce((group, ss) => {
            const key = getMlsName(ss.mlsId);
            if (!key) {
                // Assume if MLS name is not found, user no longer has perms to
                // the MLS, so don't display saved searches for that MLS
                return group;
            }
            if (!group[key]) {
                group[key] = [];
            }
            group[key].push({...ss, id: ss.agentListId});
            return group;
        }, {});
        setStateData('savedAgentGroups', savedAgentGroups, setState);
    }, [agentLists, mlsProviders]);

    const togglePopover = () => {
        if (!state.isEditMode) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
    };

    const setToastProps = (type, message) => showToast(type, message, setState);

    let selectedAgentCriteria, selectedSavedSearch, resetSelectedAgentList; // We need to pass them as undefined in the DeleteAction.

    const handleValidateAgentListNameAndSave = (event, list, newName) => {
        const args = {
            event,
            list,
            newName,
            mlsId: list.mlsId,
            selectedAgentCriteria,
            state,
            setState,
            toggleListModal,
            userId: list.ownerId,
            selectedSavedSearch,
            showToast: setToastProps,
        };
        validateAgentListNameAndSave(args);
    };

    let resetSelectedAgentListTitle; // We need to pass it as undefined in the DeleteAction.

    const toggleListModal = () => {
        setState((prevState) => {
            return {
                ...prevState,
                editAgentList: null,
                showEditModal: !state.showEditModal,
            }
        });
    };

    const handleSelect = (listId) => {
        if (selectedList?.agentListId === listId) return;
        const agentList = agentLists.find(agent => agent.agentListId === listId);
        setSelectedListByModule(savedAgentsModule, agentList);
        togglePopover();
    };

    const handleEdit = (list, e) => {
        e.stopPropagation();
        setState((prevState) => {
            return {
                ...prevState,
                editAgentList: list,
                showEditModal: true
            }
        });
    };

    const getSavedAgentName = (item) => item.name;
    const getSavedAgentMlsId = (item) => item.mlsId;

    const NoSavedAgents = () => (<div className='text-center py-3'>
        {searchTerms.noSavedAgentsLists}
    </div>);

    return (
        <div className='bg-white border-bottom px-3 pt-3 pb-2 sticky-top' >
            <SavedItemDropdown
                id='saved-agents-chip'
                label={terms.agentLists}
                selectedName={selectedList?.name}
                currentTitle={popoverTerms.currentList}
                listTitle={popoverTerms.savedAgentLists}
                NoItemsComponent={NoSavedAgents}
                getSavedItemName={getSavedAgentName}
                getSavedItemMls={getSavedAgentMlsId}
                initialSelectedItemId={selectedList?.agentListId}
                onSelectItem={handleSelect}
                togglePopover={togglePopover}
                isPopoverOpen={state.isPopoverOpen}
                savedGroups={state.savedAgentGroups}
                handleOpenEditModal={handleEdit}
                filterPlaceholder={searchTerms.nameYourList}
            />
            <AffectedSavedSearchesModal
                showModal={state.showAffectedSavedSearchesModal}
                onClose={() => setStateData('showAffectedSavedSearchesModal', false, setState)}
                onYes={() => continueWithSavedSearchesUpdate(state.selectedAgentList, state.selectedAgentList.ownerId,
                    selectedSavedSearch, resetSelectedAgentList, state, setState, setToastProps, toggleListModal)}
                savedSearches={state.affectedSavedSearches}
                list={state.selectedAgentList}
                continuePrompt={state.savedSearchesUpdatePrompt}
                searchType='Agent'
            />
            {state.editAgentList && <EditListModal
                key={modalKeys.dropdown}
                closeEditModal={() => closeEditModal(setState, toggleListModal)}
                modalIsOpen={state.showEditModal}
                initialList={state.editAgentList}
                idProperty='agentListId'
                onSaveNew={handleValidateAgentListNameAndSave}
                onUpdate={handleValidateAgentListNameAndSave}
                onDelete={(list) => validateSavedSearchAndDelete( list, state, setState, selectedList.ownerId, setToastProps,
                    toggleListModal, resetSelectedAgentListTitle)}
                headerContent={searchTerms.editList}
            />}
            <ToastContainerPortal toastProps={state.toastProps} />
        </div>
    );
};
