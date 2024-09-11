import { listingStatuses as ls } from '../listingStatuses';
import { terms as t, getYAxisTitle, measureTypes } from '../index';
import { formatOneDecimalPercentageWithMultiplier } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const avgSpOpAllProperties = {
    label: t.avgSpOpAllProperties,
    value: 'avgSpOpAllProperties',
    statusOptions: {
        groups: [
            {
                options: [
                    { ...ls.spOp, isDefault: true, keyField: 'spOpRatioAllProperties' }
                ]
            }
        ]
    },
    tableSettings: {
        id: 'avgSpOpAllProperties',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart },
            { col: mdCols.soldUnits, colDef: colSettings.numberSmInteger, measureType: measureTypes.units },
            { col: mdCols.avgSpOp, colDef: colSettings.numberLgPercentageOneDecimal },
            { col: mdCols.soldAvgDom, colDef: colSettings.numberSmInteger }
        ]
    },
    chart: {
        yAxis: {
            title: getYAxisTitle(t.percentage),
            labels: { formatter: formatOneDecimalPercentageWithMultiplier }
        }
    },
    keyInformation: {
        formatter: formatOneDecimalPercentageWithMultiplier,
        changeColumnHeaderName: t.change
    }
};
