import React from 'react';
import {
    additionalTableHeaders as ath,
    listingProficiencyColTitles as colTitles,
    listingProficiencyTooltips,
    tabModes
} from '../../constants/agentProductionConstants';
import { agentProductionTerms } from '../../../constants';
import { columnGroups, getHeaderText } from '../../helpers/listingProficiencyHelpers';
import {
    addAdditionalTableHeader,
    getAdditionalColumnCount,
    transformSchemaTableColumns
} from '../../helpers/schemaTableHelpers';

const getCountDisplayedColumns = (columns, headerPlacement) => columns?.filter(c => c.isDisplayed &&
    c.headerPlacement === headerPlacement).length || 0;

export const getListingProficiencyTableSettings = ({ columns }) => {

    const listingProficiencyColumns = transformSchemaTableColumns(listingProficiencyTooltips, tabModes.LISTING_PROFICIENCY);

    const getAdditionalTableHeaders = (columns, contactColumnsToAlwaysDisplay) => {
        const additionalAddressColumns = getAdditionalColumnCount(columns, listingProficiencyColumns.officeAddress.id);
        const countDisplayedColumnsContact = getCountDisplayedColumns(columns, columnGroups.CONTACT) +
            contactColumnsToAlwaysDisplay.length + additionalAddressColumns;
        const countDisplayedColumnsTotalSell = getCountDisplayedColumns(columns, columnGroups.TOTAL_SELL);
        const countDisplayedColumnsTotalList = getCountDisplayedColumns(columns, columnGroups.TOTAL_LIST);
        const countDisplayedColumnsNoPriceChange = getCountDisplayedColumns(columns, columnGroups.NO_PRICE_CHANGE);
        const countDisplayedColumnsPriceChange = getCountDisplayedColumns(columns, columnGroups.PRICE_CHANGE);

        const countDisplayedNonContactHeaders = countDisplayedColumnsTotalSell +
            countDisplayedColumnsTotalList +
            countDisplayedColumnsPriceChange +
            countDisplayedColumnsNoPriceChange;

        const headers = [];

        let headersRow2 = {};
        const classHeader = 'border text-center';
        const apt = agentProductionTerms;

        const addHeaderWithClass = classToUse => {
            return (lowers, count, title, addTabHeader) => addAdditionalTableHeader(lowers, count, title, addTabHeader, classToUse);
        };
        const addHeader = addHeaderWithClass(classHeader);

        headersRow2 = addHeader(headersRow2, countDisplayedColumnsContact, apt.officeInformation, ath.contact);
        headersRow2 = addHeader(headersRow2, countDisplayedColumnsTotalSell, apt.totalSell, ath.column1);
        headersRow2 = addHeader(headersRow2, countDisplayedColumnsTotalList, apt.totalList, ath.column2);
        headersRow2 = addHeader(headersRow2, countDisplayedColumnsNoPriceChange, apt.noPriceChangeListings, ath.column3);
        headersRow2 = addHeader(headersRow2, countDisplayedColumnsPriceChange, apt.priceChangeListings, ath.column4);

        const nonContactSuperheader = getHeaderText();

        if (countDisplayedNonContactHeaders) {
            headers.push({
                column1: {
                    title: colTitles.officeInformation,
                    attrs: {
                        colSpan: countDisplayedColumnsContact,
                        className: classHeader
                    }
                },
                column2: {
                    title: colTitles.totalSell,
                    attrs: {
                        colSpan: countDisplayedNonContactHeaders,
                        className: classHeader
                    }
                },
                column3: {
                    title: colTitles.totalList,
                    attrs: {
                        colSpan: countDisplayedColumnsContact,
                        className: classHeader
                    }
                },
                column4: {
                    title: colTitles.noPriceChangeListings,
                    attrs: {
                        colSpan: countDisplayedColumnsContact,
                        className: classHeader
                    }
                },
                column5: {
                    title: colTitles.priceChangeListings,
                    attrs: {
                        colSpan: countDisplayedColumnsContact,
                        className: classHeader
                    }
                },
                column6: {
                    title: nonContactSuperheader,
                    attrs: {
                        colSpan: countDisplayedNonContactHeaders,
                        className: classHeader
                    }
                },
                column7: {
                    title: colTitles.emptyString,
                    attrs: {
                        colSpan: countDisplayedNonContactHeaders,
                        className: classHeader
                    }
                }
            });
        }
        headers.push(headersRow2);

        return headers;
    };

    const contactColumnsToAlwaysDisplay = ['agentName', 'office'];
    const additionalTableHeaders = getAdditionalTableHeaders(columns, contactColumnsToAlwaysDisplay);

    return additionalTableHeaders;
};
