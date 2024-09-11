import React from 'react';
import { overviewToolTips, tabModes } from '../../constants/agentProductionConstants';
import { agentProductionTerms } from '../../../constants';
import { formatMediumDate, formatMediumSimpleDate } from '../../../common/helpers/date';
import {
    getAdditionalColumnCount,
    transformSchemaTableColumns
} from '../../helpers/schemaTableHelpers';

export const getAdditionalTableHeaders = (columns, agentDataLength, last12MonthsDates, currentSearchDates) => {
    const overviewColumns = transformSchemaTableColumns(overviewToolTips, tabModes.OVERVIEW);

    const additionalAddressColumns = getAdditionalColumnCount(
        columns, overviewColumns.officeAddress.id
    );
    const areaColCounter = columns.filter(
        (overviewColumn) =>
            overviewColumn.headerPlacement === 'area' && overviewColumn.isDisplayed
    ).length + additionalAddressColumns;

    const mlsColCounter = columns.filter(
        (overviewColumn) =>
            overviewColumn.headerPlacement === 'mls' && overviewColumn.isDisplayed
    ).length;

    const formattedFrom = currentSearchDates?.from
        && `${formatMediumDate(currentSearchDates.from)}`;
    const formattedTo = currentSearchDates?.to
        && `${formatMediumDate(currentSearchDates.to)}`;
    const currentSearchText = currentSearchDates?.lastIntervalText
        && `${currentSearchDates.lastIntervalText}: ${formattedFrom} - ${formattedTo}`;

    const formattedLast12MonthsFrom = last12MonthsDates?.from && formatMediumSimpleDate(new Date(last12MonthsDates.from));
    const formattedLast12MonthsTo = last12MonthsDates?.to && formatMediumSimpleDate(new Date(last12MonthsDates.to));
    const currentLast12MonthsText = currentSearchDates?.lastIntervalText && `${formattedLast12MonthsFrom} - ${formattedLast12MonthsTo}`;

    return [
        {
            column1: {
                title: `${agentProductionTerms.currentSearch} (${currentSearchText}) - ${agentDataLength} Agents`,
                attrs: {
                    colSpan: 2 + areaColCounter,
                    className: `border border-end-5 text-center ${areaColCounter === 0 ? 'd-none' : ''}`
                }
            },
            column2: {
                title: `${agentProductionTerms.allMlsTransactions} ${agentProductionTerms.last12Months} (${currentLast12MonthsText})`,
                attrs: {
                    colSpan: areaColCounter === 0 ? 2 + mlsColCounter : mlsColCounter,
                    className: `border text-center ${mlsColCounter === 0 ? 'd-none' : ''}`
                }
            }
        }
    ];
};
