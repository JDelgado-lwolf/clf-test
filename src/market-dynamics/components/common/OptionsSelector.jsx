import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@lwt-helix/buttons';
import Popover from '@lwt-helix/popover';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { chevron_small_down } from '@lwt-helix/helix-icon/outlined';
import { getCountChecked, getRenderedStatusOptions, MIN_COUNT_SELECTIONS } from '../../helpers/optionsSelector';
import { setStateData } from '../../../common/helpers/state';
import { terms } from '../../constants';
import { ToastContainer } from '@lwt-helix/toast';
import { marketDynamicsTerms } from '../../../constants';

const OptionsSelector = props => {
    const { options, id, title, setOptions } = props;

    const [state, setState] = useState({
        isPopoverOpen: false,
        renderedOptions: [],
        countChecked: getCountChecked(options),
        toast: {}
    });

    const togglePopover = () => {
        setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        return null;
    };

    const showToast = toastType => {
        let toastProperties;
        if (toastType === marketDynamicsTerms.atLeastOneStatusMustBeSelected) {
            toastProperties = {
                id: 1,
                message: marketDynamicsTerms.atLeastOneStatusMustBeSelected,
                color: 'danger',
                icon: 'error_outline_icon',
                border: 'left'
            };
        }
        setStateData('toast', toastProperties, setState);
    };

    const handleOptionClick = e => {
        const clickedOption = e.target;

        if (!clickedOption.checked && state.countChecked === MIN_COUNT_SELECTIONS) {
            showToast(marketDynamicsTerms.atLeastOneStatusMustBeSelected);
            return;
        }
        const updatedOptions = options.map(option => {
            if (clickedOption.type === 'radio' && option.isRadio) {
                const { value, checked } = clickedOption;
                return { ...option, checked: option.id === value ? checked : false };
            }
            if (option.id === clickedOption.value) {
                return { ...option, checked: clickedOption.checked };
            }
            return option;
        });
        setStateData('countChecked', getCountChecked(options), setState);
        setOptions(updatedOptions);
    };

    const buttonId = `options-selector-${id}`;

    useEffect(() => {
        const renderedOptions = getRenderedStatusOptions(options, handleOptionClick, state.countChecked);
        setStateData('renderedOptions', renderedOptions, setState);
        setStateData('countChecked', getCountChecked(options), setState);
    }, [options, state.countChecked]);

    const buttonLabel = terms.itemTypeCount(title, state.countChecked);

    return <>
        <Button id={buttonId}
                dataLwtId={buttonId}
                className='bg-dark d-flex align-items-center justify-content-between'
                size='sm'
                onClick={togglePopover}>
            <span>{buttonLabel}</span>
            <HelixIcon icon={chevron_small_down} className='metrics-arrow-icon' />
        </Button>
        <Popover target={buttonId}
                popperClassName='options-selector-popover'
                size='lg'
                placement='bottom'
                trigger='legacy'
                toggle={togglePopover}
                isOpen={state.isPopoverOpen}
                body={<>
                    {state.renderedOptions}
                </>}
        />
        <ToastContainer
            dataLwtId='market-dynamics-options-selector-toast'
            toastProps={state.toast}
            position={'toast-bottom-right'}
        />
    </>;
};

OptionsSelector.propTypes = {
    setOptions: PropTypes.func,
    options: PropTypes.element,
    title: PropTypes.string,
    id: PropTypes.string
};

export default OptionsSelector;
