import { modules, searchTerms } from '../constants';
import { getMarketAreaMainTitle } from '../common/helpers/titles';
import { agentSearchView, officeSearchView, transactionsSearchView } from './proficiencyMetrics';
import { marketCoverageView, marketTotalsView } from './marketShare';
import { marketDynamicsView } from './marketDynamics';

export const defaultTitles = {
    propertyTypeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.propertyTypes)
    },
    timeFrameTitle: {
        mainTitle: searchTerms.selectType(searchTerms.timeFrame)
    },
    totalVolumeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.totalVolume)
    },
    soldPriceRangeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.soldPriceRange)
    },
    priceRangeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.priceRange)
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
    marketAreaTitle: (module) => ({
        mainTitle: getMarketAreaMainTitle({ module: module.id })
    }),
    areaTypeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.areaType)
    },
    listingStatusTitle: {
        mainTitle: searchTerms.selectType(searchTerms.listingStatus)
    },
    officesTitle: {
        mainTitle: searchTerms.selectType(searchTerms.offices)
    },
    agentsTitle: {
        mainTitle: searchTerms.selectType(searchTerms.agents)
    },
    lotSizeTitle: {
        mainTitle: searchTerms.selectType(searchTerms.lotSize)
    },
    squareFootageTitle: {
        mainTitle: searchTerms.selectType(searchTerms.squareFootage)
    },
    comparisonSetTitle: {
        mainTitle: searchTerms.selectType(searchTerms.comparisonSet)
    },
};

export const viewByModule = {
    [modules.proficiencyMetrics.transactions]: transactionsSearchView,
    [modules.proficiencyMetrics.offices]: officeSearchView,
    [modules.proficiencyMetrics.agents]: agentSearchView,
    [modules.marketShare.totals]: marketTotalsView,
    [modules.marketShare.coverage]: marketCoverageView,
    [modules.marketDynamics.marketDynamics]: marketDynamicsView
};
