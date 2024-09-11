import jwtDecode from "jwt-decode";
import PlatformService from "@lwolf-common/platform-service/build/PlatformService";
import { getIsTokenExpired, expiredTokenActionByToken } from "../../common/helpers/auth";
import { getKeycloakToken } from "../../service/keycloak";
import { getUserAccounts, getUserAccountsById } from "../../service/account";
import { initialAuthState } from "./store";
import {
    LWA_TOKEN_OBJECT_IDENTIFIER,
    SIGN_UP_MODE,
    getUserTypeByError,
    tokenTypes,
    userTypes
} from "../../constants/auth";
import { msToDays } from "../../common/helpers/utilities";
import {
    urlKeycloakToken,
    urlPlatformConnection,
    urlPlatformLaunch,
} from "../../constants/service";
import {
    navigateToHomeAndReload,
    navigateToPlatformAuth,
    navigateToPlatformUI,
    navigateToPlatformConnection,
} from "../../constants/nav";
import {
    PLATFORM_DOMAIN,
    getEndpoint,
    PLATFORM_LOCAL_LAUNCH,
    accountIdsAllowedForXAMByEnv,
    runningEnv
} from "../../providers/endpoint.provider";
import { Routes } from "../../common/routes/routes";
import { sendUserInvitation } from "../../login/components/helpers";
import { useCommonStore, useSavedAgentsStore, useSearchStore } from "../store";
import { ownerTypes, validationMessages as vm } from "../../constants";
import { produce } from 'immer';
import { appIds, isAgentMetrics } from "../../constants/app";

export const actions = (set, get) => ({
    ...loginActions(set, get),
    incrementAskMeLaterAttempt: () => {
        if (get().isLoadingLinkLwa) return;

        const now = new Date();
        const currentAttempts = get().askMeLaterAttempts;
        set({
            askMeLaterAttempts: currentAttempts + 1,
            lastAskMeLaterAt: now,
            shouldShowLinkLwaModal: false,
        })
    },
    handleShouldShowLinkLwaModal: (hasLwaId) => {
        // This is temporary until we integrate Unified platform with Agent Metrics
        if (isAgentMetrics) return;
        const lastAskedAt = new Date (get().lastAskMeLaterAt);
        const now = new Date();

        const dateDiffInDays = msToDays(now - lastAskedAt);
        const shouldShowByDateDiff = isNaN(dateDiffInDays) || dateDiffInDays > 1;

        if (shouldShowByDateDiff && !hasLwaId) set({shouldShowLinkLwaModal: true});
    },
    sendLwaInvitation: async (user, token) => {
        const userLWAinfo = await sendUserInvitation(user, token);
        return userLWAinfo?.id;
    },
    handleLinkLwa: async (user) => {
        if (get().isLoadingLinkLwa) return;
        try {
            set({ isLoadingLinkLwa: true,  });
            const lwid = await get().sendLwaInvitation(user);

            if(!lwid) {
                get().setInvitationError();
                return;
            };

            set({ isLoadingLinkLwa: false, shouldShowLinkLwaModal: false });

            const redirectUrl = urlPlatformConnection(lwid);
            const authParams = {
                email: user.email,
                redirectUrl,
                mode: SIGN_UP_MODE
            }
            navigateToPlatformAuth(authParams);
        } catch (error) {
            get().setInvitationError();
        }
    },
    setInvitationError: () => {
        set({
            isLoadingLinkLwa: true,
            errorLinkingLwa: vm.unableToLink,
        })
        setTimeout(() => {
            set({
                isLoadingLinkLwa: false,
                shouldShowLinkLwaModal: false,
                errorLinkingLwa: undefined,
            })
        }, 3000);
    },
    authLwaUser: (token, platformServiceClient) => {
        const tokenInfo = jwtDecode(token);
        const ownerId = tokenInfo[LWA_TOKEN_OBJECT_IDENTIFIER]?.uid.toLowerCase();
        set({
            error: undefined,
            platformServiceClient,
            token,
            tokenInfo: {
                ...tokenInfo,
                [LWA_TOKEN_OBJECT_IDENTIFIER]: {
                    ...tokenInfo[LWA_TOKEN_OBJECT_IDENTIFIER],
                    uid: ownerId
                },
            },
            tokenType: tokenTypes.LWA,
            ownerType: ownerTypes.lwa,
            ownerId
        });
    },
    authKeycloakUser: async (state, setState, history) => {
        try {
            setState(prev => ({
                ...prev,
                isLoading: true,
            }));

            const updateUserType = (userType) => {
                setState(prev => ({
                    ...prev,
                    userType,
                    isLoading: false
                }));
            };

            const loginUser = (token, isLegacy) => {
                get().setKeycloakToken(token, isLegacy);
                navigateToHomeAndReload(history);
            };

            const token = await getKeycloakToken(
                urlKeycloakToken,
                state.emailValue,
                encodeURIComponent(state.passwordValue),
            );

            if (token.error) {
                updateUserType(
                    getUserTypeByError[token.error_description]
                        || userTypes.invalid);
                return;
            }

            const accessToken = token.access_token;
            const decodedToken = jwtDecode(accessToken);
            const userAccounts = await getUserAccounts(decodedToken.email, accessToken);

            // This checks when service-gateway is down
            if (userAccounts.error === 503) {
                get().setAuthError(vm.connectionError, history);
                return;
            }

            const isLegacyUser = userAccounts?.error === 404;

            if (isLegacyUser) {
                loginUser(accessToken, true)
                return;
            }

            if (isAgentMetrics){
                const hasAccessToAgentMetrics = get().verifyAgentMetricsUser(userAccounts);
                if (!hasAccessToAgentMetrics) {
                    updateUserType(
                        getUserTypeByError[token.error_description]
                            || userTypes.invalid);
                    return;
                }
            }
            const hasLwaId = userAccounts?.user?.lwaId;
            if (hasLwaId) {
                const authParams = {
                    email: state.emailValue,
                    redirectUrl: urlPlatformLaunch
                };
                navigateToPlatformAuth(authParams);
                return;
            };

            //TODO: add account selector logic here, right now select the first option
            const selectedAccount = userAccounts.accounts[0];
            const isInactiveXbmUser = !selectedAccount.accountActive || !selectedAccount.userActive;

            if (isInactiveXbmUser) return updateUserType(userTypes.inactiveXbm);

            setState(prev => ({
                ...prev,
                userType: undefined,
                isLoading: false,
            }));

            loginUser(accessToken);
        } catch (error) {
            console.log({error});
            setState(prev => ({
                ...prev,
                isLoading: false,
            }));
            set({
                authError: vm.unknownError,
                token: undefined,
                tokenInfo: undefined,
                tokenType: undefined,
                platformServiceClient: undefined,
            });
        }
    },
    verifyAgentMetricsUser: userAccounts => {
        // This approach is temporary for demo users.
        return userAccounts.accounts.filter(account =>
            accountIdsAllowedForXAMByEnv[runningEnv].includes(account.id)).length > 0;
    },
    setKeycloakToken: (token, isLegacyUser = false) => {
        const tokenInfo = jwtDecode(token);
        const ownerId = tokenInfo?.sub;
        set({
            token,
            isLegacyUser,
            tokenInfo: jwtDecode(token),
            tokenType: tokenTypes.KEYCLOAK,
            ownerType: ownerTypes.user,
            ownerId,
        })
    },
    clearToken: () => set({
        token: undefined,
        tokenInfo: undefined,
        tokenTypes: undefined
    }),
    initPlatform: async (token, history) => {
        try {
            set({ authError: undefined });
            const storedToken = get().token;
            const localToken = JSON.parse(localStorage.getItem('auth_state')).state?.token;
            const decodedLocalToken = localToken && jwtDecode(localToken);

            if (!token && !storedToken) {
                navigateToPlatformUI();
                return;
            }

            if(!token && storedToken) {
                navigateToHomeAndReload(history);
                return;
            }

            const tokenInfo = jwtDecode(token);
            const localLwid = decodedLocalToken?.[LWA_TOKEN_OBJECT_IDENTIFIER]?.uid;
            const incomingLwid = tokenInfo?.[LWA_TOKEN_OBJECT_IDENTIFIER]?.uid.toLowerCase();
            const xbmUserIdFromToken = tokenInfo[LWA_TOKEN_OBJECT_IDENTIFIER]?.apps?.xbm?.uid;

            if (!xbmUserIdFromToken) {
                navigateToPlatformUI();
                return;
            }

            if (localLwid && localLwid !== incomingLwid) {
                navigateToHomeAndReload(history);
                return;
            }

            const userAccounts = await getUserAccountsById(xbmUserIdFromToken, incomingLwid, token);
            const isLwaUser = userAccounts?.user?.lwaId;

            if (!isLwaUser) {
                get().setAuthErrorByRoute(vm.connectionMismatch(tokenInfo.email), Routes.AUTH.LOG_IN, history);
                return;
            }

            const platformService = await PlatformService.initialize({
                lwDomain: getEndpoint(PLATFORM_DOMAIN),
                token,
                appId: appIds.xbm,
                lwaOnly: true,
                luParamSupplier: () => getEndpoint(PLATFORM_LOCAL_LAUNCH)
            });

            useCommonStore.getState().resetStore();
            useSearchStore.getState().resetStore();

            get().authLwaUser(token, platformService);

            const appSections = await platformService.getAppSections();
            set({ appSections: appSections });

            navigateToHomeAndReload(history);
        } catch (error) {
            console.log({error});
            navigateToPlatformUI();
        }
    },
    setAuthErrorByRoute: (errorMessage, route, history) => {
        set(produce(state => {
            state.authErrorByRoute[route] = errorMessage;
            state.token = undefined;
            state.tokenInfo = undefined;
            state.platformServiceClient = undefined;
        }));
        history && history.replace(Routes.AUTH.LOG_IN);
    },
    logout: (history) => {
        useCommonStore.getState().resetStore();
        useSearchStore.getState().resetStore();
        useSavedAgentsStore.getState().resetStore();
        get().resetStore();
        history.replace(Routes.AUTH.LOG_IN);
        window.location.reload();
    },
    handleExpiredToken: () => {
        const tokenInfo = get().tokenInfo;
        const tokenType = get().tokenType;

        const isTokenExpired = getIsTokenExpired(tokenInfo);

        if(!isTokenExpired) return;

        expiredTokenActionByToken[tokenType]();
    },
    resetStore: () => {
        const askMeLaterAttempts = get().askMeLaterAttempts;
        const lastAskMeLaterAt = get().lastAskMeLaterAt;
        set({...initialAuthState, askMeLaterAttempts, lastAskMeLaterAt});
    }
});

const loginActions = (set, get) => ({
    setIsLoadingByRoute: (route, isLoading) => {
        set(produce(state => {
            state.isLoadingByRoute[route] = isLoading;
        }));
    },
    getUserByEmail: async (state, setState, currentRoute) => {
        try {
            const token = await getKeycloakToken(
                urlKeycloakToken,
                state.emailValue,
                encodeURIComponent(state.passwordValue),
            );

            if (token.error) {
                get().updateUserType(
                    getUserTypeByError[token.error_description]
                        || userTypes.invalidLogin, setState);
                return;
            }

            const accessToken = token.access_token;
            const decodedToken = jwtDecode(accessToken);
            const userAccounts = await getUserAccounts(decodedToken.email, accessToken);

            // This checks when service-gateway is down
            if (userAccounts.error === 503) {
                get().authErrorByRoute(vm.connectionError, currentRoute, history);
                return;
            }

            return { accessToken, userAccounts };
        } catch (error) {
            console.error(error);
        } finally {
            get().setIsLoadingByRoute(currentRoute, false);
        }
    },
    updateUserType: (userType, setState) => {
        setState(prev => ({
            ...prev,
            userType,
        }));
    },
    loginUser: (token, history) => {
        get().setKeycloakToken(token);
        navigateToHomeAndReload(history);
    },
    setKeycloakToken: (token) => set({
        token,
        tokenInfo: jwtDecode(token),
        tokenType: tokenTypes.KEYCLOAK,
    }),
    authKeycloakUser: async (state, setState, history) => {
        const currentRoute = Routes.AUTH.LOG_IN;
        const setIsLoading = (isLoading) => {
            get().setIsLoadingByRoute(currentRoute, isLoading);
        }
        try {
            setIsLoading(true);
            const { accessToken, userAccounts } = await get().getUserByEmail(state, setState, currentRoute);

            const isLegacyUser = userAccounts?.error === 404;

            if (isLegacyUser) {
                get().loginUser(accessToken, history);
                return;
            }

            const hasLwaId = userAccounts?.user?.lwaId;
            if (hasLwaId) {
                const authParams = {
                    email: state.emailValue,
                    redirectUrl: urlPlatformLaunch
                };
                navigateToPlatformAuth(authParams);
                return;
            };

            //TODO: add account selector logic here, right now select the first option
            const selectedAccount = userAccounts.accounts[0];
            const isInactiveXbmUser = !selectedAccount.accountActive || !selectedAccount.userActive;

            if (isInactiveXbmUser) {
                get().updateUserType(userTypes.inactiveXbm, setState)
                setIsLoading(false);
                return;
            };

            setState(prev => ({
                ...prev,
                userType: undefined,
            }));

            get().loginUser(accessToken, history);
        } catch (error) {
            console.log({error});
            get().setAuthErrorByRoute(vm.unknownError, currentRoute);
        } finally {
            setIsLoading(false);
        }
    },
    connectKeycloakUser: async (state, setState) => {
        const currentRoute = Routes.AUTH.CONNECT;
        if (get().isLoadingByRoute[currentRoute]) return;

        const setIsLoading = (isLoading) => {
            get().setIsLoadingByRoute(currentRoute, isLoading);
        };

        const setAuthError = (errorMessage) => {
            get().setAuthErrorByRoute(errorMessage, currentRoute);
        };

        try {
            setIsLoading(true);
            const { accessToken, userAccounts } = await get().getUserByEmail(state, setState, currentRoute);

            if(!userAccounts) return;

            const isLegacyUser = userAccounts?.error === 404;

            if (isLegacyUser) {
                setAuthError(vm.unableToConnect);
                setIsLoading(false);
                return;
            }

             //TODO: add account selector logic here, right now select the first option
             const selectedAccount = userAccounts.accounts[0];
             const isInactiveXbmUser = !selectedAccount.accountActive || !selectedAccount.userActive;

             if (isInactiveXbmUser) {
                get().updateUserType(userTypes.inactiveXbm, setState);
                setIsLoading(false);
                return;
            }

            const hasLwaId = userAccounts?.user?.lwaId;

            if (hasLwaId) {
                setAuthError(vm.accountAlreadyConnected);
                setIsLoading(false);
                return;
            }

            const userInfo = userAccounts.user;
            const lwaId = await get().sendLwaInvitation(userInfo, accessToken);

            if(!lwaId) {
                setAuthError(vm.unableToLink);
                setIsLoading(false);
                return;
            }

            navigateToPlatformConnection(lwaId);

            get().updateUserType(undefined, setState);
        } catch (error) {
            console.error(error);
            setAuthError(vm.unknownError);
            setIsLoading(false);
        }
    }
});
