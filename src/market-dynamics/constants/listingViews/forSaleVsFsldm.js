import { terms as t, getYAxisTitle } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatInteger, popOverDataFormatters } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const forSaleVsFsldm = {
    label: t.forSaleVsFsldm,
    value: 'forSaleVsFsldm',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.forSale, isDefault: true, keyField: 'forSaleUnits' },
                { ...ls.forSaleLdm, isDefault: true, keyField: 'forSaleLastDayUnits' }
            ]
        }]
    },
    tableSettings: {
        id: 'forSaleVsFsldm',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart, colDef: colSettings.quarterNumYearFormat },
            { col: mdCols.forSaleUnits, colDef: colSettings.numberSmInteger },
            { col: mdCols.forSaleLastDayUnits, colDef: colSettings.numberSmInteger },
            { col: mdCols.forSaleLastDayChangeVolume, colDef: colSettings.numberSmInteger },
            { col: mdCols.forSaleLastDayPercentage, colDef: colSettings.numberSmPercentage },
        ]
    },
    chart: {
        yAxis: {
            title: getYAxisTitle(t.units),
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
