import { ACCOUNTS } from '../../constants';
import { appNames, getRunningApp } from '../../constants/app';
import { environments, getEnvironment } from './environment';

export const ENVIROS_WHERE_TREND_ANALYSIS_IS_HIDDEN = [
    environments.PRD,
];

export const getIsTrendAnalysisDebugEnabled = (hostname, envirosWhereTrendAnalysisIsHidden) => {
    const currentEnvironment = getEnvironment(hostname);
    return !envirosWhereTrendAnalysisIsHidden?.find(enviro => enviro === currentEnvironment);
};

export const getIsComparisonSetsEnabled = () => {
    const runningApp = getRunningApp(window.location.host);
    return runningApp !== appNames.XAM;
};

export const isComparisonSetsEnabled = getIsComparisonSetsEnabled();

export const getIsMDOfficeBreakdownEnabled = (accountId) => {
    return accountId === ACCOUNTS.LONE_WOLF_INTERNAL.id;
};
