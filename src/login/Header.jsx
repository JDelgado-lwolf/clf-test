import React from 'react';
import { appLabels, runningApp } from '../constants/app';

const Header = () => {
    return (
        <div className='login-header'>
            <a href='/login'>
                <img
                    height='50'
                    src='https://assets.lwolf.com/img/lw-logo-dark.svg'
                    alt='Logo'
                    className='logo-wrapper'
                />
            </a>
            <span>
                {appLabels[runningApp]}
            </span>
        </div>
    );
};

export default Header;
