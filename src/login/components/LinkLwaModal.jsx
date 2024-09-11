import React from 'react'
import Modal from '@lwt-helix/modal'
import { useAuthStore } from '../../store/auth/store';
import { modalTerms, modalTitles } from '../../constants';
import { LinkLwaModalButtons } from './LinkLwaModalButtons';
import { appLabels, runningApp } from '../../constants/app';

export const LinkLwaModal = () => {
    const {
        errorLinkingLwa,
        shouldShowLinkLwaModal,
    } = useAuthStore(state => ({
        errorLinkingLwa: state.errorLinkingLwa,
        shouldShowLinkLwaModal: state.shouldShowLinkLwaModal,
    }));

    const appName = appLabels[runningApp];

    return (
        <Modal
            show={shouldShowLinkLwaModal}
            title={modalTitles.linkLwaModal(appName)}
            buttons={<LinkLwaModalButtons />}
        >
            <h6>{modalTerms.linkLwaModalsubtitle(appName)}</h6>
            <p className='text-modal-msg'>
                {modalTerms.linkLwaModalBody1}
                <br/>
                <br/>
                {modalTerms.linkLwaModalBody2(appName)}
            </p>
            {errorLinkingLwa && (
                <p className='text-danger text-center'>
                    <br/>
                    {errorLinkingLwa}
                </p>
            )}
        </Modal>
    );
}
