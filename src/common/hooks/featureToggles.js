import { useCommonStore } from '../../store/store';
import {
    ENVIROS_WHERE_TREND_ANALYSIS_IS_HIDDEN,
    getIsMDOfficeBreakdownEnabled,
    getIsTrendAnalysisDebugEnabled,
    isComparisonSetsEnabled
} from '../helpers/featureToggles';

export const useFeatureToggles = () => {

    const { id: accountId } = useCommonStore(state => state.accountInfo || {});

    const isTrendAnalysisDebugOutputEnabled = getIsTrendAnalysisDebugEnabled(location.hostname,
        ENVIROS_WHERE_TREND_ANALYSIS_IS_HIDDEN);

    return {
        trendAnalysisDebugOutput: {
            isEnabled: isTrendAnalysisDebugOutputEnabled
        },
        comparisonSets: {
            isEnabled: isComparisonSetsEnabled
        },
        mdOfficeBreakdown: {
            isEnabled: getIsMDOfficeBreakdownEnabled(accountId)
        },
    };
};
