import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button } from '@lwt-helix/buttons';
import Loader from '@lwt-helix/loader';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { building_modern } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import Office from '../menus/Office';
import { showToast } from '../../../helpers/toast';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import ToastContainerPortal from '../menus/ToastContainerPortal';
import { useCommonStore, useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const OfficesChip = props => {
    const { disabled, module, userId, selectedSavedSearch, selectedMls, mlsProps } = props;

    const {
        search,
        title
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.officesTitle
    }), shallow);

    const offices = mlsProps?.offices;

    const officeLists = useCommonStore(state => state.officeLists);

    const [state, setState] = useState({
        mlsId: undefined,
        isPopoverOpen: false,
        toastProps: undefined,
        hasAvailableOffices: false,
    });

    useCloseChip(state.isPopoverOpen, setState, state.isListModalOpen);

    useEffect(() => {
        if (offices) {
            setStateData('offices', offices, setState);
            setStateData('hasAvailableOffices', true, setState);
        }
    }, [offices]);

    useEffect(() => {
        if (selectedMls) {
            const mls = {
                ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                    mls.realEstateDatasourceId === search.mlsId
                )
            };
            const selectedOfficeCriteria = mls?.idFiltering?.find(f => f.idType === searchTerms.officeIdType);
            setStateData('selectedOfficeCriteria', selectedOfficeCriteria, setState);
        }
    }, [search]);

    useEffect(() => {
        state.offices?.length === 0 && setStateData('hasAvailableOffices', false, setState);
    }, [state.offices]);

    useEffect(() => {
        officeLists && setStateData(
            'officeLists',
            officeLists
                ? [...officeLists].filter(list => list.mlsId === selectedMls?.mlsId)
                : [],
            setState
        );
    }, [officeLists, search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const toggleListModal = () => setStateData('isListModalOpen', !state.isListModalOpen, setState);

    const togglePopover = () => {
        if (!state.isListModalOpen) {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
        state.isPopoverOpen && setFilterText(undefined);
    };

    const closePopover = () => {
        setStateData('isPopoverOpen', false, setState);
    };

    const setToastProps = (type, message) => {
        showToast(type, message, setState);
    };

    const setSelectedSortOption = option => {
        setStateData('selectedSortOption', option, setState);
    };

    const setFilterText = filterText => {
        setStateData('filterText', filterText, setState);
    };

    return (<>
        <Button
            id='offices-chip'
            dataLwtId='offices-chip'
            size='sm'
            color='secondary'
            className='mb-1 text-capitalize text-truncate truncated-chip-button'
            onClick={togglePopover}
            disabled={disabled}
            style={{ whiteSpace: 'pre' }}
        >
            <HelixIcon icon={building_modern} {...chipIconProps} title='building icon' />
            {
                state.selectedOfficeCriteria?.listId
                    ? state.officeLists?.find(list => list.officeListId === state.selectedOfficeCriteria.listId)?.name
                    : title?.mainTitle
            }
            <span style={{ textTransform: 'none' }}>
                    {title?.subTitle && `: ${title.subTitle}`}
            </span>
        </Button>

        <Popover
            innerClassName='helix-heading'
            target='offices-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={searchTerms.offices}
            isOpen={state.isPopoverOpen}
            toggle={togglePopover}
            style={{ width: '1300px' }}
            body={
                state.offices
                    ? <Office
                        offices={state.offices}
                        officeLists={state.officeLists}
                        selectedOfficeCriteria={state.selectedOfficeCriteria}
                        mlsId={selectedMls?.mlsId}
                        userId={userId}
                        module={module}
                        toggleListModal={toggleListModal}
                        showToast={setToastProps}
                        closePopover={closePopover}
                        selectedSortOption={state.selectedSortOption}
                        setSortOption={setSelectedSortOption}
                        filterText={state.filterText}
                        setFilterText={setFilterText}
                        hasAvailableOffices={state.hasAvailableOffices}
                        selectedSavedSearch={selectedSavedSearch}
                    />
                    : <Loader />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
        <ToastContainerPortal toastProps={state.toastProps} />
    </>);
};

export default OfficesChip;
