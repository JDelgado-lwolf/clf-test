import React from 'react';
import PropTypes from 'prop-types';
import { searchTerms } from '../../../constants';
import { CustomInput } from '@lwt-helix/controls';

const ShowAdditionalInfo = ({onClick, isChecked}) => (
    <div className='ml-auto d-flex justify-content-center align-items-center'>
        <p className='mb-0 mr-2 clickable font-weight-normal font-gray-primary'
            onClick={onClick}>
            {searchTerms.additionalInfo}
        </p>
        <CustomInput
            dataLwtId='additional-info-toggle'
            type='switch'
            id='additional-info-toggle'
            onChange={onClick}
            checked={isChecked}/>
    </div>
);

ShowAdditionalInfo.propTypes = {
    onClick: PropTypes.func,
    isChecked: PropTypes.bool,
};

export default ShowAdditionalInfo;
