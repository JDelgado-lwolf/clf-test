import { productionListingsTooltips as plt } from '../../../../agent-production/constants/agentProductionConstants';

const agentProductionListingView = ( id, { colSettings: cs, cellRenderers }, ) => ({
    id,
    showPagination: true,
    paginationOptions: {
        sizePerPage: 10
    },
    defaultSort: { colId: plt.soldDate.keyField, sortDir: 'desc' },
    tables: [
        { col: plt.mlsNum, colDef: cs.textSm },
        { col: plt.typeName, colDef: cs.textSm },
        { 
            col: plt.address, 
            colDef: cs.textMd, 
            cellRenderer: cellRenderers.productionAddressListingsLink 
        },
        { col: plt.city, colDef: cs.textSm },
        { col: plt.zip, colDef: cs.textXs },
        { col: plt.area, colDef: cs.textXs },
        { col: plt.bankProperty, colDef: cs.textSm },
        { col: plt.orgPrice, colDef: cs.numberMdVolume },
        { col: plt.listPrice, colDef: cs.numberSmVolume },
        { col: plt.lastPrice, colDef: cs.numberSmVolume },
        { col: plt.priceChangeCnt, colDef: cs.numberLgInteger },
        { col: plt.spop, colDef: cs.numberSmPercentage },
        { col: plt.splp, colDef: cs.numberSmPercentage },
        { col: plt.soldDate, colDef: cs.dateSm },
        { col: plt.dom, colDef: cs.numberXsInteger },
        { col: plt.cdom, colDef: cs.numberSmInteger },
        { col: plt.pcDom, colDef: cs.numberSmInteger },
        { col: plt.bedrooms, colDef: cs.numberXsInteger },
        { col: plt.bathrooms, colDef: cs.numberXsInteger },
        { col: plt.squareFt, colDef: cs.numberXsInteger },
        { col: plt.pricePerSquareFt, colDef: cs.numberSmVolume },
        { col: plt.lotSizeSquareFt, colDef: cs.numberMdInteger },
        { col: plt.yearBuilt, colDef: cs.numberSmRightAlign },
        { col: plt.listAgent, colDef: cs.textLg },
        { col: plt.sellAgent, colDef: cs.textLg },
        { col: plt.doubleSided, colDef: cs.textSm }
    ]
});

export default agentProductionListingView;
