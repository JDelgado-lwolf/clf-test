export const teams = [{kayak: 1},{volleyball: 2},{soccer: 3}, {rugby: 0}];
export const availableTeams = [{kayak: 1},{volleyball: 2},{soccer: 3}];
export const garages = [
    {garageName: 'Garage 1', car: 2, bike: 0, helicopter: 0, boat: 1},
    {garageName: 'Garage 2', car: 0, bike: 0, helicopter: 0, boat: 0},
    {garageName: 'Garage 3', car: 0, bike: 0, helicopter: 10, boat:8},
];
export const availableVehicles = [{car: 2},{boat: 1}];
export const columns = [
    {col: {id: 'dollars'}, measureType: 'volume'},
    {col: {id: 'bikes'}, measureType: 'units'},
    {col: {id: 'hat'}, measureType: 'units'},
];

export const tableView = {
    id: "medianPrice",
    showPagination: false,
    defaultSort: {
        colId: "timePeriodStart",
        sortDir: "desc"
    },
    tables: [
        {
            col: {
                id: "timePeriodStart"
            },
            colDef: {
                label: "Month",
                keyField: "timePeriodStart",
                headerClass: "font-weight-bold",
                minWidth: 155,
                resizable: true
            }
        },
        {
            col: {
                id: "soldMedianVolume",
                label: "Sold Median $"
            },
            colDef: {
                cellClass: "td-num",
                headerClass: "align-top no-wrap td-num d-flex justify-content-end",
                minWidth: 155,
                resizable: true
            },
            statusId: "sold"
        },
        {
            col: {
                id: "soldUnits",
                label: "# Sold"
            },
            colDef: {
                cellClass: "td-num",
                headerClass: "align-top no-wrap td-num d-flex justify-content-end",
                minWidth: 155,
                resizable: true
            },
            statusId: "sold",
            measureType: "units"
        }
    ]
};

export const revisedBreakdownColumns = [
    {
        col: {
            id: "officeName",
            label: "Office"
        },
        colDef: {
            headerClass: "font-weight-bold",
            minWidth: 330,
            resizable: true,
        }
    },
    {
        col: {
            id: "soldMedianVolume",
            label: "Sold Median $"
        },
        colDef: {
            cellClass: "td-num",
            headerClass: "align-top no-wrap td-num d-flex justify-content-end",
            minWidth: 155,
            resizable: true,
            valueFormatter: () => {}
        },
        statusId: "sold"
    },
    {
        col: {
            id: "soldUnits",
            label: "# Sold"
        },
        colDef: {
            cellClass: "td-num",
            headerClass: "align-top no-wrap td-num d-flex justify-content-end",
            minWidth: 155,
            resizable: true,
            valueFormatter: () => {}
        },
        statusId: "sold",
        measureType: "units"
    }
];
