import React from 'react';
import PropTypes from 'prop-types';
import Modal from "@lwt-helix/modal"
import { comparisonSetsModals, marketShareTerms as mst } from '../../constants'
import { SaveComparisonSetContent } from './SaveComparisonSetContent';
import { SaveButtons } from './SaveButtons';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';

export const SaveComparisonSet = ({
    isSaveButtonDisabled,
    mlsListOptions,
    defaultMlsOption,
    setState,
    selectedMls,
    setSelectedMls
}) =>  {
    const saveModal = comparisonSetsModals.SAVE;

    const {
        shouldShowSaveModal,
        toggleModal,
    } = useComparisonSetsStore(state => ({
        shouldShowSaveModal: state.shouldShowByModal[saveModal],
        toggleModal: state.toggleModal,
    }));

    return ( <Modal
        dataLwtId= 'new-comparison-set-modal'
        onClose= {() => {toggleModal(false, saveModal)}}
        title={mst.addNewComparisonSet}
        show={shouldShowSaveModal}
        size='md'
        buttons={<SaveButtons
            isSaveButtonDisabled={isSaveButtonDisabled}
            setState={setState}
            defaultMlsOption={defaultMlsOption}
            isEdit={false}
            selectedMls={selectedMls}
        />}
    >
        <SaveComparisonSetContent
            shouldShowMlsList={true}
            mlsListOptions={mlsListOptions}
            defaultMlsOption={defaultMlsOption}
            setState={setState}
            setSelectedMls={setSelectedMls}
        />
    </Modal>);
};

SaveComparisonSet.propTypes = {
    isSaveButtonDisabled: PropTypes.boolean,
    mlsListOptions: PropTypes.array,
    defaultMlsOption: PropTypes.object,
    setState: PropTypes.func,
    selectedMls: PropTypes.object,
    setSelectedMls: PropTypes.func
};
