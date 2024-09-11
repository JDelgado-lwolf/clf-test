import { coverageListingsTooltips as clt } from '../../../../agent-production/constants/agentProductionConstants';

const agentCoverageListingSoldView = ({ colSettings: cs, tableViewNames, cellRenderers, }) => {
    return {
        id: tableViewNames.agentCoverageListingSold,
        showPagination: true,
        paginationOptions: {
            sizePerPage: 10
        },
        defaultSort: { colId: clt.dateLastSold.keyField, sortDir: 'desc' },
        tables: [
            { col: clt.mlsNum, colDef: cs.textSm },
            { col: clt.typeName, colDef: cs.textSm },
            {
                col: clt.address,
                colDef: cs.textMd,
                cellRenderer: cellRenderers.coverageAddressListingsLink
            },
            { col: clt.city, colDef: cs.textSm },
            { col: clt.zipCode, colDef: cs.textXs },
            { col: clt.areaId, colDef: cs.textXs },
            { col: clt.bankStatus, colDef: cs.bankStatus },
            { col: clt.orgPrice, colDef: cs.numberMdVolume },
            { col: clt.listPrice, colDef: cs.numberSmVolume },
            { col: clt.lastPrice, colDef: cs.numberSmVolume },
            { col: clt.priceChangeCnt, colDef: cs.numberLgInteger }, 
            { col: clt.spop, colDef: cs.numberTwoDecimalsPercentage },
            { col: clt.splp, colDef: cs.numberTwoDecimalsPercentage },
            { col: clt.dateLastSold, colDef: cs.dateSm },
            { col: clt.dom, colDef: cs.numberXsInteger },
            { col: clt.cdom, colDef: cs.numberSmInteger },
            { col: clt.pcDom, colDef: cs.numberSmInteger },
            { col: clt.bedrooms, colDef: cs.numberXsInteger },
            { col: clt.fullBaths, colDef: cs.numberXsInteger },
            { col: clt.squareFt, colDef: cs.numberXsInteger },
            { col: clt.pricePerSquareFt, colDef: cs.numberSmVolume },
            { col: clt.lotSizeSquareFt, colDef: cs.numberMdInteger },
            { col: clt.yearBuilt, colDef: cs.numberSmRightAlign },
            { col: clt.listAgent, colDef: cs.textLg },
            { col: clt.sellAgent, colDef: cs.textLg },
            { col: clt.doubleSided, colDef: cs.textSmall }
        ]
    };
};

export default agentCoverageListingSoldView;
