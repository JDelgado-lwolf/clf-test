import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { actions } from "./actions";
import { modules } from "../../constants";

export const initialSavedAgentStore = {
    selectedListByModule: ({
        [modules.proficiencyMetrics.agents]: undefined,
        [modules.proficiencyMetrics.savedAgents]: undefined,
    }),
    agentListByModule: ({
        [modules.proficiencyMetrics.savedAgents]: {
            recruitingSoldResponse: undefined,
            recruitingSoldTotals: undefined,
        },
    }),
    agentList: undefined,
    propertyTypeNames: [],
    isLoading: false,
    agentListsCheckedValues: {},
    popoverDataForAddAgentList: {},
}

const savedAgentsStore = (set, get) => ({
    ...initialSavedAgentStore,
    ...actions(set, get),
});

export const useSavedAgentsStore = createWithEqualityFn(
    devtools(
        persist(
            savedAgentsStore,
            {
                name: 'saved_agents_state',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
);
