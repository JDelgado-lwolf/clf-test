import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { Button } from '@lwt-helix/buttons';
import { buttonTerms, comparisonSetsModals } from '../../constants';

export const SaveButtons = ({ isSaveButtonDisabled, setState, defaultMlsOption, isEdit, selectedMls }) => {
    const {
        comparisonSets,
        handleSaveComparisonSet,
        toggleModal,
        selectedComparisonSet,
        newCompSetName,
    } = useComparisonSetsStore(state => ({
        comparisonSets: state.comparisonSets,
        handleSaveComparisonSet: state.handleSaveComparisonSet,
        toggleModal: state.toggleModal,
        selectedComparisonSet: state.selectedComparisonSet,
        newCompSetName: state.newCompSetName
    }));

    useEffect(() => {
        const isSaveDisabledOnEdit = newCompSetName === selectedComparisonSet?.name;
        const isSaveDisabledOnCreate = !newCompSetName || newCompSetName.trim() === '';
        const isSaveButtonDisabled = isEdit ? isSaveDisabledOnEdit : isSaveDisabledOnCreate;
        setState( prevState => ({ ...prevState, isSaveButtonDisabled }));
    }, [selectedComparisonSet, newCompSetName]);

    return (<>
        <Button
            dataLwtId='cancel'
            color='secondary'
            onClick={() => {
                toggleModal(false, comparisonSetsModals.SAVE);
            }}
        >
            {buttonTerms.cancel}
        </Button>
        <Button
            dataLwtId='save'
            color='primary'
            onClick={() => { handleSaveComparisonSet({ setState, defaultMlsOption, comparisonSets, isEdit, selectedMls }); }}
            disabled={isSaveButtonDisabled}>
            {buttonTerms.save}
        </Button>
    </>);
};

SaveButtons.propTypes = {
    isSaveButtonDisabled: PropTypes.boolean,
    defaultMlsOption: PropTypes.object,
    setState: PropTypes.func,
    isEdit: PropTypes.bool,
    selectedMls: PropTypes.object
};
