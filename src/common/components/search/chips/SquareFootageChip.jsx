import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popover from '@lwt-helix/popover/build/src/Popover';
import { Button, ButtonGroup, ButtonIcon } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { box_size } from '@lwt-helix/helix-icon/outlined';
import { useSearchStore } from '../../../../store/store';
import { shallow } from 'zustand/shallow';
import SquareFootage from '../menus/SquareFootage';
import { setStateData } from '../../../helpers/state';
import { searchTerms } from '../../../../constants';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { chipIconProps } from '../../../helpers/chips';
import { validateRange } from '../../../helpers/validation';
import { useCloseChip } from './hooks/closeChip';

const SquareFootageChip = props => {

    const { key, onClose, disabled, module } = props;

    const {
        search,
        squareFootageTitle,
        setSquareFootage
    } = useSearchStore(state => ({
        search: state[module]?.search,
        squareFootageTitle: state[module]?.squareFootageTitle,
        setSquareFootage: state.setSquareFootage
    }), shallow);

    const [state, setState] = useState({
        isPopoverOpen: false,
        title: undefined,
        selectedSquareFootage: undefined,
        squareFootageTitle: undefined
    });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        const mls = {
            ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                mls.realEstateDatasourceId === search.mlsId
            )
        };
        const criteria = mls.searchFields?.find(searchField =>
            searchField.fieldName === searchTerms.squareFeetFilter);
        if (criteria) {
            setStateData(
                'selectedSquareFootage',
                {
                    min: criteria.fieldMinValue,
                    max: criteria.fieldMaxValue
                },
                setState
            );
        } else {
            setStateData('selectedSquareFootage', undefined, setState);
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => {
        if (!state.isPopoverOpen || !state.selectedSquareFootage) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
            return;
        }
        const validationProps = state.selectedSquareFootage &&
            validateRange(searchTerms.squareFootageFilter, state.selectedSquareFootage, false);
        if (!validationProps.isValid) {
            setStateData('validationProps', validationProps, setState);
            return;
        }
        setSquareFootage(state.selectedSquareFootage);
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

    const setSquareFootageValue = selectedSquareFootage => {
        setStateData('selectedSquareFootage', selectedSquareFootage, setState);
    };

    return <>
        <ButtonGroup dataLwtId={`${key}-buttons`}>
            <Button
                id="square-footage-chip"
                dataLwtId="square-footage-chip"
                size="sm"
                color="secondary"
                className="mb-1 text-capitalize"
                onClick={togglePopover}
                disabled={disabled}
            >
                <HelixIcon icon={box_size} {...chipIconProps} title='square-footage-icon'/>
                {squareFootageTitle?.mainTitle}
                <span style={{ textTransform: 'none' }}>
                    {squareFootageTitle?.subTitle && `: ${squareFootageTitle.subTitle}`}
                </span>
            </Button>
            <ButtonIcon
                dataLwtId="close-square-footage"
                size="xs"
                color="secondary"
                iconName="clear"
                label="Clear Square Footage"
                className="px-1 mb-1"
                onClick={closeChip}
                disabled={disabled}
            />
        </ButtonGroup>

        <Popover
            innerClassName="helix-heading"
            target="square-footage-chip"
            placement="bottom"
            size="auto"
            trigger="legacy"
            header={searchTerms.squareFootage}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            body={
                <SquareFootage
                    initialSquareFootage={state.selectedSquareFootage}
                    setSquareFootage={setSquareFootageValue}
                    validationProps={state.validationProps}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
    </>
};

SquareFootageChip.propTypes = {
    key: PropTypes.string,
    onClose: PropTypes.function,
    disabled: PropTypes.boolean,
    module: PropTypes.string,
};

export default SquareFootageChip;
