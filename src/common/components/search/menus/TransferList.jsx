import React from 'react';
import { Button } from '@lwt-helix/buttons';
import Loader from '@lwt-helix/loader';
import { buttonTerms, searchTerms } from '../../../../constants';
import Icon from '@lwt-helix/icon';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { arrows_exchange } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import EditListModal from './EditListModal';

const TransferList = props => {
    const {
        renderedAvailableItems,
        renderedAddedItems,
        addAll,
        removeAll,
        showEditModal,
        closeEditModal,
        modalIsOpen,
        selectedList,
        selectedItems,
        saveList,
        updateList,
        availableWidth,
        addedWidth,
        disabled,
        editModalHeader,
        idProperty,
        isDirty,
        isLoadingAddedItems,
        shouldHideSaveAsListButton,
        isAddAllDisabled
    } = props;

    return (
        <div className={`w-100 d-inline-block transfer-list-menu ${idProperty}`} >
            <div className="available-column-wrapper" style={{ width: availableWidth || '48%' }}>
                <span className="helix-body--strong">Available</span>
                <div className="available-items transfer-items-list">
                    {renderedAvailableItems}
                </div>
                <div className="add-controls float-left">
                    <Button
                        dataLwtId="add-all"
                        color="secondary"
                        onClick={() => addAll()}
                        disabled={isAddAllDisabled}
                    >
                        {buttonTerms.all} {'>'}
                    </Button>
                </div>
            </div>
            <div className="transfer-column-separator">
                <div className="transfer-list-bar" />
                <div className="transfer-icon">
                    <HelixIcon icon={arrows_exchange} {...chipIconProps} title="exchange icon" />
                </div>
                <div className="transfer-list-bar" />
            </div>
            <div className="added-column-wrapper" style={{ width: addedWidth || '48%' }}>
                <span className="helix-body--strong d-inline">Added</span>
                {!shouldHideSaveAsListButton && <Button
                    dataLwtId="edit-list"
                    size="sm"
                    color="light"
                    className="text-capitalize align-self-end"
                    id="edit-list"
                    onClick={showEditModal}
                    style={{ marginBottom: '8px', padding: '0 0 2px 0', float: 'right' }}
                    disabled={disabled}
                >
                    <Icon className="mr-1 text-primary" iconName="add_circle" dataLwtId="add-icon" />
                    {selectedList ? searchTerms.saveList : searchTerms.saveAsList}
                </Button>}
                <EditListModal
                    key="transfer-edit-list"
                    closeEditModal={closeEditModal}
                    modalIsOpen={modalIsOpen}
                    initialList={selectedList}
                    idProperty={idProperty}
                    onSaveNew={saveList}
                    onUpdate={updateList}
                    disabled={disabled}
                    headerContent={editModalHeader}
                    isDirty={isDirty}
                />
                <div className="added-items transfer-items-list">
                    {isLoadingAddedItems ? <Loader /> : renderedAddedItems}
                </div>
                <div className="remove-controls float-right">
                    <Button
                        dataLwtId="remove-all"
                        color="secondary"
                        onClick={removeAll}
                        disabled={!selectedItems?.length}
                    >
                        {'< '}
                        {buttonTerms.all}
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default TransferList;
