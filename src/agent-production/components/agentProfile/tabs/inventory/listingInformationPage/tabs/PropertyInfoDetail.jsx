import React, { useState, useEffect } from 'react';
import Modal from '@lwt-helix/modal';
import EntryTable from '@lwt-helix/entry-table';
import { Col, Row } from '@lwt-helix/layout';
import { getAgentInfoDetail, getOfficeInfoDetail } from '../../../../../../../service/service-gateway';
import { agentProductionTerms as apt } from '../../../../../../../constants';
import { setStateData } from '../../../../../../../common/helpers/state';
import {
    getAgentInfoRows,
    getInputParamConfig,
    getOfficeInfoRows,
    agentEntries
} from '../../../helpers/propertyInfoDetail';

const PropertyInfoDetail = ({ data, entry, mlsName, renderEntryCode, entryValueClassName }) => {
    const [state, setState] = useState({
        agentDetails: null,
        officeDetails: null,
        requestParams: null,
        showModal: false
    });

    useEffect(() => {
        const getDetailData = async () => {
            if (!state.requestParams) return;

            try {

                if (agentEntries.includes(state.requestParams.entry)) {
                    const agentDetail = await getAgentInfoDetail(state.requestParams.mlsId, state.requestParams.idValue);
                    setStateData('agentDetails', agentDetail, setState);

                    const officeDetail = await getOfficeInfoDetail(state.requestParams.mlsId, agentDetail.officeId);
                    setStateData('officeDetails', officeDetail, setState);
                } else {
                    let officeDetail = await getOfficeInfoDetail(state.requestParams.mlsId, state.requestParams.idValue);
                    setStateData('officeDetails', officeDetail, setState);
                }

            } catch (error) {
                throw new Error(`Listing Information Detail error: ${error}`);
            }
        };

        const detailError = (error) => console.log(error);

        getDetailData().catch(detailError);
    }, [state.requestParams]);


    let columns, title;

    if (agentEntries.includes(state.requestParams?.entry)) {
        columns = getAgentInfoRows(state.agentDetails, state.officeDetails);
        title = apt.agentContactInformation;
    } else {
        columns = getOfficeInfoRows(state.officeDetails, mlsName);
        title = apt.officeDetail;
    }

    const renderEntry = entry => {
        let className = 'border-top m-0';
        if (entry.isLastRow) className += ' border-bottom';

        if (entry.isAltData) {
            return (
                <>
                    <Row className={className}>
                        <Col className='property-detail-description'>{entry.description}</Col>
                        <Col>
                            {Array.isArray(entry.value) && entry.value.length > 0
                                ? entry.value.map((item, index) => {
                                    return (
                                        <Row key={index}>
                                            <Col className='property-detail-description'>{item.description}</Col>
                                            <Col className='property-detail-value'>{item.value}</Col>
                                        </Row>
                                    );
                                })
                                : '-'
                            }
                        </Col>
                    </Row>
                </>
            );
        }

        return <>
            <Row className={className}>
                <Col className='property-detail-description'>{entry.description}</Col>
                <Col className='property-detail-value'>{entry.value}</Col>
            </Row>
        </>;
    };

    const toggleModal = () => setStateData('showModal', !state.showModal, setState);

    const inputParamConfig = getInputParamConfig(data);

    const handleDetailInformation = (entry) => {
        setStateData('requestParams', inputParamConfig[entry], setState);
        toggleModal();
    };

    return (
        <>
            <a className={`btn-link ${entryValueClassName}`} onClick={() => handleDetailInformation(entry.description)}>
                {entry.value ?? ''} {renderEntryCode(entry.code)}
            </a>
            <Modal
                onClose={toggleModal}
                show={state.showModal}
                showFooter={false}
                size='lg'
                title={title}
            >
                <div id='property-info'>
                    <EntryTable
                        dataLwtId='property-info'
                        data={columns}
                        renderEntry={renderEntry}
                        className='card-body'
                    />
                </div>
            </Modal>
        </>
    );
};

export default PropertyInfoDetail;
