import { moduleNames } from '../../constants';

export const getProductFlags = userProducts => {
    const values = userProducts || [];
    return {
        has_proficiency_metrics: values.includes(moduleNames.proficiencyMetrics),
        has_market_share: values.includes(moduleNames.marketShare),
        has_market_dynamics: values.includes(moduleNames.marketDynamics),
    };
};
