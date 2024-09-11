import React from 'react';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { Button } from '@lwt-helix/buttons';
import { buttonTerms, comparisonSetsModals } from '../../constants';

export const OfficeGroupButtons = ({
    setState
}) => {
    const {
        addedOffices,
        officeGroupName,
        comparisonSets,
        handleSaveOfficeGroups,
        selectedComparisonSet,
        toggleModal,
        selectedMls,
        clearState,
        isOfficeGroupEdit,
        getIsOfficeGroupSaveBtnDisabled,
    } = useComparisonSetsStore(state => ({
        addedOffices: state.addedOffices,
        officeGroupName: state.officeGroupName,
        handleSaveOfficeGroups: state.handleSaveOfficeGroups,
        selectedComparisonSet: state.selectedComparisonSet,
        toggleModal: state.toggleModal,
        comparisonSets: state.comparisonSets,
        selectedMls: state.selectedMls,
        clearState: state.clearState,
        isOfficeGroupEdit: state.isOfficeGroupEdit,
        getIsOfficeGroupSaveBtnDisabled: state.getIsOfficeGroupSaveBtnDisabled,
    }));

    const handleSave = () => {
        const offices = addedOffices.map(office => ({officeId: office.officeId}));
        const groups = [{ name: officeGroupName.trim(), offices }];
        const mlsDescription = selectedComparisonSet.shortDescription || selectedMls?.value.shortDescription;
        const groupLabel = `${officeGroupName} (${mlsDescription})`;
        handleSaveOfficeGroups({ comparisonSets, selectedComparisonSet, groupLabel, groups, setState });
    };

    const showOfficeGroupDeleteModal = () => {
        toggleModal(true, comparisonSetsModals.DELETE_OFFICE_GROUP);
        clearState();
    };

    const closeOfficeGroupModal = () => {
        toggleModal(false, comparisonSetsModals.OFFICE_GROUP);
        clearState();
    };

    return <div className='d-flex justify-content-between w-100'>
        <Button
            dataLwtId='delete-comp-set-office-group'
            color='danger'
            onClick={showOfficeGroupDeleteModal}
            disabled={!isOfficeGroupEdit}
        >
            {buttonTerms.delete}
        </Button>
        <div>
            <Button
                dataLwtId='cancel-comp-set-office-group'
                color='secondary'
                onClick={closeOfficeGroupModal}
            >
                {buttonTerms.cancel}
            </Button>
            <Button
                dataLwtId='save-comp-set-office-group'
                color='primary'
                onClick={handleSave}
                disabled={getIsOfficeGroupSaveBtnDisabled()}
            >
                {buttonTerms.save}
            </Button>
        </div>
    </div>;
};
