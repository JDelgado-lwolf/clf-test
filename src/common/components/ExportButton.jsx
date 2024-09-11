import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@lwt-helix/buttons';
import { buttonTerms } from '../../constants';

const ExportButton =({onClick, isDisabled}) => (
    <Button
        id='downloadButton'
        color='primary'
        onClick={onClick}
        disabled={isDisabled}
    >
        {buttonTerms.download}
    </Button>
);

ExportButton.propTypes = {
    onClick: PropTypes.func,
    isDisabled: PropTypes.bool,
};

export default ExportButton;
