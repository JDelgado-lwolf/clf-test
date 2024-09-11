import { colSettings } from "../../common/components/table/agGrid/colSettings";
import { soldAvgVsMedianPrice } from "./listingViews/soldAvgVsMedianPrice";
import { marketDynamicsColumns as mdCols } from "./marketDynamicsColumns";

export const officeBreakdownColsByListing = {
    [soldAvgVsMedianPrice.tableSettings.id]: [
        { col: mdCols.timePeriodStart, colDef: colSettings.quarterNumYearFormat },
        { col: mdCols.soldUnits, colDef: colSettings.numberSmInteger, measureType: 'units' },
        { col: mdCols.soldMedianVolume, colDef: colSettings.numberSmVolume },
        { col: mdCols.soldAvgVolume, colDef: colSettings.numberSmVolume },
        { col: mdCols.soldChangeVolume, colDef: colSettings.numberSmVolume },
        { col: mdCols.soldGrowthVolumePct, colDef: colSettings.numberSmPercentage },
        { col: mdCols.soldAvgDom, colDef: colSettings.numberSmInteger }
    ]
};
