import { terms as t, getYAxisTitle } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatInteger, popOverDataFormatters } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

export const avgDomCdom = {
    label: t.avgDomCdom,
    value: 'avgDomCdom',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.averageDom, isDefault: true, keyField: 'ucAvgDom' },
                { ...ls.averageCdom, isDefault: true, keyField: 'ucAvgCdom' }
            ]
        }]
    },
    tableSettings: {
        id: 'avgDomCdom',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart, colDef: colSettings.quarterNumYearFormat },
            { col: mdCols.ucUnits, colDef: colSettings.numberSmInteger },
            { col: mdCols.avgDom, colDef: colSettings.numberSmInteger, statusId: ls.averageDom.id },
            { col: mdCols.avgCdom, colDef: colSettings.numberSmInteger, statusId: ls.averageCdom.id }
        ]
    },
    chart: {
        yAxis: { 
            title: getYAxisTitle(t.days), 
            labels: { formatter: formatInteger }
        },
        popOverDataFormatter: popOverDataFormatters.units
    },
    keyInformation: {
        formatter: formatInteger,
        changeColumnHeaderName: t.daysChange,
        headerTooltipUnitType: t.dom
    }
};
