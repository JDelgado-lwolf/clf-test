import { measureTypes, terms as t } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { formatVolume, getCompactDollars } from '../../../agent-production/helpers/dataFormatters';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';
import { getYAxisTitle } from '../index';
import { popOverDataFormatters } from '../../../agent-production/helpers/dataFormatters';

export const avg$Sqft = {
    label: t.avgPriceSqft,
    value: 'avgPriceSqft',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.newListings, keyField: 'newAvgPricePerSqft', keyInfoLabel: t.avgPriceSqftLabel(ls.newListings.label) },
                { ...ls.forSale, keyField: 'forSaleAvgPricePerSqft', keyInfoLabel: t.avgPriceSqftLabel(ls.forSale.label) },
                { ...ls.underContract, keyField: 'ucAvgPricePerSqft', keyInfoLabel: t.avgPriceSqftLabel(ls.underContract.label) },
                { ...ls.sold, keyField: 'soldAvgPricePerSqft', keyInfoLabel: t.avgPriceSqftLabel(ls.sold.label), isDefault: true },
                { ...ls.expired, keyField: 'expAvgPricePerSqft', keyInfoLabel: t.avgPriceSqftLabel(ls.expired.label) }
            ]
        }]
    },
    tableSettings: {
        id: 'avgPriceSqft',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart },
            { col: mdCols.newUnits, colDef: colSettings.numberMdInteger, statusId: ls.newListings.id, measureType: measureTypes.units },
            { col: mdCols.newAvgVolume, colDef: colSettings.numberSmVolume, statusId: ls.newListings.id },
            { col: mdCols.newAvgSqft, colDef: colSettings.numberMdInteger, statusId: ls.newListings.id },
            { col: mdCols.newAvgPricePerSqft, colDef: colSettings.numberSmVolume, statusId: ls.newListings.id },
            { col: mdCols.forSaleUnits, colDef: colSettings.numberSmInteger, statusId: ls.forSale.id, measureType: measureTypes.units },
            { col: mdCols.forSaleAvgVolume, colDef: colSettings.numberMdVolume, statusId: ls.forSale.id },
            { col: mdCols.forSaleAvgSqft, colDef: colSettings.numberLgInteger, statusId: ls.forSale.id },
            { col: mdCols.forSaleAvgPricePerSqft, colDef: colSettings.numberMdVolume, statusId: ls.forSale.id },
            { col: mdCols.ucUnits, colDef: colSettings.numberLgInteger, statusId: ls.underContract.id, measureType: measureTypes.units },
            { col: mdCols.ucAvgVolume, colDef: { ...colSettings.numberMdVolume, minWidth: 250 } , statusId: ls.underContract.id },
            { col: mdCols.ucAvgSqft, colDef: {...colSettings.numberLgInteger , minWidth: 270 } , statusId: ls.underContract.id },
            { col: mdCols.ucAvgPricePerSqft, colDef: {...colSettings.numberMdVolume, minWidth: 250 } , statusId: ls.underContract.id },
            { col: mdCols.soldUnits, colDef: colSettings.numberSmInteger, statusId: ls.sold.id, measureType: measureTypes.units },
            { col: mdCols.soldAvgVolume, colDef: colSettings.numberSmVolume, statusId: ls.sold.id },
            { col: mdCols.soldAvgSqft, colDef: colSettings.numberMdInteger, statusId: ls.sold.id },
            { col: mdCols.soldAvgPricePerSqft, colDef: colSettings.numberSmVolume, statusId: ls.sold.id },
            { col: mdCols.expUnits, colDef: colSettings.numberSmInteger, statusId: ls.expired.id, measureType: measureTypes.units },
            { col: mdCols.expAvgVolume, colDef: colSettings.numberMdVolume, statusId: ls.expired.id },
            { col: mdCols.expAvgSqft, colDef: colSettings.numberLgInteger, statusId: ls.expired.id },
            { col: mdCols.expAvgPricePerSqft, colDef: colSettings.numberMdVolume, statusId: ls.expired.id },
        ]
    },
    chart: {
        yAxis: {
            title: getYAxisTitle(t.pricePerSqft),
            labels: { formatter: getCompactDollars }
        },
        popOverDataFormatter: popOverDataFormatters.volume
    },
    keyInformation: {
        formatter: formatVolume,
        changeColumnHeaderName: t.change$
    }
};
