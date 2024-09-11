import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button, ButtonGroup, ButtonIcon } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { sign_in_ground } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import Units from '../menus/Units';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { validateRange } from '../../../helpers/validation';
import { useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const UnitsChip = props => {
    const { key, onClose, disabled, module, selectedMls } = props;

    const {
        search,
        title,
        setTotalUnits
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.totalUnitsTitle,
        setTotalUnits: state.setTotalUnits
    }), shallow);

    const [state, setState] = useState({
        isPopoverOpen: false,
        title: undefined
    });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        if (selectedMls) {
            const mls = {
                ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                    mls.realEstateDatasourceId === search.mlsId)
            };
            const unitsCriteria = mls.computedFields.find(searchField => searchField.fieldName === 'totalUnits');

            if (unitsCriteria) {
                setStateData(
                    'selectedUnits',
                    {
                        min: unitsCriteria.fieldMinValue,
                        max: unitsCriteria.fieldMaxValue
                    },
                    setState
                );
            } else {
                setStateData('selectedUnits', undefined, setState);
            }
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => {
        if (state.isPopoverOpen) {
            if (state.selectedUnits) {
                const validationProps = validateRange(searchTerms.totalUnitsFilter, state.selectedUnits);
                if (validationProps.isValid) {
                    setTotalUnits(state.selectedUnits);
                    setState(prevState => ({
                        ...prevState,
                        isPopoverOpen: !prevState.isPopoverOpen,
                        validationProps: undefined
                    }));
                } else {
                    setStateData('validationProps', validationProps, setState);
                }
            } else {
                setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
            }
        } else {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
    };

    const closeChip = () => {
        onClose(key);
        if (state.isPopoverOpen) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
    };

    const setUnits = selectedUnits => {
        setStateData('selectedUnits', selectedUnits, setState);
    };

    return (<>
        <ButtonGroup dataLwtId={`${key}-buttons`}>
            <Button
                id='units-chip'
                dataLwtId='units-chip'
                size='sm'
                color='secondary'
                className='mb-1 text-capitalize'
                onClick={togglePopover}
                disabled={disabled}
            >
                <HelixIcon icon={sign_in_ground} {...chipIconProps} title='sale sign icon' />
                {title?.mainTitle}
                <span style={{ textTransform: 'none' }}>
                    {title?.subTitle && `: ${title.subTitle}`}
                </span>
            </Button>
            <ButtonIcon
                dataLwtId='close-units'
                size='xs'
                color='secondary'
                iconName='clear'
                label='Clear Units'
                className='px-1 mb-1'
                onClick={closeChip}
                disabled={disabled}
            />
        </ButtonGroup>

        <Popover
            innerClassName='helix-heading'
            target='units-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={searchTerms.totalUnits}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            body={
                <Units
                    initialUnits={state.selectedUnits}
                    setUnits={setUnits}
                    validationProps={state.validationProps}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
    </>);
};

export default UnitsChip;
