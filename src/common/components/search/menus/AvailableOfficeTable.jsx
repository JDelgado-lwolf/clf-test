import React, { useMemo } from 'react';
import Table from '../../table/agGrid/Table';
import { availableOfficesTooltips } from '../../../../agent-production/constants/agentProductionConstants';
import { searchTerms, status } from '../../../../constants';
import { availableOfficesColumns, getColumnsWithFilters } from '../../table/tableViews/availableOffices';
import addedOfficesColumns from '../../table/tableViews/addedOfices';

const AvailableOfficeTable = props => {
    const { availableOffices, addOffices, hasAvailableOffices, hasColumnFilters, setDisplayedOffices } = props;

    const tableViewSettings = useMemo(() => {
        return hasColumnFilters ? getColumnsWithFilters() : availableOfficesColumns.availableOffices;
    }, []);

    const updateDisplayedOffices = e => {
        const visibleRows = [];
        const gridApi = e.api;
        gridApi.forEachNodeAfterFilterAndSort((node) => {
            visibleRows.push(node.data);
        });
        setDisplayedOffices(visibleRows);
    }

    return <>
        {hasAvailableOffices
            ? <div className="m-2">
                <Table
                    tableView={tableViewSettings}
                    rowData={availableOffices}
                    tableTitleWithTooltips={availableOfficesTooltips}
                    onRowClicked={(office) => addOffices([office])}
                    suppressNoRowsOverlay={true}
                    updateDisplayedOffices={setDisplayedOffices ? updateDisplayedOffices : null}
                />
            </div>
            : <div className="h-75 w-100 d-flex flex-column justify-content-center align-items-center">
                <div className="font-weight-bold d-block">{searchTerms.noneAdded}</div>
                <p className="text-muted">{searchTerms.noOfficesAvailable}</p>
            </div>
        }
    </>;
};

const AddedOfficeTable = props => {
    const { addedOffices, removeOffices } = props;

    const revisedAddedOffices = addedOffices.map((office) => {
            if (office.officeStatus === status.INACTIVE) {
                return ({
                    ...office,
                    officeName: searchTerms.inactiveOffice,
                    statusKeyfield: 'officeStatus'
                })
            }
            return office;
        });

    return <Table
                tableView={addedOfficesColumns.addedOffices}
                rowData={revisedAddedOffices}
                tableTitleWithTooltips={availableOfficesTooltips}
                onRowClicked={(office) => removeOffices([office])}
                suppressNoRowsOverlay={true} />
};

export {
    AvailableOfficeTable,
    AddedOfficeTable
};
