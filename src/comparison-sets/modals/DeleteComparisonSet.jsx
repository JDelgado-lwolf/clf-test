import React from 'react';
import Modal from "@lwt-helix/modal";
import { comparisonSetsModals, marketShareTerms as mst } from '../../constants';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { Button } from '@lwt-helix/buttons';
import { buttonTerms } from '../../constants';
import { useCommonStore } from '../../store/store';
import Loader from '@lwt-helix/loader';

export const DeleteComparisonSet = ({setState}) => {
    const deleteModal = comparisonSetsModals.DELETE;

    const {
        shouldShowEditModal,
        toggleModal,
        selectedComparisonSet,
        deleteComparisonSet,
        isLoading
    } = useComparisonSetsStore(state => ({
        shouldShowEditModal: state.shouldShowByModal[deleteModal],
        toggleModal: state.toggleModal,
        selectedComparisonSet: state.selectedComparisonSet,
        deleteComparisonSet: state.deleteComparisonSet,
        isLoading: state.isLoading
    }));
    const userInfo = useCommonStore(state => state.userInfo);

    const handleDelete = () => deleteComparisonSet(selectedComparisonSet, userInfo.id, setState);

    return (<Modal
        dataLwtId='delete-comparison-set-modal'
        onClose={() => toggleModal(false, deleteModal)}
        title={mst.getDeleteComparisonSet(selectedComparisonSet?.name)}
        show={shouldShowEditModal}
        size='md'
        buttons={
            <div className="d-flex justify-content-end">
                <Button
                    dataLwtId='cancel'
                    color='secondary'
                    onClick={() => toggleModal(false, comparisonSetsModals.DELETE)}
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
        {mst.deleteComparisonSetDescription}
    </Modal >
    );
};
