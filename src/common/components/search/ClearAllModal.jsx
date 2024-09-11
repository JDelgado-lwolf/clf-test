import React from 'react';
import { Button } from '@lwt-helix/buttons';
import Modal from '@lwt-helix/modal';
import { buttonTerms, searchTerms } from '../../../constants';
import { useSearchStore } from '../../../store/store';

const ClearAllModal = props => {
    const {
        shouldShowModal,
        onClose,
    } = props;

    const { clearAllSearch } = useSearchStore(
        state => ({ clearAllSearch: state.clearAllSearch })
    );

    const handleClearAllSearch = () => {
        clearAllSearch();
        onClose();
    };

    return <Modal
        key="clear-all"
        title={searchTerms.clearAllSearchTitle}
        show={shouldShowModal}
        onClose={onClose}
        buttons={
            <>
                <Button
                    dataLwtId="Cancel"
                    color="secondary"
                    onClick={onClose}
                >
                    {buttonTerms.cancel}
                </Button>
                <Button
                    color='danger'
                    dataLwtId='clear'
                    onClick={handleClearAllSearch}
                >
                    <div className='d-flex align-items-center justify-content-center'>
                        {buttonTerms.clearAll}
                    </div>
                </Button>
            </>
        }
    >
        <p className='clear-all-modal-text'>
            {searchTerms.clearAllSearchMessage}
        </p>
    </Modal>;
};

export default ClearAllModal;
