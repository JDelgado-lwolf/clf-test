import { loginTerms as lt, ownerTypes } from ".";
import { Routes } from "../common/routes/routes";

export const userTypes = Object.freeze({
    invalid: 'invalid',
    inactiveKeycloak: 'inactiveKeycloak',
    inactiveXbm: 'inactiveXbm',
});

export const unprotectedRoutes = [
    Routes.AUTH.BASE,
    Routes.AUTH.LOG_IN,
    Routes.AUTH.CONNECT,
];

export const tokenTypes = Object.freeze({
    LWA: 'LWA',
    KEYCLOAK: 'KEYCLOAK',
});

export const userNameByTokenType = (tokenInfo) => ({
    [tokenTypes.KEYCLOAK]: tokenInfo.preferred_username,
    [tokenTypes.LWA]: tokenInfo.nickname,
});

export const LWA_TOKEN_OBJECT_IDENTIFIER = 'http://lwt';

export const getOwnerIdByTokenInfo =  ({
    [tokenTypes.KEYCLOAK]: (tokenInfo) => tokenInfo?.sub,
    [tokenTypes.LWA]: (tokenInfo) => tokenInfo?.[LWA_TOKEN_OBJECT_IDENTIFIER]?.uid,
});

export const keycloakResponseDescription = Object.freeze({
    accountDisabled: 'Account disabled',
    invalidUser: 'Invalid user credentials'
});

export const getUserTypeByError = {
    [keycloakResponseDescription.accountDisabled]: userTypes.inactiveKeycloak,
    [keycloakResponseDescription.invalidUser]: userTypes.invalid,
};

export const ASK_ME_LATER_MAX_ATTEMPTS = 3;
export const PASSWORD_MAX_LENGTH = 100;
export const PASSWORD_MIN_LENGTH = 8;

export const SIGN_UP_MODE = 'signup';

export const ownerTypeByTokenType = ({
    [tokenTypes.KEYCLOAK]: ownerTypes.user,
    [tokenTypes.LWA]: ownerTypes.lwa,
});

export const getLoginInputs = (state) => [
    {
        id: 'userName',
        name: 'username',
        placeholder: lt.email,
        type: 'email',
        errorMessage: state.emailValidationMsg,
    },
    {
        id: 'password',
        name: 'password',
        placeholder: lt.password,
        type: 'password',
        errorMessage: state.passwordValidationMsg,
    }
];
