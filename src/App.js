import React, { Suspense, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useLocation, useHistory } from 'react-router-dom';
import { AGGridProvider } from '@lwt-helix/ag-grid';
import Page from '@lwt-helix/page';
import { Button } from '@lwt-helix/buttons';
import Modal from '@lwt-helix/modal';
import UniversalNavBar from './common/components/header/UniversalNavBar';
import Profile from './common/components/header/profile/Profile';
import SearchBar from './common/components/search/SearchBar';
import AgentProduction from './agent-production/components/AgentProduction';
import AgentProfile from './agent-production/components/agentProfile/AgentProfile';
import SavedAgents from './agent-production/components/SavedAgents';
import { SearchBar as SavedAgentsSearchBar } from './agent-production/components/savedAgents/SearchBar';
import {
    accountTypes,
    buttonTerms,
    moduleNames,
    moduleRoutes,
    modules,
    modulesByRouteAndNameAssociation,
    searchRoutes as rt,
    searchStatuses
} from './constants';
import ListingInformationPage
    from './agent-production/components/agentProfile/tabs/inventory/listingInformationPage/ListingInformationPage';
import AgentCoverageListing
    from './agent-production/components/agentProfile/tabs/transaction-coverage/coverage-listing/AgentCoverageListing';
import { setStateData } from './common/helpers/state';
import { AgentProductionListings } from './agent-production/components/agentProfile/tabs/production/listingProductionPage/AgentProductionListings';
import MarketShare from './market-share/components/MarketShare';
import { Routes } from './common/routes/routes';
import { getAllowedModuleByUrl, getFirstToolRoute } from './common/helpers/routes';
import ListingsBreakdown from './market-share/components/ListingsBreakdown';
import OfficesBreakdown from './market-share/components/OfficesBreakdown';
import MDOfficesBreakdown from './market-dynamics/components/OfficesBreakdown';
import ListingInformation from './market-share/components/ListingInformation';
import { getNavItems, getUserItems, helpItems } from './common/helpers/nav';
import MarketDynamics from './market-dynamics/components/MarketDynamics';
import { useCommonStore, useSavedAgentsStore, useSearchStore } from './store/store';
import { useAuthStore } from './store/auth/store';
import { getUserAccounts, getUserAccountsById } from './service/account';
import Logout from './common/components/header/Logout';
import { removeDuplicates } from './common/helpers/utilities';
import { getProductFlags } from './common/helpers/pendo';
import { getUserProducts } from './common/helpers/userPrivileges';
import { getKeyByValue } from './common/helpers/object';
import { getProficiencyMetrics } from './service/proficiency-metrics';
import { getCoverageSearch } from './service/market-share';
import { useMls } from './common/hooks/mls';
import { getOwnerIdByTokenInfo, tokenTypes, LWA_TOKEN_OBJECT_IDENTIFIER } from './constants/auth';
import { LinkLwaModal } from './login/components/LinkLwaModal';
import { navigateToLogout } from './constants/nav';
import { officeBreakdownRoute } from './market-dynamics/constants/routes';
import { views } from './agent-production/constants/savedAgents';
import { responseKeys } from './constants/service';
import { appNames, isAgentMetrics, runningApp } from './constants/app';
import { useMarketDynamicsStore } from './store/marketDynamics/store';

const App = (props) => {
    const [state, setState] = useState({
        userInactive: false,
        mlsId: undefined,
        propTypes: undefined,
        mappedAreas: undefined,
        offices: undefined,
        selectedSearchApplied: undefined,
        selectedSavedMarketArea: undefined,
        selectedMarketAreaApplied: undefined,
        allowedModules: undefined,
        navItems: undefined,
        userOffices: undefined,
        userAccounts: undefined,
        userAccount: undefined,
        privileges: undefined,
        isPendoReady: false
    });

    const [agentData, setAgentData] = useState({});

    let location = useLocation();
    const history = useHistory();

    const {
        membership,
        officeInfo,
        timeIntervals,
        getPrivileges,
        getUserProfile,
        getAgentInfo,
        getOfficeInfo,
        getMembership,
        getTimeIntervals,
        setMlsProviders,
        getMarketAreaLists,
        getOfficeLists,
        getAgentLists,
        setAccountInfo,
        setUserInfo,
    } = useCommonStore(state => ({
        userInfo: state.userInfo,
        membership: state.membership,
        officeInfo: state.officeInfo,
        timeIntervals: state.timeIntervals,
        getPrivileges: state.getPrivileges,
        getUserProfile: state.getUserProfile,
        getAgentInfo: state.getAgentInfo,
        getOfficeInfo: state.getOfficeInfo,
        getMembership: state.getMembership,
        getTimeIntervals: state.getTimeIntervals,
        setMlsProviders: state.setMlsProviders,
        getMarketAreaLists: state.getMarketAreaLists,
        getOfficeLists: state.getOfficeLists,
        getAgentLists: state.getAgentLists,
        setAccountInfo: state.setAccountInfo,
        setUserInfo: state.setUserInfo,
    }));

    const selectedModule = useSearchStore(state => state.selectedModule);

    const {
        tokenInfo,
        tokenType,
        handleShouldShowLinkLwaModal,
        isLegacyUser
    } = useAuthStore(state => ({
        tokenInfo: state.tokenInfo,
        tokenType: state.tokenType,
        handleShouldShowLinkLwaModal: state.handleShouldShowLinkLwaModal,
        isLegacyUser: state.isLegacyUser
    }));

    const {
        agentDataStore,
        setTotalsRowData,
        setSummaryPinnedData,
        selectedMls,
        setSelectedModule,
        getSavedSearchList,
        setSelectedMls,
        searchStatus,
        setLoadedSearch,
        setIsLoading,
        setIsLoadingSearchData,
        setSearchStatus,
        search,
        loadedSearchCriteria,
        selectedSavedSearch,
        runMarketShareTotalsSearch,
    } = useSearchStore(state => ({
        agentDataStore: state[selectedModule]?.agentData,
        setTotalsRowData: state.setTotalsRowData,
        setSummaryPinnedData: state.setSummaryPinnedData,
        selectedMls: state[selectedModule]?.selectedMls,
        setSelectedModule: state.setSelectedModule,
        getSavedSearchList: state.getSavedSearchList,
        setSelectedMls: state.setSelectedMls,
        searchStatus: state[selectedModule]?.searchStatus,
        setLoadedSearch: state.setLoadedSearch,
        setIsLoading: state.setIsLoading,
        setIsLoadingSearchData: state.setIsLoadingSearchData,
        setSearchStatus: state.setSearchStatus,
        search: state[selectedModule]?.search,
        loadedSearchCriteria: state[selectedModule]?.loadedSearchCriteria,
        selectedSavedSearch: state[selectedModule]?.selectedSavedSearch,
        runMarketShareTotalsSearch: state.runMarketShareTotalsSearch,
    }));

    const agentNameModule = modules.proficiencyMetrics.agents;

    const {
        setAgentListByModule,
        findAgentListById,
        setSelectedListByModule,
    } = useSavedAgentsStore(state => ({
        setAgentListByModule: state.setAgentListByModule,
        findAgentListById: state.findAgentListById,
        setSelectedListByModule: state.setSelectedListByModule,
    }));

    const runMarketDynamicsSearch = useMarketDynamicsStore(state => state.runMarketDynamicsSearch);

    useEffect(() => {
        const checkPendoReady = () => {
            if (window.pendo) {
                setStateData('isPendoReady', true, setState);
            } else {
                setTimeout(checkPendoReady, 50);
            }
        };

        checkPendoReady();
    }, []);

    const ownerId = tokenType && getOwnerIdByTokenInfo[tokenType](tokenInfo);
    // We have different Agent Data location, depending of the module.
    const selectedAgentData = agentData?.[selectedModule] || agentDataStore;

    const initializePendo = ({ tokenInfo, selectedAccount, userAccounts, productFlags }) => {
        // This function creates anonymous visitor IDs in Pendo unless you change the visitor id field to use your app's values
        // This function uses the placeholder 'ACCOUNT-UNIQUE-ID' value for account ID unless you change the account id field to use your app's values
        // Call this function in your authentication promise handler or callback when your visitor and account id values are available
        // Please use Strings, Numbers, or Bools for value types.
        window.pendo?.initialize({
            visitor: {
                ...productFlags,
                id: tokenInfo.email,              //'VISITOR-UNIQUE-ID'   // Required if user is logged in, default creates anonymous ID
                email: tokenInfo.email,        // Recommended if using Pendo Feedback, or NPS Email
                full_name: tokenInfo.name,      // Recommended if using Pendo Feedback
                ...(selectedAccount ? { accountId: selectedAccount.id } : {}),
                ...(selectedAccount ? { accountName: selectedAccount.name } : {}),
                ...(userAccounts ? { accounts: userAccounts } : {}),
                legacy: !!isLegacyUser,
                // role:         // Optional

                // You can add any additional visitor level key-values here,
                // as long as it's not one of the above reserved names.
                auth_time: tokenInfo.auth_time,
                sub: ownerId,
                session_state: tokenInfo.session_state,
                roles: tokenInfo?.resource_access?.account.roles,
                scope: tokenInfo.scope,
                name: tokenInfo.name,
                preferred_username: tokenInfo.preferred_username,
                given_name: tokenInfo.given_name,
                family_name: tokenInfo.family_name,
                app: appNames[runningApp]
            },

            account: {
                id: selectedAccount ? selectedAccount.id : 'ACCOUNT-UNIQUE-ID', // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
                ...(selectedAccount ? { name: selectedAccount.name } : {})
                // is_paying:    // Recommended if using Pendo Feedback
                // monthly_value:// Recommended if using Pendo Feedback
                // planLevel:    // Optional
                // planPrice:    // Optional
                // creationDate: // Optional

                // You can add any additional account level key-values here,
                // as long as it's not one of the above reserved names.
            }
        });
    };

    const localToken = JSON.parse(localStorage.getItem('auth_state'))?.state?.token;

    // This checks if the session was ended in another tab
    useEffect(() => {
        if (!localToken) navigateToLogout();
    },[localToken]);

    const mlsProps = useMls(selectedMls?.mlsId, selectedModule);

    useEffect(async () => {
        if (!tokenInfo || !state.isPendoReady) return;

        if ( mlsProps
            && officeInfo
            && timeIntervals
            && loadedSearchCriteria
            && (searchStatus !== searchStatuses.running || searchStatus !== searchStatuses.ran)
        ) {
            setSearchStatus(searchStatuses.run);
            setIsLoadingSearchData(true);
            setIsLoading(true);
        }

        let userAccounts;
        if (tokenType === tokenTypes.LWA) {
            const xbmUserIdFromToken = tokenInfo[LWA_TOKEN_OBJECT_IDENTIFIER]?.apps?.xbm?.uid;
            const lwaId = tokenInfo?.[LWA_TOKEN_OBJECT_IDENTIFIER]?.uid;
            userAccounts = await getUserAccountsById(xbmUserIdFromToken, lwaId);
            if (userAccounts.error === 404) navigateToLogout();
            setStateData('userAccounts', userAccounts, setState);
        }
        if (tokenType === tokenTypes.KEYCLOAK) {
            userAccounts = await getUserAccounts(tokenInfo.email);
        }

        if (userAccounts.error && userAccounts.error !== 404) return;

        // if there are no userAccounts returned, then this indicates old legacy setup
        if(!userAccounts.accounts?.length) {
            const userProducts = getUserProducts({ isLegacyUser: true });
            setStateData('allowedModules', userProducts, setState);
            const profile = await getUserProfile(tokenInfo.preferred_username);
            if (profile.error) return;

            if (!profile.isSetupActive || !profile.isUserActive) {
                setStateData('userInactive', true, setState);
                return;
            }
            const productFlags = getProductFlags(userProducts);
            initializePendo({ tokenInfo, productFlags });

            await getMembership(profile.mlsList);
            await getTimeIntervals();
            await getUserLists(ownerId);
            return;
        }

        //TODO: add account selector logic here, right now select the first option
        const selectedAccount = userAccounts?.accounts[0];

        const isAccountUserInactive = !selectedAccount.accountActive || !selectedAccount.userActive

        // This is part of the A/C of XBM-7408 and could be modified after the demo
        if (isAccountUserInactive && !isAgentMetrics) {
            setStateData('userInactive', true, setState);
            return;
        }

        const hasLwaId = !!userAccounts?.user?.lwaId;
        setStateData('userAccount', selectedAccount, setState);
        setAccountInfo(selectedAccount);
        setUserInfo(userAccounts?.user);

        handleShouldShowLinkLwaModal(hasLwaId);

        const privileges = await getPrivileges(selectedAccount.id, userAccounts.user.id);
        const userProducts = getUserProducts({ privileges });
        const productFlags = getProductFlags(userProducts);
        initializePendo({ tokenInfo, selectedAccount, userProducts, productFlags });

        if (privileges?.error) return;

        setStateData('allowedModules', privileges.userProducts, setState);

        if (searchStatus === searchStatuses.running) setSearchStatus(searchStatuses.run);

        const activeValidOffices = await setMlsListForMembershipLookup(privileges, selectedAccount);
        activeValidOffices && await getMembership(activeValidOffices?.map(o => o.mlsOfficeId.mlsId));
        await getTimeIntervals();
        await getUserLists(ownerId);
    }, [tokenInfo, state.isPendoReady]);

    useEffect(() => {
        membership && setStateData('mlsList', membership, setState);
    }, [membership]);

    useEffect(() => {
        officeInfo && setStateData('userOffices', officeInfo, setState);
    }, [officeInfo]);

    useEffect(async () => {
        //run search again if not already loaded (refresh)
        //we dont want this for savedAgents module, since we are not running a search manually. 
        if (selectedModule === modules.proficiencyMetrics.savedAgents) return;
        if (loadedSearchCriteria && !agentData?.[selectedModule] && (!searchStatus || searchStatus === searchStatuses.ran)) {
            setLoadedSearch();
            setSearchStatus(searchStatuses.run);
        }
    }, [loadedSearchCriteria, agentData]);

    useEffect(async () => {
        if (!tokenInfo) return;
        if (searchStatus === searchStatuses.run) {
            setIsLoading(true);
            setIsLoadingSearchData(true);
            setLoadedSearch();
            setAgentData(agentData => ({
                ...agentData,
                [selectedModule]: undefined
            }));
            setAgentListByModule(selectedModule, undefined);
            try {
                await runSearch();
            } catch {
                setIsLoadingSearchData(false);
            }
        } else if (searchStatus === searchStatuses.ran) {
            setIsLoading(false);
            setIsLoadingSearchData(false);
            setSearchStatus(undefined);
        }
    }, [searchStatus]);

    useEffect(async () => {
        if (!!state.mlsList?.length) {
            const activeMlsList = state.mlsList.filter(mls => mls.isActive);
            const activeMlsListWithActiveOffices = !state.userOffices?.length
                ? activeMlsList
                : activeMlsList
                    .filter(mls => !!state.userOffices
                        .find(office => office.isOfficeActive && office.mlsOfficeId.mlsId === mls.mlsId)
                    );
            if (activeMlsListWithActiveOffices?.length === 1) {
                if(selectedSavedSearch) return;
                setMlsProviders(activeMlsListWithActiveOffices);
                !loadedSearchCriteria && await setSelectedMls(
                    activeMlsListWithActiveOffices[0],
                    selectedModule,
                    timeIntervals,
                    activeMlsListWithActiveOffices?.length
                );
            } else {
                const sortFunction = (a, b) => a.shortDescription.localeCompare(b.shortDescription);
                activeMlsListWithActiveOffices && setMlsProviders(activeMlsListWithActiveOffices.sort(sortFunction));
            }
        }
    }, [state.mlsList, state.userOffices, selectedModule, selectedMls]);

    useEffect(async () => {
        if (state.allowedModules && !selectedModule) {
            const initialModuleToLoad = getAllowedModuleByUrl({
                url: location.pathname,
                allowedModules: state.allowedModules,
                modulesByRouteAndNameAssociation: modulesByRouteAndNameAssociation
            });
            await setSelectedModule(initialModuleToLoad);
            await navTo(moduleRoutes[initialModuleToLoad], initialModuleToLoad);
        }
    }, [state.allowedModules, selectedModule]);

    useEffect(() => {
        state.allowedModules && setStateData('navItems', getNavItems(state.allowedModules, navTo), setState);
    }, [state.allowedModules]);

    useEffect(async () => {
        if (location && location.pathname !== '/' && selectedModule && location.pathname !== moduleRoutes[selectedModule]) {
            const nextModule = getKeyByValue(moduleRoutes, location.pathname);
            await setSelectedModule(nextModule);
        }
    }, [location]);

    const runSearch = async () => {
        const searchCriteria = search?.searchCriteria;
        if (searchCriteria) {
            setSearchStatus(searchStatuses.running);
            switch (selectedModule) {
                case modules.proficiencyMetrics.transactions:
                case modules.proficiencyMetrics.offices:
                case agentNameModule:
                    try {
                        const { recruitingSoldResponse, recruitingSoldTotals, error } = await getProficiencyMetrics(searchCriteria);
                        if (!error) {
                            setAgentData(agentData => ({
                                ...agentData,
                                [selectedModule]: recruitingSoldResponse
                            }));
                            setTotalsRowData(recruitingSoldTotals, responseKeys.recruitingSoldTotals);
                            setSummaryPinnedData(views.overview, responseKeys.recruitingSoldTotals);
                            if (selectedModule !== agentNameModule) break;
                            const selectedAgentList = findAgentListById();
                            selectedAgentList && setSelectedListByModule(selectedModule, selectedAgentList);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                    break;
                case modules.marketShare.totals:
                    await runMarketShareTotalsSearch(searchCriteria, setAgentData);
                    break;
                case modules.marketShare.coverage:
                    const coverageSearchResponse = await getCoverageSearch(searchCriteria);
                    if (!coverageSearchResponse.error) {
                        setAgentData(agentData => ({
                            ...agentData,
                            [selectedModule]: {
                                coverageSearch: coverageSearchResponse
                            }
                        }));
                    }
                    break;
                case modules.marketDynamics.marketDynamics:
                    const { results, totals } = await runMarketDynamicsSearch(searchCriteria);
                    setAgentData(agentData => ({
                        ...agentData,
                        [selectedModule]: {
                            marketDynamicsSearch: results
                        }
                    }));
                    setTotalsRowData(totals, responseKeys.totals);
                    break;
                default:
                    break;
            }
            setSearchStatus(searchStatuses.ran);
        }
    };

    const getUserLists = async (ownerId) => {
        await getMarketAreaLists(ownerId);
        await getOfficeLists(ownerId);
        await getAgentLists(ownerId);
        await getSavedSearchList(ownerId);
    };

    const userAllowedTo = (module) => {
        return module && (!state.allowedModules?.length || state.allowedModules.includes(module));
    };

    const navTo = async (destination, module) => {
        history.replace(destination);
        module && await setSelectedModule(module);
    };

    /// validate the user's settings, so we're only using the MLSs for which the user has an active agent id and/or belongs to an active office
    const setMlsListForMembershipLookup = async (privileges, userAccount) => {
        let officesForLookup = [];
        let activeOffices = [];
        let mlsOffices = [];
        let activeAgents = [];
        if (!!privileges.userOffices?.length) {
            mlsOffices = [].concat(...privileges.userOffices.map(group => {
                return [].concat(...group.officeIds.map(officeId => ({ officeId: officeId, mlsId: group.mlsId })));
            }));
        }
        const shouldDisregardActiveAgents = !![accountTypes.internal, accountTypes.broker]
            .find(type => userAccount?.accountType.includes(type));
        if (!shouldDisregardActiveAgents && !!privileges.agentIds?.length) {
            const mlsAgents = [].concat(...privileges.agentIds.map(group => {
                return [].concat(...group.agentIds.map(agentId => ({ agentId: agentId, mlsId: group.mlsId })));
            }));
            const response = await getAgentInfo(mlsAgents);
            if (!response.error) {
                activeAgents = response.filter(a => !!a.isAgentActive);
            }
        }

        for (const mlsOffice of mlsOffices) {
            if (shouldDisregardActiveAgents) {
                officesForLookup.push(mlsOffice);
            } else if (!!activeAgents.find(agent => agent.office.mlsOfficeId.mlsId === mlsOffice.mlsId)) {
                officesForLookup.push(mlsOffice);
            }
        }

        if (officesForLookup) {
            const response = await getOfficeInfo(removeDuplicates(officesForLookup));
            if (!response?.error) {
                activeOffices = response.filter(office => !!office.isOfficeActive );
                activeOffices.length === 0 && setStateData('userInactive', true, setState);
            }
        }
        return activeOffices;
    };

    const AG_GRID_LICENCE = 'CompanyName=Lone Wolf Technologies and affiliates,LicensedApplication=BrokerMetrics,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=4,LicensedProductionInstancesCount=1,AssetReference=AG-031465,SupportServicesEnd=5_August_2023_[v2]_MTY5MTE5MDAwMDAwMA==099242bb87c29770cf8328fdf1733534';

    return (
        <div className='App'>
            <Modal
                title='Your login credential is inactive'
                show={state.userInactive}
                onClose={navigateToLogout}
                buttons={<div className='w-100 text-center'>
                    <Button
                        dataLwtId='logout-button'
                        color='primary'
                        onClick={navigateToLogout}
                    >
                        {buttonTerms.ok}
                    </Button>
                </div>
                }
            >
                <div className='text-center'>
                    <p>Please contact our Customer Support at</p>
                    <p>
                        <a href='mailto:terradatum.support@lwolf.com'>terradatum.support@lwolf.com</a> or call
                        888-212-4793
                    </p>
                </div>
            </Modal>
            <LinkLwaModal />
            <Suspense fallback={<div>Loading...</div>}>
                <UniversalNavBar
                    module={selectedModule}
                    navItems={state.navItems}
                    userItems={getUserItems(navTo)}
                    helpItems={helpItems}
                />
                <AGGridProvider license={AG_GRID_LICENCE}>
                    <Switch>
                        {userAllowedTo(moduleNames.proficiencyMetrics) && ([
                            <Route exact path={rt.transactions}>
                                <SearchBar
                                    key='agent-production'
                                    module={selectedModule}
                                    mlsProps={mlsProps}
                                />
                                <Page fluid hero showFooter={false}>
                                    <AgentProduction agentData={selectedAgentData}
                                                     module={modules.proficiencyMetrics.transactions} />
                                </Page>
                            </Route>,
                            <Route exact strict path={rt.officeName}>
                                <SearchBar
                                    key='office-name'
                                    module={selectedModule}
                                    mlsProps={mlsProps}
                                />
                                <Page fluid hero showFooter={false}>
                                    <AgentProduction agentData={selectedAgentData}
                                                     module={modules.proficiencyMetrics.offices} />
                                </Page>
                            </Route>,
                            <Route exact strict path={rt.agentName}>
                                <SearchBar
                                    key='agent-name'
                                    module={selectedModule}
                                    mlsProps={mlsProps}
                                />
                                <Page fluid hero showFooter={false}>
                                    <AgentProduction agentData={selectedAgentData}
                                                     module={agentNameModule} />
                                </Page>
                            </Route>,
                            <Route path={Routes.PROF_METRICS.BASE + Routes.PROF_METRICS.AGENT_PROFILE}>
                                <Page fluid hero showFooter={false}>
                                    <AgentProfile
                                        agentData={selectedAgentData}
                                        module={selectedModule}
                                        mlsProps={mlsProps}
                                    />
                                </Page>
                            </Route>,
                            <Route path={Routes.PROF_METRICS.BASE + Routes.PROF_METRICS.COVERAGE_LISTING}>
                                <Page fluid hero showFooter={false}>
                                    <AgentCoverageListing module={selectedModule} />
                                </Page>
                            </Route>,
                            <Route path={Routes.PROF_METRICS.BASE + Routes.PROF_METRICS.LISTING_INFO}>
                                <Page fluid hero showFooter={false}>
                                    <ListingInformationPage agentData={selectedAgentData}
                                                            module={selectedModule} />
                                </Page>
                            </Route>,
                            <Route path={Routes.PROF_METRICS.BASE + Routes.PROF_METRICS.PROD_LISTING}>
                                <Page fluid hero showFooter={false}>
                                    <AgentProductionListings agentData={selectedAgentData}
                                                             module={selectedModule} />
                                </Page>
                            </Route>,
                            <Route exact path={rt.savedAgents}>
                                <SavedAgentsSearchBar />
                                <Page fluid hero showFooter={false}>
                                    <SavedAgents />
                                </Page>
                            </Route>,
                        ])}
                        {userAllowedTo(moduleNames.marketShare) && ([
                            <Route path={[
                                rt.totals + Routes.MARKET_SHARE.OFFICE_LISTING,
                                rt.coverage + Routes.MARKET_SHARE.OFFICE_LISTING
                            ]}>
                                <Page fluid hero showFooter={false}>
                                    <ListingsBreakdown module={selectedModule} />
                                </Page>
                            </Route>,
                            <Route path={[
                                rt.totals + Routes.MARKET_SHARE.OFFICES_BREAKDOWN,
                                rt.coverage + Routes.MARKET_SHARE.OFFICES_BREAKDOWN
                            ]}>
                                <Page fluid hero showFooter={false}>
                                    <OfficesBreakdown module={selectedModule} />
                                </Page>
                            </Route>,
                            <Route path={rt.totals}>
                                <SearchBar
                                    key='market-share-totals'
                                    module={selectedModule}
                                    mlsProps={mlsProps}
                                />
                                <Page fluid hero showFooter={false}>
                                    {selectedModule === modules.marketShare.totals &&
                                    <AGGridProvider license={AG_GRID_LICENCE}>
                                        <MarketShare 
                                            agentData={agentData?.[modules.marketShare.totals]}
                                            module={modules.marketShare.totals} />
                                    </AGGridProvider>
                                    }
                                </Page>
                            </Route>,
                            <Route path={rt.coverage}>
                                <SearchBar
                                    key='market-share-coverage'
                                    module={selectedModule}
                                    mlsProps={mlsProps}
                                />
                                <Page fluid hero showFooter={false}>
                                    {selectedModule === modules.marketShare.coverage &&
                                    <AGGridProvider license={AG_GRID_LICENCE}>
                                        <MarketShare agentData={agentData?.[modules.marketShare.coverage]}
                                                     module={modules.marketShare.coverage} />
                                    </AGGridProvider>
                                    }
                                </Page>
                            </Route>,
                            <Route path={Routes.MARKET_SHARE.BASE + Routes.MARKET_SHARE.LISTING_INFO}>
                                <Page fluid hero showFooter={false}>
                                    <ListingInformation module={selectedModule} />
                                </Page>
                            </Route>
                        ])}
                        {userAllowedTo(moduleNames.marketDynamics) && ([
                            <Route path={officeBreakdownRoute}>
                                <Page fluid hero showFooter={false}>
                                    <MDOfficesBreakdown />
                                </Page>
                            </Route>,
                             <Route path={Routes.MARKET_DYNAMICS.BASE}>
                                <SearchBar
                                    key='market-dynamics'
                                    module={selectedModule}
                                    mlsProps={mlsProps}
                                    />
                                <Page fluid hero showFooter={false}>
                                    {selectedModule === moduleNames.marketDynamics &&
                                    <MarketDynamics agentData={agentData?.[modules.marketDynamics.marketDynamics]}
                                    module={selectedModule} />
                                }
                                </Page>
                            </Route>
                        ])}
                        <Route path={Routes.MY_PROFILE.BASE}>
                            <Page fluid hero showFooter={false}>
                                <Profile userAccounts={state.userAccounts}
                                         isMarketShareAllowed={userAllowedTo(moduleNames.marketShare)}
                                />
                            </Page>
                        </Route>
                        {state.allowedModules && <>
                            <Route exact path='/'>
                                <Redirect to={getFirstToolRoute(state.allowedModules)} />
                            </Route>
                            <Route path='*'>
                                <Redirect to={getFirstToolRoute(state.allowedModules)} />
                            </Route>
                        </>
                        }
                        <Route exact path={Routes.AUTH.LOG_OUT}>
                            <Logout />
                        </Route>
                    </Switch>
                </AGGridProvider>
            </Suspense>
        </div>
    );
};

export default App;
