import {
    agentProductionTerms,
    marketDynamicsTerms,
    marketShareTerms,
    moduleNames,
    modules,
    searchTerms,
    searchTypes,
    navTerms,
    searchRoutes as rt
} from '../../constants';
import { appNames, runningApp } from '../../constants/app';
import { navigateToLogout } from '../../constants/nav';
import { Routes } from '../routes/routes';

const getProficiencyMetricsNavItemsByApp = (navTo) => ({
    [appNames.XAM]: undefined,
    [appNames.XBM]: {
        label: agentProductionTerms.proficiencyMetrics,
        menuItems: [
            { label: searchTerms.searchBy, header: true },
            {
                label: searchTypes[rt.transactions].title,
                onClick: () => {
                    navTo(
                        rt.transactions,
                        modules.proficiencyMetrics.transactions
                    );
                },
                activePathname: rt.transactions
            },
            {
                label: searchTypes[rt.officeName].title,
                onClick: () => navTo(
                    rt.officeName,
                    modules.proficiencyMetrics.offices
                ),
                activePathname: rt.officeName
            },
            {
                label: searchTypes[rt.agentName].title,
                onClick: () => navTo(
                    rt.agentName,
                    modules.proficiencyMetrics.agents
                ),
                activePathname: rt.agentName
            },
            {
                label: searchTypes[rt.savedAgents].title,
                onClick: () => navTo(
                    rt.savedAgents,
                    modules.proficiencyMetrics.savedAgents
                ),
                activePathname: rt.savedAgents
            }
        ]
    },
});
const getMarketShareNavItemsByApp = (navTo) => ({
    [appNames.XAM]: {
        label: marketShareTerms.marketShare,
        onClick: () => navTo(
            rt.totals,
            moduleNames.marketShare.totals
        ),
        activePathname: rt.totals,
    },
    [appNames.XBM]: {

        label: marketShareTerms.marketShare,
        menuItems: [
            { label: searchTerms.searchBy, header: true },
            {
                label: searchTypes[rt.totals].title,
                onClick: () => navTo(
                    rt.totals,
                    modules.marketShare.totals
                ),
                activePathname: rt.totals
            },
            {
                label: searchTypes[rt.coverage].title,
                onClick: () => navTo(
                    rt.coverage,
                    modules.marketShare.coverage
                ),
                activePathname: rt.coverage
            }
        ]
    }
});
const getMarketDynamicsNavItems = (navTo) => ({
    label: marketDynamicsTerms.marketDynamics,
    onClick: () => navTo(
        Routes.MARKET_DYNAMICS.BASE,
        moduleNames.marketDynamics
    ),
    activePathname: Routes.MARKET_DYNAMICS.BASE
});

export const getUserItems = (navTo) => ([
    { url: '', label: navTerms.myProfile, onClick: () => navTo('/my-profile') },
    // {
    //     url: `${getEndpoint(ID_SITE)}/auth/realms/terradatum/login-actions/reset-credentials?client_id=aergo&tab_id=txRDXnWXhc0`,
    //     label: 'Reset Password'
    // },
    { url: '#', label: navTerms.signOut, onClick: () => navigateToLogout() }
]);

export const helpItems = [
    {
        url: 'https://www.lwolf.com/services/training#terradatum',
        label: 'Webinars/Training',
        target: '_blank'
    },
    {
        url: 'https://lwolf.force.com/s/article/BMPM-Proficiency-Metrics-FAQs',
        label: 'Help Guides/FAQs',
        target: '_blank'
    }
];

export const getNavItems = (allowedModules, navTo) => {
    const updatedNavItems = [];
    if (!allowedModules?.length || allowedModules.includes(moduleNames.proficiencyMetrics)) {
        updatedNavItems.push(getProficiencyMetricsNavItemsByApp(navTo)[runningApp]);
    }
    if (allowedModules?.includes(moduleNames.marketShare)) {
        updatedNavItems.push(getMarketShareNavItemsByApp(navTo)[runningApp]);
    }
    if (allowedModules?.includes(moduleNames.marketDynamics)) {
        updatedNavItems.push(getMarketDynamicsNavItems(navTo));
    }
    return updatedNavItems;
};
