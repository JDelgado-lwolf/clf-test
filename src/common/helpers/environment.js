export const environments = Object.freeze({
    PRD: 'production',
    PRE: 'pre',
    STG: 'stg',
    DEV: 'dev',
    LOCALHOST: 'localhost'
});

export const getEnvironment = hostname => {

    const host = hostname.toLowerCase();

    if (host.indexOf('dev') > -1) return environments.DEV;
    if (host.indexOf('stg') > -1) return environments.STG;
    if (host.indexOf('pre') > -1) return environments.PRE;
    if (host.indexOf('localhost') > -1) return environments.LOCALHOST;

    return environments.PRD;
};
