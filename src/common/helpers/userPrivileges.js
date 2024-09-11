import { moduleNames } from '../../constants';

export const getUserProducts = ({ isLegacyUser, privileges }) => {
    if (isLegacyUser) {
        return [ moduleNames.proficiencyMetrics ];
    }
    return privileges?.userProducts || [];
};
