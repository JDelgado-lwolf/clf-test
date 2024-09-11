import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@lwt-helix/buttons';
import Popover from '@lwt-helix/popover';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { chevron_small_down } from '@lwt-helix/helix-icon/outlined';
import { marketShareTerms } from '../../constants';

const OptionsSelector = (props) => {
    const { options } = props;

    const [popoverIsOpen, setPopoverIsOpen] = useState(false);

    const togglePopover = () => {
        setPopoverIsOpen(!popoverIsOpen);
    };

    return <>
        <Button id='showAndHideOptionsBtn'
                dataLwtId='showAndHideOptionsBtn'
                className='bg-dark d-flex align-items-center justify-content-between'
                size='sm'
                onClick={togglePopover}>
            <span>{marketShareTerms.metrics}</span>
            <HelixIcon icon={chevron_small_down} className='metrics-arrow-icon' />
        </Button>
        <Popover target='showAndHideOptionsBtn'
                 popperClassName='showAndHideOptionsPopover'
                 size='lg'
                 placement='bottom'
                 trigger='legacy'
                 toggle={togglePopover}
                 isOpen={popoverIsOpen}
                 body={<>
                     {options}
                 </>}
        />
    </>;
};

OptionsSelector.propTypes = {
    options: PropTypes.element
};

export default OptionsSelector;
