import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { sign_sold } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import ListingStatus from '../menus/ListingStatus';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { toggleRunSearchButton } from '../../../helpers/search';
import { useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const ListingStatusChip = props => {
    const { disabled, module, selectedMls } = props;

    const {
        search,
        title
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.listingStatusTitle
    }), shallow);

    const initialState = {
        isPopoverOpen: false
    };
    const [state, setState] = useState({ ...initialState });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        if (selectedMls) {
            const mls = {
                ...search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters?.find(mls =>
                    mls.realEstateDatasourceId === search.mlsId
                )
            };
            const listingStatusCriteria = mls.computedFields.find(searchField => searchField.fieldName === searchTerms.transactionStatus);
            setStateData(
                'selectedListingStatus',
                listingStatusCriteria?.fieldValues.length ? listingStatusCriteria.fieldValues[0] : undefined,
                setState
            );
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = () => setStateData('isPopoverOpen', !state.isPopoverOpen, setState);

    return (<>
        <Button
            id='listing-status-chip'
            dataLwtId='listing-status-chip'
            size='sm'
            color='secondary'
            className='mb-1 text-capitalize'
            onClick={togglePopover}
            disabled={disabled}
        >
            <HelixIcon icon={sign_sold} {...chipIconProps} title='sold icon' />
            {title?.mainTitle}
        </Button>

        <Popover
            innerClassName='helix-heading'
            target='listing-status-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={searchTerms.listingStatus}
            isOpen={state?.isPopoverOpen}
            toggle={togglePopover}
            body={
                <ListingStatus
                    togglePopover={togglePopover}
                    initialListingStatus={state.selectedListingStatus}
                    module={module}
                />
            }
            disabled={disabled}
        />
    </>);
};

export default ListingStatusChip;
