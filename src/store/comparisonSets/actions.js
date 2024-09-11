import { getFilteredListByKeyField } from "../../common/helpers/chips";
import { showToast, toastTypes } from "../../common/helpers/toast";
import { getCriteriaObject, getUpdatedObjectByKeyfield } from "../../common/helpers/utilities";
import { getHasDuplicatedText } from "../../common/helpers/validation";
import { comparisonSetsModals, modules, marketShareTerms as mst, navTerms, searchTerms as st } from "../../constants";
import { getCompSetsByMLsWithOfficeGroup } from "../../market-share/helpers/comparisonSets";
import { getCoverageOffices } from "../../service/mlsInfo";
import { getComparisonSetsByUser } from "../../service/savedLists";
import { deleteComparisonSet, saveComparisonSet, updateComparisonSet, updateSavedSearch } from "../../service/service-gateway";
import { useCommonStore, useSearchStore } from "../store";
import { initialComparisonSetsState } from "./store";

export const actions = (set, get) => ({
    getComparisonSetsByUser: async (userAccountId) => {
        try {
            set({ isLoading: true });
            const response = await getComparisonSetsByUser(userAccountId);
            const comparisonSets = !response?.error ? response : initialComparisonSetsState.comparisonSets;
            set({ isLoading: false, comparisonSets });
        } catch (err) {
            console.error(err, 'Error getting comparison sets')
            set({ isLoading: false, error: err.message });
        }
    },
    handleComparisonSetNameChange: (e, setState) => {
        const input = e.target.value;
        const newCompSetName = get().newCompSetName;
        const selectedCompSetName = get().selectedComparisonSet?.name;
        const newState = { isSaveButtonDisabled: newCompSetName === selectedCompSetName };
        setState(prevState => ({...prevState, ...newState}));
        set({newCompSetName: input.toString()})
    },
    createNewCompSet: ({setState, comparisonSets, selectedMlsDescription, saveModal, userAccount,
        selectedMlsId, newCompSetName}) => {
        saveComparisonSet(
            newCompSetName,
            userAccount?.id,
            selectedMlsId
        ).then(savedComparisonSet => {
            if (savedComparisonSet?.error) throw new Error(savedComparisonSet?.error);
            const mlsList = useCommonStore.getState().mlsList;
            const mlsToSet = {...mlsList?.filter(mls => mls.mlsId === savedComparisonSet.mlsId)[0]};
            const savedSetOption = {
                ...savedComparisonSet,
                label: mst.getComparisonSetLabel(newCompSetName, selectedMlsDescription),
                value: savedComparisonSet.id,
            };
            set(prevState => ({
                comparisonSets: {list: [savedComparisonSet, ...comparisonSets?.list]},
                comparisonSetListOptions: [savedSetOption, ...prevState.comparisonSetListOptions],
                selectedComparisonSet: savedSetOption
            }));
            get().handleMlsChange({
                label: mst.getComparisonSetLabel(mlsToSet?.shortDescription, mlsToSet?.longDescription),
                value: mlsToSet
            });
            showToast(
                toastTypes.success,
                mst.getCreatedComparisonSetMessage(`${newCompSetName} (${selectedMlsDescription})`),
                setState
            );
        }).catch((e) => {
            showToast(toastTypes.error, mst.createComparisonSetsError, setState);
            console.error(mst.createComparisonSetsError, e);
        }).finally(() => {
            get().toggleModal(false, saveModal);
        });
    },
    renameComparisonSet: ({setState, comparisonSets, selectedMlsDescription, saveModal, newCompSetName}) => {
        const selectedCompSet = get().selectedComparisonSet;
        updateComparisonSet(
            {...selectedCompSet, name: newCompSetName},
            [...selectedCompSet.groups]
        ).then(updatedComparisonSet => {
            if (updatedComparisonSet?.error) throw new Error(updatedComparisonSet?.error);
            const comparisonSetIndex = comparisonSets?.list.findIndex(cs => cs.id === updatedComparisonSet.id);
            const savedSetOption = {
                label: mst.getComparisonSetLabel(updatedComparisonSet?.name, selectedMlsDescription),
                value: updatedComparisonSet.id,
                ...updatedComparisonSet
            };
            showToast(toastTypes.success, mst.getCompNameUpdatedMsg(updatedComparisonSet?.name), setState);
            if (comparisonSetIndex > -1 && comparisonSets.list.length) {
                comparisonSets.list[comparisonSetIndex] = {
                    ...comparisonSets.list[comparisonSetIndex],
                    ...updatedComparisonSet
                };
            }

            const updatedComparisonSetListOptions = get().comparisonSetListOptions.map(cs =>
                cs.id === updatedComparisonSet.id ? savedSetOption : cs
            );
            set({
                comparisonSets,
                comparisonSetListOptions: updatedComparisonSetListOptions,
                selectedComparisonSet: savedSetOption,
            });
        }).catch((e) => {
            showToast(toastTypes.error, mst.createComparisonSetsError, setState);
            console.error(mst.updateOfficeGroupError, e);
        }).finally(() => {
            get().toggleModal(false, saveModal);
            get().clearState();
        });
    },
    removeComparisonSetFromSavedSearches: async (selectedCompSet) => {
        const searchStore = useSearchStore.getState();
        const module = modules.marketShare.totals;
        const search = searchStore[module];
        const savedSearchList = search?.savedSearchList;
        if (!savedSearchList?.length) return;

        const revisedSavedSearches = savedSearchList
            .filter(ss => getCriteriaObject(ss?.savedSearch.searchCriteria)?.mlsObjectId === selectedCompSet.id)
            .map(ss => getUpdatedObjectByKeyfield(ss, 'mlsObjectId', undefined));

        const updateSavedSearchCalls = revisedSavedSearches.map(ss => updateSavedSearch(ss));
        try {
            await Promise.all(updateSavedSearchCalls);
        } catch (err) {
            console.error(mst.errorUpdatingSavedSearches, err);
        }
    },
    deleteComparisonSet: (selectedCompSet, userInfoId, setState) => {
        if (!selectedCompSet) return;
        get().setIsLoading(true);
        deleteComparisonSet(selectedCompSet)
            .then(async (removedComparisonSet) => {
                if (removedComparisonSet?.error) throw new Error(mst.getRemovedComparisonSetErrorMessage(selectedCompSet.name));
                await get().getComparisonSetsByUser(userInfoId, true);
                get().setIsLoading(false);
                showToast(
                    toastTypes.success,
                    mst.getRemovedComparisonSetMessage(removedComparisonSet.name),
                    setState
                );
                get().handleSelectedComparisonSet(undefined);
                get().buildComparisonSetOptions();
                get().removeComparisonSetFromSavedSearches(selectedCompSet);
                get().toggleModal(false, comparisonSetsModals.DELETE);
            })
            .catch(() => {
                get().setIsLoading(false);
                showToast(
                    toastTypes.error,
                    mst.getRemovedComparisonSetErrorMessage(selectedCompSet.name),
                    setState
                );
            })
    },
    handleSaveComparisonSet: ({
        setState,
        defaultMlsOption,
        comparisonSets,
        isEdit = false,
        selectedMls
    }) => {

        const newCompSetName = get().newCompSetName;
        const mls = selectedMls ?? defaultMlsOption;
        const selectedMlsId = mls?.value?.mlsId;
        const selectedMlsSets = comparisonSets?.list
            .filter(comparisonSet => comparisonSet.mlsId === selectedMlsId);
        const userAccount = useCommonStore.getState().userInfo;
        const selectedMlsDescription = mls?.value.shortDescription;
        const saveModal = comparisonSetsModals.SAVE;
        const hasDuplicatedName = getHasDuplicatedText(selectedMlsSets, 'name', newCompSetName);

        if (hasDuplicatedName) {
            showToast(toastTypes.error, mst.duplicateComparisonSetName, setState);
            return;
        };

        if (isEdit) {
            get().renameComparisonSet({setState, comparisonSets, selectedMlsDescription, saveModal, newCompSetName});
            return;
        }
        get().createNewCompSet({setState, comparisonSets, selectedMlsDescription,
            saveModal, userAccount, selectedMlsId, newCompSetName});
    },
    handleOfficeGroupsAdd: () => {
        set({
            addedOffices: [],
            isOfficeGroupEdit: undefined,
            selectedOfficeGroup: undefined,
        });
        get().toggleModal(true, comparisonSetsModals.OFFICE_GROUP);
    },
    handleOfficeGroupsEdit: (officeGroup) => {
        if (!officeGroup.offices?.length) return;
        const selectedComparisonSetOfficesList = get().selectedComparisonSetOfficesList;
        const officesIds = officeGroup?.offices.map(office => office?.officeId);
        const addedOffices = selectedComparisonSetOfficesList.filter(office => officesIds.includes(office.officeId));
        const availableOffices = selectedComparisonSetOfficesList.filter(office => !officesIds.includes(office.officeId));
        set({
            addedOffices,
            isOfficeGroupEdit: true,
            selectedOfficeGroup: {name: officeGroup?.name, addedOffices, availableOffices},
        });
        get().toggleModal(true, comparisonSetsModals.OFFICE_GROUP);
    },
    handleOfficeGroupsDelete: (officeGroup) => {
        set({ selectedOfficeGroup: officeGroup });
        get().toggleModal(true, comparisonSetsModals.DELETE_OFFICE_GROUP);
    },
    deleteOfficeGroup: (selectedComparisonSet, selectedOfficeGroup, setState) => {
        get().setIsLoading(true);
        const comparisonSets = get().comparisonSets;
        const deleteOfficeGroupModal = comparisonSetsModals.DELETE_OFFICE_GROUP;
        const updatedGroups = selectedComparisonSet.groups.filter(group => group.name !== selectedOfficeGroup.name);
        updateComparisonSet(selectedComparisonSet, updatedGroups).then(updatedComparisonSet => {
            if (updatedComparisonSet?.error) throw new Error(updatedComparisonSet?.error);
            const comparisonSetIndex = comparisonSets?.list.findIndex(cs => cs.id === updatedComparisonSet.id);
            const revisedComparisonSet = { ...selectedComparisonSet, ...updatedComparisonSet };
            get().setIsLoading(false);
            get().toggleModal(false, deleteOfficeGroupModal);
            showToast(toastTypes.success, mst.getOfficeGroupDeletedMsg(selectedOfficeGroup.name), setState);
            if (comparisonSetIndex > -1 && comparisonSets.list.length) {
                comparisonSets.list[comparisonSetIndex] = {
                    ...comparisonSets.list[comparisonSetIndex],
                    ...updatedComparisonSet
                };
            };

            const updatedComparisonSetsList = comparisonSets?.list.filter(cs => cs.id !== updatedComparisonSet.id);
            set({ selectedComparisonSet: revisedComparisonSet,
                  comparisonSets: { list: [revisedComparisonSet, ...updatedComparisonSetsList] }
                });

        }).catch((e) => {
            get().setIsLoading(false);
            showToast(toastTypes.error, mst.getOfficeGroupDeleteError(selectedOfficeGroup.name), setState);
            console.error(mst.deleteOfficeGroupError, e);
        }).finally(() => {
            get().clearState();
        });
    },
    setNewCompSetName: (newCompSetName) => set({newCompSetName: newCompSetName}, false, 'setNewCompSetName'),
    toggleModal: (shouldOpen, modal) => set({
        shouldShowByModal: {
            [modal]: shouldOpen,
        }
    }),
    handleMlsChange: (selectedMls) => set({selectedMls}),
    handleSelectedComparisonSet: (selectedComparisonSet) => set({selectedComparisonSet}),
    buildComparisonSetOptions: (module = navTerms.myProfile) => {
        const mlsList = useCommonStore.getState().mlsList || useCommonStore.getState().membership;
        const comparisonSets = get().comparisonSets;
        const comparisonSetListOptions = comparisonSets?.list?.map(cs => {
            const mls = mlsList?.find(mls => mls.mlsId === cs?.mlsId);
            return {
                ...cs,
                label: mst.getComparisonSetLabel(cs?.name, mls?.shortDescription),
                shortDescription: mls?.shortDescription,
                value: cs?.id
            };
        });
        const sortedComparisonSets = comparisonSetListOptions?.sort((a, b) => {
            if (a.shortDescription !== b.shortDescription) {
                return a.shortDescription < b.shortDescription ? -1 : 1;
            }
            return a.name?.localeCompare(b.name);
        });

        const selectedComparisonSet = sortedComparisonSets.find(cs => cs.id === get().selectedComparisonSet?.id)
            ?? sortedComparisonSets?.[0];

        set({
            selectedComparisonSet: selectedComparisonSet,
            comparisonSetListOptions: sortedComparisonSets
        });

        const isMarketShareTotals = module === modules.marketShare.totals;
        if (!isMarketShareTotals) return;

        return get().buildComparisonSetChipOptions(sortedComparisonSets);
    },
    buildComparisonSetChipOptions: (sortedComparisonSet) => {
        const searchStore = useSearchStore.getState();
        const selectedModule = searchStore.selectedModule;
        const selectedMls = searchStore[selectedModule]?.selectedMls;
        const selectedComparisonSet = get().selectedComparisonSet;
        const comparisonSets = get().comparisonSets;

        const comparisonSetsByMls = getFilteredListByKeyField(
            comparisonSets?.list,
            mst.comparisonSetMlsIdField,
            selectedMls?.mlsId
        );

        if (!comparisonSetsByMls?.length > 0)
            return { messageType: st.comparisonSet, redirectButtonTitle: st.createComparisonSets, shouldShow: true };

        const comparisonSetsByMlsWithGroupOffice =  comparisonSetsByMls?.filter(comparisonSet => comparisonSet?.groups.length > 0)
        if (!comparisonSetsByMlsWithGroupOffice?.length > 0)
            return { messageType: mst.officeGroup, redirectButtonTitle: st.createOfficeGroups, shouldShow: true };

        const comparisonSetsOptionsByMlsWithGroupOffice = getCompSetsByMLsWithOfficeGroup(sortedComparisonSet, selectedMls);
        get().handleSelectedComparisonSet(selectedComparisonSet || comparisonSetsByMlsWithGroupOffice?.[0]);
        set({
            comparisonSetListOptionsBySelectedMls: comparisonSetsOptionsByMlsWithGroupOffice,
            comparisonSetsBySelectedMls: comparisonSetsByMlsWithGroupOffice,
        });

        return {
            comparisonSetsOptionsByMlsWithGroupOffice,
            comparisonSetsByMlsWithGroupOffice,
        };
    },
    handleSaveOfficeGroups: ({
        comparisonSets,
        selectedComparisonSet,
        groups,
        setState,
        groupLabel
    }) => {

        const newGroupName = groups[0].name;
        const saveModal = comparisonSetsModals.OFFICE_GROUP;
        const isOfficeGroupEdit = get().isOfficeGroupEdit;
        const selectedOfficeGroup = get().selectedOfficeGroup;
        const selectedCompSetGroups = isOfficeGroupEdit
            ? [...selectedComparisonSet.groups.filter(group => group.name !== selectedOfficeGroup.name)]
            : [...selectedComparisonSet.groups];
        const isDuplicatedOfficeGroupName = getHasDuplicatedText(selectedCompSetGroups, 'name', newGroupName);

        if (isDuplicatedOfficeGroupName) {
            showToast(toastTypes.error, mst.duplicateOfficeGroupName, setState);
            return;
        }

        updateComparisonSet(
            selectedComparisonSet,
            [...selectedCompSetGroups, ...groups]
        ).then(updatedComparisonSet => {
            if (updatedComparisonSet?.error) throw new Error(updatedComparisonSet?.error);
            const successMsg = isOfficeGroupEdit
                ? mst.getGroupEditedMsg(groupLabel)
                : mst.getGroupUpdatedMessage(groupLabel);
            showToast(toastTypes.success, successMsg, setState);
            const comparisonSetsList = comparisonSets?.list ?? [];
            const comparisonSetIndex = comparisonSetsList.findIndex(cs => cs.id === updatedComparisonSet.id);

            if (comparisonSetIndex > -1 && comparisonSetsList.length) {
                comparisonSetsList[comparisonSetIndex] = {
                    ...comparisonSetsList[comparisonSetIndex],
                    ...updatedComparisonSet
                };
            }
            const revisedComparisonSet = { ...selectedComparisonSet, ...updatedComparisonSet };
            const updatedComparisonSetsList = comparisonSetsList.filter(cs => cs.id !== updatedComparisonSet.id);
            set({ selectedComparisonSet: revisedComparisonSet,
                  comparisonSets: { list: [revisedComparisonSet, ...updatedComparisonSetsList] } 
                });
            get().toggleModal(false, saveModal);
            get().clearState();
        }).catch((e) => {
            const errorMsg = isOfficeGroupEdit
                ? mst.getOfficeGroupEditError(groupLabel)
                : mst.createComparisonSetsError;
            showToast(toastTypes.error, errorMsg, setState);
            console.error(mst.updateOfficeGroupError, e);
            get().toggleModal(false, saveModal)
            get().clearState();
        });
    },
    getSelectedComparisonSetOfficesList: async () => {
        try {
            const selectedComparisonSet = get().selectedComparisonSet || get().comparisonSetListOptions?.[0];
            if (!selectedComparisonSet) return;
            const offices = await getCoverageOffices(selectedComparisonSet?.mlsId);
            set({ selectedComparisonSetOfficesList: offices });
        } catch(err) {
            set({ error: err.message });
        }
    },
    getIsOfficeGroupSaveBtnDisabled: () => {
        const addedOffices = get().addedOffices;
        const comparisonSets = get().comparisonSets;
        const officeGroupName = get().officeGroupName?.trim();
        const isOfficeGroupEdit = get().isOfficeGroupEdit;
        const selectedOfficeGroup = get().selectedOfficeGroup;
        const selectedComparisonSet = get().selectedComparisonSet;

        if (officeGroupName.length === 0) return true;
        if (!isOfficeGroupEdit) {
            return !addedOffices.length || !officeGroupName.length;
        };
        const isNewName = selectedOfficeGroup?.name !== officeGroupName;
        const filteredGroup = comparisonSets?.list.filter(comparisonSet =>
            comparisonSet.id === selectedComparisonSet.id
        )[0]?.groups?.find(group => group.name === selectedOfficeGroup.name);
        const addedOfficesIds = addedOffices.map(office => office.officeId);
        const groupOfficesIds = filteredGroup?.offices.map(office => office.officeId);
        const hasGroupChange = !(addedOfficesIds.every(item => groupOfficesIds?.includes(item))
            && groupOfficesIds.every(item => addedOfficesIds.includes(item)));
        return !addedOffices.length || (!isNewName && !hasGroupChange);
    },
    setIsComparisonSetView: (isComparisonSetView) => set({ isComparisonSetView }),
    setSelectedComparisonSetOfficesList: (selectedComparisonSetOfficesList) => set({ selectedComparisonSetOfficesList }),
    setAddedOffices: (addedOffices) => set({ addedOffices }),
    setOfficeGroupName: (officeGroupName) => set({officeGroupName}, false, 'setOfficeGroupName'),
    setSelectedMls: (selectedMls) => set({selectedMls}, false, 'setSelectedMls'),
    clearState: () => {
        set({ addedOffices: [] });
        set({ officeGroupName: '' });
    },
    setIsLoading: (isLoading) => set({ isLoading })
});
