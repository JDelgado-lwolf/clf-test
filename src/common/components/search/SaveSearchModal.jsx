import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Modal from '@lwt-helix/modal';
import { Button } from '@lwt-helix/buttons';
import { Label, Input } from '@lwt-helix/controls';
import { Row } from '@lwt-helix/layout';
import { ToastContainer } from '@lwt-helix/toast';
import { setStateData } from '../../helpers/state';
import {
    buttonTerms,
    moduleRoutes,
    modules,
    searchTerms,
    searchTypes,
    toastMessages
} from '../../../constants';
import { saveSavedSearch, updateSavedSearch } from '../../../service/service-gateway';
import { showToast } from '../../helpers/toast';
import { getParentFromValue } from '../../helpers/object';
import { useCommonStore, useSearchStore } from '../../../store/store';
import { useAuthStore } from '../../../store/auth/store';
import { ownerTypeByTokenType } from '../../../constants/auth';
import { OverwriteModalContent } from './OverwriteModalContent';
import { runningApp } from '../../../constants/app';

const SaveSearchModal = props => {
    const { disabled, searchObj, userId, module } = props;

    const {
        setIsLoading,
        savedSearchList,
        getSavedSearchList,
        setSelectedSavedSearch
    } = useSearchStore(state => ({
        setIsLoading: state.setIsLoading,
        savedSearchList: state[module]?.savedSearchList,
        getSavedSearchList: state.getSavedSearchList,
        setSelectedSavedSearch: state.setSelectedSavedSearch
    }));

    const {
        timeIntervals,
        marketAreaLists,
        officeLists,
        agentLists,
        accountInfo,
        mlsProviders,
    } = useCommonStore(state => ({
        timeIntervals: state.timeIntervals,
        marketAreaLists: state.marketAreaLists,
        officeLists: state.officeLists,
        accountInfo: state.accountInfo,
        agentLists: state.agentLists,
        mlsProviders: state.mlsProviders,
    }));

    const { tokenType } = useAuthStore(({ tokenType }) => ({ tokenType }));

    const searchNameRef = useRef();
    const [state, setState] = useState({});
    const location = useLocation();

    const updateSearch = (e, prop) => {
        setStateData(
            'saveSearch',
            {
                ...state.saveSearch,
                [prop]: e.target.value.trim()
            },
            setState
        );
    };

    const saveSearchModalHeader = searchTerms.saveSearchHeader;
    const overwriteSearchModalHeader = searchTerms.overwriteSearchHeader;
    const saveSearchModalContent = (<div className='mx-3'>
        <Row>
            <Label dataLwtId='name-search-label'>{searchTerms.nameYourSearch}</Label>
            <Input dataLwtId='name-search' placeholder={searchTerms.searchNamePlaceholder}
                   onChange={e => updateSearch(e, 'searchName')} innerRef={searchNameRef} maxLength={80} />
        </Row>
        <Row>
            <Label dataLwtId='notes-search-label'>{searchTerms.describeYourSearch}</Label>
            <Input dataLwtId='notes-search' placeholder={searchTerms.searchNotesPlaceholder}
                   onChange={e => updateSearch(e, 'notes')} maxLength={80} />
        </Row>
    </div>);

    const toggleSaveModal = () => {
        setState(prevState => ({
            ...prevState,
            showSaveModal: !state.showSaveModal,
            saveSearch: undefined
        }));
    };

    const toggleOverwriteModal = () => {
        setStateData('showOverwriteModal', !state.showOverwriteModal, setState);
    };

    const saveSearch = () => {
        const found = savedSearchList?.find(ss =>
            ss.savedSearch.mlsId === searchObj.mlsId
            && ss.savedSearch.ownerId === userId
            && ss.savedSearch.searchName.toLowerCase() === state.saveSearch.searchName.toLowerCase());

        if (found) {
            setState(prevState => ({
                    ...prevState,
                    showOverwriteModal: true,
                    overwriteSearch: found,
                    search: {
                        ...searchObj,
                        notes: state.saveSearch.notes || ''
                    }
                }
            ));
        } else {
            const savedSearch = {
                ...searchObj,
                searchName: state.saveSearch.searchName,
                notes: state.saveSearch.notes,
                application: runningApp,
                module: getParentFromValue(modules, module),
                ownerType: ownerTypeByTokenType[tokenType],
                ownerId: userId,
                isDefault: false,
                representationCriteria: {},
                searchType: location.pathname === moduleRoutes[module]
                    ? searchTypes[location.pathname].type
                    : undefined
            };
            toggleSaveModal();

            saveSavedSearch(savedSearch).then(async response => {
                if (response.id) {
                    setIsLoading(true);
                    await getSavedSearchList(userId);
                    setIsLoading(false);

                    const savedSearchWithId = { id: response.id, savedSearch: { ...savedSearch } };
                    const selectedMls = { ...mlsProviders.find(mls => mls.mlsId === savedSearchWithId.savedSearch.mlsId) };
                    await setSelectedSavedSearch({
                        search: savedSearchWithId,
                        selectedMls,
                        timeIntervals,
                        marketAreaLists,
                        accountId: accountInfo?.id,
                        officeLists,
                        agentLists
                    });
                    showToast('success', toastMessages.success.searchSaved, setState);
                } else if (response.error) {
                    showToast('error', toastMessages.error.saveSearch, setState);
                }
            });
        }
    };

    const handleOverwriteSearch = async () => {
        const savedSearch = {
            ...state.overwriteSearch,
            savedSearch: {
                ...state.overwriteSearch.savedSearch,
                mlsId: searchObj.mlsId,
                searchCriteria: { ...searchObj.searchCriteria },
                searchName: state.saveSearch.searchName,
                notes: state.saveSearch.notes
            }
        };

        setState(prevState => ({
            ...prevState,
            showSaveModal: false,
            showOverwriteModal: false
        }));
        updateSavedSearch(savedSearch).then(async response => {
            if (!response.error) {
                await getSavedSearchList(userId);
                const savedSearchWithId = { id: response.id,  ...savedSearch };
                const selectedMls = { ...mlsProviders.find(mls => mls.mlsId === savedSearchWithId.savedSearch.mlsId) };
                await setSelectedSavedSearch({
                    search: savedSearchWithId,
                    selectedMls,
                    timeIntervals,
                    marketAreaLists,
                    accountId: accountInfo?.id,
                    officeLists,
                    agentLists
                });
                showToast('success', toastMessages.success.searchSaved, setState);
            } else {
                showToast('error', toastMessages.error.saveSearch, setState);
            }
        });
    };

    return <>
        <Button
            dataLwtId='toggle-save-search'
            color='outline-primary'
            size='sm'
            disabled={disabled}
            onClick={toggleSaveModal}
        >
            {buttonTerms.save}
        </Button>
        <Modal
            title={saveSearchModalHeader}
            children={saveSearchModalContent}
            show={state.showSaveModal}
            onClose={toggleSaveModal}
            onOpened={() => searchNameRef.current?.focus()}
            buttons={<>
                <Button dataLwtId='cancel' color='secondary'
                        onClick={toggleSaveModal}>{buttonTerms.cancel}</Button>
                <Button dataLwtId='save' color='primary' onClick={saveSearch}
                        disabled={!state.saveSearch?.searchName}>{buttonTerms.save}</Button>
            </>}
        />
        <Modal
            title={overwriteSearchModalHeader}
            show={state.showOverwriteModal}
            onClose={toggleOverwriteModal}
            buttons={<>
                <Button dataLwtId='cancel' color='secondary'
                        onClick={toggleOverwriteModal}>{buttonTerms.cancel}</Button>
                <Button dataLwtId='save' color='primary' onClick={handleOverwriteSearch}>{buttonTerms.ok}</Button>
            </>}
        >
            <OverwriteModalContent name={state.saveSearch?.searchName}/>
        </Modal>
        <ToastContainer position='toast-bottom-right' dataLwtId='save-search-toasts'
                        toastProps={state.toastProps} />
    </>;
};

SaveSearchModal.propTypes = {
    disabled: PropTypes.boolean,
    module: PropTypes.string,
    searchObj: PropTypes.object,
    userId: PropTypes.number,
};

export default SaveSearchModal;
