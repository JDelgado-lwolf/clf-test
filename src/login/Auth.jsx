import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useQuery } from '../common/hooks/location';
import Loader from '@lwt-helix/loader';
import { useAuthStore } from '../store/auth/store';

const Auth = () => {
    const { initPlatform } =
        useAuthStore(({ initPlatform }) => ({ initPlatform }));

    const query = useQuery();
    const history = useHistory();
    const platformToken = query.get('token');

    useEffect(() => {
        const initPlatformClient = async (token) => {
            await initPlatform(token, history);
        }
        initPlatformClient(platformToken);
    }, [initPlatform, platformToken, history]);

    return (
        <div className='d-flex flex-grow-1 align-items-center justify-content-center'>
            <Loader />
        </div>
    );
};

export default Auth;
