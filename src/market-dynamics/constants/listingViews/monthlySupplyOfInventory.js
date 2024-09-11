import { terms as t, getYAxisTitle } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { marketDynamicsStatusTooltips as statusTips } from '../tooltipDefinitions';
import { getDecimalNumber, popOverDataFormatters } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const monthlySupplyOfInventory = {
    label: t.monthlySupplyOfInventory,
    value: 'monthlySupplyOfInventory',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.underContractMsi, keyField: 'ucMsi', isDefault: true, tooltip: statusTips.underContractMsi },
                { ...ls.msiSold, keyField: 'soldMsi', tooltip: statusTips.msiSold }
            ]
        }]
    },
    tableSettings: {
        id: 'monthlySupplyOfInventory',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart, colDef: colSettings.quarterNumYearFormat },
            { col: mdCols.ucMsi, colDef: colSettings.numberSmUnits, statusId: ls.underContractMsi.id },
            { col: mdCols.soldMsi, colDef: colSettings.numberSmUnits, statusId: ls.msiSold.id },
            { col: mdCols.forSaleLastDayUnits, colDef: colSettings.numberSmInteger },
            { col: mdCols.ucUnits, colDef: colSettings.numberSmInteger, statusId: ls.underContractMsi.id },
            { col: mdCols.soldUnits, colDef: colSettings.numberSmInteger, statusId: ls.msiSold.id },
        ]
    },
    chart: {
        yAxis: {
            title: getYAxisTitle(t.months),
            labels: { formatter: getDecimalNumber }
        },
        popOverDataFormatter: popOverDataFormatters.units
    },
    keyInformation: {
        formatter: getDecimalNumber,
        changeColumnHeaderName: t.msiChange,
        headerTooltipUnitType: t.msi
    }
};
