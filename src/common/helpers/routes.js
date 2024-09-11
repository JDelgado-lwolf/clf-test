import { defaultModules, moduleRoutes } from '../../constants';
import { officeBreakdownRoute as mDOfficesBreakdownRoute } from '../../market-dynamics/constants/routes';
import { Routes } from '../routes/routes';

//This function will retrieve the route of the first tool App depending on user permissions.
export const getFirstToolRoute = (allowedModules) => {
    return moduleRoutes[getFirstDefaultModule(allowedModules)];
};

export const getFirstDefaultModule = (allowedModules) => {
    const [_, defaultModule] = Object.entries(defaultModules).find(([key]) => {
        return allowedModules?.includes(key);
    });
    return defaultModule;
};

export const getAllowedModuleByUrl = ({ url, allowedModules, modulesByRouteAndNameAssociation }) => {
    const moduleByUrl = modulesByRouteAndNameAssociation.find(({ route }) => route === url);
    if (allowedModules?.includes(moduleByUrl?.moduleName)) {
        return moduleByUrl?.module;
    }
    return getFirstDefaultModule(allowedModules);
};

export const maskUrlVar = value => encodeURIComponent(value);
export const unmaskUrlVar = value => decodeURIComponent(value);

export const backButtonByRoute = Object.freeze({
    [mDOfficesBreakdownRoute]: (history) => history.replace(Routes.MARKET_DYNAMICS.BASE),
});
