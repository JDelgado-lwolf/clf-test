import { agentProductionTerms, searchTerms } from '../../constants';
import { gridColumnDefinitions as gridCols } from './gridColumns';
import { listingsBreakdownKeys, marketShareTerms as mst } from './index';

const officeColumns = [
    { ...gridCols.officeId, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.officeName, exportHeaderLabel: mst.office },
    { ...gridCols.streetName, isAdditionalInfo: true, shouldExport: true, headerName: mst.address },
    { ...gridCols.city, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.stateCode, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.zipcode, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.county, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.phoneNumber, isAdditionalInfo: true, shouldExport: true }
];

const listingsColumns = [
    gridCols.mlsNum,
    gridCols.typeName,
    { ...gridCols.streetNum, hide: true, shouldExport: true },
    { ...gridCols.streetName, hide: true, shouldExport: true },
    gridCols.address,
    gridCols.city,
    gridCols.zipcode,
    gridCols.mlsArea
];

const additionalInfoListingsColumns = [
    { ...gridCols.bedrooms, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.fullBaths, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.squareFt, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.costPerSqft, isAdditionalInfo: true , shouldExport: true},
    { ...gridCols.lotSizeSquareFt, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.lotSizeAcres, hide: true, shouldExport: true },
    { ...gridCols.yearBuilt, isAdditionalInfo: true, shouldExport: true } 
]

const settingsTotalVolumeUnits = {
    columns: [
        ...officeColumns,
        { ...gridCols.listVolume, exportHeaderLabel: mst.list$Volume },
        { ...gridCols.listUnits, exportHeaderLabel: mst.listNumUnits },
        { ...gridCols.sellVolume, exportHeaderLabel: mst.sell$Volume },
        { ...gridCols.sellUnits, exportHeaderLabel: mst.sellNumUnits },
        { ...gridCols.totalVolume, exportHeaderLabel: mst.total$Volume },
        { ...gridCols.totalUnits, exportHeaderLabel: mst.totalNumUnits },
        gridCols.marketSharePct,
        gridCols.totalAveragePrice,
        gridCols.agentCount,
        { ...gridCols.prodAgentSearchCount, exportHeaderLabel: mst.prodAgentsCurrentSearch }
    ],
    translatedFieldViews: {
        totalVolume: 'totalVolume',
        totalUnits: 'totalUnits'
    }
};

const settingsListSide = {
    columns: [
        ...officeColumns,
        { ...gridCols.listVolume, exportHeaderLabel: agentProductionTerms.listDollars },
        { ...gridCols.listUnits, exportHeaderLabel: agentProductionTerms.listNumber },
        gridCols.marketSharePct,
        gridCols.closeListRatio,
        gridCols.listAverageDom,
        gridCols.listSpop,
        gridCols.listAveragePrice,
        gridCols.agentCount,
        { ...gridCols.prodAgentSearchCount, exportHeaderLabel: mst.prodAgentsCurrentSearch }
    ],
    translatedFieldViews: {
        listVolume: 'listVolume',
        listUnits: 'listUnits'
    }
};

const settingsSellSide = {
    columns: [
        ...officeColumns,
        { ...gridCols.sellVolume, exportHeaderLabel: agentProductionTerms.sellDollars },
        { ...gridCols.sellUnits, exportHeaderLabel: agentProductionTerms.sellNumber },
        gridCols.marketSharePct,
        gridCols.sellSpop,
        gridCols.sellAveragePrice,
        gridCols.agentCount,
        { ...gridCols.prodAgentSearchCount, exportHeaderLabel: mst.prodAgentsCurrentSearch }
    ],
    translatedFieldViews: {
        sellVolume: 'sellVolume',
        sellUnits: 'sellUnits'
    }
};

const settingsForSale = {
    columns: [
        ...officeColumns,
        { ...gridCols.fsVolume, exportHeaderLabel: mst.forSaleVolume },
        { ...gridCols.fsUnits, exportHeaderLabel: mst.forSaleUnits },
        gridCols.marketSharePct,
        gridCols.averageDom,
        gridCols.averagePrice,
        { ...gridCols.prodAgentSearchCount, exportHeaderLabel: mst.mlsIds }
    ],
    translatedFieldViews: {
        actVolume: 'volume',
        actUnits: 'units'
    }
};

const settingsNewListings = {
    columns: [
        ...officeColumns,
        gridCols.newVolume,
        gridCols.newUnits,
        gridCols.marketSharePct,
        gridCols.averageDom,
        gridCols.averagePrice,
        gridCols.agentCount
    ],
    translatedFieldViews: {
        newListVolume: 'volume',
        newListUnits: 'units'
    }
};

const settingsUnderContract = {
    columns: [
        ...officeColumns,
        gridCols.ucVolumeAlt,
        gridCols.ucUnitsAlt,
        gridCols.marketSharePct,
        gridCols.averageDom,
        gridCols.averagePrice,
        gridCols.agentCount
    ],
    translatedFieldViews: {
        ucVolume: 'volume',
        ucUnits: 'units'
    }
};

const soldBothSidesColumns = [
    ...listingsColumns,
    gridCols.orgPrice,
    gridCols.listPrice,
    gridCols.soldPrice,
    gridCols.date,
    gridCols.dom,
    gridCols.cdom,
    gridCols.bankStatus,
    { ...gridCols.priceChangeCnt, isAdditionalInfo: true, shouldExport: true },
    gridCols.spop,
    gridCols.splp,
    ...additionalInfoListingsColumns,
    {...gridCols.listAgent, hide: true, shouldExport: true },
    {...gridCols.sellAgent, hide: true, shouldExport: true },
    gridCols.listOfficeId,
    gridCols.listOfficeName,
    gridCols.sellOfficeId,
    gridCols.sellOfficeName
];

const soldSellSideColumns = [
    ...listingsColumns,
    gridCols.orgPrice,
    gridCols.listPrice,
    gridCols.soldPrice,
    gridCols.date,
    gridCols.dom,
    gridCols.cdom,
    gridCols.bankStatus,
    { ...gridCols.priceChangeCnt, isAdditionalInfo: true, shouldExport: true },
    gridCols.spop,
    gridCols.splp,
    ...additionalInfoListingsColumns,
    gridCols.sellAgent
];

const soldListSideColumns = [
    gridCols.mlsNum,
    gridCols.typeName,
    { ...gridCols.streetNum, hide: true, shouldExport: true },
    { ...gridCols.streetName, hide: true, shouldExport: true },
    gridCols.address,
    gridCols.city,
    gridCols.zipcode,
    gridCols.mlsArea,
    gridCols.orgPrice,
    gridCols.listPrice,
    gridCols.soldPrice,
    gridCols.date,
    gridCols.dom,
    gridCols.cdom,
    gridCols.bankStatus,
    { ...gridCols.priceChangeCnt, isAdditionalInfo: true, shouldExport: true },
    gridCols.spop,
    gridCols.splp,
    ...additionalInfoListingsColumns,
    gridCols.listAgent
];

const forSaleColumns = [
    gridCols.mlsNum,
    gridCols.typeName,
    { ...gridCols.streetNum, hide: true, shouldExport: true },
    { ...gridCols.streetName, hide: true, shouldExport: true },
    gridCols.address,
    gridCols.city,
    gridCols.zipcode,
    gridCols.mlsArea,
    gridCols.orgPrice,
    { ...gridCols.listPrice, headerName: agentProductionTerms.price, exportHeaderLabel: agentProductionTerms.price },
    { ...gridCols.date, headerName: agentProductionTerms.listDate },
    gridCols.dom,
    gridCols.cdom,
    gridCols.bankStatus,
    { ...gridCols.priceChangeCnt, isAdditionalInfo: true, shouldExport: true },
    ...additionalInfoListingsColumns,
    gridCols.listAgent
];

const officeDetailsTab = {
    id: listingsBreakdownKeys.officeDetails,
    label: searchTerms.officeDetails,
    columns: {
        byOffice: [],
        byBrokerage: []
    }
};

const soldBothSidesTabs = Object.freeze([
    {
        id: 'soldBothSides',
        label: searchTerms.soldBothSides,
        columns: soldBothSidesColumns
    },
    {
        id: 'soldListSide',
        label: searchTerms.soldListSide,
        columns: soldListSideColumns
    },
    {
        id: 'soldSellSide',
        label: searchTerms.soldSellSide,
        columns: soldSellSideColumns
    },
    officeDetailsTab
]);

const soldListSideTabs = Object.freeze([
    {
        id: 'soldListSide',
        label: searchTerms.soldListSide,
        columns: soldListSideColumns
    },
    officeDetailsTab
]);

const soldSellSideTabs = Object.freeze([
    {
        id: 'soldSellSide',
        label: searchTerms.soldSellSide,
        columns: soldSellSideColumns
    },
    officeDetailsTab
]);

const forSaleTabs = Object.freeze([
    {
        id: 'forSale',
        label: searchTerms.forSale,
        columns: forSaleColumns
    },
    officeDetailsTab
]);

export const coverageSettingsListingsBreakdown = Object.freeze({
    totalVolume: {
        settings: soldBothSidesTabs
    },
    totalUnits: {
        settings: soldBothSidesTabs
    },
    listVolume: {
        settings: soldListSideTabs
    },
    listUnits: {
        settings: soldListSideTabs
    },
    sellVolume: {
        settings: soldSellSideTabs
    },
    sellUnits: {
        settings: soldSellSideTabs
    },
    actVolume: {
        settings: forSaleTabs
    },
    actUnits: {
        settings: forSaleTabs
    }
});

export const coverageSettingsOfficesBreakdown = Object.freeze({
    totalVolume: {
        settings: settingsTotalVolumeUnits
    },
    totalUnits: {
        settings: settingsTotalVolumeUnits
    },
    listVolume: {
        settings: settingsListSide
    },
    listUnits: {
        settings: settingsListSide
    },
    sellVolume: {
        settings: settingsSellSide
    },
    sellUnits: {
        settings: settingsSellSide
    },
    ucVolume: {
        settings: settingsUnderContract
    },
    ucUnits: {
        settings: settingsUnderContract
    },
    actVolume: {
        settings: settingsForSale
    },
    actUnits: {
        settings: settingsForSale
    },
    newListVolume: {
        settings: settingsNewListings
    },
    newListUnits: {
        settings: settingsNewListings
    }
});
