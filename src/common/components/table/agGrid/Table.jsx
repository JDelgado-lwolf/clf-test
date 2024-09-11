import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AGGridHelix } from '@lwt-helix/ag-grid';
import { defaultColumnDef } from './colSettings';
import { generateTableColDefs, handleDrawDivider, handleSortedHighlight } from './agGrid';
import ColumnHeader from './ColumnHeader';
import { tableViewNames } from '../../../../agent-production/constants/agentProductionConstants';
import { tableViews } from './tableViews';
import { agentProductionTerms as apt } from '../../../../constants';
import { status } from '../../../../constants';
import { cssClassNames } from '../../../../constants/css';

const Table = (props) => {
    const {
        tableView,
        rowData,
        pinnedBottomRowData,
        columns,
        additionalTableHeaders,
        tableTitleWithTooltips,
        externalParams,
        rowSelection,
        onCellClicked,
        gridRef,
        onRowClicked,
        suppressNoRowsOverlay,
        updateDisplayedOffices
    } = props;

    const [groupHeaders, setGroupHeaders] = useState(undefined);
    const [columnDefs, setColumnDefs] = useState([]);

    const agGridComponents = useMemo(() => {
        return {
            agColumnHeader: ColumnHeader
        };
    }, []);

    // It generates table colDefs dynamically.
    useEffect(() => {
        const generatedColDefs = generateTableColDefs({
            columns,
            tableView,
            additionalTableHeaders,
            tableTitleWithTooltips,
            externalParams: {...externalParams, tableId: tableView?.id},
        });
        setColumnDefs(generatedColDefs);
    }, [groupHeaders, tableView, additionalTableHeaders, tableTitleWithTooltips]);

    // It validates if additionalTab1leHeaders were updated.
    useEffect(() => {
        switch (tableView?.id) {
            case tableViewNames.overview:
                if (additionalTableHeaders[0].column1.title.length > 33
                    && additionalTableHeaders[0].column2.title.length > 39
                    && (!groupHeaders || (groupHeaders !== additionalTableHeaders))) {
                    setGroupHeaders(additionalTableHeaders);
                }
                break;
            default:
                if (!groupHeaders || (groupHeaders !== additionalTableHeaders)) {
                    setGroupHeaders(additionalTableHeaders);
                }
                break;
        }
    }, [additionalTableHeaders]);

    useEffect(() => {
        if (!gridRef) {
            return;
        }
        if (gridRef.current?.columnApi) {
            const columnApi = gridRef.current.columnApi;
            columns.forEach(col => {
                columnApi.setColumnVisible(col.id, col.isDisplayed);
            });
        }
    }, [columns, gridRef]);

    const handleRowClicked = (e) => {
        if (tableView?.id === tableViewNames.availableAgents && e.data.status === status.ACTIVE) onRowClicked(e.data);

        if (tableView?.id === tableViewNames.availableOffices) onRowClicked(e.data);

        if (tableView?.id === tableViewNames.addedAgents ||
            tableView?.id === tableViewNames.addedOffices) onRowClicked(e.data);
    };

    const rowClassRules = useMemo(() => {
        return ({
            [cssClassNames.inactiveRow]: (params) => params.data[params.data?.statusKeyfield] === status.INACTIVE
        });
    }, []);

    const tablesWithNoHighlight = [tableViewNames.addedAgents, tableView.availableAgents];

    const handleTableAction = e => {
        !tablesWithNoHighlight.includes(tableView?.id) && handleSortedHighlight(e, tableView, tableView?.id);
    };

    const handleOnFilterChanged = e => {
        if (updateDisplayedOffices) {
            updateDisplayedOffices(e);
        }
    };

    const handleOnRowDataChanged = e => {
        handleTableAction(e);
        if (updateDisplayedOffices) {
            updateDisplayedOffices(e);
        }
    }
    const handleGridColumnsChange = e => {
        handleTableAction(e);
        handleDrawDivider(tableView?.id, columnDefs);
    };

    const gridOptions = {
        localeText: {
            noRowsToShow: apt.searchReturnedNoResults
        }
    };

    const tablesWithoutAutoHeight = [
        tableViewNames.addedAgents,
        tableViewNames.addedOffices,
        tableViewNames.availableAgents,
        tableViewNames.availableOffices,
        tableViewNames.overview,
        tableViewNames.contactInformation,
        tableViewNames.growthAnalysisLtm,
        tableViewNames.growthAnalysisYtd,
        tableViewNames.listingProficiency
    ];

    const domLayout = tablesWithoutAutoHeight.includes(tableView?.id) ? 'normal' : 'autoHeight';

    return (
        <div id={tableView?.id} className={`mt-2 ${rowData?.length === 0 ? 'ag-no-table-results' : ''}`}>
            <AGGridHelix
                ref={gridRef}
                defaultColDef={defaultColumnDef}
                columnDefs={columnDefs}
                rowData={rowData}
                pagination={tableViews[tableView?.id]?.showPagination}
                paginationPageSize={tableViews[tableView?.id]?.paginationOptions?.sizePerPage}
                domLayout={domLayout}
                components={agGridComponents}
                rowSelection={rowSelection}
                onCellClicked={onCellClicked}
                onVirtualColumnsChanged={handleTableAction}
                onSortChanged={handleTableAction}
                onColumnResized={handleGridColumnsChange}
                onRowDataChanged={handleOnRowDataChanged}
                suppressCsvExport={false}
                onGridColumnsChanged={handleGridColumnsChange}
                onBodyScroll={handleTableAction}
                onGridReady={handleTableAction}
                onRowClicked={handleRowClicked}
                gridOptions={gridOptions}
                rowClassRules={rowClassRules}
                suppressNoRowsOverlay={suppressNoRowsOverlay}
                onFilterChanged={handleOnFilterChanged}
                pinnedBottomRowData={pinnedBottomRowData || []}
            />
        </div>
    );
};

Table.propTypes = {
    tableView: PropTypes.string.isRequired,
    rowData: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    additionalTableHeaders: PropTypes.array,
    tableTitleWithTooltips: PropTypes.object.isRequired,
    externalParams: PropTypes.object,
    rowSelection: PropTypes.string,
    onCellClicked: PropTypes.func,
    gridRef: PropTypes.object,
    updateDisplayedOffices: PropTypes.func,
    onRowClicked: PropTypes.func,
    suppressNoRowsOverlay: PropTypes.bool,
    pinnedBottomRowData: PropTypes.array
};

export default Table;
