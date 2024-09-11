import React from "react";
import { getStatusValue } from "../../agent-production/helpers/propertyDataHelpers";
import { boolToShortString, formatUnitOrPercentage, formatVolumeOrDays, getCurrencyFormat } from "../../agent-production/helpers/dataFormatters";
import { agentProductionTerms as apt} from "../../constants";

const getRow = (description, value = '-', code, hasDetail) => {
    return {
        description,
        value,
        code,
        hasDetail
    };
};

export const getListingInfo = listInfo => {

    const propertyStatus = getStatusValue(listInfo.status);
    const orgPriceListPrice = <>
        {listInfo.originalPrice && getCurrencyFormat(listInfo.originalPrice)}
        &nbsp;/&nbsp;
        {listInfo.listPrice && getCurrencyFormat(listInfo.listPrice)}
    </>;

    const rows = [];

    rows.push(getRow(apt.mlsNumber, listInfo.mlsNumber || ''));
    rows.push(getRow(apt.status, propertyStatus || ''));
    rows.push(getRow(apt.propertyType, listInfo.propertyType || ''));
    rows.push(getRow(apt.propertySubType, listInfo.propertySubType || ''));
    rows.push(getRow(apt.price, listInfo.price
        ? getCurrencyFormat(listInfo.price)
        : getCurrencyFormat(listInfo.listPrice)));
    rows.push(getRow(apt.orgPriceListPrice, orgPriceListPrice || ''));
    rows.push(getRow(apt.bankProperty, boolToShortString(listInfo.bankInvolvement) || ''));
    rows.push(getRow(apt.domCdom, `${listInfo.dom}/${listInfo.cdom}` || ''));
    rows.push(getRow(apt.taxId, listInfo.taxId || ''));
    rows.push(getRow(apt.listAgent, listInfo.listAgentName, listInfo.listAgentId?.agentCode || ''));
    rows.push(getRow(apt.coListAgent, listInfo.coListAgentName, listInfo.coListAgentId?.agentCode || ''));
    rows.push(getRow(apt.sellAgent, listInfo.sellAgentName, listInfo.sellAgentId?.agentCode || ''));
    rows.push(getRow(apt.coSellAgent, listInfo.coSellAgentName, listInfo.coSellAgentId?.agentCode || ''));
    rows.push(getRow(apt.listOffice, listInfo.listOfficeName, listInfo.listOfficeId?.officeCode || ''));
    rows.push(getRow(apt.coListOffice, listInfo.coListOfficeName, listInfo.coListOfficeId?.officeCode || ''));
    rows.push(getRow(apt.sellOffice, listInfo.sellOfficeName, listInfo.sellOfficeId?.officeCode || ''));
    rows.push(getRow(apt.coSellOffice, listInfo.coSellOfficeName, listInfo.coSellOfficeId?.officeCode || ''));

    rows[rows.length - 1].isLastRow = true;

    return rows;
};

export const getPropertyInfo = propertyInfo => {

    const rows = [];

    rows.push(getRow(apt.bedrooms, propertyInfo.bedrooms || ''));
    rows.push(getRow(apt.fullBaths, propertyInfo.fullBaths || ''));
    rows.push(getRow(apt.partialBaths, propertyInfo.partialBaths || ''));
    rows.push(getRow(
        apt.squareFeet, 
        propertyInfo.sqFt 
            ? formatVolumeOrDays(propertyInfo.sqFt)
            : ''
        ));
    rows.push(getRow(
        apt.lotSizeSqft, propertyInfo.lotSize ? formatVolumeOrDays(propertyInfo.lotSize) : ''));
    rows.push(getRow(
        apt.acres, 
        propertyInfo.acres 
            ? formatUnitOrPercentage(propertyInfo.acres) 
            : ''
        ));
    rows.push(getRow(apt.mlsArea, propertyInfo.mlsArea || ''));
    rows.push(getRow(apt.subdivision, propertyInfo.subdivision || ''));
    rows.push(getRow(apt.mapCode, propertyInfo.mapCode || ''));
    rows.push(getRow(apt.yearBuilt, propertyInfo.yearBuilt || ''));
    rows.push(getRow(apt.newConstruction, propertyInfo.newConstruction || propertyInfo.constructionType || ''));

    rows[rows.length - 1].isLastRow = true;

    return rows;
};

export const getBrokerDetails = (officeDetails) => {

    const rows = [];

    rows.push(getRow(apt.brokerID, officeDetails.data.brokerId));
    rows.push(getRow(apt.officeId, officeDetails.data.officeId));
    rows.push(getRow(apt.mls, officeDetails.data.mls));
    rows.push(getRow(apt.responsibleMember, officeDetails.data.responsibleMember));
    rows.push(getRow(apt.mlsIDs, officeDetails.data.mlsId));
    rows.push(getRow(apt.producingAgents, officeDetails.data.producingAgents));

    rows[rows.length - 1].isLastRow = true;

    return rows;
};

export const getOfficeDetails = (officeDetails) => {

    const rows = [];

    rows.push(getRow(apt.officeName, officeDetails.data.officeName));
    rows.push(getRow(apt.officeAddress, officeDetails.data.streetName1));
    rows.push(getRow(apt.officePhone, officeDetails.data.phoneList[0].phoneNumber));
    rows.push(getRow(apt.officeEmail, officeDetails.data.emailAddress));
    rows.push(getRow(apt.memberType, officeDetails.data.memberType));
    rows.push(getRow(apt.status, officeDetails.data.status));

    rows[rows.length - 1].isLastRow = true;

    return rows;
};
