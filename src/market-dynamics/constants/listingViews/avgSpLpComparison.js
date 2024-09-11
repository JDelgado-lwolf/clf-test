import { terms as t, getYAxisTitle, measureTypes } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatOneDecimalPercentageWithMultiplier } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const avgSpLpComparison = {
    label: t.avgSpLpComparison,
    value: 'avgSpLpComparison',
    statusOptions: {
        groups: [
            {
                options: [
                    { ...ls.spLpNoPriceChanges, isDefault: true, keyField: 'spLpRatioWithoutPriceChanges' },
                    { ...ls.spLpPriceChanges, isDefault: true, keyField: 'spLpRatioWithPriceChanges' }
                ]
            }
        ]
    },
    tableSettings: {
        id: 'avgSpLpComparison',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart },
            { col: mdCols.soldUnitsWithoutPriceChanges, colDef: colSettings.numberMdInteger, statusId: ls.spLpNoPriceChanges.id, measureType: measureTypes.units },
            { col: mdCols.spLpRatioWithoutPriceChanges, colDef: colSettings.numberLgPercentageOneDecimal, statusId: ls.spLpNoPriceChanges.id },
            { col: mdCols.soldAvgDomWithoutPriceChanges, colDef: colSettings.numberMdInteger, statusId: ls.spLpNoPriceChanges.id },
            { col: mdCols.soldUnitsWithPriceChanges, colDef: colSettings.numberMdInteger, statusId: ls.spLpPriceChanges.id, measureType: measureTypes.units },
            { col: mdCols.spLpRatioWithPriceChanges, colDef: colSettings.numberLgPercentageOneDecimal, statusId: ls.spLpPriceChanges.id },
            { col: mdCols.soldAvgDomWithPriceChanges, colDef: colSettings.numberMdInteger, statusId: ls.spLpPriceChanges.id }
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
