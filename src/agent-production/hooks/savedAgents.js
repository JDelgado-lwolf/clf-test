import { useEffect, useRef, useState } from "react";
import { types, views } from "../constants/savedAgents";
import { getDefaultContactInfoColumns, getDefaultOverviewColumns, getMlsRestrictionSettings } from "../helpers/agentProductionHelpers";
import { useCommonStore, useSavedAgentsStore, useSearchStore } from "../../store/store";
import { getDefaultColumns as getDefaultListingProfColumns} from "../helpers/listingProficiencyHelpers";
import { growthAnalysisColumnsByPeriod } from "../components/helpers/growthAnalysisHelpers";
import { removeRowByKey } from "../../common/helpers/agGrid";
import { setStateData } from "../../common/helpers/state";
import { getKeyByValue } from "../../common/helpers/object";
import { TimePeriods, agentProductionTerms as terms, modules } from "../../constants";

export const useSavedAgents = () => {
    const savedAgentsModule = modules.proficiencyMetrics.savedAgents;
    const gridRef = useRef();

    const {
        timeIntervals,
        agentLists,
        popoverDataForAddAgentList,
        toggleAgentListsPopover,
        lastUpdatedAgentList,
        privileges
    } = useCommonStore(state => ({
        timeIntervals: state.timeIntervals,
        agentLists: state.agentLists,
        popoverDataForAddAgentList: state.popoverDataForAddAgentList,
        toggleAgentListsPopover: state.toggleAgentListsPopover,
        lastUpdatedAgentList: state.lastUpdatedAgentList,
        privileges: state.privileges
    }));

    const { currentModule } = useSearchStore(state => ({
        currentModule: state.selectedModule,
    }));

    const {
        savedAgentsSelectedList,
        runSelectedList,
        agentData,
        setAgentListByModule,
        setSelectedListByModule,
        setRowDataSortedAndRanked,
    } = useSavedAgentsStore(state => ({
        savedAgentsSelectedList: state.selectedListByModule[savedAgentsModule],
        runSelectedList: state.runSelectedList,
        agentData: state.agentListByModule[savedAgentsModule]?.recruitingSoldResponse,
        setAgentListByModule: state.setAgentListByModule,
        setSelectedListByModule: state.setSelectedListByModule,
        setRowDataSortedAndRanked: state.setRowDataSortedAndRanked,
    }));

    const restrictedMlsSettings = getMlsRestrictionSettings(savedAgentsSelectedList?.mlsId);

    const [state, setState] = useState({
        selectedView: views.overview,
        selectedAgentsView: types.SHOW_ALL_AGENTS,
        rowData: [],
        overviewColumns: getDefaultOverviewColumns(),
        contactInfoColumns: getDefaultContactInfoColumns(restrictedMlsSettings),
        listingProfColumns: getDefaultListingProfColumns(),
        currentSearchDates: {
            lastIntervalText: '',
            from: null,
            to: null
        },
        growthAnalysisColumns: growthAnalysisColumnsByPeriod[terms.last12Months],
        growthAnalysisPeriod: terms.last12Months,
        timeIntervals,
        searchCriteria: undefined,
        showModal: false,
        modalProps: {
            dataLwtId: 'agent-production-modal',
            show: false,
            size: '',
            title: '',
            footerClassName: '',
            showFooter: false,
            onClose: () => null,
            children: null
        },
        prevSelectedList: savedAgentsSelectedList,
    });

    const removeAgentInSearchStoreData = (agentId) => {
        const updatedAgentData = agentData?.filter(agent => agent.agentId !== agentId);
        setAgentListByModule(currentModule, updatedAgentData);
    };

    const removeAgentFromTableAndModuleSearch = (gridRef, agentId) => {
        if (!gridRef.current || !gridRef.current?.api) return;
        removeRowByKey(gridRef, 'agentId', agentId);
        toggleAgentListsPopover();
        removeAgentInSearchStoreData(agentId);
    };
    useEffect(() => {
        if (!agentData || agentData.error) return;
        setRowDataSortedAndRanked(agentData, setState);
    },[agentData]);

    useEffect( () => {
        runSelectedList(setState);
    }, [runSelectedList, savedAgentsSelectedList?.agentIds, state.prevSelectedList]);

    useEffect(() => {
        setStateData(
            'growthAnalysisColumns',
            growthAnalysisColumnsByPeriod[state.growthAnalysisPeriod],
            setState
        );
    }, [state.growthAnalysisPeriod]);

    useEffect(() => {
        if (!timeIntervals?.length) return;
        let currentSearchDates;
        const interval = timeIntervals?.find(i => i?.intervalType === terms.annually);
        if (interval) {
            const lastIntervalText = getKeyByValue(TimePeriods, terms.annually);
            const from = new Date(`${interval.last.from}Z`);
            const to = new Date(`${interval.last.to}Z`);
            currentSearchDates = { lastIntervalText, from, to };
        }
        setStateData('currentSearchDates', currentSearchDates, setState);
    }, [timeIntervals]);

    useEffect(() => {
        if (!savedAgentsSelectedList) {
            const agentList = agentLists?.length ? agentLists[0] : undefined
            setSelectedListByModule(savedAgentsModule, agentList);
        }
        if (currentModule === savedAgentsModule) {
            const { agentId } = popoverDataForAddAgentList;
            const isAgentInList = savedAgentsSelectedList?.agentIds.includes(agentId);
            const lastUpdatedAgentListMatch = lastUpdatedAgentList === savedAgentsSelectedList?.agentListId;
            lastUpdatedAgentListMatch && isAgentInList && removeAgentFromTableAndModuleSearch(gridRef, agentId);
        }
    }, [agentLists]);

    useEffect(() => {
        if (!savedAgentsSelectedList || !agentData || agentData.error) return;
        const { userOffices } = privileges;
        const userMlsOffices = userOffices.filter(office => office.mlsId === savedAgentsSelectedList.mlsId);
        const userFilteredOffices = userMlsOffices.map(office => office.officeIds)[0];
        const agentResults = setRowDataSortedAndRanked(agentData, setState);
        const shouldNotRank = true;
        let agentsFilteredData;

        switch (state.selectedAgentsView) {
            case types.ONLY_SHOW_MY_AGENTS:
                agentsFilteredData = agentResults.filter(agent => userFilteredOffices.includes(agent.officeId));
                setRowDataSortedAndRanked(agentsFilteredData, setState, shouldNotRank);
                break;
            case types.HIDE_MY_AGENTS:
                agentsFilteredData = agentResults.filter(agent => !userFilteredOffices.includes(agent.officeId));
                setRowDataSortedAndRanked(agentsFilteredData, setState, shouldNotRank);
                break;
            default:
                setRowDataSortedAndRanked(agentData, setState);
                break;
        };
    }, [state.selectedAgentsView]);

    return {
        state,
        setState,
        gridRef,
    };
};
