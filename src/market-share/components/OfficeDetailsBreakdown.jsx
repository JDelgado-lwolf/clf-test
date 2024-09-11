import React from 'react';
import EntryTable from '@lwt-helix/entry-table';
import { Col, Row } from '@lwt-helix/layout';
import { getBrokerDetails, getOfficeDetails } from '../helpers/propertyInfoDetail';

const OfficeDetails = (data) => {

    const column1 = getBrokerDetails(data);
    const column2 = getOfficeDetails(data);

    const columns = [column1, column2];

    const renderEntry = entry => {
        const value = entry.value ?? '';

        let className = 'border-top m-0';
        if (entry.isLastRow) className += ' border-bottom';

        return <>
            <Row className={className}>
                <Col>{entry.description}</Col>
                <Col className="font-weight-bold">{value}</Col>
            </Row>
        </>;
    };

    return <>
        {columns.map((column, index) => {
            return <div key={index} className="col-lg-6 col-md-12 pd-0">
                <EntryTable
                    dataLwtId={`office-details-column-${index}`}
                    data={column}
                    renderEntry={renderEntry}
                />
            </div>;
        })}
    </>;
};

export default OfficeDetails;
