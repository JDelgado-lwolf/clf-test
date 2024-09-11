import { errorMessaging } from "../../market-dynamics/constants";
import { getMarketDynamicsOfficeBreakdown, getMarketDynamicsSearch } from "../../service/market-dynamics";

export const actions = (set) => ({
    setTableView: ({ tableView }) => {
        set({ tableView });
    },
    setSelectedBreakdownPeriod: (selectedBreakdownPeriod) => {
        set({ selectedBreakdownPeriod });
    },
    getOfficesBreakdown: async (searchCriteria) => {
        try {
            const offices = await getMarketDynamicsOfficeBreakdown(searchCriteria);
            if (offices.error) throw new Error(errorMessaging.fetchOffices);
            return offices;
        } catch(e) {
            console.error(e);
        }
    },
    setCheckedStatusOptions: (options) => set({ checkedStatusOptions: [...options] }),
    runMarketDynamicsSearch: async criteria => {
        try {
            const { results, totals, error = undefined } = await getMarketDynamicsSearch(criteria);

            if (error) throw new Error (error);
            return {
                results,
                totals
            };
        } catch(e) {
            throw new Error (e?.message ?? e)
        }
    },
});
