import React from 'react'
import { Button } from '@lwt-helix/buttons';
import { useAuthStore } from '../../store/auth/store';
import { buttonTerms } from '../../constants';
import { ASK_ME_LATER_MAX_ATTEMPTS } from '../../constants/auth';
import { useCommonStore } from '../../store/store';

export const LinkLwaModalButtons = () => {
    const {
        askMeLaterAttempts,
        incrementAskMeLaterAttempt,
        isLoadingLinkLwa,
        handleLinkLwa,
    } = useAuthStore(state => ({
        askMeLaterAttempts: state.askMeLaterAttempts,
        incrementAskMeLaterAttempt: state.incrementAskMeLaterAttempt,
        isLoadingLinkLwa: state.isLoadingLinkLwa,
        handleLinkLwa: state.handleLinkLwa,
    }));

    const { userInfo } = useCommonStore(({userInfo}) => ({ userInfo }));

    const shouldShowAskMeLaterBtn = askMeLaterAttempts < ASK_ME_LATER_MAX_ATTEMPTS;

    return (
        <>
            {shouldShowAskMeLaterBtn && (
                <Button
                    dataLwtId='ask-later-btn'
                    color='text'
                    onClick={incrementAskMeLaterAttempt}
                    disabled={isLoadingLinkLwa}
                >
                    {buttonTerms.askLater}
                </Button>
            )}
            <Button
                dataLwtId='link-lwa-btn'
                className={'link-my-account-btn d-flex justify-content-center align-items-center'}
                color='primary'
                onClick={() => handleLinkLwa(userInfo)}
                disabled={isLoadingLinkLwa}
            >
                {buttonTerms.linkLwa}
            </Button>
        </>
    );
}
