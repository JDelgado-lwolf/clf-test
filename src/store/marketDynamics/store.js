import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { actions } from "./actions";

export const initialMarketDynamicsStore = {
    tableView: {},
    selectedBreakdownPeriod: undefined,
    checkedStatusOptions: [],
};

const marketDynamicsStore = (set, get) => ({
    ...initialMarketDynamicsStore,
    ...actions(set, get),
});

export const useMarketDynamicsStore = createWithEqualityFn(
    devtools(
        persist(
            marketDynamicsStore,
            {
                name: 'market_dynamics_state',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
);
