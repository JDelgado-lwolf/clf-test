import { modules, searchTerms } from '../../constants';

const marketTotalsView = (initialView) => ({
    ...initialView,
    id: modules.marketShare.totals,
    selectedPropTypes: [],
    selectedComparisonSetSearch: undefined,
    marketAreaTitle: {
        mainTitle: searchTerms.selectType(searchTerms.marketArea)
    },
    propertyTypeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.propertyTypes)
    },
    listingStatusTitle: {
        mainTitle: searchTerms.selectType(searchTerms.listingStatus)
    },
    priceRangeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.priceRange)
    },
    bedroomsTitle: {
        mainTitle: searchTerms.selectType(searchTerms.bedrooms)
    },
    fullBathroomsTitle: {
        mainTitle: searchTerms.selectType(searchTerms.fullBathrooms)
    },
    comparisonSetTitle: {
        mainTitle: searchTerms.selectType(searchTerms.comparisonSet)
    },
    searchFilters: [
        searchTerms.savedSearchFilter,
        searchTerms.mlsFilter,
        searchTerms.marketAreaFilter,
        searchTerms.propTypeFilter,
        searchTerms.timeFrameFilter,
        searchTerms.listingStatusFilter
    ]
});

const marketCoverageView = (initialView) => ({
    ...initialView,
    id: modules.marketShare.coverage,
    selectedPropTypes: [],
    areaTypeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.areaType)
    },
    propertyTypeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.propertyTypes)
    },
    listingStatusTitle: {
        mainTitle: searchTerms.selectType(searchTerms.listingStatus)
    },
    officesTitle: {
        mainTitle: searchTerms.selectType(searchTerms.offices)
    },
    priceRangeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.priceRange)
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
        searchTerms.areaTypeFilter,
        searchTerms.propTypeFilter,
        searchTerms.timeFrameFilter,
        searchTerms.listingStatusFilter,
        searchTerms.officesFilter
    ]
});

export {
    marketTotalsView,
    marketCoverageView
};
