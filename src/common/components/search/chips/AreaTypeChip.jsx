import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { Button } from '@lwt-helix/buttons';
import Popover from '@lwt-helix/popover';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { map_pin } from '@lwt-helix/helix-icon/outlined';
import { setStateData } from '../../../helpers/state';
import { areaRequestTypes, searchTerms } from '../../../../constants';
import AreaTypesList from '../menus/AreaTypesList';
import { popoverModifiers } from '../../../helpers/search';
import { useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const AreaTypeChip = props => {
    const { disabled, module, selectedMls, mlsProps } = props;

    const {
        search,
        title,
        setAreaType
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.areaTypeTitle,
        setAreaType: state.setAreaType
    }), shallow);

    const mappedAreas = mlsProps?.mappedAreas;

    const initialState = {
        isPopoverOpen: false,
        title: undefined,
        areaTypes: [],
        selectedType: undefined
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
            const areaTypeCriteria = mls.computedFields.find(searchField => searchField.fieldName === 'areaType');
            areaTypeCriteria && setStateData('selectedType', areaTypeCriteria, setState);
        }
    }, [search]);

    useEffect(() => {
        mappedAreas && setStateData(
            'areaTypes',
            Object.values(mappedAreas).map(area => ({
                ...area,
                columnName: areaRequestTypes[area.columnName]
            })),
            setState);
    }, [mappedAreas]);

    const togglePopover = () => {
        setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
    };

    const handleSelectChange = (e, selectedAreaType) => {
        const areaType = e.target.value;
        if (state.selectedType !== areaType) {
            setAreaType(searchTerms.selectedAreaTypeTitle + selectedAreaType.viewName, selectedAreaType.columnName);
            setStateData('selectedType', selectedAreaType.columnName, setState);
        }
        togglePopover();
        e.preventDefault();
    };

    return (
        <>
            <Button
                dataLwtId='areaType-chip'
                size='sm'
                color='secondary'
                className='mb-1 text-capitalize'
                id='area-type-chip'
                disabled={disabled}
            >
                <HelixIcon icon={map_pin} className='align-top mr-1' title='map-pin icon' />
                {title?.mainTitle}
            </Button>

            <Popover
                target='area-type-chip'
                placement='bottom'
                size='auto'
                trigger='legacy'
                header={searchTerms.areaTypePopover}
                style={{ minWidth: '300px' }}
                isOpen={state.isPopoverOpen}
                toggle={() => togglePopover()}
                body={
                    <AreaTypesList
                        areaTypes={state.areaTypes}
                        selectType={handleSelectChange}
                        selectedType={state.selectedType}
                    />
                }
                disabled={disabled}
                {...popoverModifiers}
            />
        </>);
};

export default AreaTypeChip;
