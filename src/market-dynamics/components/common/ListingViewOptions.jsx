import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '@lwt-helix/dropdown';

const ListingViewOptions = props => {
    const { options, listingViewId, title } = props;

    return <>
        <Dropdown
            dataLwtId='listing-view-options'
            toggleProps={{
                dataLwtId: 'no-split-toggle',
                id: 'listing-view-options',
                caret: true,
                children: options?.find(option => option.dataLwtId === listingViewId)?.itemText || title,
                className: 'bg-dark btn btn-sm btn-secondary mr-2 md-title-row'
            }}
            items={options}
            menuProps={{
                dataLwtId: 'listing-view-options-menu',
                right: true
            }}
        />
    </>;
};

ListingViewOptions.propTypes = {
    options: PropTypes.element,
    title: PropTypes.string,
    listingViewId: PropTypes.number || null
};

export default ListingViewOptions;
