import React from 'react';
import { CustomInput } from '@lwt-helix/controls';
import { marketShareListingStatuses, marketShareListingStatusesCoverage } from '../../../../constants';
import { modules } from '../../../../constants';
import { useSearchStore } from '../../../../store/store';

const ListingStatus = props => {
    const { togglePopover, initialListingStatus, module } = props;
    const setListingStatus = useSearchStore(state => state.setListingStatus);

    const listingStatuses = module === modules.marketShare.totals
        ? marketShareListingStatuses
        : marketShareListingStatusesCoverage;

    const onChangeValue = e => {
        const listingStatus = e.target.value;
        if (listingStatus && listingStatus !== initialListingStatus) {
            setListingStatus({
                value: listingStatus,
                title: listingStatuses[listingStatus]
            });
            togglePopover();
        }
    };

    return (<div style={{ minWidth: '300px' }} onChange={onChangeValue}>
        {Object.keys(listingStatuses).map(s => {
            return (
                <CustomInput
                    key={s}
                    dataLwtId={`status-select-${s}`}
                    id={`status-select-${s}`}
                    value={s}
                    type='radio'
                    name='listing-status'
                    label={listingStatuses[s]}
                    checked={initialListingStatus === s}
                />);
        })}
    </div>);
};

export default ListingStatus;
