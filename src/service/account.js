import { sendApiRequest } from './service-gateway';

export const getUserAccounts = async (email, token) => {
    return await sendApiRequest(
        'profile_user_get_by_email',
        [
            { parameter: 'email', value: `${email}` }
        ],
        undefined,
        token
    );
};

export const getUserAccountsById = async (userId, lwaId, token) => {
    return await sendApiRequest(
        'profile_user_get_by_id_and_lwaid',
        [
            { parameter: 'lwaId', value: `${lwaId}` },
            { parameter: 'id', value: `${userId}` }
        ],
        undefined,
        token
    );
};

export const getUserPrivileges = async (accountId, userId) => {
    return await sendApiRequest(
        'user_account_privileges',
        [
            {
                parameter: 'accountId',
                value: `${accountId}`
            },
            {
                parameter: 'userId',
                value: `${userId}`
            }
        ]
    );
};

/**
 * @deprecated Since XBM-Admin release. Will be deleted post-migration.
 */
export const getUserProfile = async (username) => {
    return await sendApiRequest(
        'User_profile',
        [
            {
                parameter: 'userName',
                value: `${username}`
            }
        ]
    );
};

