import { listingViews as lv } from '../listingViews';
import { terms as t } from '../index';
import { gridColumnDefinitions as cols } from '../gridColumns';
import { getMonthlyCategories } from '../../helpers/chart';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { shortMonthAndYearFormat } from '../../../agent-production/helpers/dataFormatters';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

const generalConfig = {
    chart:{
        xaxis: {
            categories: getMonthlyCategories
        }
    },
    columnSettings: {
        label: t.month,
        keyField: mdCols.timePeriodStart.id,
        valueFormatter: v => shortMonthAndYearFormat(v.value),
        ...colSettings.textSm
    },
    periodSelection: true,
    keyInfo: {
        beginVsEndMonth: [
            cols.status, 
            cols.beginPeriod,
            cols.endPeriod, 
            cols.changeValue, 
            cols.changeValuePercentage 
        ],
        wholeTimePeriod: [
            cols.status,
            cols.periodChange,
            cols.periodPercentChange,
            cols.totalChange,
            cols.totalPercentChange
        ]
    }
};

export const years1Monthly = [
    {
        group: t.price,
        ...generalConfig,
        options: [
            { ...lv.medianPrice, isDefault: true },
            lv.soldAvgVsMedianPrice,
            lv.avgSpOpComparison,
            lv.avgSpLpComparison,
            lv.avgSpOpAllProperties,
            lv.avg$Sqft
        ]
    },
    {
        group: t.supplyAmpDemand,
        ...generalConfig,
        options: [
            lv.supplyAmpDemandNumUnits,
            lv.forSaleVsFsldm
        ]
    },
    {
        group: t.salesRate,
        ...generalConfig,
        options: [
            lv.monthlySupplyOfInventory,
            lv.avgDomCdom,
            lv.salesAbsorption,
            lv.cdomBreakout
        ]
    },
];
