import { terms as t, getYAxisTitle } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatVolume, getCompactDollars } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';
import { popOverDataFormatters } from '../../../agent-production/helpers/dataFormatters';

export const soldAvgVsMedianPrice = {
    label: t.soldAvgVsMedianPrice,
    value: 'soldAvgVsMedianPrice',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.averagePrice, isDefault: true, keyField: 'soldAvgVolume' },
                { ...ls.medianPrice, isDefault: true, keyField: 'soldMedianVolume' }
            ]
        }]
    },
    tableSettings: {
        id: 'soldAvgVsMedianPrice',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart, colDef: colSettings.quarterNumYearFormat },
            { col: mdCols.soldChangeVolume, colDef: colSettings.numberSmVolume },
            { col: mdCols.soldAvgVolume, colDef: colSettings.numberSmVolume },
            { col: mdCols.soldGrowthVolumePct, colDef: colSettings.numberSmPercentage },
            { col: mdCols.soldAvgDom, colDef: colSettings.numberSmInteger }
        ]
    },
    chart: {
        yAxis: { 
            title: getYAxisTitle(t.yAxisDollarChartTitle), 
            labels: { formatter: getCompactDollars }
        },
        popOverDataFormatter: popOverDataFormatters.volume
    },
    keyInformation: {
        formatter: formatVolume,
        changeColumnHeaderName: t.change$
    }
};
