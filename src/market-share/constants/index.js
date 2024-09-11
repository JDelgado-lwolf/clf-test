import { marketShareTerms as t } from './index';
import { marketShareListingStatuses, searchTerms } from '../../constants';
import { transformData } from '../helpers/helpers';
import { fieldMarkers as marker } from '../helpers/export';

export const marketShareTerms = Object.freeze({
    maxReached: 'Maximum number of rows has been reached.',
    MAX_ROWS_ARE_SELECTED: 'MAX_ROWS_ARE_SELECTED',
    totals: 'Totals',
    coverage: 'Coverage',

    byOffice: 'By Office',
    byBrokerage: 'By Brokerage',

    rankedBy: 'Ranked by',

    total$Volume: 'Total $ Volume',
    totalNumUnits: 'Total # Units',
    listSide$Volume: 'List Side $ Volume',
    listSideNumUnits: 'List Side # Units',
    sellSide$Volume: 'Sell Side $ Volume',
    sellSideNumUnits: 'Sell Side # Units',
    underContract$: 'Under Contract ($)',
    underContractVolume: 'Under Contract $',
    underContractNum: 'Under Contract (#)',
    underContractUnits: 'Under Contract #',
    underContract$Volume: 'Total $ Under Contract',
    underContractNumUnits: 'Total # Under Contract',
    newListing$Volume: 'Total $ New Listings',
    newListingNumUnits: 'Total # New Listings',
    newListing$: 'New ($)',
    newListingNum: 'New (#)',
    newListingVolume: 'New Listings $',
    newListingUnits: 'New Listings #',
    forSale$Volume: 'Total $ For Sale',
    forSaleNumUnits: 'Total # For Sale',
    coverageForSale$Volume: '$ Volume For Sale',
    coverageForSaleNumUnits: '# Units For Sale',
    forSale$: 'For Sale ($)',
    forSaleNum: 'For Sale (#)',
    forSaleVolume: 'For Sale $',
    forSaleUnits: 'For Sale #',
    mlsIds: 'MLS IDs',
    type: 'Type',
    status: 'Status',

    onlyShowSelectedOffices: 'Only Show Selected Offices',
    onlyShowSelectedBrokerages: 'Only Show Selected Brokerages',
    onlyShowSelectedAreas: 'Only Show Selected Areas',
    onlyShowSelectedGroups: 'Only Show Selected Groups',
    chart: 'Chart',
    additionalInfo: 'Additional Information',

    state: 'State',
    phone: 'Phone',

    address: 'Address',
    marketSharePct: 'Market Share %',
    mkt: 'Mkt',
    marketShare: 'Market Share',
    noRowsSelected: 'Please select a checkbox on the table below to view your chart data',
    dom: 'DOM',
    averagePrice: 'Average Price',
    avgPrice: 'Avg Price',
    unitsPerProducingAgent: 'Units per Producing Agent',
    volumePerProducingAgent: 'Volume per Producing Agent',
    producingAgents: 'Producing Agents',
    numOfOffices: '# of Offices',
    metrics: 'Metrics',
    spOp: 'SP/OP',
    spOpPct: 'SP/OP %',
    spLp: 'SP/LP %',
    closedToList: 'Closed-to-List',
    clr: 'C/L',
    clrPct: 'C/L %',

    getSearchSubtitle: title => `${title}`,
    noListingRowsToShow: listing => `No ${listing} Listings Found`,

    area: 'Area',
    list$: 'List ($)',
    listSideVolume: 'List Side $ Volume',
    list$Volume: 'List $ Volume',
    listNum: 'List (#)',
    listSideUnit: 'List Side # Unit',
    listNumUnits: 'List # Units',
    sell$: 'Sell ($)',
    sellSideVolume: 'Sell Side $ Volume',
    sell$Volume: 'Sell $ Volume',
    sellNum: 'Sell (#)',
    sellSideUnit: 'Sell Side # Unit',
    sellNumUnits: 'Sell # Units',
    side: 'Side',
    total$: 'Total ($)',
    totalNum: 'Total (#)',
    total: 'Total',
    mktPct: 'Mkt %',
    unitPct: 'Units %',
    volumePct: '$ Volume %',
    avg$: 'Avg $',
    prodAgentUnits: '# PPA',
    prodAgentVolume: '$ PPA',
    prodAgentCount: 'P.Agts',
    prodAgents: 'Prod Agents',
    prodAgentsCurrentSearch: 'Prod Agents (Current Search)',
    rank: 'Rank',
    isSelected: 'Is Selected',
    office: 'Office',
    officeId: 'Office ID',
    officeName: 'Office Name',
    listingView: 'Listing View',
    listingType: 'Listing Type',
    listingBreakdown: 'Listing Breakdown',
    officeBreakdown: 'Office Breakdown',
    searchFilterAdjust: 'Please adjust your search filters to find offices/brokerages you\'re looking for',
    searchFilterAdjustCoverage: 'Please adjust your search filters to find the Area Coverage you\'re looking for',
    listOfficeId: 'List Office ID',
    sellOfficeId: 'Sell Office ID',
    group: 'Group',
    allOther: 'All Other',
});

export const EXCLUDED_ROWS = [
    marketShareTerms.allOther
]

export const listingBreakdownSettings = {
    soldBothSides: 'Total Sold List + Sell',
    soldListSide: 'Sold List Side',
    soldSellSide: 'Sold Sell Side',
    officeDetails: 'Office Details'
};

export const listingsBreakdownKeys = {
    officeDetails: 'officeDetails',
    newListings: 'newListings'
};

export const showHideTypes = Object.freeze({
    onlyShowSelectedOffices: { id: 'onlyShowSelectedOffices', label: t.onlyShowSelectedOffices },
    onlyShowSelectedBrokerages: { id: 'onlyShowSelectedBrokerages', label: t.onlyShowSelectedBrokerages },
    onlyShowSelectedAreas: { id: 'onlyShowSelectedAreas', label: t.onlyShowSelectedAreas },
    onlyShowSelectedGroups: { id: 'onlyShowSelectedGroups', label: t.onlyShowSelectedGroups },
    chart: { id: 'chart', label: t.chart }
});

export const searchTypes = Object.freeze({
    soldBothSides: 'SoldBothSides',
    soldListSide: 'SoldListSide',
    soldSellSide: 'SoldSellSide',
    forSale: 'ForSale',
    underContract: 'UnderContract',
    newListings: 'New'
});

export const listingTypes = Object.freeze({
    byOffice: {
        id: 'byOffice',
        label: t.byOffice,
        collectionKey: 'offices',
        yAxisLabelMapper: d => d['officeName'],
        getTransformData: (stats, sortField) => {
            return ({ offices }) => transformData(offices, stats, sortField, false);
        },
        defaultShowHideOptions: [
            showHideTypes.onlyShowSelectedOffices,
            { ...showHideTypes.chart, isDefault: true }
        ]
    },
    byBrokerage: {
        id: 'byBrokerage',
        label: t.byBrokerage,
        collectionKey: 'brokers',
        yAxisLabelMapper: d => d['brokerName'],
        getTransformData: (stats, sortField) => {
            return ({ brokers }) => transformData(brokers, stats, sortField, false);
        },
        defaultShowHideOptions: [
            showHideTypes.onlyShowSelectedBrokerages,
            { ...showHideTypes.chart, isDefault: true }
        ]
    },
    comparisonSet: {
        id: 'comparisonSet',
        label: searchTerms.comparisonSet,
        collectionKey: 'comparisonSetData',
        yAxisLabelMapper: d => d['groupName'],
        getTransformData: (stats, sortField) => {
            return ({ comparisonSetData }) => transformData(comparisonSetData, stats, sortField, false);
        },
        defaultShowHideOptions: [
            showHideTypes.onlyShowSelectedGroups,
            { ...showHideTypes.chart, isDefault: true }
        ]
    }
});

export const coverageTransforms = Object.freeze({
    getTransformData: (sumOfColumn, sortField) => {
        return ({ data }) => transformData(data, sumOfColumn, sortField, true);
    }
});

export const barChartColors = Object.freeze({
    DARK_BLUE: '#0C4A6E',
    LIGHT_BLUE: '#7DD3FC'
});

export const marketShareColors = Object.freeze({
    NEW_LISTING: barChartColors.DARK_BLUE,
    FOR_SALE: barChartColors.DARK_BLUE,
    UNDER_CONTRACT: barChartColors.DARK_BLUE,
    LIST_SIDE: barChartColors.LIGHT_BLUE,
    SELL_SIDE: barChartColors.DARK_BLUE
});

export const dataPoints = {
    FOR_SALE_VOLUME: {
        dataMapper: d => d.actVolume,
        color: marketShareColors.FOR_SALE,
        label: marketShareListingStatuses.ForSale
    },
    FOR_SALE_UNITS: {
        dataMapper: d => d.actUnits,
        color: marketShareColors.FOR_SALE,
        label: marketShareListingStatuses.ForSale
    },
    UNDER_CONTRACT_VOLUME: {
        dataMapper: d => d.ucVolume,
        color: marketShareColors.UNDER_CONTRACT,
        label: marketShareListingStatuses.UnderContract
    },
    UNDER_CONTRACT_UNITS: {
        dataMapper: d => d.ucUnits,
        color: marketShareColors.UNDER_CONTRACT,
        label: marketShareListingStatuses.UnderContract
    },
    SOLD_LIST_SIDE_VOLUME: {
        dataMapper: d => d.listVolume,
        color: marketShareColors.LIST_SIDE,
        label: marketShareListingStatuses.SoldListSide
    },
    SOLD_SELL_SIDE_VOLUME: {
        dataMapper: d => d.sellVolume,
        color: marketShareColors.SELL_SIDE,
        label: marketShareListingStatuses.SoldSellSide
    },
    NEW_LISTING_VOLUME: {
        dataMapper: d => d.newListVolume,
        color: marketShareColors.NEW_LISTING,
        label: marketShareListingStatuses.New
    },
    NEW_LISTING_UNITS: {
        dataMapper: d => d.newListUnits,
        color: marketShareColors.NEW_LISTING,
        label: marketShareListingStatuses.New
    },
    SOLD_LIST_SIDE_UNITS: {
        dataMapper: d => d.listUnits,
        color: marketShareColors.LIST_SIDE,
        label: marketShareListingStatuses.SoldListSide
    },
    SOLD_SELL_SIDE_UNITS: {
        dataMapper: d => d.sellUnits,
        color: marketShareColors.SELL_SIDE,
        label: marketShareListingStatuses.SoldSellSide
    }
};

export const gridGroups = Object.freeze({
    ADDRESS: 'address'
});

export const exportFilenameTemplates = {
    officeBreakdown: `${marker.OWNER}'s ${marker.LISTING_TYPE} Office Breakdown`,
    listingBreakdown: `${marker.OWNER}'s ${marker.LISTING_TYPE} Listings Breakdown`,
    totals: `Market Share's ${marker.SEARCH_TYPE} for ${marker.LISTING_STATUS_FILTER} - ${marker.LISTING_TYPE} Export - ${marker.DATE}`,
    coverage: `Market Share's ${marker.SEARCH_TYPE} for ${marker.LISTING_STATUS_FILTER} Export - ${marker.DATE}`,
    marketDynamicsSearch: `Market Dynamics' ${marker.LISTING_VIEW} - Export - ${marker.DATE}`
};
