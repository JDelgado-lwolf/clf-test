import {
    marketShareColumns as cols
} from './marketShareColumns';
import { gridColumnDefinitions as gridCols } from './gridColumns';
import { showHideTypes } from './index';
import { listingViews } from './listingViews';
import { marketShareTerms } from './index';

const defaultShowHideOptions = [
    showHideTypes.onlyShowSelectedAreas,
    { ...showHideTypes.chart, isDefault: true }
];

const showHideForSaleCols = [
    {...gridCols.avgListDom, hide: false},
    {...gridCols.totalAvgPrice, hide: false, isCoverage: true},
    {...gridCols.mlsAgentCount, hide: false},
    {...gridCols.mlsOfficeCount, hide: false}
];

const settingsTotalVolumeUnits = {
    showHideOptions: {
        options: defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.totalAvgPrice, isDefault: true },
            { ...cols.totalProdAgentSearchCount, isDefault: true },
            { ...cols.mlsOfficeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.area,
        gridCols.listVolume,
        gridCols.listUnits,
        gridCols.sellVolume,
        gridCols.sellUnits,
        gridCols.totalVolume,
        gridCols.totalUnits,
        {...gridCols.marketSharePct, hide: false, isCoverage: true},
        { ...gridCols.totalAvgPrice, hide: false, isCoverage: true },
        {...gridCols.totalProdAgentSearchCount, hide: false},
        {...gridCols.mlsOfficeCount, hide: false}
    ]
};

const settingsForSaleVolume = {
    showHideOptions: {
        options: defaultShowHideOptions,
        columns: [
            { ...cols.unitSharePct, isDefault: true },
            { ...cols.marketSharePct, isDefault: true, label: marketShareTerms.volumePct },
            { ...cols.avgListDom, isDefault: true },
            { ...cols.totalAvgPrice, isDefault: true },
            { ...cols.mlsAgentCount, isDefault: true },
            { ...cols.mlsOfficeCount, isDefault: true }
            ]
        },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.area,
        {...gridCols.actVolume, isCoverage: true},
        {...gridCols.actUnits, isCoverage: true},
        gridCols.unitSharePct,
        {...gridCols.marketSharePct, hide:false, headerName: marketShareTerms.volumePct, tooltip:gridCols.volumeSharePct.field, minWidth: 140},
        ...showHideForSaleCols
    ]
};

const settingsForSaleUnits = {
    showHideOptions: {
        options: defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true, label: marketShareTerms.unitPct },
            { ...cols.volumeSharePct, isDefault: true },
            { ...cols.avgListDom, isDefault: true },
            { ...cols.totalAvgPrice, isDefault: true },
            { ...cols.mlsAgentCount, isDefault: true },
            { ...cols.mlsOfficeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.area,
        {...gridCols.actVolume, isCoverage: true},
        {...gridCols.actUnits, isCoverage: true},
        {...gridCols.marketSharePct, hide:false, headerName: marketShareTerms.unitPct, tooltip:gridCols.unitSharePct.field, minWidth: 110},
        gridCols.volumeSharePct,
        ...showHideForSaleCols
    ]
};

const settingsListSide = {
    showHideOptions: {
        options: defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.avgListDom, isDefault: true},
            { ...cols.listAvgPrice, isDefault: true },
            { ...cols.listSpop, isDefault: true },
            { ...cols.clr, isDefault: true },
            { ...cols.mlsAgentCount, isDefault: true },
            { ...cols.listProdAgentSearchCount, isDefault: true },
            { ...cols.mlsOfficeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.area,
        gridCols.listVolume,
        gridCols.listUnits,
        {...gridCols.marketSharePct, hide: false, isCoverage: true},
        {...gridCols.clr, hide: false, isCoverage: true},
        {...gridCols.avgListDom, hide: false},
        {...gridCols.listAvgPrice, hide: false},
        { ...gridCols.listSpop, hide: false },
        {...gridCols.mlsAgentCount, hide: false},
        {...gridCols.listProdAgentSearchCount, hide: false},
        {...gridCols.mlsOfficeCount, hide: false}
    ]
};

const settingsSellSide = {
    showHideOptions: {
        options: defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.sellAvgPrice, isDefault: true },
            { ...cols.sellSpop, isDefault: true },
            { ...cols.mlsAgentCount, isDefault: true },
            { ...cols.sellProdAgentSearchCount, isDefault: true },
            { ...cols.mlsOfficeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.area,
        gridCols.sellVolume,
        gridCols.sellUnits,
        {...gridCols.marketSharePct, hide: false, isCoverage: true},
        {...gridCols.sellAvgPrice, hide: false},
        { ...gridCols.sellSpop, hide: false },
        {...gridCols.mlsAgentCount, hide: false},
        {...gridCols.sellProdAgentSearchCount, hide: false},
        {...gridCols.mlsOfficeCount, hide: false}
    ]
};

export const coverageListingViews = Object.freeze({
    total$Volume: {
        ...listingViews.total$Volume,
        settings: settingsTotalVolumeUnits
    },
    totalNumUnits: {
        ...listingViews.totalNumUnits,
        settings: settingsTotalVolumeUnits
    },
    listSide$Volume: {
        ...listingViews.listSide$Volume,
        settings: settingsListSide
    },
    listSideNumUnits: {
        ...listingViews.listSideNumUnits,
        settings: settingsListSide
    },
    sellSide$Volume: {
        ...listingViews.sellSide$Volume,
        settings: settingsSellSide
    },
    sellSideNumUnits: {
        ...listingViews.sellSideNumUnits,
        settings: settingsSellSide
    },
    forSale$Volume: {
        ...listingViews.forSale$Volume,
        label: marketShareTerms.coverageForSale$Volume,
        settings: settingsForSaleVolume
    },
    forSaleNumUnits: {
        ...listingViews.forSaleNumUnits,
        label: marketShareTerms.coverageForSaleNumUnits,
        settings: settingsForSaleUnits
    }
});
