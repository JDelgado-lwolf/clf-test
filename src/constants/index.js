import { NAME_MAX_LENGTH } from '../market-share/helpers/comparisonSets';
import { Routes } from '../common/routes/routes';

// these searchTerms keys match the terms in the search criteria
export const searchTerms = Object.freeze({
    allResidential: 'All Residential',
    mls: 'MLS',
    mlsProvider: 'MLS Provider',
    propertyType: 'Property Type',
    propertyTypes: 'Property Type(s)',
    propertyTypesSA: 'Property Types',
    marketArea: 'Market Area',
    areaTypePopover: 'Display Coverage By:',
    areaType: 'Area Type',
    selectedAreaTypeTitle: 'Area Type: ',
    timeFrame: 'Time Period',
    listingStatus: 'Status',
    totalVolume: '$ Volume',
    savedSearches: 'Saved Searches',
    soldPriceRange: 'Sold Price Range',
    soldPrice: 'Sold Price',
    priceRange: 'Price Range',
    totalUnits: '# Units',
    fullBathrooms: '# Bathrooms',
    bedrooms: '# Bedrooms',
    required: 'Required',
    optional: 'Optional',
    saveSearchHeader: 'Save Search',
    saveMarketAreaHeader: 'New Market Area List',
    overwriteMarketAreaHeader: 'Overwrite Market Area List',
    overwriteOfficeListHeader: 'Overwrite Office List',
    overwriteSearchHeader: 'Overwrite Search',
    nameYourSearch: 'Name your custom search',
    nameYourList: 'List Name',
    describeYourSearch: 'Description',
    searchNamePlaceholder: 'Enter a name for your search',
    searchNotesPlaceholder: 'Enter a description about your search',
    searchName: 'Search Name',
    searchDescription: 'Description',
    confirmDelete: 'Are you sure you want to delete this saved search permanently?',
    savedSearchFilter: 'savedSearches',
    mlsFilter: 'mls',
    propTypeFilter: 'propertyType',
    timeFrameFilter: 'timeFrame',
    marketAreaFilter: 'marketArea',
    areaTypeFilter: 'areaType',
    totalVolumeFilter: 'totalVolume',
    soldPriceFilter: 'soldPriceRange',
    priceRangeFilter: 'priceRange',
    totalUnitsFilter: 'totalUnits',
    fullBathroomsFilter: 'fullBathrooms',
    bedroomsFilter: 'bedrooms',
    squareFootageFilter: 'squareFootage',
    squareFeetFilter: 'squareFeet',
    lotSizeFilter: 'lotSize',
    lotSizeAcresFilter: 'lotSizeAcres',
    lotSquareFeetFilter: 'lotSquareFeet',
    listingStatusFilter: 'listingStatus',
    comparisonSetFilter: 'comparisonSet',
    comparisonSet: 'Comparison Set',
    getNotCreatedMessage: (type) => `You have not created ${type === searchTerms.comparisonSet ? `a ${type}` : `an ${type}`} in this MLS.`,
    getCreateMessage: (type) => `Please create ${type === searchTerms.comparisonSet ? `a ${type}` : `an ${type}`} to continue.`,
    createComparisonSets: 'Create Comparison Set',
    createOfficeGroups: 'Create Office Group',
    officesFilter: 'offices',
    officeIdType: 'officeId',
    agentsFilter: 'agents',
    agentIdType: 'agentId',
    transactionStatus: 'transactionStatus',
    marketAreaFilterPlaceholder: 'Search Lists',
    manageListsLinkText: 'Manage Lists',
    dependentSavedSearches: 'Dependent Saved Searches',
    transactionsIn: 'Transactions In',
    transactions: 'Transactions',
    searchBy: 'Search By',
    newSearch: 'New Search',
    editList: 'Edit List',
    totals: 'Totals',
    coverage: 'Coverage',
    offices: 'Offices',
    officeName: 'Office Name',
    officeId: 'Office Id',
    agents: 'Agents',
    agentName: 'Agent Name',
    savedAgentList: 'Saved Agent List',
    myMarketLists: 'My Market Lists',
    areaOptions: 'Area Options',
    allMls: 'ALL MLS',
    lowerAllMls: 'All MLS',
    noneAdded: 'None Added',
    none: 'None',
    selectItemsFromLeft: itemType => `Select ${itemType} from the list on the left to include them in your search.`,
    selectType: type => `- Select ${type} - `,
    noOfficesAvailable: 'The are no offices available at this time.',
    newOfficeList: 'New Office List',
    newAgentList: 'New Agent List',
    listName: 'List Name',
    saveList: 'Save List',
    saveAsList: 'Save as List',
    userListGroup: 'YOUR OFFICE LISTS',
    officeNotFound: '***Not Found***',
    inactiveOffice: '***Inactive***',
    searchOfficeLists: 'Search Office Lists',
    searchMarketAreaLists: 'Search Market Area Types/Lists',
    myOfficeLists: 'My Office Lists',
    myAgentLists: 'My Agent Lists',
    soldBothSides: 'Total Sold List + Sell',
    soldListSide: 'Sold List Side',
    soldSellSide: 'Sold Sell Side',
    forSale: 'For Sale',
    officeDetails: 'Office Details',
    inactiveAgent: '***Inactive***',
    agentNotFound: '***Not Found***',
    mlsNotSupportMeasureType: measureType => `${measureType} is not supported By MLS`,
    soldPriceChip: 'SoldPrice',
    lastPriceChip: 'LastPrice',
    searchOffice: 'Search Office',
    searchId: 'Search ID',
    noMin: 'No min',
    noMax: 'No max',
    clearLotSize: 'Clear Lot Size',
    clearBedrooms: 'Clear Bedrooms',
    clearBathrooms: 'Clear Bathrooms',
    clearAllSearchTitle: 'Clear All Search Criteria',
    clearAllSearchMessage: 'Are you sure you want to clear all search criteria? Doing so will ' +
        'require you to rebuild your search.',
    clearComparisonSets: 'Clear Comparison Sets',
    lotSize: 'Lot Size',
    squareFeet: 'Square Feet',
    acres: 'Acres',
    squareFootage: 'Square Footage',
    unsaved: 'Unsaved',
    noSearchesFound: 'No searches found.',
    savedItemsFilterPlaceholder: 'Search saved search name',
    searchAddress: 'Search Address',
    noSavedAgentsLists: 'You don’t have any Saved Agents.',
    additionalInfo: 'Additional Information',
    searchForItem: (item) => `Search for your ${item}`,
});

export const searchTypeNames = {
    transactions: 'transactions',
    offices: 'offices',
    agents: 'agents',
    totals: 'totals',
    coverage: 'coverage',
    marketDynamics: 'dynamics'
};

export const searchRoutes = Object.freeze({
    transactions: Routes.PROF_METRICS.BASE + Routes.PROF_METRICS.TRANSACTIONS,
    officeName: Routes.PROF_METRICS.BASE + Routes.PROF_METRICS.OFFICE_NAME,
    agentName: Routes.PROF_METRICS.BASE + Routes.PROF_METRICS.AGENTS,
    savedAgents: Routes.PROF_METRICS.BASE + Routes.PROF_METRICS.SAVED_AGENTS,
    totals: Routes.MARKET_SHARE.BASE + Routes.MARKET_SHARE.TOTALS,
    coverage: Routes.MARKET_SHARE.BASE + Routes.MARKET_SHARE.COVERAGE,
    officeBreakdown: Routes.MARKET_SHARE.BASE + Routes.MARKET_SHARE.TOTALS + Routes.MARKET_SHARE.OFFICES_BREAKDOWN,
    marketDynamicsOfficeBreakdown: Routes.MARKET_DYNAMICS.BASE + Routes.MARKET_DYNAMICS.OFFICES_BREAKDOWN,
})

export const searchTypes = {
    [searchRoutes.transactions]: {
        type: searchTypeNames.transactions,
        title: 'Transactions'
    },
    [searchRoutes.officeName]: {
        type: searchTypeNames.offices,
        title: 'Office Name'
    },
    [searchRoutes.agentName]: {
        type: searchTypeNames.agents,
        title: 'Agent Name'
    },
    [searchRoutes.savedAgents]: {
        type: searchTypeNames.agents,
        title: 'Saved Agents'
    },
    [searchRoutes.totals]: {
        type: searchTypeNames.totals,
        title: 'Totals'
    },
    [searchRoutes.coverage]: {
        type: searchTypeNames.coverage,
        title: 'Coverage'
    },
    [Routes.MARKET_DYNAMICS.BASE]: {
        type: searchTypeNames.marketDynamics,
        title: 'Market Dynamics'
    }
};

export const marketDynamicsTerms = Object.freeze({
    marketDynamics: 'Market Dynamics',
    searchFilterAdjust: 'Please adjust your search filters to find the market information you\'re looking for',
    newSearch: 'New Search',
    years3Quarterly: '3 Years (Quarterly)',
    years2Monthly: '2 Years (Monthly)',
    years1Monthly: '1 Year (Monthly)',
    months6Weekly: '6 Months (Weekly)',
    atLeastOneStatusMustBeSelected: 'At least one status must be selected.'
});

export const marketShareTerms = Object.freeze({
    marketShare: 'Market Share',
    noRowsSelected: 'Please select a checkbox on the table below to view your chart data',
    comparisonSets: 'Comparison Sets',
    manageComparisonSets: 'Manage Comparison Sets',
    comparisonSetsDescription: 'Create and compare market share for collections of one or more office groups.',
    addComparisonSetMessage: 'To add a comparison set, click "New Set"',
    editComparisonSet: 'Edit Comparison Set',
    getDeleteComparisonSet: (comparisonSetName) => `Are you sure you want to delete ${comparisonSetName}?`,
    getDeleteOfficeGroup: (officeGroupName) => `Are you sure you want to delete ${officeGroupName}?`,
    deleteComparisonSetDescription: 'Deleting this comparison set will delete all office groups associated with this ' +
        'comparison set and remove this comparison set from all associated saved searches.',
    noneAdded: 'None added',
    addNewComparisonSet: 'Add New Comparison Set',
    comparisonSetName: 'Comparison Set Name',
    newComparisonSet: 'New Comparison Set',
    addComparisonSetDescription: `Choose a name for the new comparison set (max ${NAME_MAX_LENGTH} characters).`,
    editComparisonSetDescription: `Choose a new name for the comparison set (max ${NAME_MAX_LENGTH} characters).`,
    addNewGroupDescription: `Choose a name for the new office group (max ${NAME_MAX_LENGTH} characters).`,
    getCreatedComparisonSetMessage: (comparisonSetLabel) => `${comparisonSetLabel} has been created.`,
    duplicateComparisonSetName: 'There is already a Comparison Set with that name in the MLS. Please select a different name.',
    duplicateOfficeGroupName: 'There is already an Office Group with that name in the Comparison Set. Please select a different name.',
    getGroupUpdatedMessage: (officeGroupName) => `Success: ${officeGroupName} has been created.`,
    getGroupEditedMsg: (officeGroupName) => `The office group named ${officeGroupName} has been updated successfully.`,
    getCompNameUpdatedMsg: (compSetName) => `The comparison set named ${compSetName} has been updated successfully.`,
    getOfficeGroupDeletedMsg: (officeGroupName) => `The office group named ${officeGroupName} has been deleted successfully.`,
    getOfficeGroupDeleteError: (officeGroupName) => `The ${officeGroupName} office group could not be deleted. Please try again.`,
    getOfficeGroupEditError: (officeGroupName) => `The ${officeGroupName} office group could not be updated. Please try again.`,
    createComparisonSetsError: 'Error creating comparison sets',
    updateOfficeGroupError: 'Error updating office groups',
    officeGroup: 'Office Group',
    officeGroupName: 'Office Group Name',
    addOfficeGroupMessage: 'To add an office group, click "New Group"',
    addNewOfficeGroup: 'Add New Office Group',
    editOfficeGroup: 'Edit Office Group',
    newOfficeGroup: 'New Office Group',
    comparisonSetMlsIdField: 'mlsId',
    getComparisonSetLabel: (csName, csDescription) => `${csName} (${csDescription})`,
    getRemovedComparisonSetMessage: (comparisonSetName) => `The comparison set named ${comparisonSetName} has been deleted successfully.`,
    errorUpdatingSavedSearches: 'Error updating saved search criteria',
    getRemovedComparisonSetErrorMessage: (comparisonSetName) => `The ${comparisonSetName} comparison set could not be deleted. Please try again.`,
});

export const buttonTerms = {
    ok: 'Ok',
    cancel: 'Cancel',
    clearAll: 'Clear All',
    delete: 'Delete',
    download: 'Download',
    export: 'Export',
    save: 'Save',
    saveSearch: 'Save Search',
    runSearch: 'Run Search',
    volume: 'Volume',
    units: 'Units',
    addFilter: 'Add Filter',
    done: 'Done',
    selected: 'Selected',
    all: 'All',
    update: 'Update',
    statuses: 'Statuses',
    saveAsNew: 'Save as New List',
    saveAsNewButtonId: 'save-as-new-btn',
    updateButtonId: 'update-btn',
    yes: 'Yes',
    no: 'No',
    linkLwa: 'Link my Lone Wolf account',
    askLater: 'Ask me later',
    newSet: 'New Set',
    addList: 'Add List',
    display: 'Display',
    newGroup: 'New Group'
};

export const validationMessages = {
    propertyTypesNoSelectionError: 'You must select at least one property type',
    missingTimePeriodType: 'You must specify a time period type\n',
    missingStartDate: 'You must specify a start date\n',
    invalidStartDateFormat: 'Start date format must be MM/DD/YYYY\n',
    invalidStartDate: (start, end) => `The Start date must be between ${start} and ${end}\n`,
    missingEndDate: 'You must specify an end date\n',
    invalidEndDateFormat: 'End date format must be MM/DD/YYYY\n',
    endDateTooEarly: 'The Start date must be before the End date\n',
    invalidEndDate: (start, end) => `The End date must be between ${start} and ${end}\n`,
    sameStartAndEnd: 'The Start date cannot be the same as the End date\n',
    notNumeric: 'You must specify a numeric value\n',
    maxLessThanMin: (term) => `Maximum ${term} must be greater than or equal to minimum ${term}\n`,
    greaterThanLimit: (term, limit) => `${term} cannot be greater than ${limit}\n`,
    isNegative: (term) => `${term} cannot be less than 0\n`,
    invalidEmail: 'Your email is not valid.',
    requiredEmail: 'Email is required.',
    invalidPassword: 'Password must be between 8 and 100 characters long.',
    requiredPassword: 'Password is required.',
    authenticationFailed: 'The email and password you entered do not match our records. Please double-check and try again. If the issue persists, contact your administrator or support@lwolf.com.',
    inactiveKeycloak: appName => `You do not have permission to access this ${appName} account. Please contact your administrator or email support@lwolf.com.`,
    invalidLogin: 'Invalid login',
    invalidToken: 'Invalid Token',
    connectionMismatch: (emailAddress) => `The login credentials associated with ${emailAddress} have been set up incorrectly. Please contact your administrator or support@lwolf.com.`,
    connectionError: 'Connection error, please try again.',
    unableToLink: 'Unable to link account at this time.',
    unknownError: 'Something went wrong. Try again later',
    unableToConnect: 'This account could not be connected',
    accountAlreadyConnected: 'This account is already connected to a Platform account',
    notValidEnvForHost: hostname => `Couldn't find a valid environment for ${hostname}`,
    notValidEnv: (env, platformEnv) =>  `${env} or ${platformEnv} are not valid environments. Valid envs are: dev, stage, stg, pre and empty string for prod`,
};

export const agentProductionTemplates = Object.freeze({
    exportFilenames: {
        production: '[AGENT_NAME]\'s Production in [MLS_NAME] for [PERIOD_START] - [PERIOD_FINISH]',
        inventory: '[AGENT_NAME]\'s Inventory in [SEARCH_AREA/MLS_NAME] on [DOWNLOAD_DATE]',
        transactionCoverage: '[AGENT_NAME]\'s [DEAL_STATUS] Transaction Coverage in [SEARCH_AREA/MLS_NAME] on [DOWNLOAD_DATE]',
        transactionCoverageListings: '[AGENT_NAME]\'s [DEAL_STATUS] Listings in [SEARCH_AREA/MLS_NAME] for [DOWNLOAD_DATE]',
        productionAgentListings: '[AGENT_NAME]\'s Production Listings in [SEARCH_AREA/MLS_NAME] for [TIME_PERIOD]'
    },
    listingProfMetricsHeader: 'List Side Transactions (ALL MLS) Last 12 Months ([12_MONTHS_AGO] - [LAST_MONTH])',
    headerListSideTransactions: 'List Side Transactions (All MLS) [LAST_12_MONTHS] ([CURRENT_LAST_12_MONTHS_RANGE])'
});

export const agentProductionTermsTemplates = Object.freeze({
    labels: {
        ytdPrevYearNum: 'YTD [PREVIOUS_YEAR] #',
        ytdCurrentYearNum: 'YTD [CURRENT_YEAR] #',
        ytdPrevYear$: 'YTD [PREVIOUS_YEAR] $',
        ytdCurrentYear$: 'YTD [CURRENT_YEAR] $'
    }
});

export const listingStatus = Object.freeze({
    active: 'Active',
    contingent: 'Contingent',
    pending: 'Pending',
    sold: 'Sold'
});

export const marketShareListingStatuses = Object.freeze({
    'SoldBothSides': 'Total Sold (List + Sell)',
    'SoldListSide': 'Sold (List Side)',
    'SoldSellSide': 'Sold (Sell Side)',
    'UnderContract': 'Under Contract',
    'ForSale': 'For Sale',
    'New': 'New Listings'
});

export const marketShareListingStatusesCoverage = Object.freeze({
    'SoldBothSides': 'Total Sold (List + Sell)',
    'ForSale': 'For Sale'
});

export const agentProductionTerms = Object.freeze({
    account: 'Account',
    all: 'all',
    noData: 'No results found',
    noDataSuggestion: `Try adjusting your search filters to find what you're looking for.`,
    noSavedAgents: 'No Saved Agents',
    noSavedAgentsSuggestion: 'Save an agent for them to appear here.',
    initialLoad: `Please adjust your search filters to find agents you're looking for`,
    findAgents: 'Find agents using the search bar above',
    officeInformation: 'Office Information',
    officeId: 'Office ID',
    officeName: 'Office Name',
    office: 'Office',
    officeAddress: 'Office Address',
    officePhone: 'Office Phone',
    officeEmail: 'Office Email',
    broker: 'Broker',
    brokerName: 'Broker Name',
    totalSell: 'Total Sell',
    totalList: 'Total List',
    noPriceChangeListings: 'No Price Change Listings',
    priceChangeListings: 'Price Change Listings',
    showHideMetrics: 'Show/Hide Metrics',
    contact: 'Contact',
    exportData: 'Export Data',
    export: 'Export',
    month: 'Month',
    listNumber: 'List #',
    listDollars: 'List $',
    sellNumber: 'Sell #',
    sellDollars: 'Sell $',
    totalNumber: 'Total #',
    totalDollars: 'Total $',
    totalNumberPct: '# Units %',
    totalDollarsPct: '$ Volume %',
    type: 'Type',
    address: 'Address',
    city: 'City',
    zip: 'Zip',
    county: 'County',
    originalPrice: 'Original Price',
    listPrice: 'List Price',
    numPriceChanges: '# Price Changes',
    listDate: 'List Date',
    ucDate: 'UC Date',
    daysUnderContract: 'Days Under Contract',
    cdom: 'CDOM',
    status: 'Status',
    bd: 'BD',
    ba: 'BA',
    sqft: 'SQFT',
    dollarsPerSqft: '$/SQFT',
    lotSizeAcres: 'Lot Size (Acres)',
    yearBuilt: 'Year Built',
    mlsNumber: 'MLS Number',
    propertyType: 'Property Type',
    propertySubType: 'Property Subtype',
    orgPriceListPrice: 'Org. Price/List Price',
    listOffice: 'List Office',
    coListOffice: 'Co-List Office',
    domCdom: 'DOM/CDOM',
    sellOffice: 'Sell Office',
    taxId: 'Tax ID',
    coSellOffice: 'Co-Sell Office',
    coListAgent: 'Co-List Agent',
    coSellAgent: 'Co-Sell Agent',
    fullBaths: 'Full Baths',
    bedrooms: 'Bedrooms',
    mlsArea: 'MLS Area',
    subdivision: 'Subdivision',
    partialBaths: 'Partial Baths',
    mapCode: 'Map Code',
    squareFeet: 'Square Feet',
    lotSize: 'Lot Size',
    acres: 'Acres',
    newConstruction: 'New Construction',
    price: 'Price',
    abbrY: 'Y',
    abbrN: 'N',
    spLp: 'SP/LP',
    spOp: 'SP/OP',
    changeDollar: 'Change $',
    changeNum: 'Change #',
    changeType: 'Change Type',
    changeTypePct: 'Change Type %',
    priceChange: 'Price Change',
    priceChangePct: 'Price Change %',
    days: 'Days',
    date: 'Date',
    mlsNum: 'MLS #',
    share: 'Share',
    downloadPdf: 'Download PDF',
    copyShareableLink: 'Copy Shareable Link',
    dollarVolumeListSide: '$ Volume - List Side',
    dollarVolumeSellSide: '$ Volume - Sell Side',
    totalDollarVolume: 'Total $ Volume',
    dollarVolumePerMonth: '$ Volume Per Month',
    averagePrice: 'Average Price',
    unitsChange: 'Units Change',
    dollarChange: '$ Change',
    pctChange: '% Change',
    pctChangeNum: '% Change #',
    agentProfile: 'Agent Profile',
    notApplicableAbbrv: 'N/A',
    currentYear: 'Current Year',
    previousYear: 'Previous Year',
    volume: 'Volume',
    units: 'Units',
    numberUnits: '# Units',
    dollarVolume: '$ Volume',
    totalVolume: 'Total Volume',
    totalUnits: 'Total Units',
    numberUnitsListSide: '# Units - List Side',
    numberUnitsSellSide: '# Units - Sell Side',
    totalNumberUnits: 'Total # Units',
    numberUnitsPerMonth: '# Units Per Month',
    previousMonth: 'Previous Month',
    lastMonth: 'Last Month',
    last6Months: 'Last 6 Months',
    table: 'Table',
    chart: 'Chart',
    mlsWide: 'MLS-Wide',
    allMls: 'ALL MLS',
    metrics: 'Metrics',
    searchTimePeriod: 'Search Time Period',
    annually: 'Annually',
    last12Months: 'Last 12 Months',
    last24Months: 'Last 24 Months',
    yearToDate: 'Year to Date',
    previousMonthToDate: 'Previous Month To Date',
    previousQuarterToDate: 'Previous Quarter',
    previousYearToDate: 'Previous Year To Date',
    previous6Months: 'Previous 6 Months',
    previous12Months: 'Previous 12 Months',
    dollarsInMillions: '$ in Millions',
    noDataForSelectedAgent: 'No data for selected Agent',
    listSideSold: 'List Side (Sold)',
    sellSideSold: 'Sell Side (Sold)',
    searchReturnedNoResults: 'Your search returned no results',
    MTD: 'MTD',
    QTD: 'QTD',
    YTD: 'YTD',
    propertyInformation: 'Property Information',
    pricingHistory: 'Pricing History',
    agentProduction: 'Agent Production',
    proficiencyMetrics: 'Proficiency Metrics',
    overview: 'Overview',
    contactInformation: 'Contact Information',
    growthAnalysis: 'Growth Analysis',
    listingProficiency: 'Listing Proficiency',
    production: 'Production',
    inventory: 'Inventory',
    transactionCoverage: 'Transaction Coverage',
    officeHistory: 'Office History',
    officeHistoryNoData: 'No Office History Found',
    areaType: 'Area Type',
    counties: 'Counties',
    zipCode: 'Zip Code',
    zipCodes: 'Zip Codes',
    cities: 'Cities',
    mlsAreas: 'MLS Areas',
    subdivisions: 'Subdivisions',
    allMlsTransactions: 'ALL MLS Transactions',
    currentSearch: 'Current Search',
    stNumber: 'St #',
    street: 'Street',
    bankProperty: 'Bank Property',
    soldPrice: 'Sold Price',
    priceChangeCnt: '# of Price Changes',
    spop: 'SP/OP',
    spopPct: 'SP/OP %',
    splp: 'SP/LP',
    soldDate: 'Sold Date',
    dom: 'DOM',
    pcdom: 'PC_DOM',
    lotSizeSqft: 'Lot Size (SQFT)',
    listAgent: 'List Agent',
    sellAgent: 'Sell Agent',
    dbl: 'DBL',
    area: 'Area',
    marketAreaPct: 'Market Area %',
    listings: 'Listings',
    totalSoldListing: 'Total Sold List + Sell',
    sellSoldListing: 'Sold Sell-Side',
    listSoldListing: 'Sold List-Side',
    underContractListing: 'Under Contract',
    forSaleListing: 'For Sale',
    viewOnlyMyAgentsNoData: 'No agents found for this filter',
    findAgent: 'Find Agent',
    agentsFields: 'At least 1 character must be entered in one of these fields.',
    firstName: 'firstName',
    lastName: 'lastName',
    name: 'Name',
    agentId: 'Agent ID',
    agentContactInformation: 'Agent Contact Information',
    officeDetail: 'Office Detail',
    businessAddress: 'Business Address',
    phoneNumbers: 'Phone Number(s)',
    emailAddress: 'Email Address',
    alternateAddress: 'Alternate Address',
    alternatePhoneNumbers: 'Alternate Phone Number(s)',
    brokerID: 'Broker ID',
    mls: 'MLS',
    mlsIDs: 'MLS IDs',
    responsibleMember: 'Responsible Member',
    producingAgents: 'Producing Agents',
    memberType: 'Member Type',
    constructionType: 'Construction Type',
    errorServer413: `The amount of data provided in the request exceeds the capacity limit.
                     Please refine your search and try again.`,
    errorServerNoResponse: `A technical problem prevented your information from being
                            displayed. Please try again. If that doesn't work,
                            contact `,
    totalSum: 'Total',
    agent: 'Agent',
    totalsAverages: 'Totals / Averages',
    notSuppliedByMls: 'Not Supplied By MLS',
    officeLookupPlaceholder: 'Filter by office name, office ID, city, zip code, county',
    allMlsTransactionsLast12Months: 'ALL MLS Transactions Last 12 Months',
    growth: 'Growth',
    active: 'Active',
    inactive: 'Inactive',
    summary: 'Summary'
});

export const modalTerms = Object.freeze({
    overwriteTitle: name => `${name} already exists!`,
    overwriteBody: 'Do you want to overwrite?',
    linkLwaModalsubtitle: appName => `Create and link your Lone Wolf account to ${appName}`,
    linkLwaModalBody1: 'We are working to make it easier for you to access all your Lone Wolf applications in a secure manner.',
    linkLwaModalBody2: appName => `To do this, we ask that you create a Lone Wolf account, and link it to your ${appName} account. This gives you access to all your Lone Wolf applications from one place and lets you switch between applications with ease using a single login.`,
});

export const agentFilter = [
    { label: 'firstName', value: 'First Name' },
    { label: 'lastName', value: 'Last Name' },
    { label: 'agentId', value: 'Agent ID' },
    { label: 'city', value: 'City' },
    { label: 'county', value: 'County' },
    { label: 'zipCode', value: 'Zip' }
];

export const ownerTypes = {
    user: 'USER',
    lwa: 'LWA_ID',
};

export const status = {
    INACTIVE: 'I',
    NOTFOUND: 'Not found',
    ACTIVE: 'A'
};

export const statusMap = {
    [status.ACTIVE]: agentProductionTerms.active,
    [status.INACTIVE]: agentProductionTerms.inactive,
};

export const moduleNames = Object.freeze({
    proficiencyMetrics: 'PROFICIENCY_METRICS',
    marketShare: 'MARKET_SHARE',
    marketDynamics: 'MARKET_DYNAMICS'
});

export const accountTypes = {
    internal: 'Internal',
    broker: 'Broker',
    mls: 'MLS'
};

export const modules = {
    proficiencyMetrics: {
        transactions: 'PROFICIENCY_METRICS.TRANSACTIONS',
        offices: 'PROFICIENCY_METRICS.OFFICES',
        agents: 'PROFICIENCY_METRICS.AGENTS',
        savedAgents: 'PROFICIENCY_METRICS.SAVED_AGENTS'
    },
    marketShare: {
        totals: 'MARKET_SHARE.TOTALS',
        coverage: 'MARKET_SHARE.COVERAGE'
    },
    marketDynamics: {
        marketDynamics: 'MARKET_DYNAMICS'
    }
};

export const defaultModules = {
    [moduleNames.proficiencyMetrics]: modules.proficiencyMetrics.transactions,
    [moduleNames.marketShare]: modules.marketShare.totals,
    [moduleNames.marketDynamics]: modules.marketDynamics.marketDynamics
};

export const moduleRoutes = {
    [modules.proficiencyMetrics.transactions]: searchRoutes.transactions,
    [modules.proficiencyMetrics.offices]: searchRoutes.officeName,
    [modules.proficiencyMetrics.agents]: searchRoutes.agentName,
    [modules.proficiencyMetrics.savedAgents]: searchRoutes.savedAgents,
    [modules.marketShare.totals]: searchRoutes.totals,
    [modules.marketShare.coverage]: searchRoutes.coverage,
    [modules.marketDynamics.marketDynamics]: Routes.MARKET_DYNAMICS.BASE
};

export const modulesByRouteAndNameAssociation = [
    {
        moduleName: moduleNames.proficiencyMetrics,
        module: modules.proficiencyMetrics.transactions,
        route: searchRoutes.transactions
    },
    {
        moduleName: moduleNames.proficiencyMetrics,
        module: modules.proficiencyMetrics.offices,
        route: searchRoutes.officeName
    },
    {
        moduleName: moduleNames.proficiencyMetrics,
        module: modules.proficiencyMetrics.agents,
        route: searchRoutes.agentName
    },
    {
        moduleName: moduleNames.marketShare,
        module: modules.marketShare.totals,
        route: searchRoutes.totals
    },
    {
        moduleName: moduleNames.marketShare,
        module: modules.marketShare.coverage,
        route: searchRoutes.coverage
    },
    {
        moduleName: moduleNames.marketDynamics,
        module: modules.marketDynamics,
        route: Routes.MARKET_DYNAMICS.BASE
    }
];

export const moduleProperties = {
    [modules.proficiencyMetrics.transactions]: {
        hasPropertyTypes: true,
        hasOffices: false
    },
    [modules.proficiencyMetrics.offices]: {
        hasPropertyTypes: false,
        hasOffices: true
    },
    [modules.proficiencyMetrics.agents]: {
        hasPropertyTypes: true,
        hasOffices: false
    },
    [modules.marketShare.totals]: {
        hasPropertyTypes: true,
        hasOffices: false
    },
    [modules.marketShare.coverage]: {
        hasPropertyTypes: true,
        hasOffices: true
    },
    [modules.marketDynamics.marketDynamics]: {
        hasPropertyTypes: true,
        hasOffices: false
    }
};

export const schemaTableClassNames = Object.freeze({
    agentProfile: {
        HEADER_CLASSES: 'align-middle no-wrap'
    }
});

export const toastMessages = {
    error: {
        deleteSearch: 'Unable to delete your search. Please try again later.',
        saveSearch: 'Unable to save your search. Please try again later.',
        marketListExists: 'A market area list with this name already exists. Please enter an unused name.',
        duplicatedOfficeList: 'An office list with this name already exists. Please enter an unused name',
        duplicatedAgentList: 'An agent list with this name already exists. Please enter an unused name',
        saveList: listType => `Unable to save your ${listType} list. Please try again later`,
        deleteSavedList: searchType => `Unable to delete your ${searchType} list. Please try again later`,
        tooManySelections: 'You have selected too many options.',
        limitYourSelection: 'Please limit your selection to 2000.',
        searchExceeded: (maxAgentsToReturn) => `Your search result has exceeded ${maxAgentsToReturn} agents. Please adjust your search criteria and try again.`
    },
    success: {
        searchSaved: 'Success: Your search has been saved',
        savedListConfirmation: listName => `Success: ${listName} list has been saved`,
        deletedListConfirmation: listName => `${listName} list has been deleted`
    }
};

export const agentFullName = agent => `${agent.firstName} ${agent.lastName}`;

export const TimePeriods = {
    'MTD': 'MTD',
    'QTD': 'QTD',
    'YTD': 'YTD',
    'Last Month': 'Monthly',
    'Last 6 Months': 'Last6Months',
    'Last 12 Months': 'Annually',
    'Last 24 Months': 'Last24Months',
    'Last Calendar Year': 'LastCalendarYear',
    'Custom Date': 'Custom'
};

export const marketDynamicsTimePeriods = {
    [marketDynamicsTerms.years3Quarterly]: 'Last13Quarters',
    [marketDynamicsTerms.years2Monthly]: 'Last25Months',
    [marketDynamicsTerms.years1Monthly]: 'Last13Months',
    [marketDynamicsTerms.months6Weekly]: 'Last24Weeks'
};

export const searchStatuses = {
    run: 'begin-search',
    running: 'fetching-search',
    ran: 'search-completed'
};

export const areaSearchTypes = ['city', 'subdivision', 'areaKey', 'area2Key', 'areaSub', 'zip', 'county', 'mapCode', 'state'];
export const lotSizeTypes = [ searchTerms.lotSizeAcresFilter , searchTerms.lotSquareFeetFilter ];

export const areasCompletionMap = Object.freeze({
    'areaKey-suggest': 'area_id',
    'area2Key-suggest': 'area2_id',
    'areaSub-suggest': 'area_sub_id',
    'city-suggest': 'city',
    'county-suggest': 'county',
    'subdivision-suggest': 'subdivision',
    'zip-suggest': 'zip_code',
    'mapCode-suggest': 'map_code'
});

export const areaRequestTypes = Object.freeze({
    'zip_code': 'zip',
    'city': 'city',
    'county': 'county',
    'subdivision': 'subdivision',
    'area_sub_id': 'areaSub',
    'area_id': 'areaKey',
    'area2_id': 'area2Key',
    'map_code': 'mapCode',
    'state_code': 'state'
});

export const modalTitles = Object.freeze({
    tooManyResults: 'Too many results found',
    tooManySelections: 'Too many selections',
    linkLwaModal: appName => `${appName} by Lone Wolf`,
});

export const loginTerms = {
    allRightsReserved: '©2014 - 2022 Lone Wolf Inc. All rights reserved.',
    email: 'Email',
    login: 'Log in',
    password: 'Password',
    privacyPolicy:'Privacy Policy',
    signInBM: 'Sign in to BrokerMetrics',
    signInAM: 'Sign in to AgentMetrics',
    signInLWA:'Sign in with your Lone Wolf Account',
    termsOfUse: 'Terms of Use',
    or: 'or',
    lwaTooltip: appName => `Use this option if you already connected your ${appName} account to your Lone Wolf Account`
};

export const navTerms = {
    signOut: 'Sign Out',
    myProfile: 'My Profile'
};

export const ACCOUNTS = Object.freeze({ LONE_WOLF_INTERNAL: { id: 2 } });

export const MLS_SID = Object.freeze({
    MCRTC: 10
});

export const MLS_PROPERTY_TYPE_CLASS_ID = Object.freeze({
    RESIDENTIAL: 0
});

export const sortingTerms = {
    alphaValue: 'alpha',
    alphaLabel: 'A to Z',
    updatedValue: 'updated',
    updatedLabel: 'Updated',
    soldCountValue: 'soldCount',
    soldCountLabel: 'Count',
    agentNameValue: 'agentName',
    volumeLabel: '$ Volume',
    volumeValue: 'volume',
    officeNameValue: 'officeName',
};

export const comparisonSetsModals = {
    SAVE: 'save',
    OFFICE_GROUP: 'office_group',
    EDIT: 'edit',
    DELETE: 'delete',
    DELETE_OFFICE_GROUP: 'delete_office_group',
};
