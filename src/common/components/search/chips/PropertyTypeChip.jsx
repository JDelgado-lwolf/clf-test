import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import * as _ from 'lodash-es';
import Popover from '@lwt-helix/popover';
import { Button } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { home } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import PropertyType from '../menus/PropertyType';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const PropertyTypeChip = props => {
    const { disabled, module, selectedMls, mlsProps } = props;

    const {
        search,
        title,
        setSelectedPropTypes
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.propertyTypeTitle,
        setSelectedPropTypes: state.setSelectedPropTypes
    }), shallow);

    const initialState = {
        isPopoverOpen: false,
        title: searchTerms.selectType(searchTerms.propertyTypes)
    };

    const [state, setState] = useState({ ...initialState });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        if (selectedMls) {
            const mls = {
                ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                    mls.realEstateDatasourceId === (selectedMls?.mlsId ?? search.mlsId)
                )
            };
            const field = mls.searchFields
                .find(searchField => searchField.fieldName === 'propertyType');

            const selectedPropTypes = field ? _.map(field.fieldValues, (v) => Number(v)) : undefined;
            setStateData('selectedPropTypes', selectedPropTypes, setState);
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    useEffect(() => {
        setStateData('invalid', false, setState);
    }, [selectedMls]);

    const togglePopover = () => {
        !state.invalid && setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
    };

    const toggleInvalid = () => {
        setStateData('invalid', true, setState);
    };

    const savePropTypes = propTypes => {
        if (propTypes !== state.selectedPropTypes) {
            setSelectedPropTypes(propTypes, mlsProps.propTypes);
            setStateData('invalid', false, setState);
        }
    };

    return (<>
        <Button
            dataLwtId='proptype-chip'
            size='sm'
            color='secondary'
            className='mb-1'
            id='property-type'
            disabled={disabled}
        >
            <HelixIcon icon={home} {...chipIconProps} title='home icon' />
            {title?.mainTitle}
        </Button>

        <Popover
            target='property-type'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={searchTerms.propertyTypes}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            style={{ minWidth: '250px' }}
            body={
                <PropertyType
                    module={module}
                    initialPropTypes={state.selectedPropTypes}
                    setPropTypes={savePropTypes}
                    toggleInvalid={toggleInvalid}
                    invalid={state.invalid}
                    selectedMlsId={selectedMls?.mlsId}
                    propTypes={mlsProps.propTypes}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
    </>);
};

export default PropertyTypeChip;
