import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@lwt-helix/buttons';
import Modal from '@lwt-helix/modal';
import Popover from '@lwt-helix/popover';
import Loader from '@lwt-helix/loader';
import { CustomInput, Input, Label } from '@lwt-helix/controls';
import { useCommonStore, useSearchStore, useSavedAgentsStore } from '../../../store/store';
import {
    favoriteAgentTerms as favTerms,
    popoverTerms
} from '../../../agent-production/constants/agentProductionConstants';
import { buttonTerms, modules, searchTerms } from '../../../constants';
import { setStateData  } from '../../../common/helpers/state';
import ToastContainerPortal from '../../../common/components/search/menus/ToastContainerPortal';
import { showToast } from '../../../common/helpers/toast';

const AddAgentListPopover = () => {

    const listNameInput = useRef();

    const {
        agentLists,
        agentListToUpdate,
        agentListsCheckedValues,
        createAgentsList,
        handleUpdateAgentNameSelectedList,
        popoverDataForAddAgentList,
        toggleAgentListsPopover
    } = useCommonStore(state => ({
        agentLists: state.agentLists,
        agentListToUpdate: state.agentListToUpdate,
        agentListsCheckedValues: state.agentListsCheckedValues,
        createAgentsList: state.createAgentsList,
        handleUpdateAgentNameSelectedList: state.handleUpdateAgentNameSelectedList,
        popoverDataForAddAgentList: state.popoverDataForAddAgentList,
        toggleAgentListsPopover: state.toggleAgentListsPopover
    }));

    const currentModule = useSearchStore(state => state.selectedModule);

    const {
        selectedList,
        isLoading,
    } = useSavedAgentsStore(state => ({
        selectedList: state.selectedListByModule[currentModule],
        isLoading: state.isLoading,
    }));


    let mlsId = useSearchStore(state => state[state.selectedModule]?.search)?.mlsId;
    const agentNameSearch = useSearchStore(state => state[modules.proficiencyMetrics.agents]);
    const setListInSearchByAgentSearch = useSearchStore(state => state.setListInSearchByAgentSearch);

    const { agentId, rowIndex, tableId, popoverIsOpen } = popoverDataForAddAgentList;

    const [state, setState] = useState({
        agentListName: undefined,
        savedAgentLists: agentLists,
        shouldShowModal: false,
        popoverIsOpen: false,
        toastProps: undefined,
        currentRowIndex: undefined
    });

    useEffect(() => {
        if (
                currentModule === modules.proficiencyMetrics.savedAgents
                && selectedList
                && agentLists?.length
            ) {
            const mlsId = selectedList.mlsId;
            setStateData('savedAgentLists', agentLists.filter(list => list?.mlsId === mlsId), setState);
        };
    }, [currentModule, selectedList, agentLists]);

    const setToastProps = (type, message) => showToast(type, message, setState);

    const toggleModal = () => setStateData('shouldShowModal', !state.shouldShowModal, setState);

    const handleAgentListNameChange = (e) => setStateData(
        'agentListName',
        e.target.value.trim(),
        setState
    );

    const handleChecked = (event, listId, listName) => {
        event.preventDefault();
        (async () => {
            const list = agentLists.find(list => list?.agentListId === listId);
            const wasAgentRemoved = list?.agentIds.includes(agentId);
            const minAgentsAllowed = 1;
            if (!event.target.checked && list.agentIds.length === minAgentsAllowed) {
                toggleAgentListsPopover();
                setToastProps('error', popoverTerms.atLeastOneAgentInList);
                return;
            }
            await handleUpdateAgentNameSelectedList(listId, agentId, listName, agentNameSearch, setListInSearchByAgentSearch);
            toggleAgentListsPopover();
            setToastProps('success', wasAgentRemoved
                ? popoverTerms.agentRemovedFromList
                : popoverTerms.agentAddedToList
            );
        })()
    };

    const showAgentListModal = () => toggleModal();

    const cancelAddAgentList = () => {
        toggleModal();
        setStateData('agentListName', '', setState);
    };

    const createAddAgentList = async () => {
        if (isLoading) return;
        const agentListName = listNameInput.current.value.trim();
        const agentListNameExists = agentLists.find(list =>
            list?.name.toLowerCase() === agentListName.toLowerCase()
        );
        if (agentListNameExists) return;
        setStateData('popoverIsOpen', false, setState);
        toggleAgentListsPopover();
        await createAgentsList(mlsId, agentListName, agentId);
        setStateData('agentListName', undefined, setState);
        toggleModal();
        setToastProps(agentListNameExists
            ? 'error'
            : 'success',
            agentListNameExists
                ? favTerms.chooseDifferentName
                : favTerms.agentListCreated(agentListName)
        );
    };

    const modalButtons = (
        <>
            <Button
                dataLwtId='cancel-add-agent-list' color='secondary'
                onClick={cancelAddAgentList}
                disabled={isLoading}
            >
                {buttonTerms.cancel}
            </Button>
            <Button
                dataLwtId='save-add-agent-list'
                color='primary'
                onClick={createAddAgentList}
                disabled={!state.agentListName || isLoading}
            >
                {buttonTerms.save}
            </Button>
        </>
    );

    const modalChildren = (
        <div>
            <Label dataLwtId="list-name-label" className='font-weight-bold'>
                {searchTerms.nameYourList}
            </Label>
            <Input
                className='mt-2'
                dataLwtId="list-name-input"
                defaultValue={state.agentListName}
                innerRef={listNameInput}
                maxLength={55}
                onChange={handleAgentListNameChange}
                placeholder={favTerms.enterListName}
            />
            <p className='text-muted'>{favTerms.chooseAName55Char}.</p>
        </div>
    );

    useEffect(() => {
        if (!agentLists) return;
        setStateData('savedAgentLists', agentLists.filter(list => list?.mlsId === mlsId), setState);
    }, [agentLists]);

    const renderedAgentLists = state.savedAgentLists?.map(list => (
        <>
            {list?.name === agentListToUpdate
                ?
                <div className='d-flex align-items-start checkbox-loader'>
                    <Loader />
                    <span>{list?.name}</span>
                </div>
                :
                <CustomInput
                    checked={agentListsCheckedValues?.[list?.agentListId] || false}
                    id={list?.agentListId}
                    key={list?.agentListId}
                    label={list?.name}
                    onChange={(event) => handleChecked(
                        event,
                        list?.agentListId,
                        list?.name
                    )}
                    type={popoverTerms.checkbox}
                />
            }
        </>
    ));

    const popoverBody = (
        <>
            <div className='fav-agents-lists-popover'>
                {mlsId && renderedAgentLists}
            </div>
            <hr />
            <div className='d-flex justify-content-center w-100'>
                <button className='btn btn-light text-capitalize' onClick={showAgentListModal}>
                    {popoverTerms.addList}
                </button>
            </div>
        </>
    );

    return (
        <>
            {popoverIsOpen && <Popover
                id={popoverTerms.favoriteAgentPopover}
                target={popoverTerms.starIcon(tableId, rowIndex)}
                placement={popoverTerms.bottom}
                trigger={!state.shouldShowModal ? popoverTerms.legacy : undefined}
                header={favTerms.savedAgentLists}
                toggle={toggleAgentListsPopover}
                isOpen={popoverIsOpen}
                size={popoverTerms.auto}
                body={popoverBody}
                modifiers={{
                    preventOverflow: { boundariesElement: 'viewport' },
                    computeStyle: {
                        adaptive: false,
                        gpuAcceleration: false,
                        maxHeight: 800
                    }
                }}
            />}
            <ToastContainerPortal toastProps={state.toastProps} />
            <Modal
                children={modalChildren}
                buttons={modalButtons}
                onClose={toggleModal}
                onOpened={() => listNameInput.current?.focus()}
                show={state.shouldShowModal}
                title={favTerms.addAgentList}
            />
        </>
    );
};

export default AddAgentListPopover;
