import { getExportCellValue, getExportHeaderText, shouldExportColumn } from '../../common/helpers/agGrid';
import { getFilename } from './export';
import ExportButton from '../components/common/ExportButton';
import React from 'react';

export const handleButtonClick = ({ gridRef, filename }) => {
    const columnDefs = gridRef.current?.columnApi?.columnModel?.columnDefs;
    let exportedColumns = [];

    columnDefs?.forEach(col => {
        if (shouldExportColumn(col)) {
            exportedColumns.push(col.field);
        }
    });

    const exportParams = {
        fileName: filename,
        columnKeys: exportedColumns,
        processCellCallback: getExportCellValue,
        processHeaderCallback: getExportHeaderText
    };
    gridRef.current?.api?.exportDataAsCsv(exportParams);
};

export const getExportButton = (exportDetails, gridRef) => {
    const exportFilename = getFilename(exportDetails);
    const handleClick = () => handleButtonClick({ gridRef, filename: exportFilename });
    return <ExportButton handleClick={handleClick} />;
};
