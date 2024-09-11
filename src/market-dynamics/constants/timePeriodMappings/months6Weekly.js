import { listingViews as lv } from '../listingViews';
import { listingStatuses as ls } from '../listingStatuses';
import { terms as t } from '../index';
import { gridColumnDefinitions as cols } from '../gridColumns';
import { getWeeklyCategories } from '../../helpers/chart';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { shortDateFormat } from '../../../agent-production/helpers/dataFormatters';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

const generalConfig = {
    chart: {
        xaxis: {
            categories: getWeeklyCategories
        }
    },
    columnSettings: {
        label: t.weekOf,
        keyField: mdCols.timePeriodStart.id,
        valueFormatter: v => shortDateFormat(v.value),
        ...colSettings.textSm
    },
    periodSelection: false,
    keyInfo: {
        beginVsEndMonth: [
            cols.status,
            cols.previousWeeksAvg,
            cols.lastWeeksAvg,
            cols.changeAvg,
            cols.changeAvgPercentage
        ],
    }
};

export const months6Weekly = [
    {
        group: t.price,
        ...generalConfig,
        options: [
            {
                ...lv.medianPrice,
                isDefault: true,
            }
        ]
    },
    {
        group: t.supplyAmpDemand,
        ...generalConfig,
        options: [
            {
                ...lv.supplyAmpDemandNumUnits,
                statusOptions: {
                    groups: [{
                        options: lv.supplyAmpDemandNumUnits.statusOptions.groups[0].options.map(
                            (status) => {
                                if (status.id === ls.forSale.id || status.id === ls.underContract.id) {
                                    return { ...status, isDefault: false };
                                }
                                return status;
                            }
                        )
                    }]
                },
                tableSettings: {
                    ...lv.supplyAmpDemandNumUnits.tableSettings,
                    tables: [
                        { ...lv.supplyAmpDemandNumUnits.tableSettings.tables[0] },
                        { col: mdCols.newUnits, colDef: colSettings.numberSmInteger, statusId: ls.newListings.id },
                        { col: mdCols.forSaleUnits, colDef: colSettings.numberSmInteger, statusId: ls.forSale.id },
                        { col: mdCols.ucUnits, colDef: colSettings.numberSmInteger, statusId: ls.underContract.id },
                        { col: mdCols.soldUnits, colDef: colSettings.numberSmInteger, statusId: ls.sold.id },
                        { col: mdCols.expUnits, colDef: colSettings.numberSmInteger, statusId:ls.expired.id }
                    ]
                }
            }
        ]
    },
    {
        group: t.salesRate,
        ...generalConfig,
        options: [
            {
                ...lv.underContractUc
            },
            lv.salesAbsorption
        ]
    }
];
