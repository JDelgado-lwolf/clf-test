import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button, ButtonGroup, ButtonIcon } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { coin } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import SoldPrice from '../menus/SoldPrice';
import { modules, searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { validateRange } from '../../../helpers/validation';
import { useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const SoldPriceChip = props => {
    const { key, onClose, disabled, module } = props;

    const {
        search,
        soldPriceRangeTitle,
        priceRangeTitle,
        setSoldPrice,
        setLastPrice
    } = useSearchStore(state => ({
        search: state[module]?.search,
        soldPriceRangeTitle: state[module]?.soldPriceRangeTitle,
        priceRangeTitle: state[module]?.priceRangeTitle,
        setSoldPrice: state.setSoldPrice,
        setLastPrice: state.setLastPrice
    }), shallow);

    const [state, setState] = useState({
        isPopoverOpen: false,
        title: undefined
    });

    useCloseChip(state.isPopoverOpen, setState);

    const isProficiencyMetricsModule = !!Object.values(modules.proficiencyMetrics).find(m => m === module);

    useEffect(() => {
        // sold price should be for proficiency metrics searches only
        if (isProficiencyMetricsModule) {
            soldPriceRangeTitle && setStateData('title', soldPriceRangeTitle, setState);
        } else {
            priceRangeTitle && setStateData('title', priceRangeTitle, setState);
        }
        const mls = {
            ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                mls.realEstateDatasourceId === search.mlsId
            )
        };
        const field = isProficiencyMetricsModule ? searchTerms.soldPriceChip : searchTerms.lastPriceChip;
        const criteria = mls.searchFields?.find(searchField => searchField.fieldName.toLowerCase() === field.toLowerCase());
        !!criteria ? setStateData(
            `selected${isProficiencyMetricsModule ? searchTerms.soldPriceChip : searchTerms.lastPriceChip}`,
            {
                min: criteria.fieldMinValue,
                max: criteria.fieldMaxValue
            },
            setState
        ) : setStateData(
            `selected${isProficiencyMetricsModule ? searchTerms.soldPriceChip : searchTerms.lastPriceChip}`, 
            undefined, 
            setState
        );
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => {
        if (state.isPopoverOpen) {
            if (state.selectedSoldPrice) {
                const validationProps = validateRange(searchTerms.soldPriceFilter, state.selectedSoldPrice);
                if (validationProps.isValid) {
                    setSoldPrice(state.selectedSoldPrice);
                    setState(prevState => ({
                        ...prevState,
                        isPopoverOpen: !prevState.isPopoverOpen,
                        validationProps: undefined
                    }));
                } else {
                    setStateData('validationProps', validationProps, setState);
                }
            } else if (state.selectedLastPrice) {
                const validationProps = validateRange(searchTerms.priceRangeFilter, state.selectedLastPrice);
                if (validationProps.isValid) {
                    setLastPrice(state.selectedLastPrice);
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

    const setSoldPriceValue = selectedSoldPrice => {
        setStateData('selectedSoldPrice', selectedSoldPrice, setState);
    };

    const setPriceRangeValue = selectedLastPrice => {
        setStateData('selectedLastPrice', selectedLastPrice, setState);
    };

    return (<>
        <ButtonGroup dataLwtId={`${key}-buttons`}>
            <Button
                id='sold-price-chip'
                dataLwtId='sold-price-chip'
                size='sm'
                color='secondary'
                className='mb-1 text-capitalize'
                onClick={togglePopover}
                disabled={disabled}
            >
                <HelixIcon icon={coin} {...chipIconProps} title='money icon' />
                {state.title?.mainTitle}
                <span style={{ textTransform: 'none' }}>
                    {state.title?.subTitle && `: ${state.title.subTitle}`}
                </span>
            </Button>
            <ButtonIcon
                dataLwtId='close-sold-price'
                size='xs'
                color='secondary'
                iconName='clear'
                label='Clear Sold Price'
                className='px-1 mb-1'
                onClick={closeChip}
                disabled={disabled}
            />
        </ButtonGroup>

        <Popover
            innerClassName='helix-heading'
            target='sold-price-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={isProficiencyMetricsModule ? searchTerms.soldPriceRange : searchTerms.priceRange}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            body={
                <SoldPrice
                    initialPrice={isProficiencyMetricsModule ? state.selectedSoldPrice : state.selectedLastPrice}
                    setPrice={isProficiencyMetricsModule ? setSoldPriceValue : setPriceRangeValue}
                    validationProps={state.validationProps}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
    </>);
};

SoldPriceChip.propTypes = {
    key: PropTypes.string,
    onClose: PropTypes.function,
    disabled: PropTypes.boolean,
    module: PropTypes.string,
};

export default SoldPriceChip;
