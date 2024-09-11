import { createWithEqualityFn } from "zustand/traditional";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { actions } from "./actions";
import { Routes } from "../../common/routes/routes";

export const initialAuthState = {
    askMeLaterAttempts: 0,
    authErrorByRoute: {
        [Routes.AUTH.CONNECT]: undefined,
        [Routes.AUTH.LOG_IN]: undefined,
    },
    errorLinkingLwa: undefined,
    isLegacyUser: undefined,
    isLoadingLinkLwa: false,
    lastAskMeLaterAt: undefined,
    platformServiceClient: undefined,
    shouldShowLinkLwaModal: false,
    token: undefined,
    tokenInfo: undefined,
    tokenType: undefined,
    appSections: undefined,
    ownerType: undefined,
    ownerId: undefined,
    isLoadingByRoute: {
        [Routes.AUTH.CONNECT]: false,
        [Routes.AUTH.LOG_IN]: false,
    },
};

const authStore = (set, get) => ({
    ...initialAuthState,
    ...actions(set, get)
});

export const useAuthStore = createWithEqualityFn(
    devtools(
        persist(
            authStore,
            {
                name: 'auth_state',
                storage: createJSONStorage(() => localStorage)
            }
        )
    )
);
