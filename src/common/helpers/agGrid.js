import {
    boolToShortString,
    centupleDecimalFormatter, formatClr, formatDecimal,
    formatPercent,
    getDecimalNumber,
    getIntegerFormat, getListingStatus,
    getUngroupedNoDecimals, hasNoLength, shortDateFormatWithSlashes
} from '../../agent-production/helpers/dataFormatters';
import { getSum } from '../../market-share/helpers/helpers';

export const handleSortedHighlight = (e) => {
    const columns = e.columnApi.getAllColumns();
    const sortedColumn = columns?.find((column) => column.isSorting());
    const filteredColumnElements = document.querySelectorAll('.ag-floating-filter.ag-header-cell');
    const headerCellElements = document.querySelectorAll('.ag-header-cell');
    let sortedColumnIndex = -1;
    const CLASS_HIGHLIGHT = 'highlighted-column';
    const ATTR_COLUMN_INDEX = 'aria-colindex';

    if (sortedColumn) {
        sortedColumnIndex = (e.columnApi.getAllColumns()?.indexOf(sortedColumn)) + 1;
        sortedColumn.getColDef().cellClass = `${sortedColumn.userProvidedColDef.cellClass} ${CLASS_HIGHLIGHT}`;
        filteredColumnElements?.forEach((filteredColumnElement) => {
            if (filteredColumnElement.getAttribute(ATTR_COLUMN_INDEX) === sortedColumnIndex.toString()) {
                filteredColumnElement.classList.add(CLASS_HIGHLIGHT);
            }
        });
        headerCellElements?.forEach((headerCellElement) => {
            if (headerCellElement.getAttribute(ATTR_COLUMN_INDEX) === sortedColumnIndex.toString()) {
                headerCellElement.classList.add(CLASS_HIGHLIGHT);
            }
        });
    }
    filteredColumnElements?.forEach((filteredColumnElement) => {
        if (filteredColumnElement.getAttribute(ATTR_COLUMN_INDEX) !== sortedColumnIndex.toString()) {
            filteredColumnElement.classList.remove(CLASS_HIGHLIGHT);
        }
    });
    headerCellElements?.forEach((headerCellElement) => {
        if (headerCellElement.getAttribute(ATTR_COLUMN_INDEX) !== sortedColumnIndex.toString()) {
            headerCellElement.classList.remove(CLASS_HIGHLIGHT);
        }
    });
    columns?.forEach((column) => {
        if (column !== sortedColumn) {
            column.getColDef().cellClass = column.userProvidedColDef.cellClass;
        }
    });
    e.api.redrawRows();
};

export const maskInvalidValues = ({ value, defaultValue, getFormattedValue }) =>
    hasNoLength(value)
        ? defaultValue
        : getFormattedValue(value);

export const csvFormats = {
    integer: {
        format: value => maskInvalidValues({
            value,
            defaultValue: '0',
            getFormattedValue: getIntegerFormat
        })
    },
    volume: {
        format: value => getUngroupedNoDecimals(value)
    },
    date: {
        format: value => shortDateFormatWithSlashes(value)
    },
    oneDecimal: {
        format: value => formatDecimal(value, 1)
    },
    booleanShort: {
        format: value => boolToShortString(value)
    },
    listingStatus: {
        format: value => getListingStatus(value)
    },
    decimal: {
        format: value => maskInvalidValues({
            value,
            defaultValue: '0',
            getFormattedValue: getDecimalNumber
        })
    },
    percentage: {
        format: value => formatPercent(value, 1)
    },
    percent2Decimals: {
        format: value => formatPercent(value, 2)
    },
    centuplePercentage: {
        format: value => formatPercent(((value || 0) * 100), 2)
    },
    average: {
        format: value => centupleDecimalFormatter(value)
    },
    percentageEmptyCell: {
        format: value => formatClr(value)
    }
};

export const filenameTransformer = {
    input: function(value) {
        this.value = value;
        return this;
    },
    replaceDots: function() {
        // AG Grid will not add a filename suffix (eg. '.csv') if the filename contains a dot, so remove all dots
        this.value = this.value.replaceAll('.', '');
        return this;
    },
    fixApostrophes: function() {
        // REMAX's's becomes REMAX's
        this.value = this.value.replaceAll('\'s\'s', '\'s');
        // Properties's becomes Properties'
        this.value = this.value.replaceAll('s\'s', 's\'');
        // REALTORS's becomes REALTORS'
        this.value = this.value.replaceAll('S\'s', 'S\'');
        return this;
    },
    removeRepeats: function() {
        this.value = this.value.replaceAll('Listings Listings', 'Listings');
        return this;
    },
    output: function() {
        return this.value;
    }
};

export const getScrubbedFilenameForExport = filename => {
    return filenameTransformer.input(filename)
        .replaceDots()
        .fixApostrophes()
        .removeRepeats()
        .output();
};

export const shouldExportColumn = column => column?.shouldExport ?? !column.hide;

export const getExportCellValue = cell => {
    if (isEncodedCellValue(cell?.value)) return getDecodedCellValue(cell?.value);
    if (cell?.column?.colDef?.exportFormatter) return cell?.column?.colDef?.exportFormatter(cell?.value);
    if (cell?.column?.colDef?.valueFormatter) return cell?.column?.colDef?.valueFormatter(cell);
    return cell?.value;
};

export const getExportHeaderText = header => {
    const exportHeaderLabel = header?.column?.colDef?.exportHeaderLabel ??
        header?.column?.colDef?.headerComponentParams?.titleWithTooltip?.props?.headerDetails?.label;
    return exportHeaderLabel !== undefined ? exportHeaderLabel : header?.column?.colDef?.headerName;
};

export const getCalculatedPct = ({ colDef, pinnedRowData, keyField }) => {
    return pinnedRowData?.[keyField || colDef.field] * 100 ;
};

export const getPinnedCellValue = ({ pinnedRowData, keyField }) => {
    return pinnedRowData?.[keyField];
};

export const getColumnSum = ({ rowData, colDef }) => {
    return getSum(rowData, colDef.field);
};

export const FLAG_USE_CELL_VALUE = '*****-USE-CELL-VALUE-*****';
export const getEncodedCellValue = value => value + FLAG_USE_CELL_VALUE;
export const getDecodedCellValue = value => value?.replace(FLAG_USE_CELL_VALUE, '');
export const isEncodedCellValue = value => value?.toString().indexOf(FLAG_USE_CELL_VALUE) >= 0;

export const removeRowByKey = (gridRef, key, value) => {
    gridRef.current.api.forEachNode(node => {
        if (node.data[key] === value) {
            gridRef.current.api.applyTransaction({ remove: [node.data] });
        }
    });
};
