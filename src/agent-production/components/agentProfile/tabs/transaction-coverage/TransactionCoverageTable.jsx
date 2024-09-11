import React, { useEffect, useState } from 'react';
import getTableSettings from './TransactionCoverageTableSettings';
import { useAgentProfileStore } from '../../../../../store/store';
import Table from '../../../../../common/components/table/agGrid/Table';
import { tableViews } from '../../../../../common/components/table/agGrid/tableViews';
import {
    coverTableSoldTooltips,
    coverTableUcTooltips,
    coverTableForSaleTooltips,
    transactionCoverageTableTypes as tableTypes,
    superHeaders,
    tableViewNames
} from '../../../../constants/agentProductionConstants';

const TransactionCoverageTable = props => {
    const {
        areaLabel,
        data,
        isUnits,
        statusType,
        areaType,
        agent,
        tableType,
        timePeriod
    } = props;

    const {
        setAreaList
    } = useAgentProfileStore(state => ({
        setAreaList: state.setAreaList
    }));

    const [state, setState] = useState({
        tableView: tableViews.transactionCoverageSold,
        additionalTableHeaders: tableViews.transactionCoverageSold,
        coverageTableTooltips: coverTableSoldTooltips
    })

    const { goToCoverageListingsPage } = getTableSettings({
        statusType,
        areaLabel,
        areaType,
        agent,
        tableType,
        timePeriod,
        isUnits
    });

    let areaList = data.map(d => d.area);
    useEffect(() => {
        setAreaList(areaList);
    }, []);

    useEffect(() => {
        const tableByType = {
            [tableTypes.soldView]: {
                tableview: tableViews.transactionCoverageSold,
                tableViewNames: tableViewNames.transactionCoverageSold,
                tooltip: coverTableSoldTooltips
            },
            [tableTypes.underContract]: {
                tableview: tableViews.transactionCoverageUc,
                tableViewNames: tableViewNames.transactionCoverageUc,
                tooltip: coverTableUcTooltips
            },
            [tableTypes.forSale]: {
                tableview: tableViews.transactionCoverageForSale,
                tableViewNames: tableViewNames.transactionCoverageForSale,
                tooltip: coverTableForSaleTooltips
            },
        }
        const currentTableType = tableByType[tableType?.value];
        if (!currentTableType) return;
        setState(prevState => ({
            ...prevState,
            tableView: currentTableType.tableview,
            additionalTableHeaders: superHeaders[currentTableType.tableViewNames],
            coverageTableTooltips: {
                ...currentTableType.tooltip,
                area: { ...currentTableType.tooltip?.area, label: areaLabel }
            }
        }));
    }, [tableType, areaType]);

    let mappedData = [];
    if (data.length > 0) {
        mappedData = data.map(d => {
            return {
                ...d,
                id: d.area
            };
        });
    }

    return <Table
        tableView={state.tableView}
        rowData={mappedData}
        additionalTableHeaders={state.additionalTableHeaders}
        tableTitleWithTooltips={state.coverageTableTooltips}
        externalParams={{ agent, goToCoverageListingsPage }}
    />
};

export default TransactionCoverageTable;
