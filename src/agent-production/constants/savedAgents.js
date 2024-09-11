import { agentProductionTerms } from '../../constants';

export const terms = {
    agentLists: 'saved agent lists',
    savedAgents: 'saved agents',
    agents: 'agents',
    view: 'view',
    showAllAgents: 'Show all agents',
    onlyShowMyAgents: 'Only show my agents',
    hideMyAgents: 'Hide my agents',
};

export const types = {
    SHOW_ALL_AGENTS: 'show_all_agents',
    ONLY_SHOW_MY_AGENTS: 'only_show_my_agents',
    HIDE_MY_AGENTS: 'hide_my_agents',
};

export const views = {
    overview: 'overview',
    contactInformation: 'contactInformation',
    growthAnalysis: 'growthAnalysis',
    listingProficiency: 'listingProficiency'
};

export const viewOptions = [
    {
        value: views.overview,
        label: agentProductionTerms.overview
    },
    {
        value: views.contactInformation,
        label: agentProductionTerms.contactInformation
    },
    {
        value: views.growthAnalysis,
        label: agentProductionTerms.growthAnalysis
    },
    {
        value: views.listingProficiency,
        label: agentProductionTerms.listingProficiency
    }
];

export const showOptions = [
    {
        value: types.SHOW_ALL_AGENTS,
        label: terms.showAllAgents
    },
    {
        value: types.ONLY_SHOW_MY_AGENTS,
        label: terms.onlyShowMyAgents
    },
    {
        value: types.HIDE_MY_AGENTS,
        label: terms.hideMyAgents
    }
];
