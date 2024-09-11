import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button, ButtonGroup, ButtonIcon } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { bed } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import Bedrooms from '../menus/Bedrooms';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { useSearchStore } from '../../../../store/store';
import { validateRange } from '../../../helpers/validation';
import { useCloseChip } from './hooks/closeChip';

const BedroomsChip = props => {
    const { key, onClose, disabled, module, selectedMls } = props;

    const {
        search,
        title,
        setBedrooms
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.bedroomsTitle,
        setBedrooms: state.setBedrooms
    }), shallow);

    const [state, setState] = useState({
        isPopoverOpen: false,
        selectedBedrooms: undefined
    });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        if (selectedMls) {
            const mls = {
                ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                    mls.realEstateDatasourceId === search.mlsId)
            };
            const bedroomsCriteria = mls.searchFields.find(searchField => searchField.fieldName === searchTerms.bedroomsFilter);

            if (bedroomsCriteria) {
                setStateData(
                    'selectedBedrooms',
                    {
                        min: bedroomsCriteria.fieldMinValue,
                        max: bedroomsCriteria.fieldMaxValue
                    },
                    setState
                );
            } else {
                setStateData('selectedBedrooms', undefined, setState);
            }
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => {
        if (!state.isPopoverOpen || !state.selectedBedrooms) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
            return;
        }
        const validationProps = state.selectedBedrooms && validateRange(searchTerms.bedroomsFilter, state.selectedBedrooms);
        if (!validationProps.isValid) {
            setStateData('validationProps', validationProps, setState);
            return;
        }
        setBedrooms(state.selectedBedrooms);
        setState(prevState => ({
            ...prevState,
            isPopoverOpen: !prevState.isPopoverOpen,
            validationProps: undefined
        }));
    };

    const closeChip = () => {
        onClose(key);
        if (state.isPopoverOpen) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
    };

    const setSelectedBedroomsValue = selectedBedrooms => {
        setStateData('selectedBedrooms', selectedBedrooms, setState);
    };

    return (<>
        <ButtonGroup dataLwtId={`${key}-buttons`}>
            <Button
                id='bedrooms-chip'
                dataLwtId='bedrooms-chip'
                size='sm'
                color='secondary'
                className='mb-1 text-capitalize'
                onClick={togglePopover}
                disabled={disabled}
            >
                <HelixIcon icon={bed} {...chipIconProps} title='bedrooms icon' />
                {title?.mainTitle}
                <span style={{ textTransform: 'none' }}>
                    {title?.subTitle && `: ${title.subTitle}`}
                </span>
            </Button>
            <ButtonIcon
                dataLwtId='close-bedrooms'
                size='xs'
                color='secondary'
                iconName='clear'
                label={searchTerms.clearBedrooms}
                className='px-1 mb-1'
                onClick={closeChip}
                disabled={disabled}
            />
        </ButtonGroup>

        <Popover
            innerClassName='helix-heading'
            target='bedrooms-chip'
            placement='bottom'
            trigger='legacy'
            size='auto'
            header={searchTerms.bedrooms}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            style={{ minWidth: '210px' }}
            body={
                <Bedrooms
                    setBedrooms={setSelectedBedroomsValue}
                    initialBedrooms={state.selectedBedrooms}
                    validationProps={state.validationProps}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
    </>);
};

BedroomsChip.propTypes = {
    key: PropTypes.string,
    onClose: PropTypes.func,
    disabled: PropTypes.boolean,
    module: PropTypes.string
};

export default BedroomsChip;
