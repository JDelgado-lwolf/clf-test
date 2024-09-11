import React from 'react';
import { terms as t } from '../index';
import { medianPrice } from './medianPrice';
import { soldAvgVsMedianPrice } from './soldAvgVsMedianPrice';
import { avg$Sqft } from './averageDollarSqft';
import { supplyAmpDemandNumUnits } from './supplyAmpDemandNumUnits';
import { avgDomCdom } from './averageDomCdom';
import { monthlySupplyOfInventory } from './monthlySupplyOfInventory';
import { underContractUc } from './underContract'
import { avgSpLpComparison } from './avgSpLpComparison';
import { salesAbsorption } from './salesAbsorption';
import { avgSpOpAllProperties } from './avgSpOpAllProperties';
import { avgSpOpComparison } from './avgSpOpComparison';
import { forSaleVsFsldm } from './forSaleVsFsldm';
import { cdomBreakout } from './cdomBreakout';
import MarketDynamicsPeriod from '../../../common/components/table/cellRenderers/MarketDynamicsPeriod';

export const cleanListingViews = Object.freeze({
    avg$Sqft,
    avgDomCdom,
    avgSpLpComparison,
    avgSpOpComparison,
    avgSpOpAllComparison: { label: t.avgSpOpAllComparison, value: 'avgSpOpAllComparison' },
    avgSpOpAllProperties,
    cdomBreakout,
    forSaleVsFsldm,
    medianPrice,
    monthlySupplyOfInventory,
    overview: { label: t.overview, value: 'overview' },
    salesAbsorption,
    soldAvgVsMedianPrice,
    supplyAmpDemandNumUnits,
    underContractUc
});

export const listingViews = Object.fromEntries(
    Object.entries(cleanListingViews).map(([key, value]) => {
        const tablesWithCellRenderer = value.tableSettings?.tables.map(table =>
            table.col?.id === 'timePeriodStart'
                ? ({
                    ...table,
                    cellRenderer: (props) => <MarketDynamicsPeriod {...props} />
                }) : table);
        return [
            key,
            key !==  cdomBreakout.value
                ? {
                    ...value,
                    tableSettings: {
                        ...value.tableSettings,
                        tables: tablesWithCellRenderer,
                    }
                } : value
        ];
    })
);
