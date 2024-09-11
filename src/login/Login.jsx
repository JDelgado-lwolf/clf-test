import React from 'react';
import { useAuthStore } from '../store/auth/store';
import LoginFormContainer from './components/LoginFormContainer';
import LoginForm from './components/LoginForm';
import { componentsByApp } from '../constants/AppComponents';
import { runningApp } from '../constants/app';

const Login = () => {
    const {
        authKeycloakUser,
    } = useAuthStore(state => ({
        authKeycloakUser: state.authKeycloakUser,
    }));

    const LoginButtons = () => componentsByApp[runningApp].LoginButons();

    return (
        <LoginFormContainer>
            <LoginForm submitForm={authKeycloakUser}>
                <LoginButtons />
            </LoginForm>
        </LoginFormContainer>
    );
};

export default Login;
