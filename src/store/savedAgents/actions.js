import { getPropertyTypeValues, getSearchCriteria, getSearchCriteriaPropertyTypes } from "../../agent-production/components/savedAgents/helpers";
import { agentsColumns } from "../../agent-production/constants/agentProductionConstants";
import { types, views } from "../../agent-production/constants/savedAgents";
import { getDefaultContactInfoColumns, getMlsRestrictionSettings } from "../../agent-production/helpers/agentProductionHelpers";
import { setStateData } from "../../common/helpers/state";
import { modules } from "../../constants";
import { responseKeys } from "../../constants/service";
import { getSortedObjectsNumeric } from "../../market-share/helpers/helpers";
import { getPropertyTypes } from "../../service/mlsInfo";
import { getProficiencyMetrics } from "../../service/proficiency-metrics";
import { useCommonStore, useSearchStore } from "../store";
import { agentListsEditModalActions } from "./agentListsEditModalActions";
import { initialSavedAgentStore } from "./store";

export const actions = (set, get) => ({
    ...agentListsEditModalActions(set, get),
    setRowDataSortedAndRanked: (data, setState, shouldNotRank = false) => {
        const sortedData = getSortedObjectsNumeric(data, agentsColumns.totalVolume.id);
        const revisedData = sortedData.map((agent, i) => ({ ...agent, rank: i + 1 }));
        setStateData('rowData', shouldNotRank ? sortedData : revisedData, setState);
        return !shouldNotRank ? revisedData : sortedData;
    },
    runSelectedList: async (setState) => {
        const savedAgentsModule = modules.proficiencyMetrics.savedAgents;
        const selectedList = get().selectedListByModule[savedAgentsModule]
        const mlsId = selectedList?.mlsId;
        const agentIds = selectedList?.agentIds;
        const agentListId = selectedList?.agentListId;
        if (!selectedList) return;

        try {
            set({isLoading: true})
            setStateData('selectedAgentsView', types.SHOW_ALL_AGENTS, setState);
            const propertyTypes = await getPropertyTypes(mlsId);
            const searchCriteriaPropertyTypes = getSearchCriteriaPropertyTypes(propertyTypes);
            const propertyTypeIds = getPropertyTypeValues(searchCriteriaPropertyTypes, 'typeId');
            const propertyTypeNames = getPropertyTypeValues(searchCriteriaPropertyTypes, 'longName');
            const restrictedMlsSettings = getMlsRestrictionSettings(mlsId);

            set({propertyTypeNames});

            const searchCriteria = getSearchCriteria(
                mlsId,
                propertyTypeIds,
                propertyTypeNames,
                agentIds,
                agentListId,
            );

            setState(prevState => ({
                ...prevState,
                searchCriteria,
                contactInfoColumns: getDefaultContactInfoColumns(restrictedMlsSettings)
            }));

            const {recruitingSoldResponse, recruitingSoldTotals} = await getProficiencyMetrics(searchCriteria);
            get().setAgentListByModule(savedAgentsModule, recruitingSoldResponse);
            const rankedRowData = get().setRowDataSortedAndRanked(
                recruitingSoldResponse, setState
            );
            setStateData('rowData', rankedRowData, setState);
            get().setSavedAgentSearch(searchCriteria, recruitingSoldResponse);
            setStateData('prevSelectedList', selectedList, setState);
            useSearchStore.getState().setTotalsRowData(recruitingSoldTotals, responseKeys.recruitingSoldTotals);
            useSearchStore.getState().setSummaryPinnedData(views.overview, responseKeys.recruitingSoldTotals);
        } catch (error) {
            console.log({error})
        } finally {
            set({isLoading: false})
        }

    },
    setSavedAgentSearch: (searchCriteria, recruitingSoldResponse) => {
        const selectedModule = useSearchStore.getState().selectedModule;
        const selectedList = get().selectedListByModule[selectedModule];
        const membership = useCommonStore.getState().membership;
        if(selectedModule !== modules.proficiencyMetrics.savedAgents) return;
        useSearchStore.setState({ isLoading: true });
        try {
            useSearchStore.setState( state => ({
                [selectedModule]: {
                    ...state[selectedModule],
                    search: {
                        ...selectedList,
                        searchCriteria: {
                            ...searchCriteria
                        },
                    },
                    loadedSearchCriteria: searchCriteria.criteria,
                    selectedMls: membership.find(mls => mls.mlsId === selectedList?.mlsId),
                    agentData: recruitingSoldResponse
                }
            }));
        useSearchStore.setState({ isLoading: false });
        } catch (error) {
            console.log(error);
        }
    },
    resetStore: () => {
        set(initialSavedAgentStore)
    },
    getMlsName: () => {
        const selectedModule = useSearchStore.getState().selectedModule;
        const selectedList = get().selectedListByModule[selectedModule];
        const mlsId = selectedList?.mlsId;
        const membership = useCommonStore.getState().membership;
        return membership.find((p) => p?.mlsId === mlsId)?.shortDescription;
    },
    setSelectedListByModule: (module, list) => {
        const prevState = get().selectedListByModule;
        set({ selectedListByModule: { ...prevState, [module]: list }});
    },
    setAgentListByModule: (module, list) => {
        const prevState = get().agentListByModule;
        set({ agentListByModule: { ...prevState, [module]: list }});
    },
    getAgentListSelectedValue: (optionGroups) => {
        if (!optionGroups) return undefined;

        const selectedList = get().selectedListByModule[modules.proficiencyMetrics.agents];
        const titleOption = optionGroups?.[0].options[0];

        if (!selectedList) return titleOption;

        return optionGroups?.[1].options.find(option =>
            selectedList.agentListId === option.value
        );
    },
    findAgentListById: () => {
        const searchStore = useSearchStore.getState();
        const commonStore = useCommonStore.getState();
        const selectedModule = searchStore.selectedModule;
        const selectedAgentListId =  searchStore[selectedModule]?.search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.[0]?.idFiltering?.[0]?.listId;
        const agentsList = commonStore?.agentLists;
        if(!selectedAgentListId || !agentsList?.length) return;
        return agentsList.find(agentList => agentList.agentListId === selectedAgentListId);
    },
});
