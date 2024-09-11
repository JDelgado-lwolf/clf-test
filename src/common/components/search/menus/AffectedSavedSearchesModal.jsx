import React from 'react';
import { Button } from '@lwt-helix/buttons';
import Modal from '@lwt-helix/modal';
import { buttonTerms, searchTerms } from '../../../../constants';

const AffectedSavedSearchesModal = props => {
    const {
        showModal,
        onClose,
        onYes,
        savedSearches,
        list,
        continuePrompt,
        searchType
    } = props;

    return <Modal
        key="saved-searches"
        title={searchTerms.dependentSavedSearches}
        show={showModal}
        onClose={onClose}
        buttons={
            <>
                <Button
                    dataLwtId="yes"
                    color="danger"
                    style={{ color: 'white' }}
                    onClick={onYes}
                >
                    {buttonTerms.yes}
                </Button>
                <Button
                    dataLwtId="no"
                    color="secondary"
                    onClick={onClose}
                >
                    {buttonTerms.no}
                </Button>
            </>
        }
    >
        <p>
            {searchType} "{list?.name}" is used in the following Saved
            Search(es): {savedSearches?.map(ss => `"${ss.savedSearch.searchName}"`).join(', ')}.
            {continuePrompt && `Continue to ${continuePrompt}?` || 'Continue?'}
        </p>
    </Modal>;
};

export default AffectedSavedSearchesModal;
