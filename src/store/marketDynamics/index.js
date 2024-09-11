import { modules, searchTerms } from '../../constants';
import { initialView } from '../store';

const marketDynamicsView = (initialView) => ({
    ...initialView,
    id: modules.marketDynamics.marketDynamics,
    selectedPropTypes: [],
    marketAreaTitle: {
        mainTitle: searchTerms.selectType(searchTerms.marketArea)
    },
    propertyTypeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.propertyTypes)
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
    lotSizeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.lotSize)
    },
    squareFootageTitle: {
        mainTitle: searchTerms.selectType(searchTerms.squareFootage)
    },
    searchFilters: [
        searchTerms.savedSearchFilter,
        searchTerms.mlsFilter,
        searchTerms.marketAreaFilter,
        searchTerms.propTypeFilter,
        searchTerms.timeFrameFilter
    ]
});

export {
    marketDynamicsView
};
