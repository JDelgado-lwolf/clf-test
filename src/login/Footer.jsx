import React from 'react';
import { loginTerms as lt } from '../constants';

const Footer = () => {
    return (
        <div className='login-footer '>
            <div className='d-inline'>
                <a href='https://terradatum.com/terms-of-use/' target='_blank'  rel='noopener noreferrer'> {lt.termsOfUse} </a>
                <a href='https://terradatum.com/privacy-policy/' target='_blank' rel='noopener noreferrer'> {lt.privacyPolicy} </a>
            </div>
            <div>
                <span className='d-inline'>{lt.allRightsReserved}</span>
            </div>
        </div>
    );
};

export default Footer;
