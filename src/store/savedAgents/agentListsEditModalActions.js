import {
    saveAgentSearchList,
    updateSavedAgentList,
    deleteSavedAgentList,
    getSearchesByAgentListId,
    getSearchesByAreaListId
} from "../../service/service-gateway";
import {
    agentProductionTerms,
    buttonTerms,
    modules,
    toastMessages
} from "../../constants";
import { modalKeys } from "../../common/helpers/menu";
import { setStateData } from "../../common/helpers/state";
import { useCommonStore, useSearchStore } from "../store";
import { useAuthStore } from "../auth/store";
import { runningApp } from "../../constants/app";

export const agentListsEditModalActions = (set, get) => ({
    closeEditModal: (setState, toggleListModal) => {
        setState(prevState => ({
            ...prevState,
            showEditModal: {
                [modalKeys.dropdown]: false,
                [modalKeys.transfer]: false
            },
            listIsDirty: false
        }));
        setTimeout(() => toggleListModal(), 500);
    },
    closePopover: (setState) => {
        setState(prevState => ({
            ...prevState,
            showErrorModal: false,
            isListModalOpen: false,
            isPopoverOpen: false,
            filteredAgents: undefined
        }));
    },
    selectAgentList: (agentList, selectedSavedSearch) => {
        useSearchStore.getState().setSelectedAgentList(agentList, selectedSavedSearch);
    },
    updateAgentList: async (agentList, state, setState, userId, selectedSavedSearch, showToast,
        toggleListModal
    ) => {
        const savedAgentsModule = modules.proficiencyMetrics.savedAgents;
        const agentsNameModule = modules.proficiencyMetrics.agents;
        const savedAgentsSelectedList = get().selectedListByModule[savedAgentsModule];
        const response = await updateSavedAgentList(agentList);
        if (response.error) {
            showToast('error', toastMessages.error.saveList(agentProductionTerms.agent));
            return;
        }

        let updatedList = { ...response };

        if (state.overwriteAffectedSavedSearches && state.editAgentList) {
            await deleteSavedAgentList(state.editAgentList.agentListId);
            setStateData('overwriteAffectedSavedSearches', false, setState);
        }
        await useCommonStore.getState().getAgentLists(userId);
        selectedSavedSearch && get().selectAgentList(updatedList, selectedSavedSearch);
        setState(prevState => ({
            ...prevState,
            initialSelectedList: updatedList
        }));
        get().setSelectedListByModule(agentsNameModule, updatedList);
        (savedAgentsSelectedList?.agentListId === updatedList.agentListId)
            && get().setSelectedListByModule(savedAgentsModule, updatedList);
        get().closeEditModal(setState, toggleListModal);
        showToast('success', toastMessages.success.savedListConfirmation(updatedList.name));
    },
    updateAgentListWithSavedSearch: async (list, savedList, state, setState, toggleListModal, userId,
        selectedSavedSearch, showToast
    ) => {
        const response = await getSearchesByAgentListId(list.agentListId);
        if (!response.error) {
            if (response.savedSearches.length === 0) {
                await get().updateAgentList({ ...savedList }, state, setState, userId, selectedSavedSearch, showToast,
                    toggleListModal);
            } else {
                setState(prevState => ({
                    ...prevState,
                    affectedSavedSearches: response.savedSearches,
                    savedSearchesUpdatePrompt: 'save',
                    selectedAgentList: savedList,
                    showAffectedSavedSearchesModal: true
                }));
            }
        } else {
            showToast('error', toastMessages.error.saveList(agentProductionTerms.agent));
            get().closeEditModal(setState, toggleListModal);
        }
    },
    saveAgentList: async (agentList, setState, toggleListModal, userId, selectedSavedSearch, showToast) => {
        const response = await saveAgentSearchList(agentList);

        if (!response.error) {
            const agentsNameModule = modules.proficiencyMetrics.agents;
            const selectedModule = useSearchStore.getState().selectedModule;
            await useCommonStore.getState().getAgentLists(userId);

            // if SelectedSavedSearch means Prof.metrics search criteria, When in Saved Agents should be false.
            (!!selectedSavedSearch || selectedModule === agentsNameModule) && get().selectAgentList({ ...response }, selectedSavedSearch);
            get().closeEditModal(setState, toggleListModal);
            get().closePopover(setState);
            showToast('success', toastMessages.success.savedListConfirmation(response.name));
            return response;
        } else {
            showToast('error', toastMessages.error.saveList(agentProductionTerms.agent));
        }
    },
    updateAgentChipTitle: (list) => {
        const selectedModule = useSearchStore.getState().selectedModule;
        const agentsNameModule = modules.proficiencyMetrics.agents;
        const agentsNameSelectedList = get().selectedListByModule[agentsNameModule];

        const createdListId = list.agentListId;
        const agentsNameSelectedListId = agentsNameSelectedList?.agentListId;

        const listIsSelectedInAgentsName = createdListId === agentsNameSelectedListId;
        const isAgentsNameModuleSelected = selectedModule === agentsNameModule;
        const shouldSelectListInAgentsName = listIsSelectedInAgentsName || isAgentsNameModuleSelected;

        shouldSelectListInAgentsName && get().setSelectedListByModule(agentsNameModule, list);
    },
    validateAgentListNameAndSave: async (args) => {
        const { event, list, newName, mlsId, selectedAgentCriteria, state, setState, toggleListModal,
            userId, selectedSavedSearch, showToast, closePopover } = args;
        // if name is not changed, ignore overwrite prompt
        const agentLists = useCommonStore.getState().agentLists;
        let newList;
        const found = agentLists && agentLists.find( l =>
            l.mlsId === mlsId &&
            l.ownerId === userId &&
            l.name.toLowerCase() === list.name.toLowerCase()
        );

        const savedList = {
            ...list,
            application: runningApp,
            ownerType: useAuthStore.getState().ownerType,
            ownerId: userId,
            mlsId: mlsId,
            agentIds: selectedAgentCriteria ? [...selectedAgentCriteria.idValues] : state.editAgentList.agentIds
        };

        const shouldOverwrite = newName && found;
        const isExistingListWithNewName = list.agentListId && newName;
        const isSaveAsNewListPressed = event.id === buttonTerms.saveAsNewButtonId;
        const isUpdatePressed = event.id === buttonTerms.updateButtonId;
        const hasAgentsChanged = list.agentListId && list.agentIds !== savedList.agentIds;

        if (shouldOverwrite) {
            setState(prevState => ({
                ...prevState,
                showOverwriteModal: true,
                overwriteAgentList: found
            }));
        } else {
            if (isExistingListWithNewName) {
                if (isSaveAsNewListPressed) {
                    newList = await get().saveAgentList({ ...savedList },
                        setState, toggleListModal, userId, selectedSavedSearch, showToast);
                } else if (isUpdatePressed) {
                    await get().updateAgentListWithSavedSearch(list, savedList, state, setState, toggleListModal,
                        userId, selectedSavedSearch, showToast);
                }
            } else if (hasAgentsChanged) {
                if (isUpdatePressed) {
                    await get().updateAgentListWithSavedSearch(list, savedList, state, setState, toggleListModal,
                        userId, selectedSavedSearch, showToast);
                }
            } else {
                newList = await get().saveAgentList(savedList, setState, toggleListModal, userId, selectedSavedSearch, showToast);
            }
        }
        const shouldUpdateAgentChipTitle = !(isExistingListWithNewName && isSaveAsNewListPressed);
        if (!shouldOverwrite) closePopover();
        if (!shouldUpdateAgentChipTitle) return;
        get().updateAgentChipTitle(newList ?? savedList);
    },
    deleteAgentList: async (agentList, userId, resetSelectedAgentListTitle, state, setState, showToast,
        toggleListModal
    ) => {
        const response = await deleteSavedAgentList(agentList.agentListId);
        if (!response.error) {
            await useCommonStore.getState().getAgentLists(userId);
            // we're passing this prop only when resetAgentListTitle is needed.
            !!resetSelectedAgentListTitle && resetSelectedAgentListTitle(agentList, state.addedAgents);
            setStateData('selectedAgentList', undefined, setState);
            showToast('success', toastMessages.success.deletedListConfirmation(response.name));
        } else {
            showToast('error', toastMessages.error.deleteSavedList(agentProductionTerms.agent));
        }
        get().closeEditModal(setState, toggleListModal);
    },
    validateSavedSearchAndDelete: async (agentList, state, setState, userId, showToast,
        toggleListModal, resetSelectedAgentListTitle
    ) => {
        const response = await getSearchesByAreaListId(agentList.agentListId);
        if (!response.error) {
            if (response.savedSearches.length === 0) {
                await get().deleteAgentList(agentList, userId, resetSelectedAgentListTitle, state, setState, showToast,
                    toggleListModal);
                get().setNextSelectedList(agentList);
            } else {
                setState(prevState => ({
                    ...prevState,
                    affectedSavedSearches: response.savedSearches,
                    savedSearchesUpdatePrompt: 'delete',
                    selectedAgentList: agentList,
                    showAffectedSavedSearchesModal: true
                }));
            }
        } else {
            showToast('error', toastMessages.error.deleteSavedList(agentProductionTerms.agent));
            get().closeEditModal(setState, toggleListModal);
        }
    },
    toggleOverwriteModal: (state, setState) => {
        setStateData('showOverwriteModal', !state.showOverwriteModal, setState);
    },
    continueWithSavedSearchesUpdate: async ( selectedAgentList, userId, selectedSavedSearch,
        resetSelectedAgentList, state, setState, showToast, toggleListModal
    ) => {
        if (state.savedSearchesUpdatePrompt === 'save') {
            await get().updateAgentList(
                selectedAgentList,
                state,
                setState,
                userId,
                selectedSavedSearch,
                showToast,
                toggleListModal,
            );
            get().toggleOverwriteModal(state, setState);
        } else if (state.savedSearchesUpdatePrompt === 'delete') {
            await get().deleteAgentList(selectedAgentList, userId,
                resetSelectedAgentList, state, setState, showToast, toggleListModal);
            get().setNextSelectedList(selectedAgentList);
        }
        setStateData('showAffectedSavedSearchesModal', false, setState);
    },
    setNextSelectedList: (deletedList) => {
        const savedAgentsModule = modules.proficiencyMetrics.savedAgents;
        const agentsNameModule = modules.proficiencyMetrics.agents;
        const savedAgentsSelectedList = get().selectedListByModule[savedAgentsModule];
        const agentsNameSelectedList = get().selectedListByModule[agentsNameModule];
        const { agentListId } = deletedList ?? {};
        const agentLists = useCommonStore.getState().agentLists;
        if (agentListId === savedAgentsSelectedList?.agentListId) {
            const agentList = agentLists.length > 0 ? agentLists[0] : undefined;
            get().setSelectedListByModule(savedAgentsModule, agentList);
        };
        if (agentListId === agentsNameSelectedList?.agentListId)
            get().setSelectedListByModule(agentsNameModule, undefined);
    }
});
