import React from 'react';
import PropTypes from 'prop-types';
import Modal from "@lwt-helix/modal";
import { comparisonSetsModals, marketShareTerms as mst, buttonTerms } from '../../constants';
import { SaveComparisonSetContent } from './SaveComparisonSetContent';
import { SaveButtons } from './SaveButtons';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { Button } from '@lwt-helix/buttons';
import { DeleteComparisonSet } from './DeleteComparisonSet';

export const EditComparisonSet = ({
    defaultMlsOption,
    state,
    setState,
    selectedMls
}) => {
    const editModal = comparisonSetsModals.EDIT;

    const {
        shouldShowEditModal,
        toggleModal,
    } = useComparisonSetsStore(state => ({
        shouldShowEditModal: state.shouldShowByModal[editModal],
        toggleModal: state.toggleModal,
    }));

    return (<> <Modal
        dataLwtId='edit-comparison-set-modal'
        onClose={() => { toggleModal(false, editModal); }}
        title={mst.editComparisonSet}
        show={shouldShowEditModal}
        size='md'
        buttons={
            <div className="d-flex w-100">
                <Button
                    dataLwtId='delete-comp-set'
                    color='danger'
                    className='mr-auto'
                    onClick={() => { toggleModal(true, comparisonSetsModals.DELETE); }}
                >
                    {buttonTerms.delete}
                </Button>
                <SaveButtons
                    isSaveButtonDisabled={state.isSaveButtonDisabled}
                    setState={setState}
                    defaultMlsOption={defaultMlsOption}
                    isEdit={true}
                    selectedMls={selectedMls}
                />
            </div>
        }
    >
        <SaveComparisonSetContent
            isEdit={true}
            shouldShowMlsList={false}
            setState={setState}
        />
    </Modal>
        <DeleteComparisonSet setState={setState} />
    </>
    );
};

EditComparisonSet.propTypes = {
    defaultMlsOption: PropTypes.object,
    state: PropTypes.object,
    setState: PropTypes.func,
    selectedMls: PropTypes.object
};
