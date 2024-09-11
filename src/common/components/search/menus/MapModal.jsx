import React, { useState } from 'react';
import Modal from '@lwt-helix/modal';
import { Button } from '@lwt-helix/buttons';
import { Label, Input } from '@lwt-helix/controls';
import Icon from '@lwt-helix/icon';

const MapModal = props => {

    const [modalShow, setModalShow] = useState(false);

    const MainModalHeader = () => (<>
        <Label dataLwtId="save-label">Save Custom Area</Label>
        <div className="d-flex">
            <Input dataLwtId="name-area" placeholder="Name your custom map boundary" style={{ width: '250px' }} />
            <Button dataLwtId="save-area" color="primary" className="ml-2 text-nowrap">Save Area</Button>
            <span>Move around the map, select a drawing tool, and to draw your own custom area.</span>
        </div>
    </>);

    const MainModalContent = () => (<>
        // TODO: add interactive map here
    </>);

    // hooks
    const [modalHeader, setModalHeader] = useState(<MainModalHeader />);
    const [modalContent, setModalContent] = useState(<MainModalContent />);

    return (
        <>

            <Button dataLwtId="toggle-map" block color={props.color} className={props.className} size={props.size}
                    onClick={() => setModalShow(!modalShow)}>
                <Icon dataLwtId="toggle-map-icon" className="mr-1 text-primary" iconName="add_circle" />
                Add custom map area
            </Button>

            <Modal
                title={modalHeader}
                children={modalContent}
                show={modalShow}
                onClose={() => setModalShow(false)}
                buttons={<></>}
                size="xxl"
            />
        </>
    );
};

export default MapModal;
