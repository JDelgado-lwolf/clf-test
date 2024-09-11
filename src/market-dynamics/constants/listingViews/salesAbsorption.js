import { terms as t, getYAxisTitle, measureTypes } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatPercentage } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const salesAbsorption = {
    label: t.salesAbsorption, 
    value: 'salesAbsorption',
    statusOptions: {
        groups: [
            {
                options: [
                    { ...ls.underContract, label: t.ucPercentage, isDefault: true, keyField: 'ucToForSaleUnitsPct' },
                    { ...ls.sold, label: t.soldPercentage, isDefault: true, keyField: 'soldToForSaleUnitsPct' }
                ]
            }
        ]
    },
    tableSettings: {
        id: 'salesAbsorption',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart },
            { col: mdCols.ucToForSaleUnitsPct, colDef: colSettings.blankEmptyNumberSmPercentage, statusId: ls.underContract.id },
            { col: mdCols.soldToForSaleUnitsPct, colDef: colSettings.blankEmptyNumberSmPercentage, statusId: ls.sold.id },
            { col: mdCols.forSaleUnits, colDef: colSettings.numberMdInteger, measureType: measureTypes.units },
            { col: mdCols.ucUnits, colDef: colSettings.numberMdInteger, statusId: ls.underContract.id, measureType: measureTypes.units },
            { col: mdCols.soldUnits, colDef: colSettings.numberMdInteger, statusId: ls.sold.id, measureType: measureTypes.units },
        ]
    },
    chart: {
        yAxis: {
            title: getYAxisTitle(t.percentage),
            labels: { formatter: formatPercentage }
        }
    },
    keyInformation: {
        formatter: formatPercentage,
        changeColumnHeaderName: t.change
    }
};
