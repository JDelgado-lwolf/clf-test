import React, { useState } from 'react';
import { Button } from '@lwt-helix/buttons';

export default (handlerAgentChart) => {
    const [selectedAgentId, setSelectedAgentId] = useState(0);
    const [selectedRow, setSelectedRow] = useState(0);
    const changeSelectedRowColor = (agentId) => {
        setSelectedAgentId(agentId);
        setSelectedRow(null);
    };
    const handleClickAgentName = (agent) => {
        handlerAgentChart(agent)
    }    
    const chartOptions = {
        id: 'chartTableList',
        keyField: 'id',
        bootstrap4: true,
        displayCaret: true,
        striped: true,
        bordered: true,
        showFilters: true,
        showColumnBorders: false,
        tableClasses: 'table-borderless',
        showPagination: true,
        paginationOptions: {
            sizePerPage: 20,
            page: 1,
            alwaysShowAllBtns: true,
            hideSizePerPage: false,
            sizePerPageList: [20, 50, 100],
            onPageChange: () => {
                setSelectedRow(0);
            }
        },
        rowClasses: (row, rowIndex) => {
            if (rowIndex === selectedRow) return 'table-active';
            if (row.agentId === selectedAgentId) return 'table-active';
        },
        noDataIndication: 'Your search returned no results'
    };

    const chartSchema = {
        properties: {
            id: { type: 'string', hidden: true },
            agentName: {
                type: 'string',
                title: <>Agent Name</>,
                filter: 'none',
                format: 'custom',
                headerClasses: 'align-middle',
                headerStyle: { width: '150px', marginLeft: '30px' },
                sortValue: (cell, row) => {
                    const names = cell.split(' ');
                    return names[names.length - 1];
                },
                formatter: (cell, row, index, extraData) => {
                    return (
                        <Button
                            onClick={() => {
                                changeSelectedRowColor(row.agentId)
                                handleClickAgentName(row)
                            }}
                            className={'text-wrap w-max text-left text-capitalize text-decoration-none ' +
                            ' border-0 clickable'}
                        >
                            {row.agentName}
                        </Button>
                    );
                }
            }
        }
    };

    return {
        chartOptions,
        chartSchema
    };
};
