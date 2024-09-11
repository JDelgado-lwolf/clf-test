export const terms = Object.freeze({
    avgCdom: 'Average CDOM',
    avgDom: 'Average DOM',
    avgDomCdom: 'Average DOM-CDOM',
    avgPrice: 'Average Price',
    avgPriceSqft: 'Average $/SQFT',
    avgPriceSqftLabel: (status) => `${status} $/SQFT`,
    avgSpLpComparison: 'Average SP/LP Comparison',
    avgSpOp: 'Avg SP/OP',
    avgSpOpAllComparison: 'Average SP/OP Comparison',
    avgSpOpAllProperties: 'Average SP/OP All Properties',
    avgSpOpComparison: 'Average SP/OP Comparison',
    begin: 'begin',
    beginVsEndMonthLabel: 'Begin vs. End Month',
    beginPeriod: (selectedBeginValue) => `Begin: ${selectedBeginValue}`,
    cdomBreakout: 'CDOM Breakout',
    cdom: 'CDOM',
    change: 'Change',
    change$: '$ Change',
    changePct: '% Change',
    custom: 'custom',
    days: 'Days',
    daysChange: 'Days Change',
    end: 'end',
    endPeriod: (selectedEndValue) => `End: ${selectedEndValue}`,
    expAvgDom: 'Expired Avg Dom',
    expAvgPricePerSqft: 'Expired $/Sqft',
    expAvgSqft:'Avg Sqft Expired',
    expAvgVolume: 'Avg Expired $',
    expired: 'Expired',
    expMedianVolume: 'Expired Median $',
    expUnits: '# Expired',
    forSale: 'For Sale',
    forSaleAvgDom: 'For Sale Avg Dom',
    forSaleAvgPricePerSqft: 'For Sale $/Sqft',
    forSaleAvgSqft:'Avg Sqft For Sale',
    forSaleAvgVolume: 'Avg For Sale $',
    forSaleLastDayUnits: '# For Sale Last Day of Month',
    forSaleMedianVolume: 'For Sale Median $',
    forSaleUnits: '# For Sale',
    forSaleVsFsldm: 'For Sale vs. FSLDM',
    forSaleLdm: 'For Sale Last Day of the Month',
    fsldm: 'FSLDM',
    forSaleLastDayChangeVolume: '# For Sale - # For Sale Last Day Difference',
    percentDifference: '% Difference',
    itemTypeCount: (itemType, countOfItems) => `${itemType} (${countOfItems})`,
    lastWeeksAvg: 'Last 12 weeks avg',
    lastWeeksAvgTip: 'The average for the last 12 weeks',
    listingViews: 'Listing Views',
    medianPrice: 'Median Price',
    medianPriceChange: 'Median price change',
    month: 'Month',
    monthly: 'Monthly',
    monthlySupplyOfInventory: 'Monthly Supply of Inventory',
    months: 'Months',
    msiChange: 'MSI Change',
    msiSold: 'MSI-Sold',
    newAvgPricePerSqft: 'New $/Sqft',
    newAvgSqft:'Avg Sqft New',
    newAvgVolume: 'Avg New $',
    newListings: 'New Listings',
    newMedianVolume: 'New Listing Median $',
    newUnits: '# New Listed',
    offMarket: 'Off Market',
    overview: 'Overview',
    percentage: 'Percentage',
    periodChange: (period) => `${period} Change`,
    periodPercentChange: (period) => `${period} % Change`,
    previousWeeksAvg: 'Prev 12 weeks avg',
    previousWeeksAvgTip: 'The average for the previous 12 weeks',
    price: 'Price',
    pricePerSqft: '$/SQFT',
    quarter: 'Quarter',
    quarterly: 'Quarterly',
    salesAbsorption: 'Sales Absorption',
    salesRate: 'Sales Rate',
    sold: 'Sold',
    soldAvgDom: 'Sold Avg Dom',
    soldAvgDomWithoutPriceChanges: 'Avg DOM - No Price Changes',
    soldAvgDomWithPriceChanges:'Avg DOM - 1+ Price Changes',
    soldAvgPricePerSqft: 'Sold $/Sqft',
    soldAvgSqft: 'Avg Sqft Sold',
    soldAvgVolume: 'Avg Sold $',
    soldAvgVsMedianPrice: 'Sold Average vs. Median Price',
    soldChangeVolume: 'Average $ - Median $',
    soldGrowthVolumePct: 'Median $ as % of Average $',
    soldMedianVolume: 'Sold Median $',
    soldPercentage: '% Sold',
    soldUnits: '# Sold',
    soldUnitsWithoutPriceChanges:'# Sold - No Price Changes',
    soldUnitsWithPriceChanges: '# Sold - 1+ Price Changes',
    spLpNoPriceChanges: 'SP/LP No Price Changes',
    spLpPriceChanges: 'SP/LP 1+ Price Changes',
    spLpRatioWithoutPriceChanges: 'Avg SP/LP - No Price Changes',
    spLpRatioWithPriceChanges: 'Avg SP/LP - 1+ Price Changes',
    spOp: 'SP/OP',
    spOpNoPriceChanges: 'SP/OP No Price Changes',
    spOpPriceChanges: 'SP/OP 1+ Price Changes',
    spOpRatioWithoutPriceChanges: 'Avg SP/OP - No Price Changes',
    spOpRatioWithPriceChanges: 'Avg SP/OP - 1+ Price Changes',
    status: 'status',
    supplyAmpDemand: 'Supply & Demand',
    supplyAmpDemandNumUnits: 'Supply & Demand - # Units',
    timePeriodStart: 'Period',
    totalChange: 'Total Change',
    totalPercentChange: 'Total % Change',
    ucAvgDom: 'Under Contract Avg Dom',
    ucAvgPricePerSqft: 'Under Contract $/Sqft',
    ucAvgSqft:'Avg Sqft Under Contract',
    ucAvgVolume: 'Avg Under Contract $',
    ucMedianVolume: 'Under Contract Median $',
    ucPercentage: '% Under Contract',
    ucUnits: '# Under Contract',
    underContract: 'Under Contract',
    underContractMsi: 'MSI-Under Contract',
    underContractUc: 'Under Contract (UC)',
    units: 'Units',
    units0To90: '0 - 90',
    units0To90Cdom: '0 - 90 CDOM',
    units0To90CdomPct: '0 - 90 CDOM %',
    units91To180: '91 - 180',
    units91To180Cdom: '91 - 180 CDOM',
    units91To180CdomPct: '91 - 180 CDOM %',
    unitsChangeNum: '# Units Change',
    unitsNum: '# Units',
    unitsOver180: '181+',
    unitsOver180Cdom: '181+ CDOM',
    unitsOver180CdomPct: '181+ CDOM %',
    weekLabel: (week) => `W${week}`,
    week: 'Week',
    weekly: 'Weekly',
    weekOf: 'Week Of',
    wholeTimePeriodLabel: 'Whole Time Period',
    yAxisDollarChartTitle: 'Dollars in Thousands',
    msi: 'MSI',
});

export const errorMessaging = Object.freeze({
    fetchOffices: 'Error fetching offices'
});

export const periodKeys = Object.freeze({
    beginPeriodValue: 'beginPeriodValue',
    endPeriodValue: 'endPeriodValue',
    beginVsEndMonth: 'beginVsEndMonth',
    wholeTimePeriod: 'wholeTimePeriod',
});

export const barChartColors = Object.freeze({
    first: '#0C4A6E',
    second: '#0284C7',
    third: '#7DD3FC',
    firstTransparency: 'rgba(12, 74, 110, 0.2)',
    secondTransparency: 'rgba(2, 132, 199, 0.2)',
    thirdTransparency: 'rgba(125, 211, 252, 0.2)'
});

export const marketDynamicsColors = {
    bars: [barChartColors.first, barChartColors.second, barChartColors.third],
    barsTransparency: [
        barChartColors.firstTransparency,
        barChartColors.secondTransparency,
        barChartColors.thirdTransparency
    ]
};

export const chartFontFamily =
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,' +
    'sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"';

export const chartLabelStyles = {
    colors: ['#111827'],
    fontFamily: chartFontFamily,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
};

export const getYAxisTitle = (title) => ({
    text: title,
    style: { ...chartLabelStyles, fontWeight: 600, colors: ['#6B7280'] }
});

export const keyfieldByStatusId = {
    sold: 'sold',
    newListings: 'new',
    forSale: 'forSale',
    expired: 'expired',
    underContract: 'underContract',
};

export const measureTypes = Object.freeze({ units: 'units' });
