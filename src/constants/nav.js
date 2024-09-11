import { Routes } from "../common/routes/routes";
import { officeBreakdownRoute } from "../market-dynamics/constants/routes";
import { urlPlatformAuth, urlPlatformConnection, urlPlatformLaunch } from "./service";

export const navigateToPlatformConnection = (lwid) => window.location.replace(urlPlatformConnection(lwid));

export const navigateToPlatformUI  = () => window.location.replace(urlPlatformLaunch);

export const navigateToLogin = () => window.location.replace(Routes.AUTH.LOG_IN);

export const navigateToLogout = () => window.location.replace(Routes.AUTH.LOG_OUT);

export const navigateToAuth = () => window.location.replace(Routes.AUTH.BASE);

export const navigateToPlatformAuth = (authParams) => window.location.replace(urlPlatformAuth(authParams));

export const navigateToHomeAndReload = (history) => {
    history.replace(Routes.HOME.BASE);
    location.reload();
};

export const routesToShowBackNavBar = [
    officeBreakdownRoute,
];
