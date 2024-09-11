
const listingProficiencyView = ({
                                    agentsColumns,
                                    additionalTableHeaders,
                                    cellRenderers,
                                    colSettings,
                                    getAdditionalTableHeader,
                                    tableViewNames,
                                    TextFloatingFilterComponent
                                }) => {

    return {
        id: tableViewNames.listingProficiency,
        tables:
            [
                {   headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column7, props),
                    children: [
                        {
                            headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column1, props),
                            children: [
                                { col: agentsColumns.rank, colDef: colSettings.textXsRightAlign },
                                {
                                    col: agentsColumns.favoriteAgents,
                                    colDef: colSettings.icon,
                                    cellRenderer: cellRenderers.renderFavorited
                                },
                                {
                                    col: agentsColumns.agentName,
                                    colDef: colSettings.textLg,
                                    cellRenderer: cellRenderers.agentNameLink,
                                    filterOptions: {
                                        filter: 'agTextColumnFilter',
                                        floatingFilterComponent: TextFloatingFilterComponent,
                                        floatingFilterComponentParams: {
                                            placeholder: 'Search Name'
                                        }
                                    }
                                },
                                {
                                    col: agentsColumns.officeName,
                                    colDef: colSettings.textLg,
                                    filterOptions: {
                                        filter: 'agTextColumnFilter',
                                        floatingFilterComponent: TextFloatingFilterComponent,
                                        floatingFilterComponentParams: {
                                            placeholder: 'Search Office'
                                        }
                                    }
                                },
                                { col: agentsColumns.officeId, colDef: colSettings.textSm, initialHide: true },
                                { col: agentsColumns.officeAddress, colDef: colSettings.textMd, initialHide: true },
                                { col: agentsColumns.officeCity, colDef: colSettings.textSm, initialHide: true },
                                { col: agentsColumns.officeZipCode, colDef: colSettings.textXs, initialHide: true },
                                { col: agentsColumns.officeCounty, colDef: colSettings.textSm, initialHide: true }
                            ]
                        }
                    ]
                },
                {
                    headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column6, props),
                    children: [
                        {
                            headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                            children: [
                                { col: agentsColumns.last12SellUnits, colDef: colSettings.numberSmUnits },
                                { col: agentsColumns.last12SellVolume, colDef: colSettings.numberSmVolume }
                            ]
                        },
                        {
                            headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column3, props),
                            children: [
                                { col: agentsColumns.last12ListUnits, colDef: colSettings.numberSmUnits },
                                { col: agentsColumns.last12ListVolume, colDef: colSettings.numberSmVolume }
                            ]
                        },
                        {
                            headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column4, props),
                            children: [
                                { col: agentsColumns.noPcLast12ListUnits, colDef: colSettings.numberSmUnits },
                                { col: agentsColumns.noPcLast12ListUnitsPct, colDef: colSettings.numberMdPercentage },
                                { col: agentsColumns.noPcLast12ListVolume, colDef: colSettings.numberSmVolume },
                                { col: agentsColumns.noPcLast12ListVolumePct, colDef: colSettings.numberMdPercentage },
                                { col: agentsColumns.noPcLast12ListDom, colDef: colSettings.numberXsInteger },
                                { col: agentsColumns.noPcLast12ListCdom, colDef: colSettings.numberSmInteger },
                                { col: agentsColumns.noPcLast12SpOp, colDef: colSettings.numberXsPercentage }
                            ]
                        },
                        {
                            headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column5, props),
                            children: [
                                { col: agentsColumns.pcLast12ListUnits, colDef: colSettings.numberSmUnits },
                                { col: agentsColumns.pcLast12ListUnitsPct, colDef: colSettings.numberMdPercentage },
                                { col: agentsColumns.pcLast12ListVolume, colDef: colSettings.numberSmVolume },
                                { col: agentsColumns.pcLast12ListVolumePct, colDef: colSettings.numberMdPercentage },
                                { col: agentsColumns.pcLast12ListDom, colDef: colSettings.numberSmInteger },
                                { col: agentsColumns.pcLast12ListCdom, colDef: colSettings.numberSmInteger, initialHide: true },
                                { col: agentsColumns.pcLast12ListPcDom, colDef: colSettings.numberSmInteger, initialHide: true },
                                { col: agentsColumns.pcLast12ListSpOp, colDef: colSettings.numberXsPercentage, initialHide: true },
                                { col: agentsColumns.pcLast12ListSpLp, colDef: colSettings.numberXsPercentage, initialHide: true },
                                { col: agentsColumns.pcLast12ListAvgNumPc, colDef: colSettings.numberSmUnits, initialHide: true }
                            ]
                        }
                    ]
                }
            ]
    };
};

export default listingProficiencyView;
