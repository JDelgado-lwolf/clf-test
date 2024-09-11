import { colSettings } from '../../../common/components/table/agGrid/colSettings';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { terms as t, getYAxisTitle } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatInteger, popOverDataFormatters } from '../../../agent-production/helpers/dataFormatters';

export const supplyAmpDemandNumUnits = {
    label: t.supplyAmpDemandNumUnits,
    value: 'supplyAmpDemandNumUnits',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.newListings, keyField: 'newUnits' },
                { ...ls.forSale, isDefault: true, keyField: 'forSaleUnits' },
                { ...ls.underContract, isDefault: true, keyField: 'ucUnits' },
                { ...ls.sold, isDefault: true, keyField: 'soldUnits' },
                { ...ls.expired, keyField: 'expUnits'}
            ]
        }]
    },
    tableSettings: {
        id: 'supplyAmpDemandNumUnits',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart },
            { col: mdCols.newUnits, colDef: colSettings.numberSmInteger, statusId: ls.newListings.id },
            { col: mdCols.forSaleUnits, colDef: colSettings.numberSmInteger, statusId: ls.forSale.id },
            { col: mdCols.forSaleAvgDom, colDef: colSettings.numberSmInteger, statusId: ls.forSale.id },
            { col: mdCols.ucUnits, colDef: colSettings.numberSmInteger, statusId: ls.underContract.id },
            { col: mdCols.ucAvgDom, colDef: colSettings.numberSmInteger, statusId: ls.underContract.id },
            { col: mdCols.soldUnits, colDef: colSettings.numberSmInteger, statusId: ls.sold.id },
            { col: mdCols.soldAvgDom, colDef: colSettings.numberSmInteger, statusId: ls.sold.id },
            { col: mdCols.expUnits, colDef: colSettings.numberSmInteger, statusId:ls.expired.id },
            { col: mdCols.expAvgDom, colDef: colSettings.numberSmInteger, statusId:ls.expired.id }
        ]
    },
    chart: {
        yAxis: {
            title: getYAxisTitle(t.unitsNum),
            labels: { formatter: formatInteger }
        },
        popOverDataFormatter: popOverDataFormatters.units
    },
    keyInformation: {
        formatter: formatInteger,
        changeColumnHeaderName: t.unitsChangeNum,
        headerTooltipUnitType: t.unitsNum.toLowerCase()
    }
};
