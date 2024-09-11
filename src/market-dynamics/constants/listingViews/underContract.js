import { terms as t, getYAxisTitle } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { formatInteger, popOverDataFormatters } from '../../../agent-production/helpers/dataFormatters';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const underContractUc = {
    label: t.underContractUc,
    value: 'underContractUc',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.underContractUc, isDefault: true, keyField: 'ucUnits' }
            ]
        }]
    },
    tableSettings: {
        id: 'underContractUc',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart },
            { col: mdCols.ucUnits, colDef: colSettings.numberSmInteger, statusId: ls.underContractUc.id }
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
        changeColumnHeaderName: t.unitsChangeNum
    }
};
