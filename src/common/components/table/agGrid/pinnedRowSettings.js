import { agentsColumns } from "../../../../agent-production/constants/agentProductionConstants";
import { views } from "../../../../agent-production/constants/savedAgents";
import { listingViews as lv } from "../../../../market-dynamics/constants/listingViews";
import { marketDynamicsColumns as mdCols } from "../../../../market-dynamics/constants/marketDynamicsColumns";
import { getBreakdownPinnedRowColumns, getPinnedRowTitle } from "../../../../market-dynamics/helpers/helpers";

export const pinnedColIds = {
    [views.overview]: [
        agentsColumns.listVolume.id,
        agentsColumns.sellVolume.id,
        agentsColumns.totalVolume.id,
        agentsColumns.listUnits.id,
        agentsColumns.sellUnits.id,
        agentsColumns.totalUnits.id,
        agentsColumns.last12AvgDom.id,
        agentsColumns.last12ListVolume.id,
        agentsColumns.last12SellVolume.id,
        agentsColumns.last12TotalVolume.id,
        agentsColumns.last12ListUnits.id,
        agentsColumns.last12SellUnits.id,
        agentsColumns.last12TotalUnits.id
    ],
    [views.listingProficiency]: [
        agentsColumns.last12SellUnits.id,
        agentsColumns.last12SellVolume.id,
        agentsColumns.last12ListUnits.id,
        agentsColumns.last12ListVolume.id,
        agentsColumns.noPcLast12ListUnits.id,
        agentsColumns.noPcLast12ListUnitsPct.id,
        agentsColumns.noPcLast12ListVolume.id,
        agentsColumns.noPcLast12ListVolumePct.id,
        agentsColumns.noPcLast12ListDom.id,
        agentsColumns.noPcLast12ListCdom.id,
        agentsColumns.noPcLast12SpOp.id,
        agentsColumns.pcLast12ListUnits.id,
        agentsColumns.pcLast12ListUnitsPct.id,
        agentsColumns.pcLast12ListVolume.id,
        agentsColumns.pcLast12ListVolumePct.id,
        agentsColumns.pcLast12ListDom.id,
        agentsColumns.pcLast12ListCdom.id,
        agentsColumns.pcLast12ListPcDom.id,
        agentsColumns.pcLast12ListSpOp.id,
        agentsColumns.pcLast12ListSpLp.id,
        agentsColumns.pcLast12ListAvgNumPc.id,
    ],
    [lv.medianPrice.value]: getBreakdownPinnedRowColumns(lv.medianPrice.tableSettings.tables),
    [lv.soldAvgVsMedianPrice.value]: [
        agentsColumns.officeName.id,
        mdCols.soldUnits.id,
        mdCols.soldMedianVolume.id,
        mdCols.soldAvgVolume.id,
        mdCols.soldChangeVolume.id,
        mdCols.soldGrowthVolumePct.id,
        mdCols.soldAvgDom.id
    ],
    [lv.avg$Sqft.value]: [
        agentsColumns.officeName.id,
        mdCols.newUnits.id,
        mdCols.newAvgVolume.id,
        mdCols.newAvgSqft.id,
        mdCols.newAvgPricePerSqft.id,
        mdCols.forSaleUnits.id,
        mdCols.forSaleAvgVolume.id,
        mdCols.forSaleAvgSqft.id,
        mdCols.forSaleAvgPricePerSqft.id,
        mdCols.ucUnits.id,
        mdCols.ucAvgVolume.id,
        mdCols.ucAvgSqft.id,
        mdCols.ucAvgPricePerSqft.id,
        mdCols.soldUnits.id,
        mdCols.soldAvgVolume.id,
        mdCols.soldAvgSqft.id,
        mdCols.soldAvgPricePerSqft.id,
        mdCols.expUnits.id,
        mdCols.expAvgVolume.id,
        mdCols.expAvgSqft.id,
        mdCols.expAvgPricePerSqft.id
    ],
    [lv.avgSpOpComparison.value]: getBreakdownPinnedRowColumns(lv.avgSpOpComparison.tableSettings.tables),
    [lv.avgSpLpComparison.value]: getBreakdownPinnedRowColumns(lv.avgSpLpComparison.tableSettings.tables),
    [lv.avgSpOpAllProperties.value]: getBreakdownPinnedRowColumns(lv.avgSpOpAllProperties.tableSettings.tables),
    [lv.salesAbsorption.value]: getBreakdownPinnedRowColumns(lv.salesAbsorption.tableSettings.tables),
};

export const getSummaryPinnedData = (summaryData, view) => {
    if (!summaryData || !pinnedColIds[view]) return [];

    const overrideKey = Object.entries(getPinnedRowTitle(view)).flat()[0];
    let revisedSummaryData;
    revisedSummaryData = !summaryData[overrideKey]
        ? { ...summaryData, [overrideKey]: getPinnedRowTitle(view) }
        : summaryData;

    const result = Object.entries(revisedSummaryData)
        .filter(obj => pinnedColIds[view].includes(obj[0]))
        .reduce((obj, [key, value]) => {
            const cellToOverrideMatch = !!getPinnedRowTitle(view)[key];
            obj[key] = cellToOverrideMatch ? getPinnedRowTitle(view)[key] : value;
            return obj;
        }, {});
    return result;
};

export const getSummaryPinnedConfig = (view) => {
    if (!pinnedColIds[view]) return null;
    return {
        cellsToShow: pinnedColIds[view],
        cellsToOverride: getPinnedRowTitle(view)
    };
};
