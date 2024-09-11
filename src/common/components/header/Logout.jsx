import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Loader from '@lwt-helix/loader';
import { useAuthStore } from '../../../store/auth/store';

const Logout = () => {
    const history = useHistory();
    const { logout } = useAuthStore(({logout}) => ({logout}));

    useEffect(() => {
        logout(history);
    }, []);

    return <Loader />;
};

export default Logout;
