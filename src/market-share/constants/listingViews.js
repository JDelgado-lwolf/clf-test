import {
    dataPoints,
    gridGroups,
    listingTypes,
    marketShareTerms as t
} from './index';
import { marketShareColumns as cols, marketShareColumns } from './marketShareColumns';
import { gridColumnDefinitions as gridCols } from './gridColumns';
import { getCompactDollars, popOverDataFormatters } from '../../agent-production/helpers/dataFormatters';
import { marketShareListingStatuses } from '../../constants';

export const xAxisLabelFormatters = {
    volume: getCompactDollars,
    units: value => Number.isInteger(value) ? value : value.toFixed(1)
};

const getComparisonSetColumns = (columns) => {
    return columns.map(col => {
        if (col.field === gridCols.brokerName.field) return gridCols.groupName;
        return col;
    })
};

const showHideTotalVolumeUnitsCols = [
    {...gridCols.marketSharePct, hide: false},
    {...gridCols.avgListDom, hide: false},
    {...gridCols.totalAvgPrice, hide: false},
    {...gridCols.prodAgentTotalUnits, hide: false},
    { ...gridCols.prodAgentTotalVolume, hide: false },
    {...gridCols.prodAgentSearchCount, hide: false},
];

const showHideSellSideCols = [
    {...gridCols.marketSharePct, hide: false},
    {...gridCols.sellAvgPrice, hide: false},
    {...gridCols.sellSpop, hide: false},
    {...gridCols.prodAgentSellUnits, hide: false},
    { ...gridCols.prodAgentSellVolume, hide: false },
    {...gridCols.prodAgentSearchCount, hide: false}
];

const showHideListSideCols = [
    {...gridCols.marketSharePct, hide: false},
    {...gridCols.clr, hide: false},
    {...gridCols.avgListDom, hide: false},
    {...gridCols.listAvgPrice, hide: false},
    {...gridCols.listSpop, hide: false},
    {...gridCols.prodAgentListUnits, hide: false},
    { ...gridCols.prodAgentListVolume, hide: false },
    {...gridCols.prodAgentSearchCount, hide: false}
];

const showHideUnderContractForSaleCols = [
    {...gridCols.marketSharePct, hide: false},
    {...gridCols.avgDom, hide: false},
    {...gridCols.avgPrice, hide: false},
    {...gridCols.agentCount, hide: false}
];

const showHideNewListingCols = [
    {...gridCols.marketSharePct, hide: false},
    {...gridCols.avgPrice, hide: false},
    {...gridCols.agentCount, hide: false}
];

const settingsTotalVolumeUnitsByBrokerage = {
    showHideOptions: {
        options: listingTypes.byBrokerage.defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.avgListDom, isDefault: true },
            { ...cols.totalAvgPrice, isDefault: true },
            { ...cols.prodAgentTotalUnits, isDefault: true },
            { ...cols.prodAgentTotalVolume, isDefault: true },
            { ...cols.prodAgentSearchCount, isDefault: true },
            { ...cols.officeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.brokerName,
        gridCols.listVolume,
        gridCols.listUnits,
        gridCols.sellVolume,
        gridCols.sellUnits,
        gridCols.totalVolume,
        gridCols.totalUnits,
        ...showHideTotalVolumeUnitsCols,
        {...gridCols.officeCount, hide: false}
    ]
};

const settingsSellSideByBrokerage = {
    showHideOptions: {
        options: listingTypes.byBrokerage.defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.sellAvgPrice, isDefault: true },
            { ...cols.sellSpop, isDefault: true },
            { ...cols.prodAgentSellUnits, isDefault: true },
            { ...cols.prodAgentSellVolume, isDefault: true },
            { ...cols.prodAgentSearchCount, isDefault: true },
            { ...cols.officeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.brokerName,
        gridCols.sellVolume,
        gridCols.sellUnits,
        ...showHideSellSideCols,
        { ...gridCols.officeCount, hide: false }
    ]
}

const settingsForSaleByBrokerage = {
    showHideOptions: {
        options: listingTypes.byBrokerage.defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.avgDom, isDefault: true },
            { ...cols.avgPrice, isDefault: true },
            { ...cols.agentCount, isDefault: true },
            { ...cols.officeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.brokerName,
        gridCols.actVolume,
        gridCols.actUnits,
        ...showHideUnderContractForSaleCols,
        { ...gridCols.officeCount, hide: false }
    ]
}

const settingsNewListingByBrokerage = {
    showHideOptions: {
        options: listingTypes.byBrokerage.defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.avgPrice, isDefault: true },
            { ...cols.agentCount, isDefault: true },
            { ...cols.officeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.brokerName,
        gridCols.newListVolume,
        gridCols.newListUnits,
        ...showHideNewListingCols,
        { ...gridCols.officeCount, hide: false }
    ]
}

const settingsTotalVolumeUnits = {
    [listingTypes.byOffice.id]: {
        showHideOptions: {
            options: listingTypes.byOffice.defaultShowHideOptions,
            columns: [
                { ...cols.address, isDefault: false, groupId: gridGroups.ADDRESS },
                { ...cols.marketSharePct, isDefault: true },
                { ...cols.avgListDom, isDefault: true },
                { ...cols.totalAvgPrice, isDefault: true },
                { ...cols.prodAgentTotalUnits, isDefault: true },
                { ...cols.prodAgentTotalVolume, isDefault: true },
                { ...cols.prodAgentSearchCount, isDefault: true }
            ]
        },
        columns: [
            gridCols.isSelected,
            gridCols.rank,
            { ...gridCols.officeId, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.officeName,
            { ...gridCols.streetName1, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.city, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.stateCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.zipCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.county, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.phoneNumber, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.listVolume,
            gridCols.listUnits,
            gridCols.sellVolume,
            gridCols.sellUnits,
            gridCols.totalVolume,
            gridCols.totalUnits,
            ...showHideTotalVolumeUnitsCols
        ]
    },
    [listingTypes.byBrokerage.id]: settingsTotalVolumeUnitsByBrokerage,
    [listingTypes.comparisonSet.id]: {
        ...settingsTotalVolumeUnitsByBrokerage,
        showHideOptions: {
            ...settingsTotalVolumeUnitsByBrokerage.showHideOptions,
            options: listingTypes.comparisonSet.defaultShowHideOptions
        },
        columns: getComparisonSetColumns(settingsTotalVolumeUnitsByBrokerage.columns)
    }
};

const settingsUnderContractByBrokerage = {
    showHideOptions: {
        options: listingTypes.byBrokerage.defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.avgDom, isDefault: true },
            { ...cols.avgPrice, isDefault: true },
            { ...cols.agentCount, isDefault: true },
            { ...cols.officeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.brokerName,
        gridCols.ucVolume,
        gridCols.ucUnits,
        ...showHideUnderContractForSaleCols,
        {...gridCols.officeCount, hide: false},
    ]
};

const settingsUnderContract = {
    [listingTypes.byOffice.id]: {
        showHideOptions: {
            options: listingTypes.byOffice.defaultShowHideOptions,
            columns: [
                { ...cols.address, isDefault: false, groupId: gridGroups.ADDRESS },
                { ...cols.marketSharePct, isDefault: true },
                { ...cols.avgDom, isDefault: true },
                { ...cols.avgPrice, isDefault: true },
                { ...cols.agentCount, isDefault: true }
            ]
        },
        columns: [
            gridCols.isSelected,
            gridCols.rank,
            { ...gridCols.officeId, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.officeName,
            { ...gridCols.streetName, groupId: gridGroups.ADDRESS, hide: true, headerName: t.address },
            { ...gridCols.city, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.stateCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.zipCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.county, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.phoneNumber, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.ucVolume,
            gridCols.ucUnits,
            ...showHideUnderContractForSaleCols
        ]
    },
    [listingTypes.byBrokerage.id]: settingsUnderContractByBrokerage,
    [listingTypes.comparisonSet.id]: {
        ...settingsUnderContractByBrokerage,
        showHideOptions: {
            ...settingsUnderContractByBrokerage.showHideOptions,
            options: listingTypes.comparisonSet.defaultShowHideOptions
        },
        columns: getComparisonSetColumns(settingsUnderContractByBrokerage.columns)
    },
};

const settingsNewListing = {
    [listingTypes.byOffice.id]: {
        showHideOptions: {
            options: listingTypes.byOffice.defaultShowHideOptions,
            columns: [
                { ...cols.address, isDefault: false, groupId: gridGroups.ADDRESS },
                { ...cols.marketSharePct, isDefault: true },
                { ...cols.avgPrice, isDefault: true },
                { ...cols.agentCount, isDefault: true }
            ]
        },
        columns: [
            gridCols.isSelected,
            gridCols.rank,
            { ...gridCols.officeId, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.officeName,
            { ...gridCols.streetName, groupId: gridGroups.ADDRESS, hide: true, headerName: t.address },
            { ...gridCols.city, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.stateCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.zipCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.county, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.phoneNumber, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.newListVolume,
            gridCols.newListUnits,
            ...showHideNewListingCols
        ]
    },
    [listingTypes.byBrokerage.id]: settingsNewListingByBrokerage,
    [listingTypes.comparisonSet.id]: {
        ...settingsNewListingByBrokerage,
        showHideOptions: {
            ...settingsNewListingByBrokerage.showHideOptions,
            options: listingTypes.comparisonSet.defaultShowHideOptions,
        },
        columns: getComparisonSetColumns(settingsNewListingByBrokerage.columns)
    }
};

const settingsForSale = {
    [listingTypes.byOffice.id]: {
        showHideOptions: {
            options: listingTypes.byOffice.defaultShowHideOptions,
            columns: [
                { ...cols.address, isDefault: false, groupId: gridGroups.ADDRESS },
                { ...cols.marketSharePct, isDefault: true },
                { ...cols.avgDom, isDefault: true },
                { ...cols.avgPrice, isDefault: true },
                { ...cols.agentCount, isDefault: true }
            ]
        },
        columns: [
            gridCols.isSelected,
            gridCols.rank,
            { ...gridCols.officeId, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.officeName,
            { ...gridCols.streetName, groupId: gridGroups.ADDRESS, hide: true, headerName: t.address },
            { ...gridCols.city, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.stateCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.zipCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.county, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.phoneNumber, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.actVolume,
            gridCols.actUnits,
            ...showHideUnderContractForSaleCols
        ]
    },
    [listingTypes.byBrokerage.id]: settingsForSaleByBrokerage,
    [listingTypes.comparisonSet.id]: {
        ...settingsForSaleByBrokerage,
        showHideOptions: {
            ...settingsForSaleByBrokerage.showHideOptions,
            options: listingTypes.comparisonSet.defaultShowHideOptions,
        },
        columns: getComparisonSetColumns(settingsForSaleByBrokerage.columns)
    }
};

const settingsSellSide = {
    [listingTypes.byOffice.id]: {
        showHideOptions: {
            options: listingTypes.byOffice.defaultShowHideOptions,
            columns: [
                { ...cols.address, isDefault: false, groupId: gridGroups.ADDRESS },
                { ...cols.marketSharePct, isDefault: true },
                { ...cols.sellAvgPrice, isDefault: true },
                { ...cols.sellSpop, isDefault: true },
                { ...cols.prodAgentSellUnits, isDefault: true },
                { ...cols.prodAgentSellVolume, isDefault: true },
                { ...cols.prodAgentSearchCount, isDefault: true }
            ]
        },
        columns: [
            gridCols.isSelected,
            gridCols.rank,
            { ...gridCols.officeId, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.officeName,
            { ...gridCols.streetName1, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.city, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.stateCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.zipCode, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.county, groupId: gridGroups.ADDRESS, hide: true },
            { ...gridCols.phoneNumber, groupId: gridGroups.ADDRESS, hide: true },
            gridCols.sellVolume,
            gridCols.sellUnits,
            ...showHideSellSideCols
        ]
    },
    [listingTypes.byBrokerage.id]: settingsSellSideByBrokerage,
    [listingTypes.comparisonSet.id]: {
        ...settingsSellSideByBrokerage,
        showHideOptions: {
            ...settingsSellSideByBrokerage.showHideOptions,
            options: listingTypes.comparisonSet.defaultShowHideOptions,
        },
        columns: getComparisonSetColumns(settingsSellSideByBrokerage.columns)
    }
};

const settingsColumnsOfficeListSide = [
    gridCols.isSelected,
    gridCols.rank,
    { ...gridCols.officeId, groupId: gridGroups.ADDRESS, hide: true },
    gridCols.officeName,
    { ...gridCols.streetName1, groupId: gridGroups.ADDRESS, hide: true },
    { ...gridCols.city, groupId: gridGroups.ADDRESS, hide: true },
    { ...gridCols.stateCode, groupId: gridGroups.ADDRESS, hide: true },
    { ...gridCols.zipCode, groupId: gridGroups.ADDRESS, hide: true },
    { ...gridCols.county, groupId: gridGroups.ADDRESS, hide: true },
    { ...gridCols.phoneNumber, groupId: gridGroups.ADDRESS, hide: true },
    gridCols.listVolume,
    gridCols.listUnits,
    ...showHideListSideCols
];

const settingsListSideUnitsByBrokerage = {
    showHideOptions: {
        options: listingTypes.byBrokerage.defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.avgListDom, isDefault: true },
            { ...cols.listAvgPrice, isDefault: true },
            { ...cols.listSpop, isDefault: true },
            { ...cols.prodAgentListUnits, label: t.unitsPerProducingAgent, isDefault: true },
            { ...cols.prodAgentListVolume, label: t.volumePerProducingAgent, isDefault: true },
            { ...cols.clr, isDefault: true },
            { ...cols.prodAgentSearchCount, isDefault: true },
            { ...cols.officeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.brokerName,
        gridCols.listVolume,
        gridCols.listUnits,
        ...showHideListSideCols,
        {...gridCols.officeCount, hide: false},
    ]
};

const settingsListSideVolumeByBrokerage = {
    showHideOptions: {
        options: listingTypes.byBrokerage.defaultShowHideOptions,
        columns: [
            { ...cols.marketSharePct, isDefault: true },
            { ...cols.avgListDom, isDefault: true },
            { ...cols.listAvgPrice, isDefault: true },
            { ...cols.listSpop, isDefault: true },
            { ...cols.prodAgentListUnits, isDefault: true },
            { ...cols.prodAgentListVolume, isDefault: true },
            { ...cols.clr, isDefault: true },
            { ...cols.prodAgentSearchCount, isDefault: true },
            { ...cols.officeCount, isDefault: true }
        ]
    },
    columns: [
        gridCols.isSelected,
        gridCols.rank,
        gridCols.brokerName,
        gridCols.listVolume,
        gridCols.listUnits,
        ...showHideListSideCols,
        {...gridCols.officeCount, hide: false}
    ]
};

export const listingViews = Object.freeze({
    newListing$Volume: {
        id: 'newListing$Volume',
        label: t.newListing$Volume,
        dataPointGroups: [
            dataPoints.NEW_LISTING_VOLUME
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.volume,
        popOverDataFormatter: popOverDataFormatters.volume,
        popOverLabels: [
            marketShareListingStatuses['New']
        ],
        keyField: marketShareColumns.newListingVolume.id,
        settings: settingsNewListing
    },
    newListingNumUnits: {
        id: 'newListingNumUnits',
        label: t.newListingNumUnits,
        dataPointGroups: [
            dataPoints.NEW_LISTING_UNITS
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.units,
        popOverDataFormatter: popOverDataFormatters.units,
        popOverLabels: [
            marketShareListingStatuses['New']
        ],
        keyField: marketShareColumns.newListingUnits.id,
        settings: settingsNewListing
    },
    total$Volume: {
        id: 'total$Volume',
        label: t.total$Volume,
        dataPointGroups: [
            dataPoints.SOLD_LIST_SIDE_VOLUME,
            dataPoints.SOLD_SELL_SIDE_VOLUME
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.volume,
        popOverDataFormatter: popOverDataFormatters.volume,
        popOverLabels: [
            marketShareListingStatuses['SoldListSide'],
            marketShareListingStatuses['SoldSellSide'],
        ],
        keyField: marketShareColumns.totalVolume.id,
        settings: settingsTotalVolumeUnits
    },
    totalNumUnits: {
        id: 'totalNumUnits',
        label: t.totalNumUnits,
        dataPointGroups: [
            dataPoints.SOLD_LIST_SIDE_UNITS,
            dataPoints.SOLD_SELL_SIDE_UNITS
        ],
        keyField: marketShareColumns.totalUnits.id,
        xAxisLabelFormatter: xAxisLabelFormatters.units,
        popOverDataFormatter: popOverDataFormatters.units,
        popOverLabels: [
            marketShareListingStatuses['SoldListSide'],
            marketShareListingStatuses['SoldSellSide'],
        ],
        settings: settingsTotalVolumeUnits
    },
    forSale$Volume: {
        id: 'forSale$Volume',
        label: t.forSale$Volume,
        dataPointGroups: [
            dataPoints.FOR_SALE_VOLUME
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.volume,
        popOverDataFormatter: popOverDataFormatters.volume,
        popOverLabels: [
            marketShareListingStatuses['ForSale'],
        ],
        keyField: marketShareColumns.forSaleVolume.id,
        settings: settingsForSale
    },
    forSaleNumUnits: {
        id: 'forSaleNumUnits',
        label: t.forSaleNumUnits,
        dataPointGroups: [
            dataPoints.FOR_SALE_UNITS
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.units,
        popOverDataFormatter: popOverDataFormatters.roundedUnits,
        popOverLabels: [
            marketShareListingStatuses['ForSale'],
        ],
        keyField: marketShareColumns.forSaleUnits.id,
        settings: settingsForSale
    },
    listSide$Volume: {
        id: 'listSide$Volume',
        label: t.listSide$Volume,
        dataPointGroups: [
            dataPoints.SOLD_LIST_SIDE_VOLUME
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.volume,
        popOverDataFormatter: popOverDataFormatters.volume,
        popOverLabels: [
            marketShareListingStatuses['SoldListSide'],
        ],
        keyField: marketShareColumns.listVolume.id,
        settings: {
            [listingTypes.byOffice.id]: {
                showHideOptions: {
                    options: listingTypes.byOffice.defaultShowHideOptions,
                    columns: [
                        { ...cols.address, isDefault: false, groupId: gridGroups.ADDRESS },
                        { ...cols.marketSharePct, isDefault: true },
                        { ...cols.avgListDom, isDefault: true },
                        { ...cols.listAvgPrice, isDefault: true },
                        { ...cols.listSpop, isDefault: true },
                        { ...cols.prodAgentListUnits, isDefault: true },
                        { ...cols.prodAgentListVolume, isDefault: true },
                        { ...cols.clr, isDefault: true },
                        { ...cols.prodAgentSearchCount, isDefault: true }
                    ]
                },
                columns: settingsColumnsOfficeListSide
            },
            [listingTypes.byBrokerage.id]: settingsListSideVolumeByBrokerage,
            [listingTypes.comparisonSet.id]: {
                ...settingsListSideVolumeByBrokerage,
                showHideOptions: {
                    ...settingsListSideVolumeByBrokerage.showHideOptions,
                    options: listingTypes.comparisonSet.defaultShowHideOptions,
                },
                columns: getComparisonSetColumns(settingsListSideVolumeByBrokerage.columns)
            }
        }
    },
    listSideNumUnits: {
        id: 'listSideNumUnits',
        label: t.listSideNumUnits,
        dataPointGroups: [
            dataPoints.SOLD_LIST_SIDE_UNITS
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.units,
        popOverDataFormatter: popOverDataFormatters.units,
        popOverLabels: [
            marketShareListingStatuses['SoldListSide'],
        ],
        keyField: marketShareColumns.listUnits.id,
        settings: {
            [listingTypes.byOffice.id]: {
                showHideOptions: {
                    options: listingTypes.byOffice.defaultShowHideOptions,
                    columns: [
                        { ...cols.address, isDefault: false, groupId: gridGroups.ADDRESS },
                        { ...cols.marketSharePct, isDefault: true },
                        { ...cols.avgListDom, isDefault: true },
                        { ...cols.listAvgPrice, isDefault: true },
                        { ...cols.listSpop, isDefault: true },
                        { ...cols.prodAgentListUnits, label: t.unitsPerProducingAgent, isDefault: true },
                        { ...cols.prodAgentListVolume, label: t.volumePerProducingAgent, isDefault: true },
                        { ...cols.clr, isDefault: true },
                        { ...cols.prodAgentSearchCount, isDefault: true }
                    ]
                },
                columns: settingsColumnsOfficeListSide
            },
            [listingTypes.byBrokerage.id]: settingsListSideUnitsByBrokerage,
            [listingTypes.comparisonSet.id]: {
                ...settingsListSideUnitsByBrokerage,
                showHideOptions: {
                    ...settingsListSideUnitsByBrokerage.showHideOptions,
                    options: listingTypes.comparisonSet.defaultShowHideOptions,
                },
                columns: getComparisonSetColumns(settingsListSideUnitsByBrokerage.columns)
            },
        }
    },

    underContract$Volume: {
        id: 'underContract$Volume',
        label: t.underContract$Volume,
        dataPointGroups: [
            dataPoints.UNDER_CONTRACT_VOLUME
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.volume,
        popOverDataFormatter: popOverDataFormatters.volume,
        popOverLabels: [
            marketShareListingStatuses['UnderContract']
        ],
        keyField: marketShareColumns.underContractVolume.id,
        settings: settingsUnderContract
    },
    underContractNumUnits: {
        id: 'underContractNumUnits',
        label: t.underContractNumUnits,
        dataPointGroups: [
            dataPoints.UNDER_CONTRACT_UNITS
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.units,
        popOverDataFormatter: popOverDataFormatters.units,
        popOverLabels: [
            marketShareListingStatuses['UnderContract'],
        ],
        keyField: marketShareColumns.underContractUnits.id,
        settings: settingsUnderContract
    },
    sellSide$Volume: {
        id: 'sellSide$Volume',
        label: t.sellSide$Volume,
        dataPointGroups: [
            dataPoints.SOLD_SELL_SIDE_VOLUME
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.volume,
        popOverDataFormatter: popOverDataFormatters.volume,
        popOverLabels: [
            marketShareListingStatuses['SoldSellSide'],
        ],
        keyField: marketShareColumns.sellVolume.id,
        settings: settingsSellSide
    },
    sellSideNumUnits: {
        id: 'sellSideNumUnits',
        label: t.sellSideNumUnits,
        dataPointGroups: [
            dataPoints.SOLD_SELL_SIDE_UNITS
        ],
        xAxisLabelFormatter: xAxisLabelFormatters.units,
        popOverDataFormatter: popOverDataFormatters.units,
        popOverLabels: [
            marketShareListingStatuses['SoldSellSide'],
        ],
        keyField: marketShareColumns.sellUnits.id,
        settings: settingsSellSide
    }
});

export const getCurrentListingView = (listingViewId, views) => {
    return views.find(v => v.id === listingViewId) || views.find(v => v.keyField === listingViewId) ||
        views.find(v => v.isDefault);
};
