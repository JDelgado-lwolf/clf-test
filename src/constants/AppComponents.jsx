import React from 'react';
import { appNames } from './app';
import SignInLWAButton from '../login/components/SignInLWAButton';
import { loginTerms as lt } from '.';

export const componentsByApp = Object.freeze({
    [appNames.XAM]: {
        LoginButons: () => <></>,
    },
    [appNames.XBM]: {
        LoginButons: () => (<>
            <div className='d-flex justify-content-center'>
                <p className='or-divider m-0'>{lt.or}</p>
            </div>
            <SignInLWAButton />
        </>),
    },
});
