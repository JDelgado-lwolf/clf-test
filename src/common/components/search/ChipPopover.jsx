import React from 'react';
import { PropTypes } from 'prop-types';
import Popover from '@lwt-helix/popover';
import { searchTerms } from '../../../constants';
import { popoverModifiers } from '../../helpers/search';

export default function ChipPopover(props) {
    const {
        target,
        title,
        isPopoverOpen,
        togglePopover,
        selectedName,
        isDisabled,
        bodyComponent,
    } = props;

    const currentSearchDetails = (
        <div className='pb-2 border-bottom current-search-details'>
            <h3 className='my-3 filter-search-header'>{title}</h3>
            <div className='helix-heading text-truncate'>
                {selectedName || searchTerms.unsaved}
            </div>
        </div>
    );

    return (
        <Popover
            target={target}
            placement='bottom'
            trigger='legacy'
            isOpen={isPopoverOpen}
            toggle={togglePopover}
            size='auto'
            body={
                <>
                    {currentSearchDetails}
                    {bodyComponent}
                </>
            }
            disabled={isDisabled}
            {...popoverModifiers}
        />
    );
};

ChipPopover.propTypes = {
    target: PropTypes.string,
    title: PropTypes.string,
    selectedName: PropTypes.string,
    isPopoverOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    togglePopover: PropTypes.func,
    bodyComponent: PropTypes.node,
};
