import { newSendApiRequest } from './service-gateway';
import { TimePeriods } from '../constants';
import { CANCELED_ENDPOINT_CODE, MAX_ENDPOINT_RETRIES } from '../constants/service';

export const getTimeIntervals = async () => {
    return await newSendApiRequest(
        'Time_interval_descriptions',
        [{
            parameter: 'intervals_request',
            value: JSON.stringify({ intervalTypes: Object.values(TimePeriods).filter(p => p !== TimePeriods['Custom Date']) })
        }]
    );
};

export const retryEndpoint = async ({retries = MAX_ENDPOINT_RETRIES, fetchFunction}) => {
    try {
        const response = await fetchFunction();

        if(response.ok) return response.json();

        if(response?.error?.code === CANCELED_ENDPOINT_CODE && retries > 0)
            return await retryEndpoint({retries: retries - 1, fetchFunction});

        return response;

    } catch (error) {
        return { error };
    }

};

export const addUserId = userId => ({ parameter: 'userId', value: `${userId}` });
