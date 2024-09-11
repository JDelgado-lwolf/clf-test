import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { inbox } from '@lwt-helix/helix-icon/outlined';
import { buttonTerms } from '../../../constants';

const ExportButton = ({ handleClick }) => {

    return (
        <Button
            id='downloadBtn'
            className='bg-dark m-0 btn-sm mr-1 downloadBtn'
            color='secondary'
            dataLwtId='export'
            onClick={handleClick}>
            <div className='d-flex align-items-center justify-content-center'>
                <HelixIcon icon={inbox} className='mr-2' />
                {buttonTerms.download}
            </div>
        </Button>
    );
};

ExportButton.propTypes = {
    handleClick: PropTypes.func
};

export default ExportButton;
