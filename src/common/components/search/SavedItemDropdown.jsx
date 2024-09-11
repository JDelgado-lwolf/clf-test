import React from 'react';
import { PropTypes } from 'prop-types';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { chevron_small_down, search } from '@lwt-helix/helix-icon/outlined';
import ChipButton from '../../../common/components/search/ChipButton';
import ChipPopover from '../../../common/components/search/ChipPopover';
import ChipPopoverBody from '../../../common/components/search/ChipPopoverBody';

export default function SavedItemDropdown(props) {
    const {
        id,
        isDisabled = false,
        label,
        selectedName,
        currentTitle,
        listTitle,
        NoItemsComponent,
        getSavedItemName,
        getSavedItemMls,
        savedList,
        initialSelectedItemId,
        onSelectItem,
        savedGroups,
        toggleEditMode,
        handleOpenEditModal,
        togglePopover,
        isPopoverOpen,
        renderTooltip,
        getSavedItemNotes,
        filterPlaceholder,
    } = props;

    return (
        <>
            <HelixIcon icon={search} className='align-middle mr-2 mb-2' title='search icon'/>
            <ChipButton
                id={id}
                isDisabled={isDisabled}
                label={label}
                onClick={togglePopover}
                rightIcon={<HelixIcon icon={chevron_small_down} className='metrics-arrow-icon' />}
            />
            <ChipPopover
                target={id}
                title={currentTitle}
                isPopoverOpen={isPopoverOpen}
                togglePopover={togglePopover}
                selectedName={selectedName}
                isDisabled={isDisabled}
                bodyComponent={(
                    <ChipPopoverBody
                        listTitle={listTitle}
                        NoItemsComponent={NoItemsComponent}
                        initialSelectedItemId={initialSelectedItemId}
                        getSavedItemName={getSavedItemName}
                        getSavedItemNotes={getSavedItemNotes}
                        getSavedItemMls={getSavedItemMls}
                        savedList={savedList}
                        onSelectItem={onSelectItem}
                        toggleEditMode={toggleEditMode}
                        savedGroups={savedGroups}
                        handleOpenEditModal={handleOpenEditModal}
                        renderTooltip={renderTooltip}
                        filterPlaceholder={filterPlaceholder}
                    />
                )}
            />
        </>
    );
};

SavedItemDropdown.propTypes = {
    id: PropTypes.string,
    isDisabled: PropTypes.bool,
    label: PropTypes.string,
    selectedName: PropTypes.string,
    currentTitle: PropTypes.string,
    listTitle: PropTypes.string,
    NoItemsComponent: PropTypes.node,
    getSavedItemName: PropTypes.func,
    getSavedItemMls: PropTypes.func,
    savedList: PropTypes.array,
    initialSelectedItemId: PropTypes.number,
    onSelectItem: PropTypes.func,
    savedGroups: PropTypes.object,
    toggleEditMode: PropTypes.func,
    handleOpenEditModal: PropTypes.func,
    togglePopover: PropTypes.func,
    renderTooltip: PropTypes.element,
    isPopoverOpen: PropTypes.bool,
    getSavedItemNotes: PropTypes.func,
    filterPlaceholder: PropTypes.string
};
