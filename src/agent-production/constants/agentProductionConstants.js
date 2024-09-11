import { agentProductionTerms as agProdTerms, agentProductionTerms, TimePeriods } from '../../constants';
import { Routes } from '../../common/routes/routes';

export const agentProfileRoute = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.AGENT_PROFILE}`;
export const productionListingRoute = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.PROD_LISTING}`;
export const coverageListingRoute = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.COVERAGE_LISTING}`;

export const viewHideAgentsDropdownLabels = Object.freeze({
    viewHideAgents: 'View/Hide Agents',
    viewOnlyMyAgents: 'View Only My Agents',
    hideMyAgents: 'Hide My Agents'
});

export const tableViewNames = Object.freeze(({
    availableOffices: 'availableOffices',
    addedOffices: 'addedOffices',
    overview: 'overview',
    pricingHistory: 'pricingHistory',
    growthAnalysisLtm: 'growthAnalysisLtm',
    growthAnalysisYtd: 'growthAnalysisYtd',
    inventory: 'inventory',
    forSale: 'forSale',
    underContract: 'underContract',
    agentDetailProduction: 'agentDetailProduction',
    contactInformation: 'contactInformation',
    transactionCoverageSold: 'transactionCoverageSold',
    transactionCoverageUc: 'transactionCoverageUc',
    transactionCoverageForSale: 'transactionCoverageForSale',
    listingProficiency: 'listingProficiency',
    availableAgents: 'availableAgents',
    addedAgents: 'addedAgents',
    officeHistory: 'officeHistory',
    agentCoverageListingForSale: 'agentCoverageListingForSale',
    agentCoverageListingSold: 'agentCoverageListingSold',
    agentCoverageListingUc: 'agentCoverageListingUc',
    agentProductionListingTotalSold: 'agentProductionListingTotalSold',
    agentProductionListingListSide: 'agentProductionListingListSide',
    agentProductionListingSellSide: 'agentProductionListingSellSide',
}));

export const superHeaders = {
    transactionCoverageSold: [{
        column1: { title: '' },
        column2: { title: 'LIST SIDE' },
        column3: { title: 'SELL SIDE' },
        column4: { title: 'TOTAL' }
    }],
    transactionCoverageUc: [{
        column1: { title: '' },
        column2: { title: 'Currently Under Contract' }
    }],
    transactionCoverageForSale: [{
        column1: { title: '' },
        column2: { title: 'Currently For Sale' }
    }],
}

export const agentsColumns = Object.freeze({
    rank: { id: 'rank', label: 'Rank' },
    agentName: { id: 'agentName', label: 'Agent Name' },
    agentId: { id: 'agentId', label: 'Agent ID' },
    county: { id: 'county', label: 'County' },
    officeName: { id: 'officeName', label: 'Office Name' },
    officeId: { id: 'officeId', label: 'Office ID' },
    officeAddress: { id: 'officeAddress', label: 'Office Address' },
    officeCity: { id: 'officeCity', label: 'City', parentColumnId: 'officeAddress' },
    officeZipCode: { id: 'officeZipCode', label: 'Zip', parentColumnId: 'officeAddress' },
    officeCounty: { id: 'officeCounty', label: 'County', parentColumnId: 'officeAddress' },
    agentPhone1: { id: 'agentPhone1', label: 'Phone 1' },
    agentPhone2: { id: 'agentPhone2', label: 'Phone 2' },
    agentPhone3: { id: 'agentPhone3', label: 'Phone 3' },
    agentEmail: { id: 'agentEmail', label: 'Email' },
    agentAddress: { id: 'agentAddress', label: 'Alternate Address' },

    area: { id: 'area', label: 'Area' },
    listVolume: { id: 'listVolume', label: 'List Side ($)' },
    sellVolume: { id: 'sellVolume', label: 'Sell Side ($)' },
    totalVolume: { id: 'totalVolume', label: 'Total ($)' },
    listUnits: { id: 'listUnits', label: 'List Side (#)' },
    sellUnits: { id: 'sellUnits', label: 'Sell Side (#)' },
    totalUnits: { id: 'totalUnits', label: 'Total (#)' },
    totalUnitsGrowth: { id: 'totalUnitsGrowth', label: '% Change' },
    totalUnitsPct: { id: 'totalUnitsPct', label: '% Change' },
    totalUnitsChange: { id: 'totalUnitsChange', label: 'Growth (#)' },
    totalVolumeGrowth: { id: 'totalVolumeGrowth', label: '% Change' },
    totalVolumePct: { id: 'totalVolumePct', label: '% Change' },
    totalVolumeChange: { id: 'totalVolumeChange', label: '$ Change' },
    ciTotalVolumeChange: { id: 'totalVolumeChange', label: '$ Change' },

    totalSell: { id: 'totalSell', label: 'Total Sell' },
    totalList: { id: 'totalList', label: 'Total List' },
    noPriceChangeListings: { id: 'noPriceChangeListings', label: 'No Price Change Listings' },
    priceChangeListings: { id: 'priceChangeListings', label: 'Price Change Listings' },

    totalDollarVolume: { id: 'totalDollarVolume', label: 'Volume ($)' },

    ptmTotalVolume: { id: 'ptmTotalVolume', label: 'Previous 12 Months Total Volume' },
    ptmTotalUnits: { id: 'ptmTotalUnits', label: 'Previous 12 Months Total Units' },

    ptmNum: { id: 'ptmNum', label: 'Previous 12 Months #' },
    ltmNum: { id: 'ltmNum', label: 'Last 12 Months #' },
    ptm$: { id: 'ptm$', label: 'Previous 12 Months $' },
    ltm$: { id: 'ltm$', label: 'Last 12 Months $' },

    averagePrice: { id: 'averagePrice', label: 'Avg. Price' },
    last12Spop: { id: 'last12Spop', label: 'SP/OP' },
    last12AvgDom: { id: 'last12AvgDom', label: 'Avg. DOM' },
    last12ListVolume: { id: 'last12ListVolume', label: 'List Side ($)' },
    last12SellVolume: { id: 'last12SellVolume', label: 'Sell Side ($)' },
    last12TotalVolume: { id: 'last12TotalVolume', label: 'Total ($)' },
    last12ListUnits: { id: 'last12ListUnits', label: 'List Side (#)' },
    ltmListUnits: { id: 'last12ListUnits', label: 'List Side (#)' },
    last12SellUnits: { id: 'last12SellUnits', label: 'Sell Side (#)' },
    last12TotalUnits: { id: 'last12TotalUnits', label: 'Total (#)' },

    ltmTotalSideUnits: { id: 'ltmTotalSideUnits', label: 'Units (#)' },
    ltmTotalDollarVolume: { id: 'ltmTotalDollarVolume', label: 'Volume ($)' },

    ytdPrevYearNum: { id: 'ytdPrevYearNum', label: 'YTD Previous Year #' },
    ytdCurrentYearNum: { id: 'ytdCurrentYearNum', label: 'YTD Current Year #' },
    changeNum: { id: 'changeNum', label: 'Change #' },
    pctChangeNum: { id: 'pctChangeNum', label: '% Change #' },

    ytdPrevYear$: { id: 'ytdPrevYear$', label: 'YTD Previous Year $' },
    ytdCurrentYear$: { id: 'ytdCurrentYear$', label: 'YTD Current Year $' },
    change$: { id: 'change$', label: 'Change $' },
    pctChange$: { id: 'pctChange$', label: '% Change $' },

    pytdTotalVolume: { id: 'pytdTotalVolume', label: 'Previous YTD Total Volume' },
    pytdTotalUnits: { id: 'pytdTotalUnits', label: 'Previous YTD Total Units' },

    lytdTotalVolume: { id: 'lytdTotalVolume', label: 'Last Year to Date Total Volume' },
    lytdPytdTotalVolumeChange:
        { id: 'lytdPytdTotalVolumeChange', label: 'Change $' },
    lytdPytdTotalVolumeGrowth:
        { id: 'lytdPytdTotalVolumeGrowth', label: '% Change $' },

    lytdTotalUnits: { id: 'lytdTotalUnits', label: 'Last Year to Date Total Units' },
    lytdPytdTotalUnitsChange:
        { id: 'lytdPytdTotalUnitsChange', label: 'Year to Year Total Units Change' },
    lytdPytdTotalUnitsGrowth:
        { id: 'lytdPytdTotalUnitsGrowth', label: 'Year to Year Unit Growth' },

    noPcLast12ListUnits: { id: 'noPcLast12ListUnits', label: '# Units' },
    noPcLast12ListUnitsPct:
        { id: 'noPcLast12ListUnitsPct', label: '% of Total (#)' },
    noPcLast12ListVolume:
        { id: 'noPcLast12ListVolume', label: '$ Volume' },
    noPcLast12ListVolumePct:
        { id: 'noPcLast12ListVolumePct', label: '% of Total ($)' },
    noPcLast12ListDom: { id: 'noPcLast12ListDom', label: 'DOM' },
    noPcLast12ListCdom: { id: 'noPcLast12ListCdom', label: 'CDOM' },
    noPcLast12SpOp: { id: 'noPcLast12SpOp', label: 'SP/OP' },

    pcLast12ListUnits: { id: 'pcLast12ListUnits', label: '# Units' },
    pcLast12ListUnitsPct:
        { id: 'pcLast12ListUnitsPct', label: '% of Total (#)' },
    pcLast12ListVolume: { id: 'pcLast12ListVolume', label: '$ Volume' },
    pcLast12ListVolumePct:
        { id: 'pcLast12ListVolumePct', label: '% of Total ($)' },
    pcLast12ListDom: { id: 'pcLast12ListDom', label: 'DOM' },
    pcLast12ListCdom: { id: 'pcLast12ListCdom', label: 'CDOM' },
    pcLast12ListPcDom: { id: 'pcLast12ListPcDom', label: 'PC DOM' },
    pcLast12ListSpOp: { id: 'pcLast12ListSpOp', label: 'SP/OP' },
    pcLast12ListSpLp: { id: 'pcLast12ListSpLp', label: 'SP/LP' },
    pcLast12ListAvgNumPc:
        { id: 'pcLast12ListAvgNumPc', label: 'Avg # PC' },
    listingLast12ListUnits: { id: 'listingLast12ListUnits', label: '# Units' },
    agProdMonth: { id: 'month', label: 'Month' },

    inventoryTotalUnits: { id: 'totalUnits', label: 'Units (#)' },
    inventoryPriceVolume: { id: 'listPriceVolume', label: 'Volume ($)' },
    inventoryAvgPrice: { id: 'avgPrice', label: 'Avg. Price ($)' },
    status: { id: 'status', label: ' ' },
    pcUnits: { id: 'pcUnits', label: 'Units (#)' },
    lpop: { id: 'lpop', label: 'LP/OP (%)' },
    cdomTier1: { id: 'cdomTier1', label: '0 - 30' },
    cdomTier2: { id: 'cdomTier2', label: '31 - 90' },
    cdomTier3: { id: 'cdomTier3', label: '91 - 180' },
    cdomTier4: { id: 'cdomTier4', label: '181 - 360' },
    cdomTier5: { id: 'cdomTier5', label: '360+' },

    typeName: { id: 'typeName', label: 'Type' },
    address: { id: 'address', label: 'Address' },
    city: { id: 'city', label: 'City' },
    zipCode: { id: 'zipCode', label: 'Zip' },
    orgPrice: { id: 'orgPrice', label: 'Original Price' },
    listPrice: { id: 'listPrice', label: 'List Price' },
    priceChangeCnt: { id: 'priceChangeCnt', label: '# Price Changes' },
    dateList: { id: 'dateList', label: 'List Date' },
    cdom: { id: 'cdom', label: 'CDOM' },
    bedrooms: { id: 'bedrooms', label: 'BD' },
    fullBaths: { id: 'fullBaths', label: 'BA' },
    squareFt: { id: 'squareFt', label: 'SQFT' },
    dollarPerSquareFt: { id: 'dollarPerSquareFt', label: '$/SQFT' },
    lotSizeSquareFt: { id: 'lotSizeSquareFt', label: 'Lot Size (SQFT)' },
    yearBuilt: { id: 'yearBuilt', label: 'Year Built' },
    mlsNum: { id: 'mlsNum', label: 'MLS #' },
    dateCont: { id: 'dateCont', label: 'UC Date' },
    duc: { id: 'duc', label: 'DUC' },
    statusCode: { id: 'statusCode', label: 'Status' },
    ciTotalUnits: { id: "totalUnits", label: "# Units" },
    ciTotalVolume: { id: "totalVolume", label: "# Volume" },
    favoriteAgents: { id: 'favoriteAgents', label: 'Favorite Agents' },
    producingAgentCount: { id: 'producingAgentCount', label: 'PA.' },
    volume: { id: 'volume', label: 'Volume' },
    streetName: { id: 'streetName', label: 'Address' }
});

export const tabModes = Object.freeze({
    UNASSIGNED: 'unassigned',
    OVERVIEW: 'overview',
    GROWTH_ANALYSIS: 'growthAnalysis',
    CONTACT_INFORMATION: 'contactInformation',
    LISTING_PROFICIENCY: 'listingProficiency',
    AGENT_DETAIL_PRODUCTION: 'agentDetailProduction'
});

export const agentCoverageListingTabs = Object.freeze({
    TOTAL_SOLD: 0,
    LIST_SIDE: 1,
    SELL_SIDE: 2
});

export const agentProfileTabs = Object.freeze({
    PRODUCTION: 0,
    INVENTORY: 1,
    TRANSACTION_COVERAGE: 2,
    OFFICE_HISTORY: 3
});

export const dealStatusCodes = Object.freeze({
    SOLD: { label: 'Sold', value: 'S' },
    ACTIVE: { label: 'For Sale', value: 'A' },
    UNDER_CONTRACT: { label: 'Under Contract', value: 'C' }
});

export const listingOptions = Object.freeze({
    totalSold: 'Total Sold',
    listSide: 'List-Side',
    sellSide: 'Sell-Side'
})

export const productionOptions = Object.freeze([
    {
        label: agentProductionTerms.last6Months,
        value: TimePeriods[agentProductionTerms.last6Months]
    },
    {
        label: [agentProductionTerms.last12Months],
        value: TimePeriods[agentProductionTerms.last12Months]
    },
    { label: agentProductionTerms.last24Months, value: TimePeriods[agentProductionTerms.last24Months] }
]);

export const transactionCoverageOptions = Object.freeze([
    { label: TimePeriods['YTD'], value: TimePeriods['YTD'] },
    { label: TimePeriods['QTD'], value: TimePeriods['QTD'] },
    { label: TimePeriods['MTD'], value: TimePeriods['MTD'] },
    {
        label: agentProductionTerms.last6Months,
        value: TimePeriods[agentProductionTerms.last6Months]
    },
    {
        label: [agentProductionTerms.last12Months],
        value: TimePeriods[agentProductionTerms.last12Months]
    },
    { label: agentProductionTerms.last24Months, value: TimePeriods[agentProductionTerms.last24Months] }
]);

export const mlsAreaTypes = Object.freeze({
    AREA_SUB: 'area_sub_id',
    AREA2: 'area2_id',
    CITY: 'city',
    COUNTY: 'county',
    MAP_CODE: 'map_code',
    MLS_AREAS: 'area_id',
    STATE_CODE: 'state_code',
    SUBDIVISION: 'subdivision',
    ZIP: 'zip_code'
});

export const additionalOfficeAddressColumns = Object.freeze([
    agentsColumns.officeCity,
    agentsColumns.officeZipCode,
    agentsColumns.officeCounty
]);

export const transactionCoverageSoldColumns = Object.freeze({
    area: agentsColumns.area,
    listUnits: agentsColumns.listUnits,
    listVolume: agentsColumns.listVolume,
    sellUnits: agentsColumns.sellUnits,
    sellVolume: agentsColumns.sellVolume,
    totalUnits: agentsColumns.totalUnits,
    totalVolume: agentsColumns.totalVolume,
    totalUnitsPct: agentsColumns.totalUnitsPct,
    totalVolumePct: agentsColumns.totalVolumePct
});

export const transactionCoverageUcColumns = Object.freeze({
    area: { ...agentsColumns.area },
    listUnits: { ...agentsColumns.listUnits, label: '# Units' },
    listVolume: { ...agentsColumns.listVolume, label: '$ Volume' },
    totalUnitsPct: { ...agentsColumns.totalUnitsPct, label: '# Units %' },
    totalVolumePct: { ...agentsColumns.totalVolumePct, label: '$ Volume %' }
});

export const transactionCoverageForSaleColumns = Object.freeze({
    area: { ...agentsColumns.area },
    listUnits: { ...agentsColumns.listUnits, label: '# Units' },
    listVolume: { ...agentsColumns.listVolume, label: '$ Volume' },
    totalUnitsPct: { ...agentsColumns.totalUnitsPct, label: '# Units %' },
    totalVolumePct: { ...agentsColumns.totalVolumePct, label: '$ Volume %' }
});

export const transactionCoverageTableTypes = Object.freeze({
    soldView: 'S',
    underContract: 'C',
    forSale: 'A'
});

export const agentProfileButtons = Object.freeze({
    unitsBtn: { id: 'unitsBtn', label: 'Units', tip: 'The number of transaction sides (list + sell) by month' },
    volumeBtn: {
        id: 'volumeBtn',
        label: 'Volume',
        tip: 'The dollar volume of transaction sides (list + sell) by month'
    }
});

export const productionChartTabToolTips = Object.freeze({
    unitsBtn: { label: 'Units', tip: 'The number of transaction sides (list + sell) by month' },
    volumeBtn: { label: 'Volume', tip: 'The dollar volume of transaction sides (list + sell) by month' },
    summaryVolListSide: { label: '$ Volume - List Side', tip: 'The dollar volume of list-side transactions' },
    summaryVolSellSide: { label: '$ Volume - Sell Side', tip: 'The dollar volume of sell-side transactions' },
    summaryTotalVolume: { label: 'Total $ Volume', tip: 'The dollar volume of transaction sides (list + sell)' },
    summaryVolPerMonth: {
        label: '$ Volume Per Month',
        tip: 'The average dollar volume of transaction sides (list + sell) per month'
    },
    summaryUnitsListSide: { label: '# Units - List Side', tip: 'The number of list-side transactions' },
    summaryUnitsSellSide: { label: '# Units - Sell Side', tip: 'The number of sell-side transactions' },
    summaryTotalUnits: { label: 'Total # Units', tip: 'The total number of transaction sides (list + sell)' },
    summaryUnitsPerMonth: { label: '# Units Per Month', tip: 'The average number of units sold (list+sell) per month' },
    summaryAvgPrice: { label: 'Average Price', tip: 'The average price of listings closed by the agent' }
});

export const productionTableTabToolTips = Object.freeze({
    unitsCheckBox: { id: 'unitsCheckBox', label: '# Units', tip: 'The monthly sold number of units (list + sell)' },
    volumeCheckBox: { id: 'volumeCheckBox', label: '$ Volume', tip: 'The monthly sold dollar volume (list + sell)' },
    month: { id: 'month', label: 'Month', tip: 'The month and year - the format is (Mmm - YYYY) e.g. Jul - 2022' },
    listUnits: {
        id: 'listUnits',
        label: 'List Side (#)',
        tip: 'The total number of list-side transactions for the month'
    },
    sellUnits: {
        id: 'sellUnits',
        label: 'Sell Side (#)',
        tip: 'The total number of sell-side transactions for the month'
    },
    totalUnits: { id: 'totalUnits', label: 'Total (#)', tip: 'The total number of transaction sides for the month' },
    listVolume: {
        id: 'listVolume',
        label: 'List Side ($)',
        tip: 'The dollar volume of list-side transactions for the month'
    },
    sellVolume: {
        id: 'sellVolume',
        label: 'Sell Side ($)',
        tip: 'The dollar volume of sell-side transactions for the month'
    },
    totalVolume: { id: 'totalVolume', label: 'Total ($)', tip: 'The dollar volume of transaction sides for the month' },
    summaryListSide: {
        id: 'summaryListSide',
        label: 'List Side',
        tip: 'The dollar volume of list-side transactions, and the total number of list-side transactions over the [Time Period]'
    },
    summarySellSide: {
        id: 'summarySellSide',
        label: 'Sell Side',
        tip: 'The dollar volume of sell-side transactions, and the total number of sell-side transactions over the [Time Period]'
    },
    summaryTotal: {
        id: 'summaryTotal',
        label: 'Total',
        tip: 'The dollar volume of transaction sides (list + sell), and the total number of transaction sides (list + sell) over the [Time Period]'
    }
});

export const inventoryTableTooltips = Object.freeze({
    totalUnits: { id: 'totalUnits', label: 'Units (#)', tip: 'Total number of listings', table: 'inventory' },
    listPriceVolume: { id: 'listPriceVolume', label: 'Volume ($)', tip: 'Total dollar volume', table: 'inventory' },
    avgPrice: {
        id: 'avgPrice',
        label: 'Avg. Price ($)',
        tip: 'Average price of listings closed by the agent',
        table: 'inventory'
    },
    pcUnits: {
        id: 'pcUnits',
        label: 'Units (#)',
        tip: 'Number of listings that have had one or more price changes',
        table: 'inventory'
    },
    lpop: {
        id: 'lpop',
        label: 'LP/OP (%)',
        tip: 'The ratio of the list price to the original price as a percentage for listings that have had one or more price changes',
        table: 'inventory'
    },
    cdomTier1: {
        id: 'cdomTier1',
        label: '0 - 30',
        tip: 'Number of listings that were for sale during the month for which the CDOM was 30 or less',
        table: 'inventory'
    },
    cdomTier2: {
        id: 'cdomTier2',
        label: '31 - 90',
        tip: 'Number of listings that were for sale for which the CDOM was 31 - 90',
        table: 'inventory'
    },
    cdomTier3: {
        id: 'cdomTier3',
        label: '91 - 180',
        tip: 'Number of listings that were for sale for which the CDOM was 91 - 180',
        table: 'inventory'
    },
    cdomTier4: {
        id: 'cdomTier4',
        label: '181 - 360',
        tip: 'Number of listings that were for sale for which the CDOM was 181 - 360',
        table: 'inventory'
    },
    cdomTier5: {
        id: 'cdomTier5',
        label: '360+',
        tip: 'Number of listings that were for sale for which the CDOM was 360 or more',
        table: 'inventory'
    },
    status: {
        id: 'status',
        label: '',
        tip: '',
        table: 'inventory'
    }
});

export const currentlyUCTooltips = Object.freeze({
    typeName: { id: 'typeName', label: 'Type', tip: 'Property Type, i.e., DE, AT.' },
    address: { id: 'address', label: 'Address', tip: 'The street address' },
    city: { id: 'city', label: 'City', tip: 'City name' },
    zipCode: { id: 'zipCode', label: 'Zip', tip: 'Zip Code' },
    orgPrice: { id: 'orgPrice', label: 'Original Price', tip: 'The original list price' },
    listPrice: { id: 'listPrice', label: 'List Price', tip: 'Current list price' },
    priceChangeCnt: {
        id: 'priceChangeCnt',
        label: '# Price Changes',
        tip: 'Number of price changes the listing has experienced'
    },
    dateList: { id: 'dateList', label: 'List Date', tip: 'List Date' },
    dateCont: { id: 'dateCont', label: 'UC Date', tip: 'UC Date' },
    cdom: {
        id: 'cdom',
        label: 'CDOM',
        tip: 'The Continuous Days on Market associated with the property record’s MLS history'
    },
    duc: { id: 'duc', label: 'DUC', tip: 'The number of days that the listing has been under contract' },
    statusCode: {
        id: 'statusCode',
        label: 'Status',
        tip: 'The listings Under Contract status (Contingent or Pending)'
    },
    bedrooms: { id: 'bedrooms', label: 'BD', tip: 'The number of bedrooms' },
    fullBaths: { id: 'fullBaths', label: 'BA', tip: 'The number of full baths' },
    squareFt: { id: 'squareFt', label: 'SQFT', tip: 'The square footage' },
    dollarPerSquareFt: { id: 'dollarPerSquareFt', label: '$/SQFT', tip: 'The cost per square foot' },
    lotSizeSquareFt: { id: 'lotSizeSquareFt', label: 'Lot Size (SQFT)', tip: 'The lot size (square feet)' },
    yearBuilt: { id: 'yearBuilt', label: 'Year Built', tip: 'Year Built' },
    mlsNum: { id: 'mlsNum', label: 'MLS #', tip: 'Unique MLS number' }
});

export const currentlyFSTooltips = Object.freeze({
    typeName: { id: 'typeName', label: 'Type', tip: 'Property Type, i.e., DE, AT.' },
    address: { id: 'address', label: 'Address', tip: 'The street address' },
    city: { id: 'city', label: 'City', tip: 'City name' },
    zipCode: { id: 'zipCode', label: 'Zip', tip: 'Zip Code' },
    orgPrice: { id: 'orgPrice', label: 'Original Price', tip: 'The original list price' },
    listPrice: { id: 'listPrice', label: 'List Price', tip: 'Current list price' },
    priceChangeCnt: {
        id: 'priceChangeCnt',
        label: '# Price Changes',
        tip: 'Number of price changes the listing has experienced'
    },
    dateList: { id: 'dateList', label: 'List Date', tip: 'List Date' },
    cdom: {
        id: 'cdom',
        label: 'CDOM',
        tip: 'The Continuous Days on Market associated with the property record’s MLS history'
    },
    bedrooms: { id: 'bedrooms', label: 'BD', tip: 'The number of bedrooms' },
    fullBaths: { id: 'fullBaths', label: 'BA', tip: 'The number of full baths' },
    squareFt: { id: 'squareFt', label: 'SQFT', tip: 'The square footage' },
    dollarPerSquareFt: { id: 'dollarPerSquareFt', label: '$/SQFT', tip: 'The cost per square foot' },
    lotSizeSquareFt: { id: 'lotSizeSquareFt', label: 'Lot Size (SQFT)', tip: 'The lot size (square feet)' },
    yearBuilt: { id: 'yearBuilt', label: 'Year Built', tip: 'Year Built' },
    mlsNum: { id: 'mlsNum', label: 'MLS #', tip: 'Unique MLS number' }
});

export const coverageChartTooltips = Object.freeze({
    volumeBtn: {
        id: 'coverageVolumeBtn',
        label: 'Volume',
        tip: 'The dollar volume of transaction sides (list + sell) by area'
    },
    unitsBtn: { id: 'coverageUnitsBtn', label: 'Units', tip: 'The number of transaction sides (list + sell) by area' },
    forSaleBtn: { id: 'forSaleBtn', label: 'For Sale', tip: 'Listings that are available for a first postion offer' },
    underContractBtn: {
        id: 'underContractBtn',
        label: 'Under Contract',
        tip: 'Listings where the status has changed from active to one indicating that the seller has accepted a "first position" offer'
    },
    soldBtn: { id: 'soldBtn', label: 'Sold', tip: 'Listings that have successfully sold and closed escrow' },
    marketAreaCheck: {
        id: 'marketAreaCheck',
        label: 'Market Area %',
        tip: 'The volume of business conducted in each area as a percentage of the total'
    }
});

const covTableTips = Object.freeze({
    area: 'The code the MLS uses to define an area',
    listUnitsSold: 'The (#) of list-side transactions',
    listUnitsForSale: 'The number of listings that are currently for sale',
    listUnitsUc: 'The number of listings that are currently under contract',
    listVolumeSold: 'The ($) volume of list-side transactions',
    listVolumeForSale: 'The dollar volume of listings that are currently for sale',
    listVolumeUc: 'The dollar volume of listings that are currently under contract',
    sellUnits: 'The (#) of sell-side transactions',
    sellVolume: 'The ($) volume of sell-side transactions',
    totalUnits: 'The total number of transaction sides (list + sell)',
    totalUnitsPctForSale: 'The number of listings that are currently for sale for the area as a percentage of the total number of listings that are currently for sale',
    totalUnitsPctSold: 'The number of transaction sides (list + sell) for the area as a percentage of the total number of transaction sides (list + sell)',
    totalUnitsPctUc: 'The number of listings that are currently under contract for the area as a percentage of the total number of listings that are currently under contract',
    totalVolume: 'The total dollar volume of transaction sides (list + sell)',
    totalVolumePctForSale: 'The dollar volume of listings that are currently for sale for the area as a percentage of the total dollar volume of listings that are currently for sale',
    totalVolumePctSold: 'The dollar volume of transaction sides (list + sell) for the area as a percentage of the total dollar volume of transaction sides (list + sell)',
    totalVolumePctUc: 'The dollar volume of listings that are currently under contract for the area as a percentage of the total dollar volume of listings that are currently under contract'
})

export const coverTableSoldTooltips = Object.freeze({
    area: { id: 'area', label: 'Area', tip: covTableTips.area },
    listUnits: { id: 'listUnits', label: 'List #', tip: covTableTips.listUnitsSold },
    listVolume: { id: 'listVolume', label: 'List $', tip: covTableTips.listVolumeSold },
    sellUnits: { id: 'sellUnits', label: 'Sell #', tip: covTableTips.sellUnits},
    sellVolume: { id: 'sellVolume', label: 'Sell $', tip: covTableTips.sellVolume },
    totalUnits: { id: 'totalUnits', label: '# Units', tip: covTableTips.totalUnits },
    totalUnitsPct: { id: 'totalUnitsPct', label: '# Units %', tip: covTableTips.totalUnitsPctSold },
    totalVolume: { id: 'totalVolume', label: '$ Volume', tip: covTableTips.totalVolume },
    totalVolumePct: { id: 'totalVolumePct', label: '$ Volume %', tip: covTableTips.totalVolumePctSold },
})

export const coverTableUcTooltips = Object.freeze({
    area: { ...coverTableSoldTooltips.area },
    listUnits: { ...coverTableSoldTooltips.listUnits, label: '# Units', tip: covTableTips.listUnitsUc },
    listVolume: { ...coverTableSoldTooltips.listVolume, label: '$ Volume', tip: covTableTips.listVolumeUc },
    totalUnitsPct: { ...coverTableSoldTooltips.totalUnitsPct, tip: covTableTips.totalUnitsPctUc },
    totalVolumePct: { ...coverTableSoldTooltips.totalVolumePct, tip: covTableTips.totalVolumePctUc },
})

export const coverTableForSaleTooltips = Object.freeze({
    area: { ...coverTableUcTooltips.area },
    listUnits: { ...coverTableUcTooltips.listUnits, tip: covTableTips.listUnitsForSale },
    listVolume: { ...coverTableUcTooltips.listVolume, tip: covTableTips.listVolumeForSale },
    totalUnitsPct: { ...coverTableUcTooltips.totalUnitsPct, tip: covTableTips.totalUnitsPctForSale },
    totalVolumePct: { ...coverTableUcTooltips.totalVolumePct, tip: covTableTips.totalVolumePctForSale },
})

export const overviewToolTips = Object.freeze({
    rank: { label: 'Rank', tip: 'Rank' },
    agentName: { label: 'Agent Name', tip: 'Name of the Agent' },
    agentId: { label: 'Agent ID', tip: 'ID code assigned by MLS' },
    officeName: { label: 'Office Name', tip: 'Office Name as supplied by the MLS' },
    officeId: { label: 'Office ID', tip: 'ID code assigned by MLS' },
    officeAddress: {
        label: 'Office Address',
        tip: 'The office\'s physical and/or mailing address as reflected in the MLS data'
    },
    officeCity: { label: 'City', tip: 'City where office resides' },
    officeZipCode: { label: 'Zip', tip: 'The USPS zip code associated with the office as reflected in the MLS data' },
    officeCounty: { label: 'County', tip: 'The county associated with the office as reflected in the MLS data' },
    listVolume: { label: 'List Side ($)', tip: 'The ($) volume of list side transactions' },
    sellVolume: { label: 'Sell Side ($)', tip: 'The ($) volume of sell side transactions' },
    totalVolume: { label: 'Total ($)', tip: 'The total ($) volume of transaction sides (list + sell)' },
    listUnits: { label: 'List Side (#)', tip: 'The (#) of list side transactions' },
    sellUnits: { label: 'Sell Side (#)', tip: 'The (#) of sell side transactions' },
    totalUnits: { label: 'Total (#)', tip: 'The total (#) of transaction sides (list + sell)' },
    averagePrice: {
        label: 'Avg. Price',
        tip: 'Average price of the listings closed by the agent over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12Spop: {
        label: 'SP/OP',
        tip: 'The average ratio of the sold price (closed price) to the original list price as a percentage for listings closed by the agent over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12AvgDom: {
        label: 'Avg. DOM',
        tip: 'The average DOM of listings closed by the agent over the Last 12 Months [last12Months]',
        hasDate: true
    },
    totalUnitsChange: {
        label: 'Growth (#)',
        tip: 'Difference in the number of units sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    totalVolumeChange: {
        label: 'Growth ($)',
        tip: 'Difference in the dollar volume sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    last12ListVolume: {
        label: 'List Side ($)',
        tip: 'The ($) volume of list side transactions over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12SellVolume: {
        label: 'Sell Side ($)',
        tip: 'The ($) volume of sell side transactions over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12TotalVolume: {
        label: 'Total ($)',
        tip: 'The total ($) volume of transaction sides (list + sell) over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12ListUnits: {
        label: 'List Side (#)',
        tip: 'The (#) of list side transactions over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12SellUnits: {
        label: 'Sell Side (#)',
        tip: 'The (#) of sell side transactions over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12TotalUnits: {
        label: 'Total (#)',
        tip: 'The total (#) of transaction sides (list + sell) over the Last 12 Months [last12Months]',
        hasDate: true
    },
    favoriteAgents: { label: '', tip: '' }
});

export const contactToolTips = Object.freeze({
    rank: { label: 'Rank', tip: 'Rank' },
    agentName: { label: 'Agent Name', tip: 'Name of the Agent' },
    agentId: { label: 'Agent ID', tip: 'ID code assigned by MLS' },
    officeName: { label: 'Office Name', tip: 'Office Name as supplied by the MLS' },
    officeId: { label: 'Office ID', tip: 'ID code assigned by MLS' },
    officeAddress: {
        label: 'Office Address',
        tip: 'The office\'s physical and/or mailing address as reflected in the MLS data'
    },
    officeCity: { label: 'City', tip: 'City where office resides' },
    officeZipCode: { label: 'Zip', tip: 'The USPS zip code associated with the office as reflected in the MLS data' },
    officeCounty: { label: 'County', tip: 'The county associated with the office as reflected in the MLS data' },
    agentPhone1: { label: 'Phone 1', tip: 'A telephone number for the agent as reflected in the MLS data' },
    agentPhone2: { label: 'Phone 2', tip: 'A telephone number for the agent as reflected in the MLS data' },
    agentPhone3: { label: 'Phone 3', tip: 'A telephone number for the agent as reflected in the MLS data' },
    agentEmail: { label: 'Email', tip: 'The agent\'s email address as reflected in the MLS data' },
    agentAddress: {
        label: 'Alternate Address',
        tip: 'The agent\'s alternate physical and/or mailing address as reflected in the MLS data'
    },
    totalUnits: { label: '# Units', tip: 'The total number of transaction sides (list + sell)' },
    totalVolume: { label: '$ Volume', tip: 'The total dollar volume of transaction sides (list + sell)' },
    last12TotalUnits: {
        label: '# Units',
        tip: 'The total number of transaction sides (list + sell) over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12TotalVolume: {
        label: '$ Volume',
        tip: 'The total dollar volume of transaction sides (list + sell) over the Last 12 Months [last12Months]',
        hasDate: true
    },
    totalVolumeChange: {
        label: '$ Change',
        tip: 'Difference in the dollar volume sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    totalVolumeGrowth: {
        label: '% Change',
        tip: 'Percentage difference in the dollar volume sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    favoriteAgents: { ...overviewToolTips.favoriteAgents }
});

export const growthAnalysisTooltips = Object.freeze({
    rank: { label: 'Rank', tip: 'Rank' },
    agentName: { label: 'Agent Name', tip: 'Name of the Agent' },
    officeName: { label: 'Office Name', tip: 'Office Name as supplied by the MLS' },
    officeId: { label: 'Office ID', tip: 'ID code assigned by MLS' },
    officeAddress: {
        label: 'Office Address',
        tip: 'The office\'s physical and/or mailing address as reflected in the MLS data'
    },
    officeCity: { label: 'City', tip: 'City where office resides' },
    officeZipCode: { label: 'Zip', tip: 'The USPS zip code associated with the office as reflected in the MLS data' },
    officeCounty: { label: 'County', tip: 'The county associated with the office as reflected in the MLS data' },
    ptmTotalUnits: {
        label: 'Previous 12 Months #',
        tip: 'The total number of transaction sides (list + sell) over the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    ptmNum: {
        label: 'Previous 12 Months #',
        tip: 'The total number of transaction sides (list + sell) over the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    ltmNum: {
        label: 'Last 12 Months #',
        tip: 'The total number of transaction sides (list + sell) over the Last 12 Months [last12Months]',
        hasDate: true
    },
    changeNum: {
        label: 'Change #',
        tip: 'Difference in the number of units sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    totalUnitsChange: {
        label: 'Change #',
        tip: 'Difference in the number of units sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    pctChangeNum: {
        label: '% Change #',
        tip: 'Percentage difference in the number of units sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    totalUnitsGrowth: {
        label: '% Change #',
        tip: 'Percentage difference in the number of units sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    pytdTotalUnits: {
        label: 'YTD [previousYearNumber] #',
        tip: 'The total number of transaction sides (list + sell) for the Year to Date (YTD) [previousYear]',
        hasDate: true
    },
    lytdTotalUnits: {
        label: 'YTD [currentYearNumber] #',
        tip: 'The total number of transaction sides (list + sell) for the Year to Date (YTD) [currentYear]',
        hasDate: true
    },
    lytdPytdTotalUnitsChange: {
        label: 'Change #',
        tip: 'Difference in the number of units sold between the Year to Date (YTD) [currentYear] and YTD [previousYear]',
        hasDate: true
    },
    lytdPytdTotalUnitsGrowth: {
        label: '% Change #',
        tip: 'Percentage difference in the number of units sold between the Year to Date (YTD) [currentYear] and YTD [previousYear]',
        hasDate: true
    },
    ptmTotalVolume: {
        label: 'Previous 12 Months $',
        tip: 'The total dollar volume of transaction sides (list + sell) over the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    last12TotalUnits: {
        label: 'Last 12 Months #',
        tip: 'The total number of transaction sides (list + sell) over the Last 12 Months [last12Months]',
        hasDate: true
    },
    last12TotalVolume: {
        label: 'Last 12 Months $',
        tip: 'The total dollar volume of transaction sides (list + sell) over the Last 12 Months [last12Months]',
        hasDate: true
    },
    totalVolumeChange: {
        label: 'Change $',
        tip: 'Difference in the dollar volume sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    totalVolumeGrowth: {
        label: '% Change $',
        tip: 'Percentage difference in the dollar volume sold between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    pytdTotalVolume: {
        label: 'YTD [previousYearNumber] $',
        tip: 'The total dollar volume of transaction sides (list + sell) for the Year to Date (YTD) [previousYear]',
        hasDate: true
    },
    lytdTotalVolume: {
        label: 'YTD [currentYearNumber] $',
        tip: 'The total dollar volume of transaction sides (list + sell) for the Year to Date (YTD) [currentYear]',
        hasDate: true
    },
    lytdPytdTotalVolumeChange: {
        label: 'Change $',
        tip: 'Difference in the dollar volume sold between the Year to Date (YTD) [currentYear] and YTD [previousYear]',
        hasDate: true
    },
    lytdPytdTotalVolumeGrowth: {
        label: '% Change $',
        tip: 'Percentage difference in the dollar volume sold between the Year to Date [currentYear] and YTD [previousYear]',
        hasDate: true
    },
    ytdPrevYearNum: {
        label: 'YTD [previousYearNumber] #',
        tip: 'The total number of transaction sides (list + sell) for the Year to Date (YTD) [previousYear]',
        hasDate: true
    },
    ytdCurrentYearNum: {
        label: 'YTD [currentYearNumber] #',
        tip: 'The total number of transaction sides (list + sell) for the Year to Date (YTD) [currentYear]',
        hasDate: true
    },
    ptm$: {
        label: 'Previous 12 Months $',
        tip: 'The total dollar volume of transaction sides (list + sell) over the Previous 12 Months [previous12Months]',
        hasDate: true
    },
    ltm$: {
        label: 'Last 12 Months $',
        tip: 'The total dollar volume of transaction sides (list + sell) over the Last 12 Months [last12Months]',
        hasDate: true
    },
    ytdPrevYear$: {
        label: 'YTD [previousYearNumber] $',
        tip: 'The total dollar volume of transaction sides (list + sell) for the Year to Date (YTD) [previousYear]',
        hasDate: true
    },
    ytdCurrentYear$: {
        label: 'YTD [currentYearNumber] $',
        tip: 'The total dollar volume of transaction sides (list + sell) for the Year to Date (YTD) [currentYear]',
        hasDate: true
    },
    change$: {
        label: 'Change $',
        tip: 'Difference in the dollar volume sold between the Year to Date (YTD) [currentYear] and YTD [previousYear]',
        hasDate: true
    },
    pctChange$: {
        label: '% Change $',
        tip: 'Percentage difference in the dollar volume sold between the Year to Date (YTD) [currentYear] and YTD [previousYear]',
        hasDate: true
    },
    favoriteAgents: { ...overviewToolTips.favoriteAgents }
});

export const listingProficiencyColTitles = Object.freeze({
    officeInformation: 'Office Information',
    totalSell: 'Total Sell',
    totalList: 'Total List',
    noPriceChangeListings: 'No Price Change Listings',
    priceChangeListings: 'Price Change Listings',
    emptyString: ''
})

export const listingProficiencyTooltips = Object.freeze({
    rank: { label: 'Rank', tip: 'Rank' },
    agentName: { label: 'Agent Name', tip: 'Name of the Agent' },
    officeName: { label: 'Office Name', tip: 'Office Name as supplied by the MLS' },
    officeId: { label: 'Office ID', tip: 'ID code assigned by MLS' },
    officeAddress: {
        label: 'Office Address',
        tip: 'The office\'s physical and/or mailing address as reflected in the MLS data'
    },
    officeCity: { label: 'City', tip: 'City where office resides' },
    officeZipCode: { label: 'Zip', tip: 'The USPS zip code associated with the office as reflected in the MLS data' },
    officeCounty: { label: 'County', tip: 'The county associated with the office as reflected in the MLS data' },
    last12SellUnits: { label: '# Units', tip: 'The number of sell-side transactions' },
    last12SellVolume: { label: '$ Volume', tip: 'The $ volume of sell-side transactions' },
    last12ListUnits: { label: '# Units', tip: 'The number of list-side transactions' },
    last12ListVolume: { label: '$ Volume', tip: 'The $ volume of list-side transactions' },
    area: { label: 'Area', tip: 'The area name as reflected in the MLS data' },
    agentId: { label: 'Agent ID', tip: 'ID code assigned by MLS' },
    listVolume: { label: '$ Volume', tip: 'The $ volume of list-side transactions' },
    sellVolume: { label: '$ Volume', tip: 'The $ volume of sell-side transactions' },
    totalVolume: { label: '$ Volume', tip: 'The $ volume of all transactions' },
    listUnits: { label: '# Units', tip: 'The number of list-side transactions' },
    sellUnits: { label: '# Units', tip: 'The number of sell-side transactions' },
    averagePrice: { label: 'Average Price', tip: 'The average price of all transactions' },
    last12Spop: { label: 'SP/OP', tip: 'The average SP/OP ratio for all transactions' },
    last12AvgDom: { label: 'DOM', tip: 'The average DOM for all transactions' },
    totalUnitsChange: { label: 'Change #', tip: 'Difference in the number of all transactions between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]' },
    last12TotalVolume: { label: '$ Volume', tip: 'The $ volume of all transactions' },
    last12TotalUnits: { label: '# Units', tip: 'The number of all transactions' },
    totalVolumeChange: { label: 'Change $', tip: 'Difference in the dollar volume of all transactions between the Last 12 Months [last12Months] and the Previous 12 Months [previous12Months]' },
    totalUnits: { label: '# Units', tip: 'The number of all transactions' },
    noPcLast12ListUnits: { label: '# Units', tip: 'The number of list-side transactions that had no price changes' },
    noPcLast12ListUnitsPct: {
        label: '% of Total (#)',
        tip: 'The number of list-side transactions that had no price changes as a percentage of the total number of list-side transactions'
    },
    noPcLast12ListVolume: {
        label: '$ Volume',
        tip: 'The $ volume of list-side transactions that had no price changes'
    },
    noPcLast12ListVolumePct: {
        label: '% of Total ($)',
        tip: 'The $ volume of list-side transactions that had no price changes as a percentage of the total $ volume of list-side transactions'
    },
    noPcLast12ListDom: { label: 'DOM', tip: 'The average DOM for listings that had no price changes' },
    noPcLast12ListCdom: { label: 'CDOM', tip: 'The average CDOM for listings that had no price changes' },
    noPcLast12SpOp: {
        label: 'SP/OP',
        tip: 'The average ratio of the sold price (closed price) to the original list price as a percentage for listings that had no price changes'
    },
    pcLast12ListUnits: {
        label: '# Units',
        tip: 'The number of list-side transactions that had one or more price changes'
    },
    pcLast12ListUnitsPct: {
        label: '% of Total (#)',
        tip: 'The number of list-side transactions that had one or more price changes as a percentage of the total number of list-side transactions'
    },
    pcLast12ListVolume: {
        label: '$ Volume',
        tip: 'The $ volume of list-side transactions that had one or more price changes'
    },
    pcLast12ListVolumePct: {
        label: '% of Total ($)',
        tip: 'The $ volume of list-side transactions that had one or more price changes as a percentage of the total $ volume of list-side transactions'
    },
    pcLast12ListDom: { label: 'DOM', tip: 'The average DOM for listings that had one or more price changes' },
    pcLast12ListCdom: { label: 'CDOM', tip: 'The average CDOM for listings that had one or more price changes' },
    pcLast12ListPcDom: {
        label: 'PC DOM',
        tip: 'The average number of days from the date of the last price change to the date the listing went under contract'
    },
    pcLast12ListSpOp: {
        label: 'SP/OP',
        tip: 'The average ratio of the sold price (closed price) to the original list price as a percentage for listings that had one or more price changes'
    },
    pcLast12ListSpLp: {
        label: 'SP/LP',
        tip: 'The average ratio of the sold price (closed price) to the list price (the price that drew the offer) as a percentage for listings that had one or more price changes'
    },
    pcLast12ListAvgNumPc: { label: 'Avg # PC', tip: 'The average number of price changes' },
    favoriteAgents: { ...overviewToolTips.favoriteAgents }
});

export const officeHistoryTooltips = Object.freeze({
    officeId: { id: 'officeId', label: 'MLS Office ID', tip: 'MLS Office ID' },
    officeName: { id: 'officeName', label: 'Office Name', tip: 'Office Name' },
    moveDate: { id: 'moveDate', label: 'Date Left', tip: 'Date Left' }
});
export const productionListingsTooltips = Object.freeze({
    mlsNum: { id: 'mlsNum', label: 'MLS #', tip: 'Unique MLS number' },
    typeName: { id: 'typeName', label: 'Type', tip: 'Property Type, i.e., DE, AT.' },
    address: { id: 'address', label: 'Address', tip: 'The street address' },
    city: { id: 'city', label: 'City', tip: 'City name' },
    zip: { id: 'zip', keyField: 'zipCode', label: 'Zip', tip: 'Zip Code' },
    area: { id: 'area', keyField: 'areaId', label: 'Area', tip: 'The code the MLS uses to define an area' },
    bankProperty: {
        id: 'bankProperty',
        keyField: 'bankStatus',
        label: 'Bank Property',
        tip: 'A \'Y\' indicates that the property is distressed (in foreclosure; or in foreclosure and subject to short sale; or owned/REO); an \'N\' indicates the property is free of any bank mediation'
    },
    orgPrice: { id: 'orgPrice', label: 'Original Price', tip: 'The original list price' },
    listPrice: { id: 'listPrice', label: 'List Price', tip: 'Price that drew the offer' },
    lastPrice: { id: 'lastPrice', label: 'Sold Price', tip: 'Sold Price' },
    priceChangeCnt: { id: 'priceChangeCnt', label: '# of Price Changes', tip: 'The number (#) of price changes' },
    spop: { id: 'spop', label: 'SP/OP', tip: 'The ratio of Sales Price to Original Price' },
    splp: {
        id: 'splp',
        label: 'SP/LP',
        tip: 'Ratio of the sold price (closed price) to the list price (the price that drew the offer)'
    },
    soldDate: { id: 'soldDate', keyField: 'dateLast', label: 'Sold Date', tip: 'Sold Date' },
    dom: {
        id: 'dom',
        label: 'DOM',
        tip: 'The Days on Market associated with the property record\'s current MLS number'
    },
    cdom: {
        id: 'cdom',
        label: 'CDOM',
        tip: 'The Continuous Days on Market associated with the property record\'s MLS history'
    },
    pcDom: {
        id: 'pcDom',
        label: 'PC DOM',
        tip: 'The average number of days from the date of the last price change to the date the listing went under contract'
    },
    bedrooms: { id: 'bedrooms', label: 'BD', tip: 'The number of bedrooms' },
    bathrooms: { id: 'bathrooms', label: 'BA', tip: 'The number of full baths' },
    squareFt: { id: 'squareFt', label: 'SQFT', tip: 'The square footage' },
    pricePerSquareFt: { id: 'pricePerSquareFt', label: '$/SQFT', tip: 'The cost per square foot' },
    lotSizeSquareFt: { id: 'lotSizeSquareFt', label: 'Lot Size (SQFT)', tip: 'The lot size (square feet)' },
    yearBuilt: { id: 'yearBuilt', label: 'Year Built', tip: 'Year Built' },
    listAgent: { id: 'listAgent', label: 'List Agent', tip: 'Agent(s) representing the list side of the transaction' },
    sellAgent: { id: 'sellAgent', label: 'Sell Agent', tip: 'Agent(s) representing the sell side of the transaction' },
    doubleSided: { id: 'doubleSided', label: 'DBL', tip: 'Agent(s) representing both sides of the transaction' }
});

export const coverageListingsTooltips = Object.freeze({
    officeId: { id: 'officeId', label: 'Office Id', tip: 'ID code assigned by MLS' },
    officeName: { id: 'officeName', label: 'Office Name', tip: 'Name of Office' },
    mlsNum: { id: 'mlsNum', label: 'MLS #', tip: 'Unique MLS number' },
    typeName: { id: 'typeName', label: 'Type', tip: 'Property Type, i.e., DE, AT.' },
    address: { id: 'address', label: 'Address', tip: 'The street address' },
    city: { id: 'city', label: 'City', tip: 'City name' },
    zipCode: { id: 'zipCode', label: 'Zip', tip: 'Zip Code' },
    areaId: { id: 'areaId', label: 'Area', tip: 'The code the MLS uses to define an area' },
    orgPrice: { id: 'orgPrice', label: 'Original Price', tip: 'The original list price' },
    listPrice: { id: 'listPrice', label: 'List Price', tip: 'List Price' },
    lastPrice: { id: 'lastPrice', label: 'Sold Price', tip: 'Sold Price' },
    dateLastUC: { id: 'dateLastUC', keyField:'dateLast', label: 'UC Date', tip: 'UC Date' },
    dateLastForSale: { id: 'dateLastForSale', keyField:'dateLast', label: 'List Date', tip: 'List Date' },
    dateLastSold: { id: 'dateLastSold', keyField:'dateLast', label: 'Sold Date', tip: 'Sold Date' },
    dom: {
        id: 'dom',
        label: 'DOM',
        tip: 'The Days on Market associated with the property record\'s current MLS number'
    },
    cdom: {
        id: 'cdom',
        label: 'CDOM',
        tip: 'The Continuous Days on Market associated with the property record\'s MLS history'
    },
    pcDom: {
        id: 'pcDom',
        label: 'PC DOM',
        tip: 'The average number of days from the date of the last price change to the date the listing went under contract'
    },
    bankStatus: {
        id: 'bankStatus',
        label: 'Bank Property',
        tip: 'A \'Y\' indicates that the property is distressed (in foreclosure; or in foreclosure and subject to short sale; or owned/REO); an \'N\' indicates the property is free of any bank mediation'
    },
    priceChangeCnt: { id: 'priceChangeCnt', label: '# of Price Changes', tip: 'The number (#) of price changes' },
    bedrooms: { id: 'bedrooms', label: 'BD', tip: 'The number of bedrooms' },
    fullBaths: { id: 'fullBaths', label: 'BA', tip: 'The number of full baths' },
    squareFt: { id: 'squareFt', label: 'SQFT', tip: 'The square footage' },
    pricePerSquareFt: { id: 'pricePerSquareFt', label: '$/SQFT', tip: 'The cost per square foot' },
    lotSizeSquareFt: { id: 'lotSizeSquareFt', label: 'Lot Size (SQFT)', tip: 'The lot size (square feet)' },
    yearBuilt: { id: 'yearBuilt', label: 'Year Built', tip: 'Year Built' },
    listAgent: { id: 'listAgent', label: 'List Agent', tip: 'Agent(s) representing the list side of the transaction' },
    spop: { id: 'spop', label: 'SP/OP', tip: 'The ratio of Sales Price to Original Price' },
    splp: {
        id: 'splp',
        label: 'SP/LP',
        tip: 'Ratio of the sold price (closed price) to the list price (the price that drew the offer)'
    },
    sellAgent: { id: 'sellAgent', label: 'Sell Agent', tip: 'Agent(s) representing the sell side of the transaction' },
    doubleSided: { id: 'doubleSided', label: 'DBL', tip: 'Agent(s) representing both sides of the transaction' }
});

export const pricingHistoryTooltips = Object.freeze({
    date: { id: 'date', label: 'Date', tip: 'Date of historical event' },
    status: { id: 'status', label: 'Status', tip: 'Status' },
    price: { id: 'price', label: 'Price', tip: 'Price if sold the sale price otherwise the list price' },
    priceChange: { id: 'priceChange', label: 'Price Change', tip: 'Price Change' },
    priceChangePct: { id: 'priceChangePct', label: 'Price Change %', tip: 'Price Change Percentage' },
    days: { id: 'days', label: 'Days', tip: 'The number (#) of days this status is recorded in MLS' },
    changeType: { id: 'changeType', label: 'Change Type', tip: 'Change Type' },
    spop: { id: 'spop', label: 'SP/OP', tip: 'Sales Price to Original Price ratio' },
    splp: {
        id: 'splp',
        label: 'SP/LP',
        tip: 'Ratio of the sold price (closed price) to the list price (the price that drew the offer)'
    }
});

export const officeTableTooltips = Object.freeze({
    producingAgents: { id: 'producingAgents', label: 'PA.', tip: 'Producing Agents' },
    volume: {
        id: 'volume',
        label: 'Volume',
        tip: 'Total $ volume of transaction sides (list + sell) for the last 12 months PLUS the current month to date'
    }
});

export const availableAgentsTooltips = Object.freeze({
    agentName: { id: 'agentName', label: 'Agent Name', tip: 'Agent Name' },
    agentId: { id: 'agentId', label: 'Agent Id', tip: 'Agent Id' },
    officeName: { id: 'officeName', label: 'Office', tip: 'Office Name' },
    officeCity: { id: 'officeCity', label: 'City', tip: 'Office City' },
    officeZipCode: { id: 'officeZipCode', label: 'Zip', tip: 'Office City' },
    officeCounty: { id: 'officeCounty', label: 'County', tip: 'Office County' },
    agentStatus: {id: 'agentStatus', label: 'Status', tip: 'Agent\'s Status'},
    volume: { id: 'volume', label: 'Volume', tip: 'Volume' }
});

export const addedAgentsTooltips = Object.freeze({
    agentName: { id: 'agentName', label: 'Agent Name', tip: 'Agent Name' },
    agentId: { id: 'agentId', label: 'Agent Id', tip: 'Agent Id' },
    officeName: { id: 'officeName', label: 'Office', tip: 'Office Name' },
    officeCity: { id: 'officeCity', label: 'City', tip: 'Office City' },
    officeZipCode: { id: 'officeZipCode', label: 'Zip', tip: 'Office City' },
    officeCounty: { id: 'officeCounty', label: 'County', tip: 'Office County' }
});

export const availableOfficesTooltips = Object.freeze({
    officeName: { id: 'officeName', label: 'Office Name', tip: 'Office Name' },
    officeId: { id: 'officeId', label: 'Office ID', tip: 'MLS Office ID' },
    streetName: { id: 'streetName', label: 'Address', tip: 'Address' },
    city: { id: 'city', label: 'City', tip: 'City' },
    zipCode: { id: 'zipCode', label: 'Zip', tip: 'Zip Coode' },
    county: { id: 'county', label: 'County', tip: 'County' },
    producingAgentCount: { id: 'producingAgentCount', label: 'PA.', tip: 'Producing Agents' },
    totalVolume: {
        id: 'totalVolume',
        label: 'Volume',
        tip: 'Total $ volume of transaction sides (list + sell) for the last 12 months PLUS the current month to date'
    }
});

export const agentProductionRoutes = Object.freeze({
    agentProfile: `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.AGENT_PROFILE}`
});

export const additionalTableHeaders = Object.freeze({
    column1: 'column1',
    column2: 'column2',
    column3: 'column3',
    column4: 'column4',
    column5: 'column5',
    column6: 'column6',
    column7: 'column7',
    contact: 'contact',
    search: 'search',
    mls: 'mls',
    growth: 'growth'
});

export const favoriteAgentTerms = {
    addAgentList: 'Add Agent List',
    agentListCreated: (AgentListName) => `Success: ${AgentListName} has been created.`,
    chooseAName55Char: 'Choose a name for the new agent list (max 55 characters)',
    chooseDifferentName: `The name you have entered already exists. Please choose a different name.`,
    enterListName: 'Enter list name',
    listName: 'list name',
    savedAgentLists: 'saved agent lists'
};

export const popoverTerms = {
    addList: 'add list',
    agentRemovedFromList: 'Agent removed from the list',
    agentAddedToList: 'Agent added to the list',
    auto: 'auto',
    bottom: 'bottom',
    bottomStart: 'bottom-start',
    bottomEnd: 'bottom-end',
    checkbox: 'checkbox',
    click: 'click',
    favoriteAgentPopover: 'favorite-agent-popover',
    legacy: 'legacy',
    starIcon: (tableId, rowIndex) => `starIcon-${tableId}-${rowIndex}`,
    currentList: 'current list',
    savedAgentLists: 'saved agent lists',
    atLeastOneAgentInList: 'A saved agent list must have at least one agent in it.'
};
