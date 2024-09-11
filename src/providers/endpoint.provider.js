import { Routes } from "../common/routes/routes";
import { validationMessages } from "../constants";
import { hostNameByApp, runningApp } from "../constants/app";

export const API = 'api';
export const ID_SITE = 'idSite';
export const PIX = 'pix';
export const SEARCH_SERVICE = 'searchServer';
export const AUTH = 'auth';
export const SERVICE_GATEWAY = 'serviceGateway';
export const LWA_PLATFORM = 'lwaPlatform';
export const PROFILE_SERVICE = 'profileService';
export const PLATFORM_DOMAIN = 'platformDomain';
export const LOCAL_LAUNCH = 'localLaunch';
export const PLATFORM_LOCAL_LAUNCH = 'platformLocalLaunch';
export const PLATFORM_LOCAL_LAUNCH_URL = `http://${hostNameByApp[runningApp].local}${Routes.AUTH.BASE}`

export const isLocal = hostname => (hostname.toLowerCase().indexOf('localhost') > -1)
    || (hostname.toLowerCase().indexOf('local') > -1);
export const isDev = hostname => hostname.toLowerCase().indexOf('dev') >= 0;
export const isStaging = hostname => hostname.toLowerCase().indexOf('stg') >= 0;
export const isPre = hostname => hostname.toLowerCase().indexOf('pre') >= 0;
export const isProd = hostname => !isLocal(hostname)
    && !isDev(hostname) && !isStaging(hostname) && !isPre(hostname);

export const envNames = {
    LOCAL: 'LOCAL',
    DEV: 'DEV',
    STG: 'STG',
    PRE: 'PRE',
    PROD: 'PROD',
};

// There's a single account for all the Demo users in dev and staging.
// This method to whitelist should be temporary
export const accountIdsAllowedForXAMByEnv = Object.freeze({
    [envNames.LOCAL]: [628],
    [envNames.DEV]: [628],
    [envNames.STG]: [133],
    [envNames.PRE]: [],
    [envNames.PROD]: [],
});

const getRunningEnv = (hostname) => {
    const envs = [
        { check: isLocal, name: envNames.LOCAL },
        { check: isDev, name: envNames.DEV },
        { check: isStaging, name: envNames.STG },
        { check: isPre, name: envNames.PRE },
        { check: isProd, name: envNames.PROD }
    ];

    const env = envs.find(env => env.check(hostname));
    if (!env) throw new Error(validationMessages.notValidEnvForHost);
    return env.name;
};

const hostname = window.location.host;


// Change this value manually if you need to change env locally
// i.e. For staging set the value to envNames.STG
export const runningEnv = getRunningEnv(hostname);

const buildHost = (service, env, domain) => `https://${service}${env}${domain}`;

const serviceHosts = {
    ID_SITE: (env) => buildHost('xbm-id', env, '.terradatum.com'),
    SERVICE_GATEWAY: (env) => buildHost('service-gateway', env, '.terradatum.com'),
    LWA_PLATFORM: (env) => buildHost('platform', env, '.lwolf.com'),
    PROFILE_SERVICE: (env) => buildHost('profile-service', env, '.terradatum.com'),
    PLATFORM_DOMAIN: (env) => `${env}lwolf.com`,
};

const commonEndpoints = {
    [API]: `${location.protocol}//api.${location.host.substring(location.host.indexOf('.') + 1)}`,
    [PIX]: `${location.protocol}//td-images-admin.${location.host.substring(location.host.indexOf('.') + 1)}`,
    [SEARCH_SERVICE]: `${location.protocol}//aergo-search-server.${location.host.substring(location.host.indexOf('.') + 1)}`,
    [AUTH]: `${location.protocol}//td-auth.${location.host.substring(location.host.indexOf('.') + 1)}`,
}

const generateEndpoints = (env, platformEnv = env) => {
    const validEnvs = [
        'dev',
        'stage',
        'stg',
        'pre',
        '',
    ];
    const isValidEnv = validEnvs.includes(env);
    const isValidPlatformEnv = validEnvs.includes(platformEnv);

    if (!isValidEnv || !isValidPlatformEnv) {
        throw new Error(validationMessages.validEnvs);
    }

    return ({
    ...commonEndpoints,
    [ID_SITE]: serviceHosts.ID_SITE(`.${env}`),
    [SERVICE_GATEWAY]: serviceHosts.SERVICE_GATEWAY(`.${env}`),
    [LWA_PLATFORM]: serviceHosts.LWA_PLATFORM(`.${platformEnv}`),
    [PROFILE_SERVICE]: serviceHosts.PROFILE_SERVICE(`.${env}`),
    [PLATFORM_DOMAIN]: serviceHosts.PLATFORM_DOMAIN(`${platformEnv}.`),
    [LOCAL_LAUNCH]: isLocal(hostname) ? `&lu=${PLATFORM_LOCAL_LAUNCH_URL}` : '',
    [PLATFORM_LOCAL_LAUNCH]: '',
})};

const endpointsByEnv = Object.freeze({
    [envNames.LOCAL]: generateEndpoints('dev'),
    [envNames.DEV]: generateEndpoints('dev'),
    [envNames.STG]: generateEndpoints('stage', 'stg'),
    [envNames.PRE]: generateEndpoints('pre'),
    [envNames.PROD]: generateEndpoints(''),
});

export const getEndpoint = (name) => endpointsByEnv[runningEnv][name];
