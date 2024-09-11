import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@lwt-helix/buttons';
import Modal from '@lwt-helix/modal';
import { Input, Label } from '@lwt-helix/controls';
import { Row } from '@lwt-helix/layout';
import { setStateData } from '../../../helpers/state';
import { buttonTerms, searchTerms } from '../../../../constants';

const EditListModal = props => {
    const {
        key,
        closeEditModal,
        modalIsOpen,
        initialList,
        idProperty,
        onSaveNew,
        onUpdate,
        onDelete,
        headerContent,
        isDirty
    } = props;

    const [state, setState] = useState({});
    const listNameInput = useRef();

    useEffect(() => {
        setStateData('modalIsOpen', modalIsOpen, setState);
    }, [modalIsOpen]);

    useEffect(() => {
        setStateData('selectedList', { ...initialList }, setState);
    }, [initialList]);

    const updateListProperty = (e, property) => {
        setStateData('selectedList', { ...state.selectedList, [property]: e.target.value.trim() }, setState);
    };

    const editListContent = (
        <div className="mx-3">
            <Row>
                <Label dataLwtId="list-name-label">{searchTerms.listName}</Label>
                <Input
                    innerRef={listNameInput}
                    dataLwtId="list-name-input"
                    onChange={e => updateListProperty(e, 'name')}
                    defaultValue={initialList?.name}
                    maxLength={80}
                    autoFocus={true}
                />
            </Row>
        </div>
    );

    return <Modal
        key={key}
        title={headerContent}
        children={editListContent}
        show={state.modalIsOpen}
        onClose={() => {
            closeEditModal();
            setStateData('selectedList', { ...state.selectedList, name: initialList?.name }, setState);
        }}
        onOpened={() => listNameInput.current?.focus()}
        buttons={
            initialList?.[idProperty]
                ? <div className="w-100">
                    <div className="float-left" style={{ padding: '5px 10px' }}>
                        {onDelete && <Button dataLwtId="delete-icon"
                                             color="danger"
                                             onClick={() => onDelete(state.selectedList)}
                                             id="delete-link"
                        >
                            {buttonTerms.delete}
                        </Button>
                        }
                    </div>
                    <div className="float-right">
                        <Button
                            dataLwtId="saveAsNew"
                            id={buttonTerms.saveAsNewButtonId}
                            color="outline-primary"
                            disabled={!state.selectedList || !state.selectedList.name?.length || (state.selectedList.name === initialList?.name)}
                            onClick={(e) => onSaveNew(e.target, { ...state.selectedList, id: undefined }, true)}
                        >
                            {buttonTerms.saveAsNew}
                        </Button>
                        <Button
                            dataLwtId="update"
                            color="primary"
                            id={buttonTerms.updateButtonId}
                            onClick={(e) => onUpdate(e.target, state.selectedList, state.selectedList.name !== initialList?.name)}
                            disabled={!state.selectedList || !state.selectedList.name?.length || (state.selectedList.name === initialList?.name && !isDirty)}
                        >
                            {buttonTerms.update}
                        </Button>
                    </div>
                </div>
                : <Button
                    dataLwtId="save"
                    id={buttonTerms.saveAsNewButtonId}
                    color="primary"
                    onClick={(e) => {
                        onSaveNew(e.target, state.selectedList, true);
                    }}
                    disabled={!state.selectedList?.name}
                >
                    {buttonTerms.save}
                </Button>
        }
    />
};

export default EditListModal;
