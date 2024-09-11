import { tokenTypes } from "../../constants/auth";
import { navigateToLogout, navigateToPlatformUI } from "../../constants/nav";

export const getIsTokenExpired = (tokenInfo) => {
    if (!tokenInfo) return;
    const tokenExpireDate = new Date(tokenInfo.exp * 1000);
    const now = new Date();
    return now > tokenExpireDate;
};

export const expiredTokenActionByToken = ({
    [tokenTypes.KEYCLOAK]: () => navigateToLogout(),
    [tokenTypes.LWA]: () => navigateToPlatformUI(),
});
