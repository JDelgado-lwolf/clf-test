import React, { useCallback, useEffect } from 'react';
import { AGGridHelix } from '@lwt-helix/ag-grid';
import { defaultColumnDef, agGridComponents} from '../constants/gridColumns';
import { handleSortedHighlight } from '../../common/helpers/agGrid';
import { MAX_COUNT_SELECTED_ROWS } from '../helpers/helpers';
import { marketShareTerms } from '../constants';

const ResultsTable = (props) => {
    const {
        columnDefs,
        rowData,
        gridRef,
        listingViewId,
        listingTypeId,
        listingStatus,
        isShowSelectedRows,
        setSelectedRowsIds,
        selectedRowsIds,
        showToast,
        noRowsComponent,
        noRowMessage,
        rank,
        hasHeaderTooltips,
        onSortChanged,
        getBottomRowSettings
    } = props;

    const onFirstDataRendered = useCallback((params) => {
        params.api.forEachNode((node) => node.setSelected(!!node.data && node.data.isSelected));
        getBottomRowSettings && gridRef.current.api.setPinnedBottomRowData(getBottomRowSettings());
    }, []);

    useEffect(() => {
        gridRef.current.api &&
            gridRef.current.api.forEachNode((node) => node.setSelected(!!node.data && node.data.isSelected));
    }, [columnDefs, listingTypeId, listingViewId, listingStatus, selectedRowsIds]);

    const onRowSelected = (e) => {
        if (e.api.getSelectedRows().length > MAX_COUNT_SELECTED_ROWS) {
            e.node.setSelected(false);
            showToast(marketShareTerms.MAX_ROWS_ARE_SELECTED);
            return;
        }

        const selectedRowsIds = e.api.getSelectedRows().map(row => {
            return row.officeId || row.brokerId || row.areaId || row.groupId;
        });
        setSelectedRowsIds && setSelectedRowsIds(selectedRowsIds);
    };
    const pinnedBottomRowData = getBottomRowSettings && getBottomRowSettings();

    const revisedDefaultColDef = {
        ...defaultColumnDef,
        headerComponentParams: {
            listingStatus,
            listingView: rank,
            hasHeaderTooltips
        }
    };

    const selectedData = isShowSelectedRows ? rowData?.filter(row => row.isSelected) : rowData;

    return (
        <AGGridHelix
            ref={gridRef}
            rowData={selectedData}
            columnDefs={columnDefs}
            defaultColDef={revisedDefaultColDef}
            onSortChanged={(e) => {
                onSortChanged && onSortChanged(e);
                handleSortedHighlight(e);
            }}
            onColumnResized={handleSortedHighlight}
            onFirstDataRendered={onFirstDataRendered}
            onRowDataChanged={handleSortedHighlight}
            suppressCsvExport={false}
            components={agGridComponents}
            onRowSelected={onRowSelected}
            noRowsOverlayComponent={noRowsComponent}
            noRowsOverlayComponentParams={noRowMessage}
            onGridColumnsChanged={handleSortedHighlight}
            pinnedBottomRowData={pinnedBottomRowData}
            suppressPropertyNamesCheck={true}
        />
    );
};

export default ResultsTable;
