import { createWithEqualityFn } from "zustand/traditional";
import { actions } from "./actions";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { comparisonSetsModals } from "../../constants";

export const initialComparisonSetsState = {
    comparisonSets: {list: []},
    comparisonSetsBySelectedMls: [],
    shouldShowByModal: {
        [comparisonSetsModals.SAVE]: false,
        [comparisonSetsModals.EDIT]: false,
        [comparisonSetsModals.DELETE]: false,
        [comparisonSetsModals.DELETE_OFFICE_GROUP]: false,
    },
    selectedMls: undefined,
    comparisonSetListOptions: undefined,
    comparisonSetListOptionsBySelectedMls: undefined,
    selectedComparisonSetOfficesList: undefined,
    comparisonSetResults: {},
    isComparisonSetView: false,
    addedOffices: [],
    officeGroupName: '',
    isOfficeGroupEdit: undefined,
    selectedOfficeGroup: undefined,
    newCompSetName: undefined,
    selectedComparisonSet: undefined,
    isLoading: false
};

export const comparisonSetsStore = (set, get) => ({
    ...initialComparisonSetsState,
    ...actions(set, get),
});

export const useComparisonSetsStore = createWithEqualityFn(
    devtools(
        persist(
            comparisonSetsStore,
            {
                name: 'comparison_sets_state',
                storage: createJSONStorage(() => sessionStorage)
            }
        )
    )
);
