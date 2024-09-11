import React from 'react';
import { PropTypes } from 'prop-types';
import { officeBreakdownRoute } from '../../../../market-dynamics/constants/routes';
import RedirectLink from './RedirectLink';
import { useMarketDynamicsStore } from '../../../../store/marketDynamics/store';
import { useCommonStore } from '../../../../store/store';
import { useFeatureToggles } from '../../../hooks/featureToggles';

const MarketDynamicsPeriod = ({data, valueFormatted}) => {
    const {
        checkedStatusOptions,
        setSelectedBreakdownPeriod
    } = useMarketDynamicsStore(state => ({
        checkedStatusOptions: state.checkedStatusOptions,
        setSelectedBreakdownPeriod: state.setSelectedBreakdownPeriod
    }));
    const featureToggles = useFeatureToggles();
    const setBackNavbarTitle = useCommonStore(state => state.setBackNavbarTitle);

    const handleClick = () => {
        setBackNavbarTitle(valueFormatted);
        setSelectedBreakdownPeriod(data);
    };

    const isMDOfficeBreakdownEnabled = featureToggles.mdOfficeBreakdown.isEnabled;
    const listingHasValue = checkedStatusOptions.some(status => data?.[status.keyField] > 0);
    const shouldRedirect = isMDOfficeBreakdownEnabled && listingHasValue;
    return (<RedirectLink
        linkProps={{
            to:{ pathname: officeBreakdownRoute },
            onClick: handleClick
        }}
        shouldRedirect={shouldRedirect}
        label={valueFormatted}
    />);
};

MarketDynamicsPeriod.propTypes = {
    data: PropTypes.object,
    context: PropTypes.object,
    valueFormatted: PropTypes.string,
};

export default MarketDynamicsPeriod;
