import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import {  getUserPrivileges, getUserProfile } from '../service/account';
import {
    getAgentInfo,
    getMlsMembership,
    getOfficeInfo
} from '../service/mlsInfo';
import { getTimeIntervals, retryEndpoint } from '../service/misc';
import {
    getAgentLists,
    getMarketAreaLists,
    getOfficeLists
} from '../service/savedLists';
import { actions } from './actions';
import { modules, searchTerms } from '../constants';
import { ownerTypes } from '../constants';
import { agentSearchView, officeSearchView, transactionsSearchView } from './proficiencyMetrics';
import { marketCoverageView, marketTotalsView } from './marketShare';
import { marketDynamicsView } from './marketDynamics';
import { saveAgentSearchList, updateSavedAgentList } from '../service/service-gateway';
import { getOwnerIdByTokenInfo } from '../constants/auth';
import { useAuthStore } from './auth/store';
import { useSavedAgentsStore as useSavedAgentsStoreImported } from './savedAgents/store';
import { runningApp } from '../constants/app';

// Hack to keep current import in every file that uses this store
export const useSavedAgentsStore = useSavedAgentsStoreImported;

export const initialView = {
    id: undefined,
    search: {
        ownerId: undefined,
        mlsId: undefined,
        searchCriteria: undefined,
        representationCriteria: undefined
    },
    loadedSearchCriteria: undefined,
    selectedMls: undefined,
    savedSearchList: undefined,
    selectedSavedSearch: undefined,
    timeFrameTitle: {
        mainTitle: searchTerms.selectType(searchTerms.timeFrame)
    },
    searchStatus: undefined,
    recruitingSoldTotals: undefined,
    summaryPinnedData: undefined,
    totals: undefined,
};

export const initialSearchState = initialView => ({
    selectedModule: undefined,
    isLoading: false,
    isLoadingSearchData: false,
    listIsDirty: false,
    shouldCloseChips: false,
    shouldAgentNameRerunOnLoad: false,
    [modules.proficiencyMetrics.transactions]: { ...transactionsSearchView({ ...initialView }) },
    [modules.proficiencyMetrics.offices]: { ...officeSearchView({ ...initialView }) },
    [modules.proficiencyMetrics.agents]: { ...agentSearchView({ ...initialView }) },
    [modules.marketShare.totals]: { ...marketTotalsView({ ...initialView }) },
    [modules.marketShare.coverage]: { ...marketCoverageView({ ...initialView }) },
    [modules.marketDynamics.marketDynamics]: { ...marketDynamicsView({ ...initialView }) }
});

let searchStore = (set, get) => ({
    ...initialSearchState(initialView),
    ...actions(set, get)
});

export const useSearchStore = create(
    devtools(
        persist(
            searchStore,
            {
                name: 'search_state',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
);

let agentProfileStore = set => ({
    areaList: undefined,
    selectedAgentId: undefined,
    selectedMlsId: undefined,
    selectedArea: undefined,
    areaType: undefined,
    tableType: undefined,
    intervalType: undefined,
    isUnits: undefined,
    agentCoverageListingTab: undefined,
    currentTab: undefined,
    displayMode: undefined,
    timePeriod: undefined,
    setAreaList: (list) => set({ areaList: list }),
    setSelectedAgentId: (agentId) => set({ selectedAgentId: agentId }),
    setSelectedMlsId: (mlsId) => set({ selectedMlsId: mlsId }),
    setSelectedArea: (area) => set({ selectedArea: area }),
    setAreaType: (areaType) => set({ areaType: areaType }),
    setTableType: (tableType) => set({ tableType: tableType }),
    setIntervalType: (intervalType) => set({ intervalType: intervalType }),
    setIsUnits: (isUnits) => set({ isUnits: isUnits }),
    setAgentCoverageListingTab: (tab) => set({ agentCoverageListingTab: tab }),
    setCurrentTab: (tab) => set({ currentTab: tab }),
    setDisplayMode: (displayMode) => set({ displayMode }),
    setTimePeriod: (timePeriod) => set({ timePeriod: timePeriod })
});

export const useAgentProfileStore = create(
    devtools(
        persist(
            agentProfileStore,
            {
                name: 'ap_state',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
);

const initialCommonState = {
    timeIntervals: undefined,
    selectedModule: undefined,
    membership: undefined,
    profile: undefined,
    mlsProviders: undefined,
    officeInfo: undefined,
    agentInfo: undefined,
    popoverIsOpen: false,
    apiError: undefined,
    menuIsOpen: undefined,
    privileges: undefined,
    marketAreaLists: undefined,
    officeLists: undefined,
    agentLists: undefined,
    accountInfo: undefined,
    userInfo: undefined,
    selectedBeginValue: undefined,
    selectedEndValue: undefined,
    agentListToUpdate: undefined,
    lastUpdatedAgentList: undefined,
    popoverDataForAddAgentList: {},
    mlsList: undefined,
    backNavbar: { title: undefined },
};

let commonStore = (set, get) => ({
    ...initialCommonState,
    getPrivileges: async (accountId, userId) => {
        let response;
        try {
            response = await getUserPrivileges(accountId, userId);
            if (!response.error) {
                set({ privileges: response });
            }
        } catch (err) {
            set({ error: err.message });
        }
        return response;
    },
    addAgentListsCheckedValues: (listId) => {
        const newCheckedValues = { ...get().agentListsCheckedValues };
        newCheckedValues[listId] = true;
        set({agentListsCheckedValues: newCheckedValues})
    },
    removeAgentListsCheckedValues: (listId) => {
        const newCheckedValues = { ...get().agentListsCheckedValues };
        newCheckedValues[listId] = false;
        set({agentListsCheckedValues: newCheckedValues})
    },
    handleUpdateAgentNameSelectedList: async (listId, agentIdToAdd, listName, agentNameSearch, setListInSearchByAgentSearch) => {
        const shouldUpdateAgentNameSelectedList = (moduleSearch) => {
            const dataSourceId = moduleSearch?.search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters[0];
            const hasSearchCriteria = !!moduleSearch?.search?.searchCriteria;
            const hasSearchMlsId =  !!moduleSearch?.search?.mlsId;
            const searchListId = dataSourceId?.idFiltering[0]?.listId;
            const searchListIdMatch = searchListId === listId;
            const idValues = dataSourceId?.idFiltering[0]?.idValues;
            const hasAgentId = idValues?.includes(agentIdToAdd);

            if (hasSearchCriteria && !!hasSearchMlsId && !!searchListId && searchListIdMatch && !!idValues.length) {
                if (hasAgentId) {
                    const updatedIdValues = idValues.filter(id => id !== agentIdToAdd);
                    setListInSearchByAgentSearch(updatedIdValues, searchListId);
                } else {
                    setListInSearchByAgentSearch([...idValues, agentIdToAdd], searchListId);
                }
            }
        };
        let modifiedAgentList = {};
        const selectedAgentList = get().agentLists.find(list => list.agentListId === listId);
        const updateAgentList = async (modifiedAgentList, listName, listId) => {
            set({agentListToUpdate: listName});
            const response = await updateSavedAgentList(modifiedAgentList);
            const updatedAgentLists = get().agentLists.map((list) =>
                list.agentListId === response.agentListId
                    ? response
                    : list
            );
            set({ agentLists: updatedAgentLists, agentListToUpdate: '', lastUpdatedAgentList: listId});

            const savedAgentsModule = modules.proficiencyMetrics.savedAgents;
            const agentNameModule = modules.proficiencyMetrics.agents;

            const savedAgentsSelectedListId = useSavedAgentsStore.getState().selectedListByModule[savedAgentsModule]?.agentListId;
            const agentNameSelectedListId = useSavedAgentsStore.getState().selectedListByModule[agentNameModule]?.agentListId;

            if (savedAgentsSelectedListId === listId)
                useSavedAgentsStore.getState().setSelectedListByModule(savedAgentsModule, response);

            if (agentNameSelectedListId === listId)
                useSavedAgentsStore.getState().setSelectedListByModule(agentNameModule, response);
        };

        // This is remove
        if (selectedAgentList.agentIds.includes(agentIdToAdd)) {
            modifiedAgentList = {
                ...selectedAgentList,
                agentIds: selectedAgentList.agentIds.filter(agentId => agentId !== agentIdToAdd)
            };
            get().removeAgentListsCheckedValues(listId);
            try {
                await updateAgentList(modifiedAgentList, listName, listId);
            } catch (err) {
                get().addAgentListsCheckedValues(listId);
                set({ error: err.message });
            }
        // This is add
        } else {
            modifiedAgentList = {
                ...selectedAgentList,
                agentIds: [...selectedAgentList.agentIds, agentIdToAdd]
            };
            get().addAgentListsCheckedValues(listId);
            try {
                await updateAgentList(modifiedAgentList, listName, listId);
            } catch (err) {
                get().removeAgentListsCheckedValues(listId);
                set({ error: err.message });
            }
        }
        shouldUpdateAgentNameSelectedList(agentNameSearch);
    },
    createAgentsList: async (mlsId, listName, agentIdToAdd) => {
        const tokenInfo = useAuthStore.getState().tokenInfo;
        const tokenType = useAuthStore.getState().tokenType;
        const ownerId = getOwnerIdByTokenInfo[tokenType](tokenInfo);
        const ownerType = ownerTypes[tokenType.toLowerCase()] || ownerTypes.user;
        const newAgentList = {
            name: listName,
            application: runningApp,
            ownerType,
            ownerId,
            mlsId: mlsId,
            agentIds: [agentIdToAdd]
        }
        try {
            useSavedAgentsStore.setState({
                isLoading: true
            });
            await saveAgentSearchList(newAgentList);
            await get().getAgentLists(ownerId);
        } catch (err) {
            set({ error: err.message });
        } finally {
            useSavedAgentsStore.setState({
                isLoading: false
            });
        }
    },
    toggleAgentListsPopover: () => {
        set({ popoverDataForAddAgentList: prevState => ({
                ...prevState.popoverDataForAddAgentList,
                popoverIsOpen: !prevState.popoverDataForAddAgentList.popoverIsOpen
        })});
    },
    clearAgentListPopover: () => set({
        popoverDataForAddAgentList: {}
    }),
    setMlsProviders: mlsList => set({ mlsProviders: mlsList }),
    setSelectedBeginValue: selectedBeginValue => set({ selectedBeginValue: selectedBeginValue }),
    setSelectedEndValue: selectedEndValue => set({ selectedEndValue: selectedEndValue }),
    getTimeIntervals: async () => {
        try {
            const response = await retryEndpoint({fetchFunction: getTimeIntervals});
            set({ timeIntervals: response });
        } catch (err) {
            set({ error: err.message });
        }
    },
    getUserProfile: async (username) => {
        let response;
        try {
            response = await getUserProfile(username);
            set({ profile: response });
        } catch (err) {
            set({ error: err.message });
        }
        return response;
    },
    getMembership: async (mlsIdList) => {
        try {
            const response = await getMlsMembership(mlsIdList);
            set({ membership: response });
        } catch (err) {
            set({ error: err.message });
        }
    },
    getOfficeInfo: async (officeList) => {
        let response;
        try {
            response = await getOfficeInfo(officeList);
            set({ officeInfo: response });
        } catch (err) {
            set({ error: err.message });
        }
        return response;
    },
    getAgentInfo: async (agentList) => {
        let response;
        try {
            response = await getAgentInfo(agentList);
            set({ agentInfo: response });
        } catch (err) {
            set({ error: err.message });
        }
        return response
    },
    getMarketAreaLists: async (userId) => {
        try {
            set({ isLoading: true });
            const response = await getMarketAreaLists(userId);
            set({ isLoading: false, marketAreaLists: response?.areas });
        } catch (err) {
            set({ isLoading: false, error: err.message });
        }
    },
    getOfficeLists: async (userId) => {
        try {
            set({ isLoading: true });
            const response = await getOfficeLists(userId);
            set({ isLoading: false, officeLists: response?.list });
        } catch (err) {
            set({ isLoading: false, error: err.message });
        }
    },
    getAgentLists: async (userId) => {
        try {
            const response = await getAgentLists(userId);
            set({ isLoading: false, agentLists: response });
        } catch (err) {
            set({ error: err.message });
        }
    },
    toggleMenuIsOpen: (menuIsOpen) => set({ menuIsOpen }),
    resetStore: () => {
        set(initialCommonState);
    },
    setAccountInfo: (accountInfo) => {
        set({accountInfo});
    },
    setUserInfo: (userInfo) => {
        set({userInfo});
    },
    setBackNavbarTitle: (title) => set({
        backNavbar: { title }
    }, false, 'setBackNavbarTitle'),
});

export const useCommonStore = create(
    devtools(
        persist(
            commonStore,
            {
                name: 'common_state',
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    )
);
