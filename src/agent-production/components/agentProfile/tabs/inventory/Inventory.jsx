import React, { useEffect, useState } from 'react';
import Loader from '@lwt-helix/loader';
import getInventoryTableSettings from './InventoryTableSettings';
import getCurrentlyForSaleTableSettings from './ForSaleTableSettings';
import getUnderContractTableSettings from './UnderContractTableSettings';
import { agentProductionTerms } from '../../../../../constants';
import { getAgentInventoryHistory } from '../../../../../service/service-gateway';
import { currentlyFSTooltips, currentlyUCTooltips, inventoryTableTooltips } from '../../../../constants/agentProductionConstants';
import Table from '../../../../../common/components/table/agGrid/Table'
import { tableViews } from '../../../../../common/components/table/agGrid/tableViews';

const Inventory = ({ mlsId, agentId, mlsName, sendToParent, isActive }) => {
    const additionalHeaders = getInventoryTableSettings();
    const forSaleAdditionalHeaders = getCurrentlyForSaleTableSettings();
    const underContractAdditionalHeaders = getUnderContractTableSettings();
    const [isLoading, setIsLoading] = useState(true);
    const [inventoryMappedData, setInventoryMappedData] = useState([]);
    const [forSaleRawData, setForSaleRawData] = useState([]);
    const [underContractRawData, setUnderContractRawData] = useState([]);
    const [inventoryTableData, setInventoryTableData] = useState([]);
    const [selectedRow, setSelectedRow] = useState();
    const [selectedNode, setSelectedNode] = useState();

    const inventoryTables = Object.freeze({
        UNDER_CONTRACT: 'Currently Under Contract',
        FOR_SALE: 'Currently For Sale'
    });

    useEffect(() => {

        if (!agentId || !mlsId ) return;

        const loadProductionData = async () => {
            setIsLoading(true);
            const data = await getAgentInventoryHistory({ agentId, mlsId });
            setInventoryTableData(data);
            setIsLoading(false);
        };

        const handleErrorInFutureTicket = (e) => console.log(e);

        loadProductionData().catch(handleErrorInFutureTicket);
    }, [mlsId, agentId]);

    useEffect(() => {
        if (inventoryTableData !== null) {
            let forSale = {
                id: 1,
                status: inventoryTables.FOR_SALE,
                totalUnits: 0,
                listPriceVolume: 0,
                originalPriceVolume: 0,
                pcUnits: 0,
                cdomTier1: 0,
                cdomTier2: 0,
                cdomTier3: 0,
                cdomTier4: 0,
                cdomTier5: 0
            };
            let underContract = {
                id: 2,
                status: inventoryTables.UNDER_CONTRACT,
                totalUnits: 0,
                listPriceVolume: 0,
                originalPriceVolume: 0,
                pcUnits: 0,
                cdomTier1: 0,
                cdomTier2: 0,
                cdomTier3: 0,
                cdomTier4: 0,
                cdomTier5: 0
            };

            const temp1 = [];
            const temp2 = [];

            inventoryTableData?.inventoryItems?.forEach((property) => {
                const revisedProperty = {
                    ...property,
                    dollarPerSquareFt: property.squareFt
                        ? property.listPrice / property.squareFt
                        : 0
                };
                if (!property.dateCont) {
                    forSale.totalUnits++;
                    forSale.listPriceVolume += property.listPrice;
                    forSale.originalPriceVolume += property.orgPrice;
                    property.listPrice !== property.orgPrice && forSale.pcUnits++;
                    property.cdom <= 30 && forSale.cdomTier1++;
                    property.cdom >= 31 && property.cdom <= 90 && forSale.cdomTier2++;
                    property.cdom >= 91 && property.cdom <= 180 && forSale.cdomTier3++;
                    property.cdom >= 181 && property.cdom <= 360 && forSale.cdomTier4++;
                    property.cdom > 360 && forSale.cdomTier5++;
                    temp1.push(revisedProperty);
                } else {
                    underContract.totalUnits++;
                    underContract.listPriceVolume += property.listPrice;
                    underContract.originalPriceVolume += property.orgPrice;
                    property.listPrice !== property.orgPrice && underContract.pcUnits++;
                    property.cdom <= 30 && underContract.cdomTier1++;
                    property.cdom >= 31 && property.cdom <= 90 && underContract.cdomTier2++;
                    property.cdom >= 91 && property.cdom <= 180 && underContract.cdomTier3++;
                    property.cdom >= 181 && property.cdom <= 360 && underContract.cdomTier4++;
                    property.cdom > 360 && underContract.cdomTier5++;
                    temp2.push(revisedProperty);
                }
            });

            setForSaleRawData(temp1);
            setUnderContractRawData(temp2);

            forSale.avgPrice = forSale.totalUnits ? forSale.listPriceVolume / forSale.totalUnits : 0;
            forSale.lpop = forSale.originalPriceVolume
                ? (forSale.listPriceVolume / forSale.originalPriceVolume) * 100
                : 0;
            underContract.avgPrice = underContract.totalUnits
                ? underContract.listPriceVolume / underContract.totalUnits
                : 0;
            underContract.lpop = underContract.originalPriceVolume
                ? (underContract.listPriceVolume / underContract.originalPriceVolume) * 100
                : 0;

            const combined = [];
            combined.push(forSale);
            combined.push(underContract);

            setInventoryMappedData(combined);
        }
    }, [inventoryTableData]);

    useEffect(() => {
        if (!isActive || isLoading) return;

        const hasOneOrMoreRowsToShow =
            (selectedRow?.status === inventoryTables.FOR_SALE && !!forSaleRawData.length) ||
            (selectedRow?.status === inventoryTables.UNDER_CONTRACT && !!underContractRawData.length);

        const forParent = {
            forSaleRawData,
            underContractRawData,
            shouldShowExportButton: hasOneOrMoreRowsToShow
        };
        sendToParent(forParent);
    }, [forSaleRawData, underContractRawData, isActive, selectedRow]);

    const handleCellClicked = (params) => {
        if (params.colDef.field === 'status') {
            params.api.forEachNode((node) => {
                if (node.data.id === params.data.id) {
                    node.setSelected(true, true);
                    setSelectedNode(node);
                } else {
                    node.setSelected(false);
                }
            });
        }
    };

    return (
        !isLoading ?
        <>
            <div className='d-flex justify-content-end helix-body--strong mb-2'>
            {mlsName || agentProductionTerms.allMls}
            </div>
            <div className={`${selectedRow?.id === selectedNode?.data?.id ? 'selected' : ''}`}>
                <Table
                    tableView={tableViews.inventory}
                    rowData={inventoryMappedData || []}
                    additionalTableHeaders={additionalHeaders}
                    tableTitleWithTooltips={inventoryTableTooltips}
                    externalParams={{ setSelectedRow }}
                    onCellClicked={(params) => handleCellClicked(params)}
                />
            </div>
            {selectedRow?.status === inventoryTables.FOR_SALE ? (
                <div className='pt-2'>
                    <Table
                        tableView={tableViews.forSale}
                        rowData={forSaleRawData || []}
                        additionalTableHeaders={forSaleAdditionalHeaders}
                        tableTitleWithTooltips={currentlyFSTooltips}
                    />
                </div>
            ) : selectedRow?.status === inventoryTables.UNDER_CONTRACT ? (
                <div className='pt-2'>
                    <Table
                        tableView={tableViews.underContract}
                        rowData={underContractRawData || []}
                        additionalTableHeaders={underContractAdditionalHeaders}
                        tableTitleWithTooltips={currentlyUCTooltips}
                    />
                </div>
            ) : (
                ''
            )}
            </>
            : <Loader />
    );
};

export default Inventory;
