import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button, ButtonGroup, ButtonIcon } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { coin } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import Volume from '../menus/Volume';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { validateRange } from '../../../helpers/validation';
import { useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const VolumeChip = props => {
    const { key, onClose, disabled, module, selectedMls } = props;

    const {
        search,
        title,
        setTotalVolume
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.totalVolumeTitle,
        setTotalVolume: state.setTotalVolume
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
                    mls.realEstateDatasourceId === (selectedMls?.mlsId ?? search.mlsId)
                )
            };
            const volumeCriteria = mls.computedFields.find(searchField => searchField.fieldName === 'totalVolume');

            if (volumeCriteria) {
                setStateData(
                    'selectedVolume',
                    {
                        min: volumeCriteria.fieldMinValue,
                        max: volumeCriteria.fieldMaxValue
                    },
                    setState
                );
            } else {
                setStateData('selectedVolume', undefined, setState);
            }
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => {
        if (state.isPopoverOpen) {
            if (state.selectedVolume) {
                const validationProps = validateRange(searchTerms.totalVolumeFilter, state.selectedVolume);
                if (validationProps.isValid) {
                    setTotalVolume(state.selectedVolume);
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

    const setVolume = selectedVolume => {
        setStateData('selectedVolume', selectedVolume, setState);
    };

    return (<>
        <ButtonGroup dataLwtId={`${key}-buttons`}>
            <Button
                id='volume-chip'
                dataLwtId='volume-chip'
                size='sm'
                color='secondary'
                className='mb-1 text-capitalize'
                onClick={togglePopover}
                disabled={disabled}
            >
                <HelixIcon icon={coin} {...chipIconProps} title='money icon' />
                {title?.mainTitle}
                <span style={{ textTransform: 'none' }}>
                    {title?.subTitle && `: ${title.subTitle}`}
                </span>
            </Button>
            <ButtonIcon
                dataLwtId='close-volume'
                size='xs'
                color='secondary'
                iconName='clear'
                label='Clear Volume'
                className='px-1 mb-1'
                onClick={closeChip}
                disabled={disabled}
            />
        </ButtonGroup>

        <Popover
            innerClassName='helix-heading'
            target='volume-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={searchTerms.totalVolume}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            body={
                <Volume
                    initialVolume={state.selectedVolume}
                    setVolume={setVolume}
                    validationProps={state.validationProps}
                />}
            disabled={disabled}
            {...popoverModifiers}
        />
    </>);
};

export default VolumeChip;
