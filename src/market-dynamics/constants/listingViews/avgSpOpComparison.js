import { terms as t, getYAxisTitle, measureTypes } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatOneDecimalPercentageWithMultiplier } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const avgSpOpComparison = {
    label: t.avgSpOpAllComparison,
    value: 'avgSpOpComparison',
    statusOptions: {
        groups: [
            {
                options: [
                    { ...ls.spOpNoPriceChanges, isDefault: true, keyField: 'spOpRatioWithoutPriceChanges' },
                    { ...ls.spOpPriceChanges, isDefault: true, keyField: 'spOpRatioWithPriceChanges' }
                ]
            }
        ]
    },
    tableSettings: {
        id: 'avgSpOpComparison',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart },
            { col: mdCols.soldUnitsWithoutPriceChanges, colDef: colSettings.numberMdInteger, statusId: ls.spOpNoPriceChanges.id, measureType: measureTypes.units },
            { col: mdCols.spOpRatioWithoutPriceChanges, colDef: colSettings.numberLgPercentageOneDecimal, statusId: ls.spOpNoPriceChanges.id },
            { col: mdCols.soldAvgDomWithoutPriceChanges, colDef: colSettings.numberMdInteger, statusId: ls.spOpNoPriceChanges.id },
            { col: mdCols.soldUnitsWithPriceChanges, colDef: colSettings.numberMdInteger, statusId: ls.spOpPriceChanges.id, measureType: measureTypes.units },
            { col: mdCols.spOpRatioWithPriceChanges, colDef: colSettings.numberLgPercentageOneDecimal, statusId: ls.spOpPriceChanges.id },
            { col: mdCols.soldAvgDomWithPriceChanges, colDef: colSettings.numberMdInteger, statusId: ls.spOpPriceChanges.id }
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
