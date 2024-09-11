import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { Button, ButtonGroup, ButtonIcon } from '@lwt-helix/buttons';
import Popover from '@lwt-helix/popover';
import { lot } from '@lwt-helix/helix-icon/outlined';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { searchTerms } from '../../../../constants';
import { validateRange } from '../../../helpers/validation';
import { chipIconProps } from '../../../helpers/chips';
import LotSize from '../menus/LotSize';
import { useSearchStore } from '../../../../store/store';
import { shallow } from 'zustand/shallow';
import { useCloseChip } from './hooks/closeChip';

const LotSizeChip = props => {
    const { key, onClose, disabled, module, mlsMembershipInfo } = props;

    const {
        search,
        lotSizeTitle,
        setLotSize
    } = useSearchStore(state => ({
        search: state[module]?.search,
        lotSizeTitle: state[module]?.lotSizeTitle,
        setLotSize: state.setLotSize
    }), shallow);

    const [state, setState] = useState({
        isPopoverOpen: false,
        title: undefined,
        selectedLotSize: undefined,
        lotSizeTitle: undefined
    });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        const mls = {
            ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                mls.realEstateDatasourceId === search.mlsId)
        };
        const criteria = mls.searchFields?.find(searchField =>
            searchField.fieldName === searchTerms.lotSizeAcresFilter ||
            searchField.fieldName === searchTerms.lotSquareFeetFilter
        );

        if (criteria) {
            setStateData(
                'selectedLotSize',
                {
                    min: criteria.fieldMinValue,
                    max: criteria.fieldMaxValue,
                    measureType: criteria.fieldName === searchTerms.lotSizeAcresFilter
                        ? searchTerms.acres.toLowerCase()
                        : searchTerms.squareFeetFilter
                },
                setState
            );
        } else {
            setStateData( 'selectedLotSize', undefined, setState);
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => {
        if (!state.isPopoverOpen || !state.selectedLotSize) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
            return;
        }
        const validationProps = state.selectedLotSize &&
            validateRange(searchTerms.lotSizeFilter, state.selectedLotSize, false);
        if (!validationProps.isValid) {
            setStateData('validationProps', validationProps, setState);
            return;
        }
        setLotSize(state.selectedLotSize);
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

    const setLotSizeValue = selectedLotSize => {
        setStateData('selectedLotSize', selectedLotSize, setState);
    };

    return <>
        <ButtonGroup dataLwtId={`${key}-buttons`}>
            <Button
                id="lot-size-chip"
                dataLwtId="lot-size-chip"
                size="sm"
                color="secondary"
                className="mb-1 text-capitalize"
                onClick={togglePopover}
                disabled={disabled}
            >
                <HelixIcon icon={lot} {...chipIconProps} title='lot size icon'/>
                {lotSizeTitle?.mainTitle}
                <span style={{ textTransform: 'none' }}>
                    {lotSizeTitle?.subTitle && `: ${lotSizeTitle.subTitle}`}
                </span>
            </Button>
            <ButtonIcon
                dataLwtId="close-lot-size"
                size="xs"
                color="secondary"
                iconName="clear"
                label={searchTerms.clearLotSize}
                className="px-1 mb-1"
                onClick={closeChip}
                disabled={disabled}
            />
        </ButtonGroup>

        <Popover
            innerClassName="helix-heading"
            target="lot-size-chip"
            placement="bottom"
            size="auto"
            trigger="legacy"
            header={searchTerms.lotSize}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            body={
                <LotSize
                    initialLotSize={state.selectedLotSize}
                    isPopoverOpen={state.isPopoverOpen}
                    setLotSize={setLotSizeValue}
                    validationProps={state.validationProps}
                    isMlsSupportsLotSizeAcres={mlsMembershipInfo?.supportsLotSizeAcres}
                    isMlsSupportsLotSizeSqft={mlsMembershipInfo?.supportsLotSizeSqft}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
    </>
};

LotSizeChip.propTypes = {
    key: PropTypes.string,
    onClose: PropTypes.func,
    disabled: PropTypes.boolean,
    module: PropTypes.string,
    mlsMembershipInfo: PropTypes.object
};

export default LotSizeChip;
