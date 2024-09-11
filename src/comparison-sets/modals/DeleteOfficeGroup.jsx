import React from 'react';
import Modal from "@lwt-helix/modal";
import { comparisonSetsModals, marketShareTerms as mst } from '../../constants';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { Button } from '@lwt-helix/buttons';
import { buttonTerms } from '../../constants';
import Loader from '@lwt-helix/loader';

export const DeleteOfficeGroup = ({setState}) => {
    const {
        shouldShowDeleteModal,
        toggleModal,
        selectedComparisonSet,
        selectedOfficeGroup,
        deleteOfficeGroup,
        isLoading
    } = useComparisonSetsStore(state => ({
        shouldShowDeleteModal: state.shouldShowByModal[comparisonSetsModals.DELETE_OFFICE_GROUP],
        toggleModal: state.toggleModal,
        selectedComparisonSet: state.selectedComparisonSet,
        selectedOfficeGroup: state.selectedOfficeGroup,
        deleteOfficeGroup: state.deleteOfficeGroup,
        isLoading: state.isLoading
    }));

    const closeOfficeGroupDeleteModal = () => toggleModal(false, comparisonSetsModals.DELETE_OFFICE_GROUP);

    const handleDelete = () => {
        deleteOfficeGroup(selectedComparisonSet, selectedOfficeGroup, setState);
    };

    return (<Modal
        dataLwtId='delete-comparison-set-modal'
        onClose={closeOfficeGroupDeleteModal}
        title={<h5 className='modal-title-md'>{mst.getDeleteOfficeGroup(selectedOfficeGroup?.name)}</h5>}
        show={shouldShowDeleteModal}
        size='md'
        buttons={
            <div className="d-flex justify-content-end">
                <Button
                    dataLwtId='cancel'
                    color='secondary'
                    onClick={closeOfficeGroupDeleteModal}
                    disabled={isLoading}
                >
                    {buttonTerms.cancel}
                </Button>
                <Button
                    dataLwtId='delete-ok'
                    color='primary'
                    onClick={handleDelete}
                    disabled={isLoading}
                >
                    {buttonTerms.ok}
                </Button>
            </div >
        }
    >
        {isLoading ? <Loader/> : null}
    </Modal>
);
};
