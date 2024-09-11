export const Routes = Object.freeze({
    PROF_METRICS: {
        AGENTS: '/agent-name',
        AGENT_PROFILE: '/agent-detail',
        BASE: '/proficiency-metrics',
        COVERAGE_LISTING: '/agent-coverage-listing',
        LISTING_INFO: '/listing-info',
        OFFICE_NAME: '/office-name',
        PROD_LISTING: '/agent-production-listing',
        SAVED_AGENTS: '/saved-agents',
        TRANSACTIONS: '/transactions',
    },
    MARKET_DYNAMICS: {
        BASE: '/market-dynamics',
        OFFICES_BREAKDOWN: '/office-breakdown',
    },
    MARKET_SHARE: {
        BASE: '/market-share',
        COVERAGE: '/coverage',
        LISTING_INFO: '/listing-info',
        OFFICES_BREAKDOWN: '/office-breakdown',
        OFFICE_LISTING: '/office-listing',
        TOTALS: '/totals',
    },
    MY_PROFILE: {
        BASE: '/my-profile'
    },
    AUTH: {
        BASE: '/auth',
        LOG_IN: '/login',
        LOG_OUT: '/logout',
        CONNECT: '/connect',
    },
    HOME: {
        BASE: '/',
    },
});

export const getPinnedRowRouteSettings = (route) => {
    return route.includes(Routes.MARKET_SHARE.OFFICES_BREAKDOWN) ? 'breakdown' : 'total';
};
