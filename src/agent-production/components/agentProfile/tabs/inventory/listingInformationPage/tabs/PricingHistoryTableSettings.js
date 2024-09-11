import { pricingHistoryTooltips } from '../../../../../../constants/agentProductionConstants';

export default () => {
    const pricingHistoryColumns = pricingHistoryTooltips;
    const pricingHistoryCols = [
        pricingHistoryColumns.date,
        pricingHistoryColumns.status,
        pricingHistoryColumns.price,
        pricingHistoryColumns.priceChange,
        pricingHistoryColumns.priceChangePct,
        pricingHistoryColumns.days,
        pricingHistoryColumns.changeType,
        pricingHistoryColumns.spop,
        pricingHistoryColumns.splp
    ];

    const pricingHistoryColDefs = pricingHistoryCols.map(col => ({
        ...col,
        isDisplayed: true
    }))

    return {
        pricingHistoryColDefs,
        pricingHistoryTooltips
    };
};
