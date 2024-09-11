import { modules, searchTerms } from '../../constants';

const transactionsSearchView = (initialView) => ({
    ...initialView,
    id: modules.proficiencyMetrics.transactions,
    selectedPropTypes: [],
    selectedMarketAreaList: undefined,
    marketAreaTitle: {
        mainTitle: searchTerms.selectType(searchTerms.marketArea)
    },
    propertyTypeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.propertyTypes)
    },
    totalVolumeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.totalVolume)
    },
    soldPriceRangeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.soldPriceRange)
    },
    totalUnitsTitle: {
        mainTitle: searchTerms.selectType(searchTerms.totalUnits)
    },
    bedroomsTitle: {
        mainTitle: searchTerms.selectType(searchTerms.bedrooms)
    },
    fullBathroomsTitle: {
        mainTitle: searchTerms.selectType(searchTerms.fullBathrooms)
    },
    searchFilters: [
        searchTerms.savedSearchFilter,
        searchTerms.mlsFilter,
        searchTerms.marketAreaFilter,
        searchTerms.propTypeFilter,
        searchTerms.timeFrameFilter
    ]
});

const officeSearchView = (initialView) => ({
    ...initialView,
    id: modules.proficiencyMetrics.offices,
    officesTitle: {
        mainTitle: searchTerms.selectType(searchTerms.offices)
    },
    totalVolumeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.totalVolume)
    },
    soldPriceRangeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.soldPriceRange)
    },
    totalUnitsTitle: {
        mainTitle: searchTerms.selectType(searchTerms.totalUnits)
    },
    searchFilters: [
        searchTerms.savedSearchFilter,
        searchTerms.mlsFilter,
        searchTerms.timeFrameFilter,
        searchTerms.officesFilter
    ]
});

const agentSearchView = (initialView) => ({
    ...initialView,
    id: modules.proficiencyMetrics.agents,
    agents: [],
    selectedPropTypes: [],
    propertyTypeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.propertyTypes)
    },
    agentsTitle: {
        mainTitle: searchTerms.selectType(searchTerms.agents)
    },
    soldPriceRangeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.soldPriceRange)
    },
    searchFilters: [
        searchTerms.savedSearchFilter,
        searchTerms.mlsFilter,
        searchTerms.propTypeFilter,
        searchTerms.timeFrameFilter,
        searchTerms.agentsFilter
    ]
});

export {
    transactionsSearchView,
    officeSearchView,
    agentSearchView
};
