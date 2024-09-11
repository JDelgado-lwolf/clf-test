import React from 'react';
import { moduleNames } from '../../../../../../../constants';
import EntryTable from '@lwt-helix/entry-table';
import { Col, Row } from '@lwt-helix/layout';
import PropertyInfoDetail from './PropertyInfoDetail';
import { getListingInfo, getPropertyInfo } from '../../../helpers/propertyInfoDetail';
import { getListingInfo as getListingInfoMarketShare, getPropertyInfo as getPropertyInfoMarketShare } from '../../../../../../../market-share/helpers/propertyInfoDetail';

const PropertyInformation = ({ data, module, mlsName }) => {
    const isMarketShare = module.includes(moduleNames.marketShare);
    const column1 = isMarketShare ? getListingInfoMarketShare(data) :  getListingInfo(data);
    const column2 = isMarketShare ? getPropertyInfoMarketShare(data) : getPropertyInfo(data);
    const entryValueClassName = isMarketShare ? 'property-value' : 'helix-body--strong'
    const entryDescriptionClassName = isMarketShare ? 'property-description' : ''

    const columns = [column1, column2];

    const renderEntry = entry => {
        if (entry.header) {
            return <h4 className='text-uppercase font-italic'>{entry.header}</h4>;
        }

        let className;
        if (!isMarketShare) {
            className = 'border-top m-0';
            if (entry.isLastRow) className += ' border-bottom';
        }

        const code = entry.code && `(${entry.code})`;
        const value = entry.value ?? '';

        const renderEntryCode = entryCode => {
            if (!entryCode) return ''
            if (isMarketShare) {
                return `(${entryCode})`
            } else return entryCode
        } 

        if (code) {
            return <>
                <Row className={className}>
                    <Col className={entryDescriptionClassName}>{entry.description}</Col>
                    <Col className={entryValueClassName}>
                        <PropertyInfoDetail 
                            data={data}
                            entry={entry}
                            entryValueClassName={entryValueClassName}
                            mlsName={mlsName}
                            renderEntryCode={renderEntryCode}
                        />
                    </Col>
                </Row>
            </>;
        };

        return <>
            <Row className={className}>
                <Col className={entryDescriptionClassName}>{entry.description}</Col>
                <Col className={entryValueClassName}>{value} {code}</Col>
            </Row>
        </>;
    };

    return <div id={isMarketShare ? 'property-info-market-share' : 'property-info'}>
        {columns.map((column, index) => {
            return <div key={index} className='col-lg-6 col-md-12 pd-0'>
                <EntryTable
                    dataLwtId={`property-info-column-${index}`}
                    data={column}
                    renderEntry={renderEntry}
                    className={isMarketShare ? '' : 'card-body'}
                />
            </div>;
        })}
    </div>;
};

export default PropertyInformation;
