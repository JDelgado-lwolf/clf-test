import { listingViews as lv } from '../listingViews';
import { terms as t } from '../index';
import { gridColumnDefinitions as cols } from '../gridColumns';
import { getQuarterlyCategories } from '../../helpers/chart';
import { marketDynamicsColumns as mdCols } from '../marketDynamicsColumns';
import { quarterNumYearFormat } from '../../../agent-production/helpers/dataFormatters';
import { colSettings } from '../../../common/components/table/agGrid/colSettings';

const generalConfig = {
    chart: {
        xaxis: {
            categories: getQuarterlyCategories
        }
    },
    columnSettings: {
        label: t.quarter,
        keyField: mdCols.timePeriodStart.id,
        valueFormatter: v => quarterNumYearFormat(v.value),
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

export const years3Quarterly = [
    {
        group: t.price,
        ...generalConfig,
        options: [
            {
                ...lv.medianPrice,
                isDefault: true,
                radioButtons: [ 'beginVsEndMonth', 'wholeTimePeriod' ]
            },
            {
                ...lv.soldAvgVsMedianPrice
            },
            lv.avgSpOpComparison,
            lv.avgSpLpComparison,
            lv.avgSpOpAllProperties,
            lv.avg$Sqft
        ],
    },
    {
        group: t.supplyAmpDemand,
        ...generalConfig,
        options: [
            lv.supplyAmpDemandNumUnits
        ]
    },
    {
        group: t.salesRate,
        ...generalConfig,
        options: [
            lv.avgDomCdom,
            lv.salesAbsorption
        ]
    },
];
