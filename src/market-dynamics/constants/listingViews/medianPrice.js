import { terms as t, getYAxisTitle, measureTypes } from '../index';
import { listingStatuses as ls } from '../listingStatuses';
import { formatVolume, getCompactDollars } from '../../../agent-production/helpers/dataFormatters';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';
import { popOverDataFormatters } from '../../../agent-production/helpers/dataFormatters';

export const medianPrice = {
    label: t.medianPrice,
    value: 'medianPrice',
    statusOptions: {
        groups: [{
            options: [
                { ...ls.newListings, keyField: 'newMedianVolume' },
                { ...ls.forSale, keyField:'forSaleMedianVolume'},
                { ...ls.underContract, keyField: 'ucMedianVolume' },
                { ...ls.sold, isDefault: true, keyField: 'soldMedianVolume' },
                { ...ls.expired, keyField: 'expMedianVolume' }
            ]
        }]
    },
    tableSettings: {
        id: 'medianPrice',
        showPagination: false,
        defaultSort: {
            colId: mdCols.timePeriodStart.id,
            sortDir: 'desc'
        },
        tables: [
            { col: mdCols.timePeriodStart, colDef: colSettings.quarterNumYearFormat },
            { col: mdCols.newMedianVolume, colDef: colSettings.numberSmVolume, statusId: ls.newListings.id },
            { col: mdCols.newUnits, colDef: colSettings.numberSmInteger, statusId: ls.newListings.id, measureType: measureTypes.units },
            { col: mdCols.forSaleMedianVolume, colDef: colSettings.numberSmVolume, statusId: ls.forSale.id },
            { col: mdCols.forSaleUnits, colDef: colSettings.numberSmInteger, statusId: ls.forSale.id, measureType: measureTypes.units },
            { col: mdCols.ucMedianVolume, colDef: colSettings.numberSmVolume, statusId: ls.underContract.id },
            { col: mdCols.ucUnits, colDef: colSettings.numberSmInteger, statusId: ls.underContract.id, measureType: measureTypes.units },
            { col: mdCols.soldMedianVolume, colDef: colSettings.numberSmVolume, statusId: ls.sold.id },
            { col: mdCols.soldUnits, colDef: colSettings.numberSmInteger, statusId: ls.sold.id, measureType: measureTypes.units },
            { col: mdCols.expMedianVolume, colDef: colSettings.numberSmVolume, statusId: ls.expired.id },
            { col: mdCols.expUnits, colDef: colSettings.numberSmInteger, statusId:ls.expired.id, measureType: measureTypes.units }
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
