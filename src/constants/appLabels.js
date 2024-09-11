import { loginTerms as lt } from ".";
import { appLabels, appNames } from "./app";

export const labelsByApp = Object.freeze({
    [appNames.XAM]: {
        signIn: lt.signInAM,
        headerLabel: appLabels[appNames.XAM],
    },
    [appNames.XBM]: {
        signIn: lt.signInBM,
        headerLabel: appLabels[appNames.XBM],
    },
});

export const logoByApp = Object.freeze({
    [appNames.XAM]: {
        loginHeader: 'img/AgentMetrics_logo.png'
    },
    [appNames.XBM]: {
        loginHeader: 'img/BrokerMetrics_logo.png'
    },
});
