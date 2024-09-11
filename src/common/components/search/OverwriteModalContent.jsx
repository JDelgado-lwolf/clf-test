import React from 'react';
import PropTypes from 'prop-types';
import { modalTerms } from '../../../constants';

export const OverwriteModalContent = ({ name }) => (
    <div className='mx-3'>
        <p>{modalTerms.overwriteTitle(name)}</p>
        <p>{modalTerms.overwriteBody}</p>
    </div>
);

OverwriteModalContent.propTypes = {
    name: PropTypes.string
};