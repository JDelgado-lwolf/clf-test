import React from 'react';
import LoginForm from './components/LoginForm';
import { useAuthStore } from '../store/auth/store';
import LoginFormContainer from './components/LoginFormContainer';

const Connect = () => {
    const { connectKeycloakUser } = useAuthStore(
        ({ connectKeycloakUser }) => ({ connectKeycloakUser }),
    );

    return (
        <LoginFormContainer>
            <LoginForm submitForm={connectKeycloakUser} />
        </LoginFormContainer>
    );
};

export default Connect;
