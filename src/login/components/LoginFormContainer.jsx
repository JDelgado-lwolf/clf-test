import React from 'react';
import { PropTypes } from 'prop-types';
import Footer from '../Footer';
import Header from '../Header';

const LoginFormContainer = ({ children }) => (
    <>
        <div className='login-page'>
            <Header />
            { children }
        </div>
        <Footer/>
    </>
);

LoginFormContainer.propTypes = {
    children: PropTypes.node,
};

export default LoginFormContainer;
