import Keycloak from 'keycloak-js';
import { getEndpoint, ID_SITE } from '../providers/endpoint.provider';
import { useCommonStore } from '../store/store';
import jwt_decode from 'jwt-decode';

export const initConfig = {
    responseMode: 'query',
    promiseType: 'native',
    onLoad: 'login-required',
    'checkLoginIframe': false  // fix infinite reloading problem
};

const KEYCLOAK_URL = `${getEndpoint(ID_SITE)}/auth`;

const keycloak = new Keycloak({
    realm: 'terradatum',
    url: KEYCLOAK_URL,
    'ssl-required': 'external',
    clientId: 'aergo',
    'public-client': true,
    'verify-token-audience': true,
    'use-resource-role-mappings': true,
    'confidential-port': 0
});

export const maybeUpdateToken = () => {

    keycloak.onTokenExpired = () => {
        window.location.href = '/logout'
    };
    
    keycloak.updateToken(120).then((refreshed) => {
        if (refreshed) {
            console.debug('Token refreshed');
            useCommonStore.setState({ token: keycloak.token, tokenInfo: jwt_decode(keycloak.token) });
        } else {
            //console.debug('Token not refreshed, valid for ' + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        }
    }).catch(err => {
        console.error(`Failed to refresh token. ${err}.`);
    });
};

export const start24HourTimer = () => {
    let timer = 0;
    const minute = 1000 * 60; // One minute in milliseconds
    const maxTime = 600 * minute; // 10 hours
    const tick = () => {
        timer += minute;
        if (timer >= maxTime) {
            timer = 0;
        }
        maybeUpdateToken();
        setTimeout(tick, minute);
    };
    tick();
};

export const getKeyCloak = () => keycloak;
