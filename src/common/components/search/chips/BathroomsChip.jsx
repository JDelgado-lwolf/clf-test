import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button, ButtonGroup, ButtonIcon } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { bathtub } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import Bathrooms from '../menus/Bathrooms';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { useSearchStore } from '../../../../store/store';
import { validateRange } from '../../../helpers/validation';
import { useCloseChip } from './hooks/closeChip';

const BathroomsChip = props => {
    const { key, onClose, disabled, module, selectedMls } = props;

    const {
        search,
        title,
        setBathrooms
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.fullBathroomsTitle,
        setBathrooms: state.setBathrooms
    }), shallow);

    const [state, setState] = useState({
        isPopoverOpen: false,
        selectedBathrooms: undefined
    });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        if (selectedMls) {
            const mls = {
                ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                    mls.realEstateDatasourceId === search.mlsId)
            };
            const bathroomsCriteria = mls.searchFields.find(searchField => searchField.fieldName === searchTerms.fullBathroomsFilter);

            if (bathroomsCriteria) {
                setStateData(
                    'selectedBathrooms',
                    {
                        min: bathroomsCriteria.fieldMinValue,
                        max: bathroomsCriteria.fieldMaxValue
                    },
                    setState
                );
            } else {
                setStateData('selectedBathrooms', undefined, setState);
            }
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => {
        if (!state.isPopoverOpen || !state.selectedBathrooms) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
            return;
        }
        const validationProps = state.selectedBathrooms && validateRange(searchTerms.fullBathroomsFilter, state.selectedBathrooms);
        if (!validationProps.isValid) {
            setStateData('validationProps', validationProps, setState);
            return;
        }
        setBathrooms(state.selectedBathrooms);
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

    const setSelectedBathroomsValue = selectedBathrooms => {
        setStateData('selectedBathrooms', selectedBathrooms, setState);
    };

    return (<>
        <ButtonGroup dataLwtId={`${key}-buttons`}>
            <Button
                id='bathrooms-chip'
                dataLwtId='bathrooms-chip'
                size='sm'
                color='secondary'
                className='mb-1 text-capitalize'
                onClick={togglePopover}
                disabled={disabled}
            >
                <HelixIcon icon={bathtub} {...chipIconProps} title='bathrooms-icon' />
                {title?.mainTitle}
                <span style={{ textTransform: 'none' }}>
                    {title?.subTitle && `: ${title.subTitle}`}
                </span>
            </Button>
            <ButtonIcon
                dataLwtId='close-bathrooms'
                size='xs'
                color='secondary'
                iconName='clear'
                label={searchTerms.clearBathrooms}
                className='px-1 mb-1'
                onClick={closeChip}
                disabled={disabled}
            />
        </ButtonGroup>

        <Popover
            innerClassName='helix-heading'
            target='bathrooms-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={searchTerms.fullBathrooms}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            style={{ minWidth: '210px' }}
            body={
                <Bathrooms
                    setBathrooms={setSelectedBathroomsValue}
                    initialBathrooms={state.selectedBathrooms}
                    validationProps={state.validationProps}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
    </>);
};

BathroomsChip.propTypes = {
    key: PropTypes.string,
    onClose: PropTypes.func,
    disabled: PropTypes.boolean,
    module: PropTypes.string
};

export default BathroomsChip;
