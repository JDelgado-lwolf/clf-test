import { terms as t, getYAxisTitle } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatInteger } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const cdomBreakout = {
    label: t.cdomBreakout,
    value: 'cdomBreakout',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.forSaleLdm, label: t.fsldm, isDefault: true, isRadio: true, keyField: 'forSaleLastDayUnits' },
                { ...ls.underContract, isRadio: true, keyField: 'ucUnits' },
                { ...ls.sold, isRadio: true, keyField: 'soldUnits' },
                { ...ls.units0To90, isDefault: true, keyFieldComplement: '0to90' },
                { ...ls.units91To180, isDefault: true, keyFieldComplement: '91to180' },
                { ...ls.unitsOver180, isDefault: true, keyFieldComplement: 'Over180' },
            ]
        }]
    },
    tableSettings: {
        id: 'cdomBreakout',
        showPagination: false,
        isBreakout: true,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart, colDef: colSettings.quarterNumYearFormat },
            { col: mdCols.forSaleLastDayUnits, colDef: colSettings.numberMdLgInteger, statusId: ls.forSaleLdm.id },
            { col: mdCols.forSaleLastDayUnits0to90, colDef: colSettings.numberSmInteger, statusId: ls.forSaleLdm.id + ls.units0To90.id },
            { col: mdCols.forSaleLastDayUnits0to90Pct, colDef: colSettings.numberSmPercentage, statusId: ls.forSaleLdm.id + ls.units0To90.id },
            { col: mdCols.forSaleLastDayUnits91to180, colDef: colSettings.numberSmInteger, statusId: ls.forSaleLdm.id + ls.units91To180.id },
            { col: mdCols.forSaleLastDayUnits91to180Pct, colDef: colSettings.numberSmPercentage, statusId: ls.forSaleLdm.id + ls.units91To180.id},
            { col: mdCols.forSaleLastDayUnitsOver180, colDef: colSettings.numberSmInteger, statusId: ls.forSaleLdm.id + ls.unitsOver180.id},
            { col: mdCols.forSaleLastDayUnitsOver180Pct, colDef: colSettings.numberSmPercentage, statusId: ls.forSaleLdm.id + ls.unitsOver180.id},
            { col: mdCols.ucUnits, colDef: colSettings.numberSmInteger, statusId: ls.underContract.id },
            { col: mdCols.ucUnits0to90, colDef: colSettings.numberSmInteger, statusId: ls.underContract.id + ls.units0To90.id },
            { col: mdCols.ucUnits0to90Pct, colDef: colSettings.numberSmPercentage, statusId: ls.underContract.id + ls.units0To90.id  },
            { col: mdCols.ucUnits91to180, colDef: colSettings.numberSmInteger, statusId: ls.underContract.id + ls.units91To180.id },
            { col: mdCols.ucUnits91to180Pct, colDef: colSettings.numberSmPercentage, statusId: ls.underContract.id + ls.units91To180.id },
            { col: mdCols.ucUnitsOver180, colDef: colSettings.numberSmInteger, statusId: ls.underContract.id + ls.unitsOver180.id},
            { col: mdCols.ucUnitsOver180Pct, colDef: colSettings.numberSmPercentage, statusId: ls.underContract.id + ls.unitsOver180.id},
            { col: mdCols.soldUnits, colDef: colSettings.numberSmInteger, statusId: ls.sold.id },
            { col: mdCols.soldUnits0to90, colDef: colSettings.numberSmInteger, statusId: ls.sold.id + ls.units0To90.id},
            { col: mdCols.soldUnits0to90Pct, colDef: colSettings.numberSmPercentage, statusId: ls.sold.id + ls.units0To90.id},
            { col: mdCols.soldUnits91to180, colDef: colSettings.numberSmInteger, statusId: ls.sold.id + ls.units91To180.id},
            { col: mdCols.soldUnits91to180Pct, colDef: colSettings.numberSmPercentage, statusId: ls.sold.id + ls.units91To180.id},
            { col: mdCols.soldUnitsOver180, colDef: colSettings.numberSmInteger, statusId: ls.sold.id + ls.unitsOver180.id },
            { col: mdCols.soldUnitsOver180Pct, colDef: colSettings.numberSmPercentage, statusId: ls.sold.id + ls.unitsOver180.id}
        ]
    },
    chart: {
        yAxis: {
            title: getYAxisTitle(t.units),
            labels: { formatter: formatInteger }
        },
        isStacked: true
    },
    keyInformation: {
        formatter: formatInteger,
        changeColumnHeaderName: t.unitsChangeNum
    }
};
