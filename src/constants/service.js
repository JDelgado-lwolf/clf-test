import { getEndpoint, LWA_PLATFORM, ID_SITE, LOCAL_LAUNCH } from "../providers/endpoint.provider";

const getLwaRoutes = (params) => ({
    CONFIRM_CONNECTION: `/product/confirm-connection${params || ''}`,
    LAUNCH_PRODUCT: `/product/launch${params || ''}`,
    AUTH: `/authenticate${params || ''}`
});

const buildAuthParams = (authParams) => {
    const paramsArray = [
        `${authParams?.email ? `e=${encodeURIComponent(authParams?.email)}` : ''}`,
        `${authParams?.mode ? `&sc=${authParams?.mode}` : ''}`,
        `${authParams?.redirectUrl ? `&r=${encodeURIComponent(authParams?.redirectUrl)}`: ''}`,
    ];

    return paramsArray.join('');
};

const getLwaRouteParams = ({ lwid, authParams } = {}) => ({
    XBM_APP: '?a=xbm',
    LWID: `?i=${lwid}`,
    AUTH: `?${buildAuthParams(authParams)}`,
});

export const urlKeycloakToken = `${getEndpoint(ID_SITE)}/auth/realms/terradatum/protocol/openid-connect/token`
export const urlPlatformLaunch =
    `${getEndpoint(LWA_PLATFORM)}${getLwaRoutes(getLwaRouteParams().XBM_APP).LAUNCH_PRODUCT}${getEndpoint(LOCAL_LAUNCH)}`;
export const urlPlatformConnection = (lwid) =>
    `${getEndpoint(LWA_PLATFORM)}${getLwaRoutes(getLwaRouteParams({lwid}).LWID).CONFIRM_CONNECTION}`;
export const urlPlatformAuth = (authParams) =>
    `${getEndpoint(LWA_PLATFORM)}${getLwaRoutes(getLwaRouteParams({authParams}).AUTH).AUTH}`;

export const MAX_ENDPOINT_RETRIES = 5;
export const CANCELED_ENDPOINT_CODE = 20;

export const responseKeys = {
    recruitingSoldTotals: 'recruitingSoldTotals',
    results: 'results',
    totals: 'totals',
};
