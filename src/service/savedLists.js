import { sendApiRequest } from './service-gateway';
import { useAuthStore } from '../store/auth/store';
import { useCommonStore } from '../store/store';
import { ownerTypeByTokenType } from '../constants/auth';
import { addUserId } from './misc';
import { runningApp } from '../constants/app';

export const getUserSavedSearches = async (ownerId, module, searchType) => {
    const tokenType = useAuthStore.getState()?.tokenType;
    const id = useCommonStore.getState()?.userInfo?.id;
    const params = [
        { parameter: 'ownerId', value: `${ownerId}` },
        { parameter: 'ownerType', value: `${ownerTypeByTokenType[tokenType]}`},
        { parameter: 'application', value: runningApp },
        { parameter: 'module', value: `${module}` },
        { parameter: 'searchType', value: `${searchType}` }
    ];
    if (id) params.push(addUserId(id));
    return await sendApiRequest(
        'Searches_MLS_Member',
        [ ...params ]
    );
};

export const getMarketAreaLists = async (ownerId) => {
    const tokenType = useAuthStore.getState()?.tokenType;
    const id = useCommonStore.getState()?.userInfo?.id;
    const params = [
        { parameter: 'ownerId', value: `${ownerId}` },
        { parameter: 'ownerType', value: `${ownerTypeByTokenType[tokenType]}`},
        { parameter: 'application', value: runningApp },
    ];
    if (id) params.push(addUserId(id));
    return await sendApiRequest(
        'Areas_filter',
        [ ...params ]
    );
};

export const getOfficeLists = async (ownerId) => {
    const tokenType = useAuthStore.getState()?.tokenType;
    const id = useCommonStore.getState()?.userInfo?.id;
    const params = [
        { parameter: 'ownerId', value: `${ownerId}` },
        { parameter: 'ownerType', value: `${ownerTypeByTokenType[tokenType]}`},
        { parameter: 'application', value: runningApp }
    ];
    if (id) params.push(addUserId(id));
    return await sendApiRequest(
        'OfficeList_get',
        [ ...params ]
    );
};

export const getAgentLists = async (ownerId) => {
    const tokenType = useAuthStore.getState()?.tokenType;
    const id = useCommonStore.getState()?.userInfo?.id;
    const params = [
        { parameter: 'ownerId', value: `${ownerId}` },
        { parameter: 'ownerType', value: `${ownerTypeByTokenType[tokenType]}`},
        { parameter: 'application', value: runningApp }
    ]
    if (id) params.push(addUserId(id));
    return await sendApiRequest(
        'Agent_lists',
        [ ...params ]
    );
};

export const getComparisonSetsByUser = async (userId) => {
    return await sendApiRequest(
        'MlsObjects_by_user',
        [
            { parameter: 'ownerId', value: `${userId}` },
            { parameter: 'ownerType', value: "userId" },
            { parameter: 'objectType', value: "comparison_set" }
        ]
    );
};
