import React from 'react';
import Modal from '@lwt-helix/modal';
import { comparisonSetsModals, marketShareTerms as mst } from '../../constants';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { OfficeGroupButtons } from './OfficeGroupButtons';
import { OfficeGroupContent } from './OfficeGroupContent';
import { useComparisonSets } from '../hooks/comparisonSets';
import { ToastContainer } from '@lwt-helix/toast';
import { DeleteOfficeGroup } from './DeleteOfficeGroup';

export const OfficeGroup = () => {
    const officeGroupModal = comparisonSetsModals.OFFICE_GROUP;
    const { setState: csSetState, state: csState } = useComparisonSets();
    const {
        shouldShowSaveModal,
        toggleModal,
        clearState,
        isOfficeGroupEdit,
    } = useComparisonSetsStore(state => ({
        shouldShowSaveModal: state.shouldShowByModal[officeGroupModal],
        toggleModal: state.toggleModal,
        clearState: state.clearState,
        isOfficeGroupEdit: state.isOfficeGroupEdit,
    }));

    return <>
        <Modal
            dataLwtId='new-office-group-modal'
            onClose= {() => {
                toggleModal(false, officeGroupModal);
                clearState();
            }}
            title={isOfficeGroupEdit ? mst.editOfficeGroup : mst.addNewOfficeGroup}
            show={shouldShowSaveModal}
            size='xl'
            buttons={<OfficeGroupButtons
                setState={csSetState}
            />}
        >
            <OfficeGroupContent />
        </Modal>
        <ToastContainer
            position='toast-bottom-right'
            dataLwtId='office-group-toast'
            toastProps={csState.toastProps}
        />
        <DeleteOfficeGroup setState={csSetState} />
    </>

};
