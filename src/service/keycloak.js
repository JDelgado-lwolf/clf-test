import { getPostRequestObjNoToken } from '../common/helpers/api';

export const getKeycloakToken = async (url, email, password) => {
    try {
        const response = await fetch (
            getPostRequestObjNoToken(
                url,
                `username=${email}&password=${password}&client_id=aergo&grant_type=password`
            )
        );
        return await response.json();
    } catch (error) {
        return { error };
    }
};
