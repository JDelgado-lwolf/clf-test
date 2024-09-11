import React, { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth/store';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, getLoginInputs, userTypes } from '../../constants/auth';
import Loader from '@lwt-helix/loader';
import { validateEmail } from '../../common/helpers/validation';
import { loginTerms as lt, validationMessages as vm } from '../../constants';
import { setStateData } from '../../common/helpers/state';
import { labelsByApp } from '../../constants/appLabels';
import { appLabels, runningApp } from '../../constants/app';

const LoginForm = ({ submitForm, children }) => {
    const history = useHistory();
    const currentRoute = history.location.pathname;

    const {
        authError,
        isLoading,
        setAuthErrorByRoute,
    } = useAuthStore(state => ({
        authError: state.authErrorByRoute[currentRoute],
        isLoading: state.isLoadingByRoute[currentRoute],
        setAuthErrorByRoute: state.setAuthErrorByRoute,
    }));

    const [state, setState] = useState({
        credentialsValidationMsg: undefined,
        emailValidationMsg: undefined,
        emailValue: undefined,
        passwordValidationMsg: undefined,
        passwordValue: undefined,
    });

    useEffect(() => {
        const isInvalidPassword = state.passwordValue?.length < PASSWORD_MIN_LENGTH;
        const isInvalidEmail = state.emailValue?.length && !validateEmail(state.emailValue);

        const appName = appLabels[runningApp];

        const validationConfig = [
            { isInvalid: isInvalidPassword, field: 'passwordValidationMsg', errorMsg: vm.invalidPassword },
            { isInvalid: isInvalidEmail, field: 'emailValidationMsg', errorMsg: vm.invalidEmail },
            { isInvalid: state.passwordValue?.length === 0, field: 'passwordValidationMsg', errorMsg: vm.requiredPassword },
            { isInvalid: state.emailValue?.length === 0, field: 'emailValidationMsg', errorMsg: vm.requiredEmail },
            { isInvalid: state.userType === userTypes.invalid, field: 'credentialsValidationMsg', errorMsg: vm.authenticationFailed },
            { isInvalid: state.userType === userTypes.inactiveXbm, field: 'credentialsValidationMsg', errorMsg: vm.invalidLogin},
            { isInvalid: state.userType === userTypes.inactiveKeycloak, field: 'credentialsValidationMsg', errorMsg: vm.inactiveKeycloak(appName)},
        ];

        setStateData('emailValidationMsg', undefined , setState);
        setStateData('passwordValidationMsg', undefined , setState);
        setStateData('credentialsValidationMsg', undefined , setState);

        validationConfig.forEach(config => {
            const { isInvalid, field, errorMsg } = config;
            setState(prevState => ({
                ...prevState,
                [field]: isInvalid ? errorMsg : prevState[field]
            }));
        });

    }, [state.passwordValue, state.emailValue, state.userType]);

    const handleLogInButton = async (e) => {
        e.preventDefault();
        if (!isLoginDataValid) return;

        submitForm(state, setState, history);
    };

    const handleInputChange = (e, type) => {
        setAuthErrorByRoute(undefined, currentRoute);
        setStateData(`${type}Value`, e.target.value, setState);
    };

    const isLoginDataValid = !isLoading && !!state.passwordValue?.length &&
                        !!state.emailValue?.length &&
                        getLoginInputs(state).map(input => input.errorMessage).every(val => !val);

    return (
        <form className='login-form d-flex flex-column'>
            <div className='form-header'>
                <p>{labelsByApp[runningApp].signIn}</p>
            </div>
            <p className='text-danger text-center'>{state.credentialsValidationMsg || authError}</p>
            {getLoginInputs(state).map((input) => {
                const {id, type, errorMessage} = input
                return (
                    <div className='form-item' key={id}>
                        <input
                            {...input}
                            className={`login-input ${errorMessage ? 'input-error': ''}`}
                            maxLength={PASSWORD_MAX_LENGTH}
                            autoComplete='off'
                            onChange={(e)=>handleInputChange(e, type)}
                            disabled={isLoading}
                        />
                        {errorMessage && <span className='msg-error'>{errorMessage}</span>}
                    </div>
                );
            })}
            <button
                className='login-btn d-flex justify-content-center mb-4'
                disabled={!isLoginDataValid}
                onClick={handleLogInButton}
                >
                    {isLoading && <Loader />}
                    <span className='mx-2'>{lt.login}</span>
            </button>
            {children}
        </form>
    );
};

LoginForm.propTypes = {
    submitForm: PropTypes.func,
    children: PropTypes.node
};

export default LoginForm;
