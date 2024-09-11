export const appIds = {
    xam: 'xam',
    xbm: 'xbm',
};

export const appNames = {
    XAM: 'AGENT_METRICS',
    XBM: 'BROKER_METRICS',
};

export const appLabels = {
    [appNames.XAM]: 'AgentMetrics',
    [appNames.XBM]: 'BrokerMetrics',
};

const getIsAgentMetrics = hostname => hostname.toLowerCase().indexOf('agentmetrics') >= 0;

export const getRunningApp = hostname => getIsAgentMetrics(hostname) ? appNames.XAM : appNames.XBM;

export const runningApp = getRunningApp(window.location.host);

export const isAgentMetrics = runningApp === appNames.XAM;

const getAgentMetricsHostName = (env) => `agentmetrics${env}.lwolf.com`;
const getBrokerMetricsHostName = (env) => `brokermetrics${env}.lwolf.com`;

export const hostNameByApp = Object.freeze({
    [appNames.XAM]: {
        local: getAgentMetricsHostName('.local'),
        dev: getAgentMetricsHostName('.dev'),
        stg: getAgentMetricsHostName('.stg'),
        pre: getAgentMetricsHostName('.pre'),
        prod: getAgentMetricsHostName(''),
    },
    [appNames.XBM]: {
        local: getBrokerMetricsHostName('.local'),
        dev: getBrokerMetricsHostName('.dev'),
        stg: getBrokerMetricsHostName('.stg'),
        pre: getBrokerMetricsHostName('.pre'),
        prod: getBrokerMetricsHostName(''),
    },
});
