import { listingsBreakdownKeys, marketShareTerms as mst } from './index';
import { agentProductionTerms, agentProductionTerms as apt, marketShareListingStatuses, searchTerms } from '../../constants';
import { gridColumnDefinitions as gridCols } from './gridColumns';
import { csvFormats } from '../../common/helpers/agGrid';

const additionalOfficeInfoColumnsSettings = [
    { ...gridCols.officeId, isAdditionalInfo: true, shouldExport: true },
    gridCols.officeName,
    { ...gridCols.streetName, isAdditionalInfo: true, headerName: apt.address, shouldExport: true },
    { ...gridCols.city, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.stateCode, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.zipcode, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.county, isAdditionalInfo: true, shouldExport: true },
    { ...gridCols.phoneNumber, isAdditionalInfo: true, shouldExport: true },
];

const additionalInfoListingsBothSidesColumnsSettings = [
    {...gridCols.priceChangeCnt, isAdditionalInfo: true, shouldExport: true },
    gridCols.spop,
    gridCols.splp,
    {...gridCols.bedrooms, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.fullBaths, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.squareFt, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.costPerSqft, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.lotSizeSquareFt, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.lotSizeAcres, hide: true, shouldExport: true },
    {...gridCols.yearBuilt, isAdditionalInfo: true, shouldExport: true }
];

const additionalInfoListingsForNewUnderColumnsSettings = [
    {...gridCols.priceChangeCnt, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.bedrooms, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.fullBaths, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.squareFt, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.costPerSqft, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.lotSizeSquareFt, isAdditionalInfo: true, shouldExport: true },
    {...gridCols.lotSizeAcres, hide: true, shouldExport: true },
    {...gridCols.yearBuilt, isAdditionalInfo: true, shouldExport: true }
];

const settingsTotalVolumeUnits = {
    columns: [
        ...additionalOfficeInfoColumnsSettings,
        { ...gridCols.listVolume, exportHeaderLabel: mst.list$Volume },
        { ...gridCols.listUnits, exportHeaderLabel: mst.listNumUnits },
        { ...gridCols.sellVolume, exportHeaderLabel: mst.sell$Volume },
        { ...gridCols.sellUnits, exportHeaderLabel: mst.sellNumUnits },
        { ...gridCols.totalVolume, exportHeaderLabel: mst.total$Volume },
        { ...gridCols.totalUnits, exportHeaderLabel: mst.totalNumUnits },
        gridCols.marketSharePct,
        gridCols.listAverageDom,
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
        ...additionalOfficeInfoColumnsSettings,
        { ...gridCols.listVolume, exportHeaderLabel: mst.list$Volume },
        { ...gridCols.listUnits, exportHeaderLabel: mst.listNumUnits },
        gridCols.marketSharePct,
        { ...gridCols.clr, exportFormatter: csvFormats.centuplePercentage.format, exportHeaderLabel: mst.clr },
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
        ...additionalOfficeInfoColumnsSettings,
        { ...gridCols.sellVolume, exportHeaderLabel: mst.sell$Volume },
        { ...gridCols.sellUnits, exportHeaderLabel: mst.sellNumUnits },
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

const settingsUnderContract = {
    columns: [
        ...additionalOfficeInfoColumnsSettings,
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

const settingsForSale = {
    columns: [
        ...additionalOfficeInfoColumnsSettings,
        gridCols.fsVolume,
        gridCols.fsUnits,
        gridCols.marketSharePct,
        gridCols.averageDom,
        gridCols.averagePrice,
        gridCols.agentCount
    ],
    translatedFieldViews: {
        actVolume: 'volume',
        actUnits: 'units'
    }
};

const settingsNewListings = {
    columns: [
        ...additionalOfficeInfoColumnsSettings,
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
}

const soldSellSideColumns = [
    { ...gridCols.listingStatus, hide: true, shouldExport: true },
    { ...gridCols.officeId, hide: true, shouldExport: true },
    { ...gridCols.office, hide: true, shouldExport: true },
    gridCols.mlsNum,
    gridCols.typeName,
    { ...gridCols.streetNum, hide: true, shouldExport: true },
    { ...gridCols.streetName, hide: true, shouldExport: true },
    gridCols.address,
    gridCols.city,
    gridCols.zipcode,
    gridCols.areaId,
    gridCols.orgPrice,
    gridCols.listPrice,
    { ...gridCols.price, exportHeaderLabel: agentProductionTerms.soldPrice },
    { ...gridCols.date, exportHeaderLabel: agentProductionTerms.soldDate },
    gridCols.dom,
    gridCols.cdom,
    gridCols.bankStatus,
    ...additionalInfoListingsBothSidesColumnsSettings,
    gridCols.sellAgent
];

const soldListSideColumns = [
    { ...gridCols.listingStatus, hide: true, shouldExport: true },
    { ...gridCols.officeId, hide: true, shouldExport: true },
    { ...gridCols.office, hide: true, shouldExport: true },
    gridCols.mlsNum,
    gridCols.typeName,
    { ...gridCols.streetNum, hide: true, shouldExport: true },
    { ...gridCols.streetName, hide: true, shouldExport: true },
    gridCols.address,
    gridCols.city,
    gridCols.zipcode,
    gridCols.areaId,
    gridCols.orgPrice,
    gridCols.listPrice,
    { ...gridCols.price, exportHeaderLabel: agentProductionTerms.soldPrice },
    { ...gridCols.date, exportHeaderLabel: agentProductionTerms.soldDate },
    gridCols.dom,
    gridCols.cdom,
    gridCols.bankStatus,
    ...additionalInfoListingsBothSidesColumnsSettings,
    gridCols.listAgent
];

const forUnderNewListingColumns = [
    { ...gridCols.listingStatus, hide: true, shouldExport: true },
    { ...gridCols.officeId, hide: true, shouldExport: true },
    { ...gridCols.office, hide: true, shouldExport: true },
    gridCols.mlsNum,
    gridCols.typeName,
    { ...gridCols.streetNum, hide: true, shouldExport: true },
    { ...gridCols.streetName, hide: true, shouldExport: true },
    gridCols.address,
    gridCols.city,
    gridCols.zipcode,
    gridCols.areaId,
    gridCols.orgPrice,
    { ...gridCols.listPrice, headerName: agentProductionTerms.price, exportHeaderLabel: agentProductionTerms.listPrice }
];

const forSaleColumns = [
    ...forUnderNewListingColumns,
    { ...gridCols.date, headerName: agentProductionTerms.listDate },
    gridCols.dom,
    gridCols.cdom,
    gridCols.bankStatus,
    ...additionalInfoListingsForNewUnderColumnsSettings,
    gridCols.listAgent
];

const underContractColumns = [
    ...forUnderNewListingColumns,
    { ...gridCols.date, headerName: agentProductionTerms.ucDate },
    gridCols.dom,
    gridCols.cdom,
    gridCols.bankStatus,
    ...additionalInfoListingsForNewUnderColumnsSettings,
    gridCols.listAgent
];

const newListingsColumns = forSaleColumns;

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
        columns: {
            byOffice: [
                { ...gridCols.listingStatus, hide: true, shouldExport: true },
                { ...gridCols.officeId, hide: true, shouldExport: true },
                { ...gridCols.office, hide: true, shouldExport: true },
                gridCols.mlsNum,
                gridCols.typeName,
                { ...gridCols.streetNum, hide: true, shouldExport: true },
                { ...gridCols.streetName, hide: true, shouldExport: true },
                gridCols.address,
                gridCols.city,
                gridCols.zipcode,
                gridCols.areaId,
                gridCols.orgPrice,
                gridCols.listPrice,
                gridCols.price,
                gridCols.date,
                gridCols.dom,
                gridCols.cdom,
                gridCols.bankStatus,
                ...additionalInfoListingsBothSidesColumnsSettings,
                gridCols.listAgent,
                gridCols.sellAgent,
                gridCols.doubleSided
            ],
            byBrokerage: [
                { ...gridCols.listingStatus, hide: true, shouldExport: true },
                gridCols.mlsNum,
                gridCols.typeName,
                { ...gridCols.streetNum, hide: true, shouldExport: true },
                { ...gridCols.streetName, hide: true, shouldExport: true },
                gridCols.address,
                gridCols.city,
                gridCols.zipcode,
                gridCols.areaId,
                gridCols.orgPrice,
                gridCols.listPrice,
                gridCols.price,
                gridCols.date,
                gridCols.dom,
                gridCols.cdom,
                gridCols.bankStatus,
                ...additionalInfoListingsBothSidesColumnsSettings,
                { ...gridCols.listAgent, hide: true, shouldExport: true },
                { ...gridCols.sellAgent, hide: true, shouldExport: true },
                gridCols.listOfficeId,
                gridCols.listOfficeName,
                gridCols.sellOfficeId,
                gridCols.sellOfficeName
            ]
        }
    },
    {
        id: 'soldListSide',
        label: searchTerms.soldListSide,
        columns: {
            byOffice: [
                ...soldListSideColumns,
                { ...gridCols.sellAgent, hide: true, shouldExport: true},
                { ...gridCols.doubleSided, hide: true, shouldExport: true}
            ],
            byBrokerage: [
                ...soldListSideColumns,
                { ...gridCols.sellAgent, hide: true, shouldExport: true },
                { ...gridCols.listOfficeId, hide: true, shouldExport: true },
                { ...gridCols.listOfficeName, hide: true, shouldExport: true },
                { ...gridCols.sellOfficeId, hide: true, shouldExport: true },
                { ...gridCols.sellOfficeName, hide: true, shouldExport: true }
            ]
        }
    },
    {
        id: 'soldSellSide',
        label: searchTerms.soldSellSide,
        columns: {
            byOffice: [
                { ...gridCols.listingStatus, hide: true, shouldExport: true },
                { ...gridCols.officeId, hide: true, shouldExport: true },
                { ...gridCols.office, hide: true, shouldExport: true },
                gridCols.mlsNum,
                gridCols.typeName,
                { ...gridCols.streetNum, hide: true, shouldExport: true },
                { ...gridCols.streetName, hide: true, shouldExport: true },
                gridCols.address,
                gridCols.city,
                gridCols.zipcode,
                gridCols.areaId,
                gridCols.orgPrice,
                gridCols.listPrice,
                { ...gridCols.price, exportHeaderLabel: agentProductionTerms.soldPrice },
                { ...gridCols.date, exportHeaderLabel: agentProductionTerms.soldDate },
                gridCols.dom,
                gridCols.cdom,
                gridCols.bankStatus,
                ...additionalInfoListingsBothSidesColumnsSettings,
                { ...gridCols.listAgent, hide: true, shouldExport: true},
                gridCols.sellAgent,
                { ...gridCols.doubleSided, hide: true, shouldExport: true}
            ],
            byBrokerage: [
                { ...gridCols.listingStatus, hide: true, shouldExport: true },
                { ...gridCols.officeId, hide: true, shouldExport: true },
                { ...gridCols.office, hide: true, shouldExport: true },
                gridCols.mlsNum,
                gridCols.typeName,
                { ...gridCols.streetNum, hide: true, shouldExport: true },
                { ...gridCols.streetName, hide: true, shouldExport: true },
                gridCols.address,
                gridCols.city,
                gridCols.zipcode,
                gridCols.areaId,
                gridCols.orgPrice,
                gridCols.listPrice,
                { ...gridCols.price, exportHeaderLabel: agentProductionTerms.soldPrice },
                { ...gridCols.date, exportHeaderLabel: agentProductionTerms.soldDate },
                gridCols.dom,
                gridCols.cdom,
                gridCols.bankStatus,
                ...additionalInfoListingsBothSidesColumnsSettings,
                { ...gridCols.listAgent, hide: true, shouldExport: true},
                gridCols.sellAgent,
                { ...gridCols.listOfficeId, hide: true, shouldExport: true },
                { ...gridCols.listOfficeName, hide: true, shouldExport: true },
                { ...gridCols.sellOfficeId, hide: true, shouldExport: true },
                { ...gridCols.sellOfficeName, hide: true, shouldExport: true }
            ]
        }
    },
    officeDetailsTab
]);

const soldListSideTabs = Object.freeze([
    {
        id: 'soldListSide',
        label: searchTerms.soldListSide,
        columns: {
            byOffice: soldListSideColumns,
            byBrokerage: soldListSideColumns
        }
    },
    officeDetailsTab
]);

const soldSellSideTabs = Object.freeze([
    {
        id: 'soldSellSide',
        label: searchTerms.soldSellSide,
        columns: {
            byOffice: soldSellSideColumns,
            byBrokerage: soldSellSideColumns
        }
    },
    officeDetailsTab
]);

const forSaleTabs = Object.freeze([
    {
        id: 'forSale',
        label: searchTerms.forSale,
        columns: {
            byOffice: forSaleColumns,
            byBrokerage: forSaleColumns
        }
    },
    officeDetailsTab
]);

const underContractTabs = Object.freeze([
    {
        id: 'underContract',
        label: agentProductionTerms.underContractListing,
        columns: {
            byOffice: underContractColumns,
            byBrokerage: underContractColumns
        }
    },
    officeDetailsTab
]);

const newListingsTabs = Object.freeze([
    {
        id: listingsBreakdownKeys.newListings,
        label: marketShareListingStatuses.New,
        columns: {
            byOffice: newListingsColumns,
            byBrokerage: newListingsColumns
        }
    },
    officeDetailsTab
]);

export const settingsListingsBreakdown = Object.freeze({
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
    ucVolume: {
        settings: underContractTabs
    },
    ucUnits: {
        settings: underContractTabs
    },
    actVolume: {
        settings: forSaleTabs
    },
    actUnits: {
        settings: forSaleTabs
    },
    newListVolume: {
        settings: newListingsTabs
    },
    newListUnits: {
        settings: newListingsTabs
    }
});

export const settingsOfficesBreakdown = Object.freeze({
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
