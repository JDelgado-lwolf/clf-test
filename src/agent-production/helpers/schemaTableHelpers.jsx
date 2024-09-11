import React from 'react';
import Tooltip from '@lwt-helix/tooltip';
import { getFormattedDate, shortDateFormatWithSlashes, yearFormat } from './dataFormatters';
import { additionalOfficeAddressColumns, agentsColumns } from '../constants/agentProductionConstants';
import { getTooltipText } from './uiHelpers';
import { getTimeIntervalData } from './browserStorageHelper';

export const COLUMN_CLASSNAME_PREFIX = 'col-';
export const getColumnClass = columnType => COLUMN_CLASSNAME_PREFIX + columnType;

export const addAdditionalTableHeader = (
    objHeaders,
    countNewHeaders,
    title,
    addTabHeader,
    classHeader
) => {

    if (!countNewHeaders) return objHeaders;

    const objResult = { ...objHeaders };

    objResult[addTabHeader] = {
        title,
        attrs: {
            colSpan: countNewHeaders,
            className: classHeader
        }
    };

    return objResult;
};

export const cssClasses = cssClasses => {
    return {
        cssClasses: `${stdCssClasses} ${COLUMN_CLASSNAME_PREFIX}${cssClasses ?? ''}`
    };
};

export const getShortDate = date => getFormattedDate(date, 'yyyy-MM-dd');
export const dataFormatter = (value, noShrink) => <span className={!noShrink && 'small'}>{value}</span>;

export const getClassNameSuppressHeaders = additionalHeaders => {
    const hasAdditionalTableHeaders = !!additionalHeaders.length;
    return hasAdditionalTableHeaders ? '' : 'has-no-superheaders';
};

export const getAdditionalColumnCount = (columns, columnId) => {
    return {
        [agentsColumns.officeAddress.id]: columns
            .find(c => c.id === columnId)?.isDisplayed ? additionalOfficeAddressColumns.length : 0
    }[columnId];
};

export const cssStdHeader = 'align-top no-wrap';
export const cssSearchTableHeader = `${cssStdHeader} text-uppercase text-right border-0`;
export const cssNumHeader = `${cssStdHeader} td-num`;
export const cssNumData = 'td-num';
const stdCssClasses = 'text-wrap';

const translateNullsToEnd = value => {
    const VERY_LOW_VALUE = -999999999999;
    return value ?? VERY_LOW_VALUE;
};

export const colSettingsNumber = cssClasses => ({
    headerClasses: cssNumHeader,
    cssClasses: cssNumData + ` ${COLUMN_CLASSNAME_PREFIX}${cssClasses ?? ''}`,
    type: 'string',
    filter: 'none',
    format: 'custom',
    sortValue: (cell) => translateNullsToEnd(cell)
});

export const colSettingsStrings = cssClasses => {
    return {
        headerClasses: cssStdHeader,
        type: 'string',
        filter: 'none',
        cssClasses: `${stdCssClasses} ${COLUMN_CLASSNAME_PREFIX}${cssClasses ?? ''}`,
        format: 'custom'
    };
};

export const colSettingsDate = {
    headerClasses: cssStdHeader,
    type: 'date',
    filter: 'none',
    format: 'custom',
    cssClasses: getColumnClass('date'),
    formatter: cell => shortDateFormatWithSlashes(cell)
};

export const getIsPartialMatch = (filterCriteria, data, key) => {
    const filterCriteriaValues = filterCriteria.trim().split(' ');
    const partialMatchFilter = data.filter((row) => {
        return filterCriteriaValues.some((filterValue) => {
            return (
                row[key]
                    .toLowerCase()
                    .indexOf(filterValue.toLowerCase()) > -1
            );
        });
    });
    return partialMatchFilter.filter((row) => {
        return filterCriteriaValues.every((word) => {
            return row[key]
                .toLowerCase()
                .includes(word.toLowerCase());
        });
    });
};

export const dataPointMouseOverStyler = (event) => {
    document.getElementById(event.target.instance.node.id)?.setAttribute('cursor', 'pointer');
};

export const transformSchemaTableColumns = (columns, table) => {
    for (const property in columns) {
        columns[property].id = property;
        columns[property].table = table;
    }
    return columns;
};

export const getTitleWithTooltip = (value, className, noShrink) => {
    const timePeriods = getTimeIntervalData();
    if (!timePeriods?.length) return;
    const lastYear = timePeriods?.find(value => value.intervalType === 'YTD')?.last.from;
    const previousYear = timePeriods?.find(value => value.intervalType === 'YTD')?.previous.from;
    const label = value?.label.replace('[currentYearNumber]', `${yearFormat(lastYear)}`)
        .replace('[previousYearNumber]', `${yearFormat(previousYear)}`);
    const tipId = value?.table ? `${value?.table}-${value.id}` : value.id;
    const tooltipClass = noShrink ? '' : 'helix-small';
    return <>
        <Tooltip target={tipId} placement="top" boundariesElement="window">
            <span className={tooltipClass}>{getTooltipText(value)}</span>
        </Tooltip>
        {<span id={tipId} className={`clickable ${className || ''}`}>
            {label}
        </span>}
    </>;
};
