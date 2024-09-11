import { marketDynamicsColumns as mdCols } from "./marketDynamicsColumns";
import { marketDynamicsTerms as mdt } from "../../constants";
import { terms as t } from ".";
import { listingViews as lv } from "./listingViews";

const tooltipTimePeriods = {
    [mdt.years2Monthly]: t.month.toLowerCase(),
    [mdt.years1Monthly]: t.month.toLowerCase(),
    [mdt.months6Weekly]: t.week.toLowerCase(),
    [mdt.years3Quarterly]: t.quarter.toLowerCase(),
};

export const marketDynamicsTooltips = Object.freeze({
    avgCdom: { ...mdCols.avgCdom, tip: t.avgCdom },
    avgDom: { ...mdCols.avgDom, tip: t.avgDom },
    avgSpOp: { ...mdCols.avgSpOp, tip: t.avgSpOp },
    beginPeriod: {
        ...mdCols.beginPeriod,
        tip: (periodType, beginPeriod) => `Begin ${periodType} (${beginPeriod})`
    },
    changeAvg: {
        ...mdCols.changeAvg,
        tip: 'Value difference between the average for the previous 12 weeks and the average for the last 12 weeks'
    },
    changeAvgPercentage: {
        ...mdCols.changeAvgPercentage,
        tip: 'Percentage change from the previous 12-week average'
    },
    changeValue: {
        ...mdCols.changeValue,
        tip: (beginPeriod, endPeriod, periodType) => `Value difference between Begin and End ${periodType} (${beginPeriod} - ${endPeriod})`
    },
    changeValuePercentage: {
        ...mdCols.changeValuePercentage,
        tip: (periodType, beginPeriod) => `Percentage change from the Begin ${periodType} (${beginPeriod})`
    },
    endPeriod: {
        ...mdCols.endPeriod,
        tip: (periodType, endPeriod) => `End ${periodType} (${endPeriod})`
    },
    expAvgDom: { ...mdCols.expAvgDom, tip: t.expAvgDom },
    expAvgPricePerSqft: { ...mdCols.expAvgPricePerSqft, tip: t.expAvgPricePerSqft },
    expAvgSqft: { ...mdCols.expAvgSqft, tip: t.expAvgSqft },
    expAvgVolume: { ...mdCols.expAvgVolume, tip: t.expAvgVolume },
    expMedianVolume: { ...mdCols.expMedianVolume, tip: t.expMedianVolume },
    expUnits: { ...mdCols.expUnits, tip: t.expUnits },
    forSaleAvgDom: { ...mdCols.forSaleAvgDom, tip: t.forSaleAvgDom },
    forSaleAvgPricePerSqft: { ...mdCols.forSaleAvgPricePerSqft, tip: t.forSaleAvgPricePerSqft },
    forSaleAvgSqft: { ...mdCols.forSaleAvgSqft, tip: t.forSaleAvgSqft },
    forSaleAvgVolume: { ...mdCols.forSaleAvgVolume, tip: t.forSaleAvgVolume },
    forSaleLastDayChangeVolume: { ...mdCols.forSaleLastDayChangeVolume, tip: t.forSaleLastDayChangeVolume },
    forSaleLastDayPercentage: { ...mdCols.forSaleLastDayPercentage, tip: t.percentDifference },
    forSaleLastDayUnits: { ...mdCols.forSaleLastDayUnits, tip: t.forSaleLastDayUnits },
    forSaleLastDayUnits0to90: { ...mdCols.forSaleLastDayUnits0to90, tip: t.units0To90Cdom },
    forSaleLastDayUnits0to90Pct: { ...mdCols.forSaleLastDayUnits0to90Pct, tip: t.units0To90CdomPct },
    forSaleLastDayUnits91to180: { ...mdCols.forSaleLastDayUnits91to180, tip: t.units91To180Cdom },
    forSaleLastDayUnits91to180Pct: { ...mdCols.forSaleLastDayUnits91to180Pct, tip: t.units91To180CdomPct },
    forSaleLastDayUnitsOver180: { ...mdCols.forSaleLastDayUnitsOver180, tip: t.unitsOver180Cdom },
    forSaleLastDayUnitsOver180Pct: { ...mdCols.forSaleLastDayUnitsOver180Pct, tip: t.unitsOver180CdomPct },
    forSaleMedianVolume: { ...mdCols.forSaleMedianVolume, tip: t.forSaleMedianVolume },
    forSaleUnits: { ...mdCols.forSaleUnits, tip: t.forSaleUnits },
    lastWeeksAvg: { ...mdCols.lastWeeksAvg, tip: t.lastWeeksAvgTip },
    officeName: { ...mdCols.officeName, tip: t.office },
    newAvgPricePerSqft: { ...mdCols.newAvgPricePerSqft, tip: t.newAvgPricePerSqft },
    newAvgSqft: { ...mdCols.newAvgSqft, tip: t.newAvgSqft },
    newAvgVolume: { ...mdCols.newAvgVolume, tip: t.newAvgVolume },
    newMedianVolume: { ...mdCols.newMedianVolume, tip: t.newMedianVolume },
    newUnits: { ...mdCols.newUnits, tip: t.newUnits },
    periodChange: {
        ...mdCols.periodChange,
        tip: (periodType, amountType) => `The amount of ${amountType} change per ${periodType}, for the variable being measured,
            over the selected time period; calculations are based on the slope of the
            linear trend line for the illuminated bar`
    },
    periodChangeVolume: {
        ...mdCols.periodChange,
        tip: (periodType) => `The dollar ($) change per ${periodType}, for the variable being measured,
        over the selected time period; calculations are based on the slope of the
        linear trend line for the illuminated bar` },
    periodPercentChangeUnits: {
        ...mdCols.periodPercentChange,
        tip: (periodType, amountType) => `The percent (%) ${amountType} change per ${periodType}, for the variable being measured, over the selected time period; 
         calculations are based on the slope of the linear trend line for the illuminated bar` },
    periodPercentChange: {
        ...mdCols.periodPercentChange,
        tip: (periodType) => `The percent (%) change per ${periodType}, for the variable being measured, over the selected time period; 
         calculations are based on the slope of the linear trend line for the illuminated bar` },
    previousWeeksAvg: { ...mdCols.previousWeeksAvg, tip: t.previousWeeksAvgTip },
    soldAvgDom: { ...mdCols.soldAvgDom, tip: t.soldAvgDom },
    soldAvgDomWithoutPriceChanges: { ...mdCols.soldAvgDomWithoutPriceChanges, tip: t.soldAvgDomWithoutPriceChanges },
    soldAvgDomWithPriceChanges: { ...mdCols.soldAvgDomWithPriceChanges, tip: t.soldAvgDomWithPriceChanges },
    soldAvgPricePerSqft: { ...mdCols.soldAvgPricePerSqft, tip: t.soldAvgPricePerSqft },
    soldAvgSqft: { ...mdCols.soldAvgSqft, tip: t.soldAvgSqft },
    soldAvgVolume: { ...mdCols.soldAvgVolume, tip: t.soldAvgVolume },
    soldChangeVolume: { ...mdCols.soldChangeVolume, tip: t.soldChangeVolume },
    soldGrowthVolumePct: { ...mdCols.soldGrowthVolumePct, tip: t.soldGrowthVolumePct },
    soldMedianVolume: { ...mdCols.soldMedianVolume, tip: t.soldMedianVolume },
    soldMsi: { ...mdCols.soldMsi, tip: t.msiSold },
    soldToForSaleUnitsPct: { ...mdCols.soldToForSaleUnitsPct, tip: t.soldPercentage },
    soldUnits: { ...mdCols.soldUnits, tip: t.soldUnits },
    soldUnits0to90: { ...mdCols.soldUnits0to90, tip: t.units0To90Cdom },
    soldUnits0to90Pct: { ...mdCols.soldUnits0to90Pct, tip: t.units0To90CdomPct },
    soldUnits91to180: { ...mdCols.soldUnits91to180, tip: t.units91To180Cdom },
    soldUnits91to180Pct: { ...mdCols.soldUnits91to180Pct, tip: t.units91To180CdomPct },
    soldUnitsOver180: { ...mdCols.soldUnitsOver180, tip: t.unitsOver180Cdom },
    soldUnitsOver180Pct: { ...mdCols.soldUnitsOver180Pct, tip: t.unitsOver180CdomPct },
    soldUnitsWithoutPriceChanges: { ...mdCols.soldUnitsWithoutPriceChanges, tip: t.soldUnitsWithoutPriceChanges },
    soldUnitsWithPriceChanges: { ...mdCols.soldUnitsWithPriceChanges, tip: t.soldUnitsWithPriceChanges },
    spLpRatioWithoutPriceChanges: { ...mdCols.spLpRatioWithoutPriceChanges, tip: t.spLpRatioWithoutPriceChanges },
    spLpRatioWithPriceChanges: { ...mdCols.spLpRatioWithPriceChanges, tip: t.spLpRatioWithPriceChanges },
    spOpRatioWithoutPriceChanges: { ...mdCols.spOpRatioWithoutPriceChanges, tip: t.spOpRatioWithoutPriceChanges },
    spOpRatioWithPriceChanges: { ...mdCols.spOpRatioWithPriceChanges, tip: t.spOpRatioWithPriceChanges },
    status: { ...mdCols.status },
    timePeriodStart: { ...mdCols.timePeriodStart, tip: t.timePeriodStart },
    totalChange: {
        ...mdCols.totalChange,
        tip: `The total ($) change for the variable being measured over the whole time period selected; 
         calculations are based on the slope of the linear trend line for the illuminated bar` },
    totalChangeUnits: {
        ...mdCols.totalChange,
        tip: (amountType) => `The total ${amountType} change for the variable being measured over the whole time period selected; 
         calculations are based on the slope of the linear trend line for the illuminated bar` },
    totalPercentChange: {
        ...mdCols.totalPercentChange,
        tip: `The total (%) change for the variable being measured over the whole time period selected; 
        calculations are based on the slope of the linear trend line for the illuminated bar` },
    totalPercentChangeUnits: {
        ...mdCols.totalPercentChange,
        tip: (amountType) => `The total (%) ${amountType} change for the variable being measured over the whole time period selected; 
        calculations are based on the slope of the linear trend line for the illuminated bar` },
    ucAvgCdom: { ...mdCols.avgCdom, tip: t.avgCdom},
    ucAvgDom: { ...mdCols.ucAvgDom, tip: t.ucAvgDom },
    ucAvgPricePerSqft: { ...mdCols.ucAvgPricePerSqft, tip: t.ucAvgPricePerSqft },
    ucAvgSqft: { ...mdCols.ucAvgSqft, tip: t.ucAvgSqft },
    ucAvgVolume: { ...mdCols.ucAvgVolume, tip: t.ucAvgVolume },
    ucMedianVolume: { ...mdCols.ucMedianVolume, tip: t.ucMedianVolume },
    ucMsi: { ...mdCols.ucMsi, tip: t.underContractMsi },
    ucToForSaleUnitsPct: { ...mdCols.ucToForSaleUnitsPct, tip: t.ucPercentage },
    ucUnits: { ...mdCols.ucUnits, tip: t.ucUnits },
    ucUnits0to90: { ...mdCols.ucUnits0to90, tip: t.units0To90Cdom },
    ucUnits0to90Pct: { ...mdCols.ucUnits0to90Pct, tip: t.units0To90CdomPct },
    ucUnits91to180: { ...mdCols.ucUnits91to180, tip: t.units91To180Cdom },
    ucUnits91to180Pct: { ...mdCols.ucUnits91to180Pct, tip: t.units91To180CdomPct },
    ucUnitsOver180: { ...mdCols.ucUnitsOver180, tip: t.unitsOver180Cdom },
    ucUnitsOver180Pct: { ...mdCols.ucUnitsOver180Pct, tip: t.unitsOver180CdomPct }
});

export const marketDynamicsStatusTooltips = Object.freeze({
    msiSold: 'MSI-Sold: Monthly Supply of Inventory calculated by taking the number of active listings on the last day ' +
        'of the month (FSLD) and dividing the number of listings that went Sold in selected month.',
    underContractMsi: 'MSI-Under Contract: Monthly Supply of Inventory calculated by taking the number of active ' +
        'listings on the last day of the month (FSLD) and dividing the number of listings that went Under Contract (UC) in selected month.'
});

export const getBreakdownTooltips = (periodTitle, view) => Object.freeze({
    ...marketDynamicsTooltips,
    expAvgPricePerSqft: { ...mdCols.expAvgPricePerSqft, tip: `The average price per square foot of the gross living area. This calculation excludes 0 square footage properties.`},
    expAvgSqft: { ...mdCols.expAvgSqft, tip: `SQFT reflects the gross living area as supplied by MLS data feed; the figure stated is the average square footage for all the properties within the time period. This calculation excludes 0 square footage properties.`},
    expAvgVolume: { ...mdCols.expAvgVolume, tip: `Average price of listings that went off market during the ${tooltipTimePeriods[periodTitle]}`},
    expMedianVolume: { ...mdCols.expMedianVolume, tip: `Median price of listings that went off market during the ${tooltipTimePeriods[periodTitle]}`},
    expUnits: { ...mdCols.expUnits, tip: `Number of listings that went off market during the ${tooltipTimePeriods[periodTitle]}`},
    forSaleAvgPricePerSqft: { ...mdCols.forSaleAvgPricePerSqft, tip: `The average price per square foot of the gross living area. This calculation excludes 0 square footage properties.` },
    forSaleAvgSqft: { ...mdCols.forSaleAvgSqft, tip: `SQFT reflects the gross living area as supplied by MLS data feed; the figure stated is the average square footage for all the properties within the time period. This calculation excludes 0 square footage properties.` },
    forSaleAvgVolume: { ...mdCols.forSaleAvgVolume, tip: `Average price of listings that were for sale during the ${tooltipTimePeriods[periodTitle]}` },
    forSaleMedianVolume: { ...mdCols.forSaleMedianVolume, tip: `Median price of listings that were for sale during the ${tooltipTimePeriods[periodTitle]}`},
    forSaleUnits: { ...mdCols.forSaleUnits, tip: `Number of listings that were for sale during the ${tooltipTimePeriods[periodTitle]}` },
    newAvgPricePerSqft: { ...mdCols.newAvgPricePerSqft, tip: `The average price per square foot of the gross living area. This calculation excludes 0 square footage properties.` },
    newAvgSqft: { ...mdCols.newAvgSqft, tip: `SQFT reflects the gross living area as supplied by MLS data feed; the figure stated is the average square footage for all the properties within the time period. This calculation excludes 0 square footage properties.` },
    newAvgVolume: { ...mdCols.newAvgVolume, tip: `Average price of listings that were listed during the ${tooltipTimePeriods[periodTitle]}` },
    newMedianVolume: { ...mdCols.newMedianVolume, tip: `Median price of listings that were listed during the ${tooltipTimePeriods[periodTitle]}`},
    newUnits: { ...mdCols.newUnits, tip: `Number of listings that were listed during the ${tooltipTimePeriods[periodTitle]}` },
    officeName: { ...mdCols.officeName, tip: 'Office Name - derived from MLS records' },
    soldAvgDom: { ...mdCols.soldAvgDom, tip: `Average time it took to sell (list date to under contract date) for the properties that closed during the ${tooltipTimePeriods[periodTitle]}`},
    soldAvgPricePerSqft: { ...mdCols.soldAvgPricePerSqft, tip: `A value calculation of $/SQFT; the averages of sold price and square footage for all the properties within the time period are used in the calculation. This calculation excludes 0 square footage properties.`},
    soldAvgSqft: { ...mdCols.soldAvgSqft, tip: `SQFT reflects the gross living area as supplied by MLS data feed; the figure stated is the average square footage for all the properties within the time period. This calculation excludes 0 square footage properties.`},
    soldAvgVolume: { ...mdCols.soldAvgVolume, tip: `Average price of listings that closed during the ${tooltipTimePeriods[periodTitle]}`},
    ...(view === 'avgPriceSqft' && { soldAvgVolume: { ...mdCols.soldAvgVolume, tip: `The Sold Price reflects the price-point at which the property closed escrow; the figure stated is the average sold price for all the properties within the time period.`} }),
    soldChangeVolume: { ...mdCols.soldChangeVolume, tip: `Difference between the average price and the median price of listings sold during the ${tooltipTimePeriods[periodTitle]}`},
    soldGrowthVolumePct: { ...mdCols.soldGrowthVolumePct, tip: `Difference between the average price and the median price of listings sold during the ${tooltipTimePeriods[periodTitle]} as a percentage of the average price`},
    soldMedianVolume: { ...mdCols.soldMedianVolume, tip: `Median price of listings that closed during the ${tooltipTimePeriods[periodTitle]}`},
    soldUnits: { ...mdCols.soldUnits, tip: `The number of listings that closed during the ${tooltipTimePeriods[periodTitle]}` },
    soldUnitsWithoutPriceChanges: { ...mdCols.soldUnitsWithoutPriceChanges, tip: `The number of properties sold during the ${tooltipTimePeriods[periodTitle]} that had no price changes`},
    spOpRatioWithoutPriceChanges: { ...mdCols.spOpRatioWithoutPriceChanges, tip: `The ratio of the sold price (closed price) to the original list price as a percentage for properties that had no price changes`},
    soldAvgDomWithoutPriceChanges: { ...mdCols.soldAvgDomWithoutPriceChanges, tip: `The average number of Days on Market for properties sold during the ${tooltipTimePeriods[periodTitle]} that had no price changes`},
    soldUnitsWithPriceChanges: { ...mdCols.soldUnitsWithPriceChanges, tip: `The number of properties sold during the ${tooltipTimePeriods[periodTitle]} that had one or more price changes`},
    spOpRatioWithPriceChanges: { ...mdCols.spOpRatioWithPriceChanges, tip: `The ratio of the sold price (closed price) to the original list price as a percentage for properties that had one or more price changes`},
    soldAvgDomWithPriceChanges: { ...mdCols.soldAvgDomWithPriceChanges, tip: `The average number of Days on Market for properties sold during the ${tooltipTimePeriods[periodTitle]} that had one or more price changes`},
    ucAvgPricePerSqft: { ...mdCols.ucAvgPricePerSqft, tip: `The average price per square foot of the gross living area. This calculation excludes 0 square footage properties.`},
    ucAvgSqft: { ...mdCols.ucAvgSqft, tip: `SQFT reflects the gross living area as supplied by MLS data feed; the figure stated is the average square footage for all the properties within the time period. This calculation excludes 0 square footage properties.`},
    ucAvgVolume: { ...mdCols.ucAvgVolume, tip: `Average price of listings that went under contract during the ${tooltipTimePeriods[periodTitle]}`},
    ucMedianVolume: { ...mdCols.ucMedianVolume, tip: `Median price of listings that went under contract during the ${tooltipTimePeriods[periodTitle]}`},
    ucUnits: { ...mdCols.ucUnits, tip: `Number of listings that went under contract during the ${tooltipTimePeriods[periodTitle]}`},
    spLpRatioWithoutPriceChanges: { ...mdCols.spLpRatioWithoutPriceChanges, tip: `The ratio of the sold price (closed price) to the list price (the price that drew the offer) as a percentage for properties that had no price changes` },
    spLpRatioWithPriceChanges: { ...mdCols.spLpRatioWithPriceChanges, tip: `The ratio of the sold price (closed price) to the list price (the price that drew the offer) as a percentage for properties that had one or more price changes` },
    ucToForSaleUnitsPct: { ...mdCols.ucToForSaleUnitsPct, tip: `#UC ÷ #FS as a percent` },
    soldToForSaleUnitsPct: { ...mdCols.soldToForSaleUnitsPct, tip: `#Sold ÷ #FS as a percent` },
    ...(view === 'salesAbsorption' && { soldUnits: { ...mdCols.soldUnits, tip: `Number of listings sold during the ${tooltipTimePeriods[periodTitle]}`} }),
    avgSpOp: { ...mdCols.avgSpOp, tip: `The ratio of the sold price (closed price) to the original list price as a percentage for all properties sold during the ${tooltipTimePeriods[periodTitle]}`},
    ...(view === lv.avgSpOpAllProperties.value && { soldAvgDom: { ...mdCols.soldAvgDom, tip: `The average number of Days on Market for all properties sold during the ${tooltipTimePeriods[periodTitle]}`}}),
});
