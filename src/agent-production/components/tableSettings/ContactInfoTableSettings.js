import { format } from 'date-fns';
import { agentProductionTerms } from '../../../constants';
import { contactToolTips, tabModes } from '../../constants/agentProductionConstants';
import {
    COLUMN_GROUP_CONTACT, COLUMN_GROUP_SEARCH, COLUMN_GROUP_MLS, COLUMN_GROUP_GROWTH
} from '../../helpers/agentProductionHelpers';
import { formatTransformedDate } from '../../../common/helpers/date';
import { getAdditionalColumnCount, transformSchemaTableColumns } from '../../helpers/schemaTableHelpers';

export const getContactInfoTableSettings = (columns, currentSearchDates) => {

    const contactColumns = transformSchemaTableColumns(contactToolTips, tabModes.CONTACT_INFORMATION);

    const getCountDisplayedColumns = headerPlacement => columns.filter(c => c.isDisplayed &&
        c.headerPlacement === headerPlacement).length;

    const DATE_FORMAT = 'MMM. dd, yyyy';
    const formattedFrom = currentSearchDates?.from
        && formatTransformedDate(currentSearchDates?.from, DATE_FORMAT);
    const formattedTo = currentSearchDates?.to
        && formatTransformedDate(currentSearchDates?.to, DATE_FORMAT);
    const currentSearchText = currentSearchDates?.lastIntervalText
        && `${currentSearchDates?.lastIntervalText}: ${formattedFrom} - ${formattedTo}`;

    const todayDate = new Date();
    const formattedLast12MonthsFrom = format(new Date(new Date(todayDate.setFullYear(todayDate.getFullYear() - 1)).setDate(1)), DATE_FORMAT);
    const formattedLast12MonthsTo = format(new Date(todayDate.getFullYear() + 1, todayDate.getMonth(), 0), DATE_FORMAT);
    const currentLast12MonthsText = currentSearchDates?.lastIntervalText && `${formattedLast12MonthsFrom} - ${formattedLast12MonthsTo}`;

    const contactColumnsToAlwaysDisplay = ['agentName', 'office'];

    const addHeaderColumn = ({ headerColumns, title, colSpan, columnObjectName }) => {
        return {
            ...headerColumns,
            [columnObjectName]: {
                title,
                attrs: {
                    colSpan,
                    className: 'border text-center'
                }
            }
        };
    };

    let headerColumns = {};

    const countDisplayedColumnsContact
        = getCountDisplayedColumns(COLUMN_GROUP_CONTACT) + contactColumnsToAlwaysDisplay.length;
    if (countDisplayedColumnsContact) {
        const additionalAddressColumns = getAdditionalColumnCount(columns, contactColumns.officeAddress.id);
        headerColumns = addHeaderColumn({
            headerColumns,
            title: 'Contact',
            colSpan: countDisplayedColumnsContact + additionalAddressColumns,
            columnObjectName: COLUMN_GROUP_CONTACT
        });
    }

    const countDisplayedColumnsSearch = getCountDisplayedColumns(COLUMN_GROUP_SEARCH);
    if (countDisplayedColumnsSearch) {
        headerColumns = addHeaderColumn({
            headerColumns,
            title: `${agentProductionTerms.currentSearch} (${currentSearchText})`,
            colSpan: countDisplayedColumnsSearch,
            columnObjectName: COLUMN_GROUP_SEARCH
        });
    }

    const countDisplayedColumnsMls = getCountDisplayedColumns(COLUMN_GROUP_MLS);
    if (countDisplayedColumnsMls) {
        headerColumns = addHeaderColumn({
            headerColumns,
            title: `${agentProductionTerms.allMlsTransactions} ${agentProductionTerms.last12Months} (${currentLast12MonthsText})`,
            colSpan: countDisplayedColumnsMls,
            columnObjectName: COLUMN_GROUP_MLS
        });
    }

    const countDisplayedColumnsGrowth = getCountDisplayedColumns(COLUMN_GROUP_GROWTH);
    if (countDisplayedColumnsGrowth) {
        headerColumns = addHeaderColumn({
            headerColumns,
            title: 'Growth', colSpan: countDisplayedColumnsGrowth, columnObjectName: COLUMN_GROUP_GROWTH
        });
    }

    return [
        headerColumns
    ];
};
