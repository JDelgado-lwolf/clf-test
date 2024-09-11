import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@lwt-helix/buttons';
import Icon from '@lwt-helix/icon';
import { marketShareTerms } from '../../constants';
import { CustomInput } from '@lwt-helix/controls';

const TitleInfo = (props) => {
    const {
        exportButton,
        subtitle,
        title,
        areaType,
        hasToggle,
        handleAdditionalInfoToggleChange,
        isAdditionalInfoToggleChecked
    } = props;

    const history = useHistory();

    return <div className='d-flex my-2'>
        <Button
            dataLwtId='back-button'
            color='secondary'
            size='lg'
            className='bg-dark p-1 d-flex align-self-stretch align-items-center'
            onClick={() => history.goBack()}>
            <Icon className='mr-1' iconName='navigate_before' dataLwtId='previous-icon' />
        </Button>

        <div className='d-flex mt-2'>
            <div>
                <h4 className={'mb-0 pb-0 font-weight-bold'}>
                    {`${title} ${areaType ? `(${areaType})` : ''}`}
                </h4>
                <p className='mb-0 text-secondary'>{subtitle}</p>
            </div>
        </div>
        <div className='ml-auto d-flex w-auto align-self-center'>
            <div className='ml-auto d-flex justify-content-center align-items-center'>
                {hasToggle && <>
                    <p className='mb-0 mr-2 clickable font-weight-normal font-gray-primary'
                       onClick={handleAdditionalInfoToggleChange}>
                        {marketShareTerms.additionalInfo}
                    </p>
                    <CustomInput
                        dataLwtId='additional-info-toggle'
                        type='switch'
                        id='additional-info-toggle'
                        onChange={handleAdditionalInfoToggleChange}
                        checked={isAdditionalInfoToggleChecked} />
                </>}
            </div>
            {exportButton}
        </div>
    </div>;
};

export default TitleInfo;
