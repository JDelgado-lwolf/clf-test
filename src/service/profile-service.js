import { getEndpoint, PROFILE_SERVICE } from "../providers/endpoint.provider";
import { getPostRequestObj } from "../common/helpers/api";
import { useAuthStore } from "../store/auth/store";

export const sendProfileServiceRequest = async (endpoint, data, propsToken) => {
    const token = propsToken || useAuthStore.getState().token;

    try {
        const url = `${getEndpoint(PROFILE_SERVICE)}/${endpoint}`
        const response = await fetch(getPostRequestObj(url, token, data));
        return await response.json();
    } catch (error) {
        console.error(error);
        return { error };
    }
};
