import React from "react";
import { HelixIcon } from '@lwt-helix/helix-icon';
import { wolfie } from '@lwt-helix/helix-icon/outlined';
import { Button } from "@lwt-helix/buttons";
import Tooltip from "@lwt-helix/tooltip";
import { loginTerms as lt} from "../../constants";
import { navigateToPlatformUI } from "../../constants/nav";
import { useAuthStore } from "../../store/auth/store";
import { Routes } from "../../common/routes/routes";
import { appLabels, runningApp } from "../../constants/app";

const SignInLWAButton = () => {
    const {
        isLoading,
    } = useAuthStore(({ isLoadingByRoute }) => ({
        isLoading: isLoadingByRoute[Routes.AUTH.LOG_IN],
    }));

    const appName = appLabels[runningApp];

    const handleSignInClick = (e) => {
        if (isLoading) return;

        e.preventDefault();
        useAuthStore.setState({authError: undefined});
        navigateToPlatformUI();
    };

    return (
        <>
            <Button
                id='lwa-sign-in-btn'
                dataLwtId='lwa-sign-in-btn'
                onClick={handleSignInClick}
                className={`sign-lwa d-flex justify-content-center align-items-center mt-4 p-0`}
                color="text"
                disabled={isLoading}
            >
                <HelixIcon icon={wolfie} className='wolfie-icon mr-2' />
                {lt.signInLWA}
            </Button>
            <Tooltip id='lwa-tooltip' target='lwa-sign-in-btn' placement='bottom'>
                {lt.lwaTooltip(appName)}
            </Tooltip>
        </>
    );
};

export default SignInLWAButton;
