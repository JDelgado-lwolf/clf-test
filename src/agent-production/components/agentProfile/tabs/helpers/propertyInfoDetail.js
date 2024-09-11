import React from 'react';
import { agentProductionTerms as apt } from '../../../../../constants';
import { getStatusValue } from '../../../../helpers/propertyDataHelpers';
import {
    boolToShortString,
    formatUnitOrPercentage,
    formatVolumeOrDays,
    getCurrencyFormat
} from '../../../../helpers/dataFormatters';

const getRow = (description, value = '-', code, hasDetail) => {
    return {
        description,
        value,
        code,
        hasDetail
    };
};

const getGridRow = (description, value = '', isAltData) => {
    return {
        description,
        value,
        isAltData,
    };
};

const getBusinessAddress = (officeInfo) => {
    const address = `${officeInfo.streetName1 ? officeInfo.streetName1 + ', ' : ''}${officeInfo.city ? officeInfo.city + ', ' : ''}${officeInfo.stateCode ?? ''} ${officeInfo.zipCode ?? ''}`;
    return address.trim() || '-';
}

const getPhoneNumbers = (phones) => {
    if (!phones || phones.length === 0) {
        return '-';
    }

    return phones.map(phone => {
        return {
            description: phone.phoneType,
            value: phone.phoneNumber,
        };
    });
};

export const agentEntries = [apt.listAgent, apt.coListAgent, apt.sellAgent, apt.coSellAgent];

export const getInputParamConfig = data => {
    return {
        [apt.listOffice]: {
            idValue: data.listOfficeId.officeCode,
            entry: apt.listOffice,
            mlsId: data.listOfficeId.mlsId,
        },
        [apt.coListOffice]: {
            idValue: data.coListOfficeId.officeCode,
            entry: apt.coListOffice,
            mlsId: data.coListOfficeId.mlsId,
        },
        [apt.sellOffice]: {
            idValue: data.sellOfficeId.officeCode,
            entry: apt.sellOffice,
            mlsId: data.sellOfficeId.mlsId,
        },
        [apt.coSellOffice]: {
            idValue: data.coSellOfficeId.officeCode,
            entry: apt.coSellOffice,
            mlsId: data.coSellOfficeId.mlsId,
        },
        [apt.listAgent]: {
            idValue: data.listAgentId.agentCode,
            entry: apt.listAgent,
            mlsId: data.listAgentId.mlsId,
        },
        [apt.coListAgent]: {
            idValue: data.coListAgentId.agentCode,
            entry: apt.coListAgent,
            mlsId: data.coListAgentId.mlsId,
        },
        [apt.sellAgent]: {
            idValue: data.sellAgentId.agentCode,
            entry: apt.sellAgent,
            mlsId: data.sellAgentId.mlsId,
        },
        [apt.coSellAgent]: {
            idValue: data.coSellAgentId.agentCode,
            entry: apt.coSellAgent,
            mlsId: data.coSellAgentId.mlsId,
        }
    };
};

export const getOfficeInfoRows = (detailInfo, mlsId) => {

    if (!detailInfo) return [];

    const rows = [];

    rows.push(getRow(apt.brokerID, detailInfo.brokerId));
    rows.push(getRow(apt.officeId, detailInfo.officeId));
    rows.push(getRow(apt.mls, mlsId));
    rows.push(getRow(apt.responsibleMember, detailInfo.responsibleMember));
    rows.push(getRow(apt.mlsIDs, detailInfo.totalAgents));
    rows.push(getRow(apt.producingAgents, detailInfo.producingAgents));
    rows.push(getRow(apt.officeName, detailInfo.officeName));
    rows.push(getRow(apt.emailAddress, detailInfo.emailAddress));
    rows.push(getRow(apt.memberType, detailInfo.memberType));
    rows.push(getRow(apt.status, detailInfo.status));
    rows.push(getRow(apt.businessAddress, getBusinessAddress(detailInfo)));
    rows.push(getGridRow(apt.phoneNumbers, getPhoneNumbers(detailInfo.phoneList), true));

    rows[rows.length - 1].isLastRow = true;

    return rows;
};

export const getAgentInfoRows = (agentInfo, officeInfo) => {

    if (!agentInfo || !officeInfo) return [];

    const rows = [];

    const altAddress = agentInfo?.addressList.length > 0 && agentInfo?.addressList.map(address => {
        return {
            ...address,
            value: getBusinessAddress(address),
        };
    });

    const altPhones = agentInfo?.phoneList.length > 0 && agentInfo?.phoneList.map(phone => {
        return {
            ...phone,
            value: phone.phoneNumber,
        };
    });

    rows.push(getRow(apt.agentId, agentInfo.agentId));
    rows.push(getRow(apt.name, `${agentInfo.firstName} ${agentInfo.lastName}`));
    rows.push(getRow(apt.officeId, officeInfo.officeId));
    rows.push(getRow(apt.officeName, officeInfo.officeName));
    rows.push(getRow(apt.businessAddress, getBusinessAddress(officeInfo)));
    rows.push(getGridRow(apt.phoneNumbers, getPhoneNumbers(officeInfo.phoneList), true));
    rows.push(getRow(apt.emailAddress, agentInfo.emailAddress));
    rows.push(getGridRow(apt.alternateAddress, altAddress, true));
    rows.push(getGridRow(apt.alternatePhoneNumbers, altPhones, true));

    rows[rows.length - 1].isLastRow = true;

    return rows;
};

export const getListingInfo = listInfo => {

    const propertyStatus = getStatusValue(listInfo.status);
    const orgPriceListPrice = <>
        {listInfo.originalPrice && getCurrencyFormat(listInfo.originalPrice)}
        &nbsp;/&nbsp;
        {listInfo.listPrice && getCurrencyFormat(listInfo.listPrice)}
    </>;

    const rows = [];

    rows.push(getRow(apt.mlsNumber, listInfo.mlsNumber));
    rows.push(getRow(apt.status, propertyStatus));
    rows.push(getRow(apt.propertyType, listInfo.propertyType));
    rows.push(getRow(apt.propertySubType, listInfo.propertySubType));
    rows.push(getRow(apt.price, listInfo.price
        ? getCurrencyFormat(listInfo.price)
        : getCurrencyFormat(listInfo.listPrice)));
    rows.push(getRow(apt.orgPriceListPrice, orgPriceListPrice));
    rows.push(getRow(apt.bankProperty, boolToShortString(listInfo.bankInvolvement)));
    rows.push(getRow(apt.domCdom, `${listInfo.dom}/${listInfo.cdom}`));
    rows.push(getRow(apt.taxId, listInfo.taxId));
    rows.push(getRow(apt.listAgent, listInfo.listAgentName, listInfo.listAgentId?.agentCode, true));
    rows.push(getRow(apt.coListAgent, listInfo.coListAgentName, listInfo.coListAgentId?.agentCode, true));
    rows.push(getRow(apt.sellAgent, listInfo.sellAgentName, listInfo.sellAgentId?.agentCode, true));
    rows.push(getRow(apt.coSellAgent, listInfo.coSellAgentName, listInfo.coSellAgentId?.agentCode, true));
    rows.push(getRow(apt.listOffice, listInfo.listOfficeName, listInfo.listOfficeId?.officeCode, true));
    rows.push(getRow(apt.coListOffice, listInfo.coListOfficeName, listInfo.coListOfficeId?.officeCode, true));
    rows.push(getRow(apt.sellOffice, listInfo.sellOfficeName, listInfo.sellOfficeId?.officeCode, true));
    rows.push(getRow(apt.coSellOffice, listInfo.coSellOfficeName, listInfo.coSellOfficeId?.officeCode, true));

    rows[rows.length - 1].isLastRow = true;

    return rows;
};

export const getPropertyInfo = propertyInfo => {

    const rows = [];

    rows.push(getRow(apt.bedrooms, propertyInfo.bedrooms || 0));
    rows.push(getRow(apt.fullBaths, propertyInfo.fullBaths || 0));
    rows.push(getRow(apt.partialBaths, propertyInfo.partialBaths || 0));
    rows.push(getRow(apt.squareFeet, propertyInfo.sqFt && formatVolumeOrDays(propertyInfo.sqFt)));
    rows.push(getRow(apt.lotSize, propertyInfo.lotSize && formatVolumeOrDays(propertyInfo.lotSize)));
    rows.push(getRow(apt.acres, propertyInfo.acres && formatUnitOrPercentage(propertyInfo.acres)));
    rows.push(getRow(apt.mlsArea, propertyInfo.mlsArea));
    rows.push(getRow(apt.subdivision, propertyInfo.subdivision));
    rows.push(getRow(apt.mapCode, propertyInfo.mapCode));
    rows.push(getRow(apt.yearBuilt, propertyInfo.yearBuilt));
    rows.push(getRow(apt.newConstruction, propertyInfo.newConstruction || propertyInfo.constructionType));

    rows[rows.length - 1].isLastRow = true;

    return rows;
};
