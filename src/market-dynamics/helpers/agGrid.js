import { getBlankZeroFormatter } from "../../agent-production/helpers/dataFormatters";
import { colSettings } from "../../common/components/table/agGrid/colSettings";
import { listingViews as lv } from "../constants/listingViews";
import { marketDynamicsColumns as mdCols } from "../constants/marketDynamicsColumns";
import { officeBreakdownColsByListing } from "../constants/officeBreakdownColumns";

export const getRevisedTooltipSettings  = ({ tableView, periodColumnSettings, marketDynamicsTooltips }) => {
    if (!periodColumnSettings || !tableView) return;
    let tooltipSettings;
    tableView?.tables.forEach(column => {
        if (column.col.id === periodColumnSettings.keyField) {
            const currentTimePeriodTooltipSettings = {
                ...marketDynamicsTooltips.timePeriodStart, label: periodColumnSettings.label
            };
            tooltipSettings = { ...marketDynamicsTooltips, timePeriodStart: currentTimePeriodTooltipSettings };
        }
    });
    return tooltipSettings;
};

const getBreakoutStatusOptions = (statusOptions) => {
    if (!statusOptions || statusOptions.length < 2) return statusOptions;
    const firstStatusOption = statusOptions[0];
    const breakoutOptions = statusOptions.slice(1).map(element => firstStatusOption + element);
    return [firstStatusOption, ...breakoutOptions];
}

export const getRevisedColumnDefs = (tableView, periodColumnSettings, selectedStatusOptionsIds) => {
    if (!tableView || !periodColumnSettings) return;
    const colDefs = tableView?.tables.map(col => {
        if (col.col.id === mdCols.timePeriodStart.id) {
            return { ...col, colDef: periodColumnSettings };
        }
        return col;
    });
    const revisedColDefs = colDefs.filter(col => {
        if (!col?.statusId) return true; //This can be removed after implemented status options in other tables
        if (tableView.isBreakout) {
            return getBreakoutStatusOptions(selectedStatusOptionsIds).includes(col.statusId);
        }
        return selectedStatusOptionsIds.includes(col.statusId);
    });
    return { ...tableView, tables: revisedColDefs };
};

export const getRevisedOfficeBreakdownColumns = (tableView) => {
    if (!tableView) return;
    const colsByListing = officeBreakdownColsByListing[tableView.id];
    const editedTableView = colsByListing ? {...tableView, tables: colsByListing} : tableView;

    return editedTableView?.tables.map(col => {
        if (col.col.id === mdCols.timePeriodStart.id) {
            return { col: mdCols.officeName, colDef: colSettings.textLg };
        }
        const defaultColSettings = Object.entries(lv).map(view => view[1].tableSettings.tables).flat()
            .find(column => column?.col?.id === col?.col?.id);
        const valueFormatter = v => getBlankZeroFormatter(v.value, defaultColSettings?.colDef?.valueFormatter);
        return {
            ...col,
            colDef: { ...defaultColSettings?.colDef, valueFormatter }
        };
    });
};

export const getDefaultSortColumnSettings = (columns) => {
    const firstUnitColumn = columns.find(col => col?.measureType === 'units');
    return { colId: firstUnitColumn?.col.id, sortDir: 'desc', isBreakdown: true };
};

export const getDataByDisplayedColumns = (arrayOfObjects, columns) => {
    if (!arrayOfObjects || !columns) return [];
    const keyfields = columns.map(col => col.col.keyField || col.col.id);
    let revisedData = [];
    arrayOfObjects.forEach(object => {
        let revisedObject = {};
        for (let key in object) {
            if (keyfields.includes(key) && object[key] !== 0) {
                revisedObject = { ...revisedObject, [key]: object[key] };
            }
        };
        if (Object.keys(revisedObject).length > 1) revisedData.push(revisedObject);
    });
    return revisedData;
};
