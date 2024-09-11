import React from 'react';
import { Button } from '@lwt-helix/buttons';
import { buttonTerms } from '../../../constants';
import { PropTypes } from 'prop-types';

const ClearSearchButton = ({ isDisabled, onClick }) => {

    return (
        <Button
            id='clearSearchButton'
            className='bg-dark m-0 btn-sm mr-1 downloadBtn mb-1'
            color='secondary'
            dataLwtId='clearSearchButton'
            onClick={onClick}
            disabled={isDisabled}>
            <div className='d-flex align-items-center justify-content-center'>
                {buttonTerms.clearAll}
            </div>
        </Button>
    );
};

ClearSearchButton.propTypes = {
    disabled: PropTypes.boolean
};

export default ClearSearchButton;
