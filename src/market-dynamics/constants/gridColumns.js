import { marketDynamicsColumns as cols } from './marketDynamicsColumns';
import { cellRenderers as cr, columnSettings as settings } from '../helpers/gridColumns';

export const gridColumnDefinitions = Object.freeze({
    [cols.status.id]: {
        field: cols.status.id,
        headerName: cols.status.label,
        ...settings.columnDefault,
        cellRenderer: cr.status
    },
    [cols.beginPeriod.id]: {
        field: cols.beginPeriod.field,
        ...settings.columnNumber
    },
    [cols.endPeriod.id]: {
        field: cols.endPeriod.field,
        ...settings.columnNumber
    },
    [cols.periodChange.id]: {
        field: cols.periodChange.id,
        headerName: cols.periodChange.label,
        ...settings.columnNumber
    },
    [cols.periodPercentChange.id]: {
        field: cols.periodPercentChange.id,
        headerName: cols.periodPercentChange.label,
        ...settings.columnNumber,
        cellRenderer: cr.percentage
    },
    [cols.totalChange.id]: {
        field: cols.totalChange.id,
        headerName: cols.totalChange.label,
        ...settings.columnNumber
    },
    [cols.totalPercentChange.id]: {
        field: cols.totalPercentChange.id,
        headerName: cols.totalPercentChange.label,
        ...settings.columnNumber,
        cellRenderer: cr.percentage
    },
    [cols.changeValue.id]: {
        field: cols.changeValue.id,
        headerName: cols.changeValue.label,
        ...settings.columnNumber,
        cellRenderer: cr.custom
    },
    [cols.changeValuePercentage.id]: {
        field: cols.changeValuePercentage.id,
        headerName: cols.changeValuePercentage.label,
        ...settings.columnNumber,
        cellRenderer: cr.percentage
    },
    [cols.previousWeeksAvg.id]: {
        field: cols.previousWeeksAvg.id,
        headerName: cols.previousWeeksAvg.label,
        ...settings.columnNumber
    },
    [cols.lastWeeksAvg.id]: {
        field: cols.lastWeeksAvg.id,
        headerName: cols.lastWeeksAvg.label,
        ...settings.columnNumber
    },
    [cols.changeAvg.id]: {
        field: cols.changeAvg.id,
        headerName: cols.changeAvg.label,
        ...settings.columnNumber,
        cellRenderer: cr.custom
    },
    [cols.changeAvgPercentage.id]: {
        field: cols.changeAvgPercentage.id,
        headerName: cols.changeAvgPercentage.label,
        ...settings.columnNumber,
        cellRenderer: cr.percentage
    }
});
