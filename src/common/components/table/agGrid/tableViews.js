import React from 'react';
import TextFloatingFilterComponent from '../agGrid/FloatingFilter';
import {
    agentsColumns,
    pricingHistoryTooltips,
    tableViewNames,
    additionalTableHeaders,
    tabModes,
    growthAnalysisTooltips,
    productionListingRoute,
    transactionCoverageSoldColumns,
    transactionCoverageUcColumns,
    transactionCoverageForSaleColumns
} from '../../../../agent-production/constants/agentProductionConstants';
import { colSettings } from './colSettings';
import FavoriteAgent from '../cellRenderers/FavoriteAgent';
import { AgentProfileLink } from '../cellRenderers/AgentProfileLink';
import {
    getAdditionalTableHeader,
    getContact,
    getCurrentSearchLast6Months,
    getAllMlsLast12Months,
    getGrowth
} from './agGrid';
import { Link } from 'react-router-dom';
import { listingViews as lv } from '../../../../market-dynamics/constants/listingViews'
import { useQuery } from '../../../hooks/location';
import { Routes } from '../../../routes/routes';
import { getShortDate, transformSchemaTableColumns } from '../../../../agent-production/helpers/schemaTableHelpers';
import { getDefaultGrowthAnalysisColumnsLtm } from '../../../../agent-production/components/helpers/growthAnalysisHelpers';
import { monthTextYearFormatter } from '../../../../agent-production/components/agentProfile/tabs/helpers/exportHelpers';
import { searchTerms } from '../../../../constants';
import { isHiddenColumn } from '../../../../agent-production/helpers/agentProductionHelpers';
import { CoverageAddressFormatter, ProductionAddressFormatter } from '../../../../agent-production/components/agentProfile/tabs/transaction-coverage/helpers/listingTableSettings';
import {
    addedAgentsView,
    availableAgentsView,
    listingProficiencyView,
    officeHistoryView,
    agentCoverageListingSoldView,
    agentCoverageListingUcView,
    agentCoverageListingForSaleView,
    agentProductionListingView
} from '../tableViews';


const agentEmailLink = (data) => (
    <span title={data.agentEmail}>
        <a href={`mailto:${data.agentEmail}`}>
            {data.agentEmail}
        </a>
    </span>
);

const agentAddress = (data) => {
    const altAddress = data?.agentAddress || '';
    const agentCity = data?.agentCity ? data.agentCity + ' ' : '';
    const agentZip = data?.agentZipcode ? data.agentZipcode : '';
    const agentCityAndAgentZip = agentCity || agentZip ? `${agentCity + agentZip}` : null;
    const altState = data?.agentState ? data.agentState : null;
    return (
        <p className='text-wrap col-address'> {altAddress} {agentCityAndAgentZip} {altState} </p>
    );
};

const agentProductionListingLink = (props) => {
    const { data, timePeriod, productionGraphMode } = props;
    const idParam = `?id=${data.agentId}`;
    const periodParam = `&period=${monthTextYearFormatter(data.month).replace('- 20', '')}`;
    const graphParam = `&graph=${productionGraphMode}`;
    const chartParam = `&chartMode=${data.chartMode}`;
    const intervalParam = `&intervalType=${timePeriod}`;
    return (
        <Link to={`${productionListingRoute}${idParam}${periodParam}${graphParam}${chartParam}${intervalParam}`}>
            {monthTextYearFormatter(data.month)}
        </Link>
    )
};

const areaTransactionCoverageLink = (props) => {
    const { data, goToCoverageListingsPage } = props;
    return (
        <a
            id='agentsCoverageTableLink'
            href='#'
            onClick={() => goToCoverageListingsPage(data.area)}
        >
            {data.area}
        </a>
    )
};

const inventoryName = ({ data, setSelectedRow }) => {
    return (
        <a
            href="#"
            id={`status-select-${data.id}`}
            onClick={() => setSelectedRow(data)}
            className="text-capitalize text-left text-wrap border-0"
        >
            {data.status}
        </a>
    );
};

const currentlyAddress = (data) => {
    let query = useQuery();
    const listingInfoRoute = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.LISTING_INFO}`;
    return (
        <Link
            className="text-truncate w-max text-left text-wrap text-decoration-none border-0"
            to={`${listingInfoRoute}?mlsNum=${data.mlsNum}&agentId=${query.get('id')}&tabIndex=1`}
        >
            {data.address}
        </Link>
    );
}

const showMoveDate = (props) => {
    return (<p className={props.data.display ? '' : 'first-office'}>{getShortDate(props.data.moveDate)}</p>);
}

export const cellRenderers = {
    agentNameLink: (props) => <AgentProfileLink {...props} />,
    inventoryType: (props) => inventoryName(props),
    address: (props) => currentlyAddress(props.data),
    agentProductionListingLink: (props) => agentProductionListingLink(props),
    emailLink: (props) => agentEmailLink(props.data),
    alternativeAddress: (props) => agentAddress(props.data),
    areaTransactionCoverageLink: (props) => areaTransactionCoverageLink(props),
    renderFavorited: params => <FavoriteAgent {...params} />,
    moveDate: (props) => showMoveDate(props),
    coverageAddressListingsLink: (props) => CoverageAddressFormatter(props.data),
    productionAddressListingsLink: (props) => ProductionAddressFormatter(props.data),
    pinnedRow: (value) => <span>{value || ''}</span>
};

const growthAnalysisColumns = transformSchemaTableColumns(growthAnalysisTooltips, tabModes.GROWTH_ANALYSIS);
const columns = getDefaultGrowthAnalysisColumnsLtm();

export const tableViewCommonDependencies = {
    agentsColumns,
    additionalTableHeaders,
    cellRenderers,
    colSettings,
    getAdditionalTableHeader,
    tableViewNames,
    TextFloatingFilterComponent
}

export const tableViews = {
    [tableViewNames.overview]: {
        id: tableViewNames.overview,
        defaultSort: {
            colId: agentsColumns.totalVolume.id,
            sortDir: 'desc'
        },
        tables:
            [
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
                            col: agentsColumns.agentId,
                            colDef: colSettings.textMd,
                            initialHide: true,
                            filterOptions: {
                                filter: 'agTextColumnFilter',
                                floatingFilterComponent: TextFloatingFilterComponent,
                                floatingFilterComponentParams: {
                                    placeholder: 'Search ID'
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
                        { col: agentsColumns.officeCounty, colDef: colSettings.textSm, initialHide: true },
                        { col: agentsColumns.listVolume, colDef: colSettings.numberSmVolume },
                        { col: agentsColumns.sellVolume, colDef: colSettings.numberSmVolume },
                        { col: agentsColumns.totalVolume, colDef: colSettings.numberSmVolume },
                        { col: agentsColumns.listUnits, colDef: colSettings.numberSmUnits },
                        { col: agentsColumns.sellUnits, colDef: colSettings.numberSmUnits },
                        { col: agentsColumns.totalUnits, colDef: colSettings.numberSmUnits }
                    ]
                },
                {
                    headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                    children: [
                        { col: agentsColumns.averagePrice, colDef: colSettings.numberSmVolume, initialHide: true },
                        { col: agentsColumns.last12Spop, colDef: colSettings.numberSmPercentage, initialHide: true },
                        { col: agentsColumns.last12AvgDom, colDef: colSettings.numberSmInteger, initialHide: true },
                        { col: agentsColumns.totalUnitsChange, colDef: colSettings.numberSmUnits, initialHide: true },
                        { col: agentsColumns.totalVolumeChange, colDef: colSettings.numberSmVolume, initialHide: true },
                        { col: agentsColumns.last12ListVolume, colDef: colSettings.numberSmVolume },
                        { col: agentsColumns.last12SellVolume, colDef: colSettings.numberSmVolume },
                        { col: agentsColumns.last12TotalVolume, colDef: colSettings.numberSmVolume },
                        { col: agentsColumns.last12ListUnits, colDef: colSettings.numberSmUnits },
                        { col: agentsColumns.last12SellUnits, colDef: colSettings.numberSmUnits },
                        { col: agentsColumns.last12TotalUnits, colDef: colSettings.numberSmUnits }
                    ]
                }
            ]
    },
    [tableViewNames.pricingHistory]: {
        id: tableViewNames.pricingHistory,
        showPagination: false,
        defaultSort: {
            colId: pricingHistoryTooltips.date.id,
            sortDir: 'desc'
        },
        tables: [
            { col: pricingHistoryTooltips.date, colDef: colSettings.dateSm },
            { col: pricingHistoryTooltips.status, colDef: colSettings.textSm },
            { col: pricingHistoryTooltips.price, colDef: colSettings.numberSmVolume },
            { col: pricingHistoryTooltips.priceChange, colDef: colSettings.blankEmptySmVolume },
            {
                col: pricingHistoryTooltips.priceChangePct,
                colDef: colSettings.blankEmptyNumberSmPercentageWithMultiplier
            },
            { col: pricingHistoryTooltips.days, colDef: colSettings.numberSmInteger },
            { col: pricingHistoryTooltips.changeType, colDef: colSettings.textSm },
            { col: pricingHistoryTooltips.spop, colDef: colSettings.blankEmptyNumberSmPercentageWithMultiplier },
            { col: pricingHistoryTooltips.splp, colDef: colSettings.blankEmptyNumberSmPercentageWithMultiplier }
        ]
    },
    [tableViewNames.inventory]: {
        id: tableViewNames.inventory,
        tables: [
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column1, props),
                children: [
                    { 
                        col: agentsColumns.status, 
                        colDef: colSettings.textLg,
                        cellRenderer: cellRenderers.inventoryType, 
                    }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                children: [
                    { col: agentsColumns.inventoryTotalUnits, colDef: colSettings.numberSmUnits },
                    { col: agentsColumns.inventoryPriceVolume, colDef: colSettings.numberSmVolume },
                    { col: agentsColumns.inventoryAvgPrice, colDef: colSettings.numberSmVolume }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column3, props),
                children: [
                    { col: agentsColumns.pcUnits, colDef: colSettings.numberSmUnits },
                    { col: agentsColumns.lpop, colDef: colSettings.numberSmPercentage }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column4, props),
                children: [
                    { col: agentsColumns.cdomTier1, colDef: colSettings.numberSmInteger },
                    { col: agentsColumns.cdomTier2, colDef: colSettings.numberSmInteger },
                    { col: agentsColumns.cdomTier3, colDef: colSettings.numberSmInteger },
                    { col: agentsColumns.cdomTier4, colDef: colSettings.numberSmInteger },
                    { col: agentsColumns.cdomTier5, colDef: colSettings.numberSmInteger }
                ]
            }
        ]
    },
    [tableViewNames.forSale]: {
        id: tableViewNames.forSale,
        defaultSort: {
            colId: agentsColumns.dateList.id,
            sortDir: 'asc'
        },
        tables: [
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column1, props),
                children: [
                    { col: agentsColumns.typeName, colDef: colSettings.textSm },
                    {  
                        col: agentsColumns.address, 
                        colDef: colSettings.textMd,
                        cellRenderer: cellRenderers.address
                     },
                    { col: agentsColumns.city, colDef: colSettings.textSm },
                    { col: agentsColumns.zipCode, colDef: colSettings.textSm },
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                children: [
                    { col: agentsColumns.orgPrice, colDef: colSettings.numberMdVolume  },
                    { col: agentsColumns.listPrice, colDef: colSettings.numberSmVolume },
                    { col: agentsColumns.priceChangeCnt, colDef: colSettings.numberMdInteger }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column3, props),
                children: [
                    { col: agentsColumns.dateList, colDef: colSettings.dateSm },
                    { col: agentsColumns.cdom, colDef: colSettings.numberSmGroupedInteger }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column4, props),
                children: [
                    { col: agentsColumns.bedrooms, colDef: colSettings.numberXsInteger },
                    { col: agentsColumns.fullBaths, colDef: colSettings.numberXsInteger },
                    { col: agentsColumns.squareFt, colDef: colSettings.numberSmInteger },
                    { col: agentsColumns.dollarPerSquareFt, colDef: colSettings.numberMdVolume },
                    { col: agentsColumns.lotSizeSquareFt, colDef: colSettings.numberMdInteger },
                    { col: agentsColumns.yearBuilt, colDef: colSettings.numberSmRightAlign },
                    { col: agentsColumns.mlsNum, colDef: colSettings.textSm },
                ]
            }
        ]
    },
    [tableViewNames.underContract]: {
        id: tableViewNames.underContract,
        defaultSort: {
            colId: agentsColumns.dateList.id,
            sortDir: 'asc'
        },
        tables: [
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column1, props),
                children: [
                    { col: agentsColumns.typeName, colDef: colSettings.textSm },
                    {  
                        col: agentsColumns.address, 
                        colDef: colSettings.textMd,
                        cellRenderer: cellRenderers.address
                     },
                    { col: agentsColumns.city, colDef: colSettings.textSm },
                    { col: agentsColumns.zipCode, colDef: colSettings.textSm }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                children: [
                    { col: agentsColumns.orgPrice, colDef: colSettings.numberMdVolume  },
                    { col: agentsColumns.listPrice, colDef: colSettings.numberSmVolume },
                    { col: agentsColumns.priceChangeCnt, colDef: colSettings.numberMdInteger }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column3, props),
                children: [
                    { col: agentsColumns.dateList, colDef: colSettings.dateSm },
                    { col: agentsColumns.dateCont, colDef: colSettings.dateSm },
                    { col: agentsColumns.cdom, colDef: colSettings.numberSmGroupedInteger },
                    { col: agentsColumns.duc, colDef: colSettings.numberXsInteger }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column4, props),
                children: [
                    { col: agentsColumns.statusCode, colDef: colSettings.textSm },
                    { col: agentsColumns.bedrooms, colDef: colSettings.numberXsInteger },
                    { col: agentsColumns.fullBaths, colDef: colSettings.numberXsInteger },
                    { col: agentsColumns.squareFt, colDef: colSettings.numberSmInteger },
                    { col: agentsColumns.dollarPerSquareFt, colDef: colSettings.numberMdVolume },
                    { col: agentsColumns.lotSizeSquareFt, colDef: colSettings.numberMdInteger },
                    { col: agentsColumns.yearBuilt, colDef: colSettings.numberSmRightAlign },
                    { col: agentsColumns.mlsNum, colDef: colSettings.textSm }
                ]
            }
        ]
    },
    [tableViewNames.growthAnalysisLtm]: {
        id: tableViewNames.growthAnalysisLtm,
        tables: [
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
                        col: growthAnalysisColumns.agentName,
                        colDef: colSettings.textLg,
                        cellRenderer: cellRenderers.agentNameLink,
                        filterOptions: {
                            filter: 'agTextColumnFilter',
                            floatingFilterComponent: TextFloatingFilterComponent,
                            floatingFilterComponentParams: {
                                placeholder: searchTerms.searchName
                            }
                        }
                    },
                    {
                        col: growthAnalysisColumns.officeName,
                        colDef: colSettings.textLg,
                        filterOptions: {
                            filter: 'agTextColumnFilter',
                            floatingFilterComponent: TextFloatingFilterComponent,
                            floatingFilterComponentParams: {
                                placeholder: searchTerms.searchOffice
                            }
                        }
                    },
                    {
                        col: growthAnalysisColumns.officeId,
                        colDef: colSettings.textSm,
                        initialHide: true
                    },
                    {
                        col: growthAnalysisColumns.officeAddress,
                        colDef: colSettings.textMd,
                        initialHide: isHiddenColumn(growthAnalysisColumns.officeAddress.id, columns)
                    },
                    {
                        col: growthAnalysisColumns.officeCity,
                        colDef: colSettings.textSm,
                        initialHide: isHiddenColumn(growthAnalysisColumns.officeAddress.id, columns)
                    },
                    {
                        col: growthAnalysisColumns.officeZipCode,
                        colDef: colSettings.textXs,
                        initialHide: isHiddenColumn(growthAnalysisColumns.officeAddress.id, columns)
                    },
                    {
                        col: growthAnalysisColumns.officeCounty,
                        colDef: colSettings.textSm,
                        initialHide: isHiddenColumn(growthAnalysisColumns.officeAddress.id, columns)
                    }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                children: [
                    { col: growthAnalysisColumns.ptmTotalUnits, colDef: colSettings.numberMdUnits },
                    {
                        col: growthAnalysisColumns.last12TotalUnits,
                        colDef: colSettings.numberMdUnits
                    },
                    {
                        col: growthAnalysisColumns.totalUnitsChange,
                        colDef: colSettings.numberSmUnits
                    },
                    {
                        col: growthAnalysisColumns.totalUnitsGrowth,
                        colDef: colSettings.numberSmPercentage
                    }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column3, props),
                children: [
                    {
                        col: growthAnalysisColumns.ptmTotalVolume,
                        colDef: colSettings.numberLgVolume
                    },
                    {
                        col: growthAnalysisColumns.last12TotalVolume,
                        colDef: colSettings.numberMdVolume
                    },
                    {
                        col: growthAnalysisColumns.totalVolumeChange,
                        colDef: colSettings.numberSmVolume
                    },
                    {
                        col: growthAnalysisColumns.totalVolumeGrowth,
                        colDef: colSettings.numberSmPercentage
                    }
                ]
            }
        ]
    },
    [tableViewNames.growthAnalysisYtd]: {
        id: tableViewNames.growthAnalysisYtd,
        tables: [
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
                        col: growthAnalysisColumns.agentName,
                        colDef: colSettings.textLg,
                        cellRenderer: cellRenderers.agentNameLink,
                        filterOptions: {
                            filter: 'agTextColumnFilter',
                            floatingFilterComponent: TextFloatingFilterComponent,
                            floatingFilterComponentParams: {
                                placeholder: searchTerms.searchName
                            }
                        }
                    },
                    {
                        col: growthAnalysisColumns.officeName,
                        colDef: colSettings.textLg,
                        filterOptions: {
                            filter: 'agTextColumnFilter',
                            floatingFilterComponent: TextFloatingFilterComponent,
                            floatingFilterComponentParams: {
                                placeholder: searchTerms.searchOffice
                            }
                        }
                    },
                    {
                        col: growthAnalysisColumns.officeId,
                        colDef: colSettings.textSm,
                        initialHide: true
                    },
                    {
                        col: growthAnalysisColumns.officeAddress,
                        colDef: colSettings.textMd,
                        initialHide: isHiddenColumn(growthAnalysisColumns.officeAddress.id, columns)
                    },
                    {
                        col: growthAnalysisColumns.officeCity,
                        colDef: colSettings.textSm,
                        initialHide: isHiddenColumn(growthAnalysisColumns.officeAddress.id, columns)
                    },
                    {
                        col: growthAnalysisColumns.officeZipCode,
                        colDef: colSettings.textXs,
                        initialHide: isHiddenColumn(growthAnalysisColumns.officeAddress.id, columns)
                    },
                    {
                        col: growthAnalysisColumns.officeCounty,
                        colDef: colSettings.textSm,
                        initialHide: isHiddenColumn(growthAnalysisColumns.officeAddress.id, columns)
                    }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                children: [
                    {
                        col: growthAnalysisColumns.pytdTotalUnits,
                        colDef: colSettings.numberSmUnits
                    },
                    {
                        col: growthAnalysisColumns.lytdTotalUnits,
                        colDef: colSettings.numberSmUnits
                    },
                    {
                        col: growthAnalysisColumns.lytdPytdTotalUnitsChange,
                        colDef: colSettings.numberSmUnits
                    },
                    {
                        col: growthAnalysisColumns.lytdPytdTotalUnitsGrowth,
                        colDef: colSettings.numberSmPercentage
                    }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column3, props),
                children: [
                    {
                        col: growthAnalysisColumns.pytdTotalVolume,
                        colDef: colSettings.numberSmVolume
                    },
                    {
                        col: growthAnalysisColumns.lytdTotalVolume,
                        colDef: colSettings.numberSmVolume
                    },
                    {
                        col: growthAnalysisColumns.lytdPytdTotalVolumeChange,
                        colDef: colSettings.numberSmVolume
                    },
                    {
                        col: growthAnalysisColumns.lytdPytdTotalVolumeGrowth,
                        colDef: colSettings.numberSmPercentage
                    }
                ]
            }
        ]
    },
    [tableViewNames.agentDetailProduction]: {
        id: tableViewNames.agentDetailProduction,
        showPagination: false,
        defaultSort: { colId: agentsColumns.agProdMonth.id, sortDir: 'desc' },
        tables: [
            {
                col: agentsColumns.agProdMonth,
                colDef: colSettings.textLg,
                cellRenderer: cellRenderers.agentProductionListingLink
            },
            { col: agentsColumns.listUnits, colDef: colSettings.numberSmUnits },
            { col: agentsColumns.sellUnits, colDef: colSettings.numberSmUnits },
            { col: agentsColumns.totalUnits, colDef: colSettings.numberSmUnits },
            { col: agentsColumns.listVolume, colDef: colSettings.numberSmVolume },
            { col: agentsColumns.sellVolume, colDef: colSettings.numberSmVolume },
            { col: agentsColumns.totalVolume, colDef: colSettings.numberSmVolume }
        ]
    },
    [tableViewNames.contactInformation]: {
        id: tableViewNames.contactInformation,
        defaultSort: {
            colId: agentsColumns.ciTotalVolume.id,
            sortDir: 'desc'
        },
        tables:
            [
                {
                    headerGroupTitle: getContact,
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
                                    placeholder: searchTerms.searchName
                                }
                            }
                        },
                        {
                            col: agentsColumns.agentId,
                            colDef: colSettings.textMd,
                            filterOptions: {
                                filter: 'agTextColumnFilter',
                                floatingFilterComponent: TextFloatingFilterComponent,
                                floatingFilterComponentParams: {
                                    placeholder: searchTerms.searchId
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
                                    placeholder: searchTerms.searchOffice
                                }
                            }
                        },
                        { col: agentsColumns.officeId, colDef: colSettings.textSm },
                        { col: agentsColumns.officeAddress, colDef: colSettings.textLg },
                        { col: agentsColumns.officeCity, colDef: colSettings.textSm },
                        { col: agentsColumns.officeZipCode, colDef: colSettings.textXs },
                        { col: agentsColumns.officeCounty, colDef: colSettings.textSm },
                        { col: agentsColumns.agentPhone1, colDef: colSettings.textMd },
                        { col: agentsColumns.agentPhone2, colDef: colSettings.textMd },
                        { col: agentsColumns.agentPhone3, colDef: colSettings.textMd },
                        {
                            col: agentsColumns.agentEmail, colDef: colSettings.textLg,
                            cellRenderer: cellRenderers.emailLink
                        },
                        {
                            col: agentsColumns.agentAddress, colDef: colSettings.textLg,
                            cellRenderer: cellRenderers.alternativeAddress
                        }
                    ]
                },
                {
                    headerGroupTitle: getCurrentSearchLast6Months,
                    children: [
                        { col: agentsColumns.ciTotalUnits, colDef: colSettings.numberMdLgUnits },
                        { col: agentsColumns.ciTotalVolume, colDef: colSettings.numberMdLgVolume }
                    ]
                },
                {
                    headerGroupTitle: getAllMlsLast12Months,
                    children: [
                        { col: agentsColumns.last12TotalUnits, colDef: colSettings.numberLgUnits },
                        { col: agentsColumns.last12TotalVolume, colDef: colSettings.numberExLgVolume }
                    ]
                },
                {
                    headerGroupTitle: getGrowth,
                    children: [
                        { col: agentsColumns.totalVolumeChange, colDef: colSettings.numberSmVolume },
                        { col: agentsColumns.totalVolumeGrowth, colDef: colSettings.numberSmPercentage }
                    ]
                }
            ]
    },
    [tableViewNames.transactionCoverageSold]: {
        id: tableViewNames.transactionCoverageSold,
        showPagination: true,
        paginationOptions: {
            sizePerPage: 10
        },
        defaultSort: { colId: transactionCoverageSoldColumns.totalVolume.id, sortDir: 'desc' },
        tables: [
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column1, props),
                children: [
                    {
                        col: transactionCoverageSoldColumns.area,
                        colDef: colSettings.textMd,
                        cellRenderer: cellRenderers.areaTransactionCoverageLink
                    },
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                children: [
                    { col: transactionCoverageSoldColumns.listUnits, colDef: colSettings.numberSmUnits },
                    { col: transactionCoverageSoldColumns.listVolume, colDef: colSettings.numberSmVolume }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column3, props),
                children: [
                    { col: transactionCoverageSoldColumns.sellUnits, colDef: colSettings.numberSmUnits },
                    { col: transactionCoverageSoldColumns.sellVolume, colDef: colSettings.numberSmVolume }
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column4, props),
                children: [
                    { col: transactionCoverageSoldColumns.totalUnits, colDef: colSettings.numberSmUnits },
                    { col: transactionCoverageSoldColumns.totalVolume, colDef: colSettings.numberSmVolume },
                    { col: transactionCoverageSoldColumns.totalUnitsPct, colDef: colSettings.numberSmPercentage },
                    { col: transactionCoverageSoldColumns.totalVolumePct, colDef: colSettings.numberSmPercentage }
                ]
            }
        ]
    },
    [tableViewNames.transactionCoverageUc]: {
        id: tableViewNames.transactionCoverageUc,
        showPagination: true,
        paginationOptions: {
            sizePerPage: 10
        },
        defaultSort: { colId: transactionCoverageUcColumns.listVolume.id, sortDir: 'desc' },
        tables: [
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column1, props),
                children: [
                    {
                        col: transactionCoverageUcColumns.area,
                        colDef: colSettings.textMd,
                        cellRenderer: cellRenderers.areaTransactionCoverageLink
                    },
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                children: [
                    { col: transactionCoverageUcColumns.listUnits, colDef: colSettings.numberSmUnits },
                    { col: transactionCoverageUcColumns.listVolume, colDef: colSettings.numberSmVolume },
                    { col: transactionCoverageUcColumns.totalUnitsPct, colDef: colSettings.numberSmPercentage },
                    { col: transactionCoverageUcColumns.totalVolumePct, colDef: colSettings.numberSmPercentage }
                ]
            }
        ]
    },
    [tableViewNames.transactionCoverageForSale]: {
        id: tableViewNames.transactionCoverageForSale,
        showPagination: true,
        paginationOptions: {
            sizePerPage: 10
        },
        defaultSort: { colId: transactionCoverageForSaleColumns.listVolume.id, sortDir: 'desc' },
        tables: [
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column1, props),
                children: [
                    {
                        col: transactionCoverageForSaleColumns.area,
                        colDef: colSettings.textMd,
                        cellRenderer: cellRenderers.areaTransactionCoverageLink
                    },
                ]
            },
            {
                headerGroupTitle: (props) => getAdditionalTableHeader(additionalTableHeaders.column2, props),
                children: [
                    { col: transactionCoverageForSaleColumns.listUnits, colDef: colSettings.numberSmUnits },
                    { col: transactionCoverageForSaleColumns.listVolume, colDef: colSettings.numberSmVolume },
                    { col: transactionCoverageForSaleColumns.totalUnitsPct, colDef: colSettings.numberSmPercentage },
                    { col: transactionCoverageForSaleColumns.totalVolumePct, colDef: colSettings.numberSmPercentage }
                ]
            }
        ]
    },
    [tableViewNames.listingProficiency]: listingProficiencyView(tableViewCommonDependencies),
    [tableViewNames.availableAgents]: availableAgentsView(tableViewCommonDependencies),
    [tableViewNames.addedAgents]: addedAgentsView(tableViewCommonDependencies),
    [tableViewNames.officeHistory]: officeHistoryView(tableViewCommonDependencies),
    [tableViewNames.agentCoverageListingForSale]: agentCoverageListingForSaleView(tableViewCommonDependencies),
    [tableViewNames.agentCoverageListingSold]: agentCoverageListingSoldView(tableViewCommonDependencies),
    [tableViewNames.agentCoverageListingUc]: agentCoverageListingUcView(tableViewCommonDependencies),
    [tableViewNames.agentProductionListingTotalSold]: agentProductionListingView(tableViewNames.agentProductionListingTotalSold, tableViewCommonDependencies),
    [tableViewNames.agentProductionListingListSide]: agentProductionListingView(tableViewNames.agentProductionListingListSide, tableViewCommonDependencies),
    [tableViewNames.agentProductionListingSellSide]: agentProductionListingView(tableViewNames.agentProductionListingSellSide, tableViewCommonDependencies),
    [lv.avg$Sqft.value]: lv.avg$Sqft.tableSettings,
    [lv.avgDomCdom.value]: lv.avgDomCdom.tableSettings,
    [lv.avgSpLpComparison.value]: lv.avgSpLpComparison.tableSettings,
    [lv.avgSpOpAllComparison.value]: lv.avgSpOpAllComparison.tableSettings,
    [lv.avgSpOpAllProperties.value]: lv.avgSpOpAllProperties.tableSettings,
    [lv.avgSpOpComparison.value]: lv.avgSpOpComparison.tableSettings,
    [lv.cdomBreakout.value]: lv.cdomBreakout.tableSettings,
    [lv.forSaleVsFsldm.value]: lv.forSaleVsFsldm.tableSettings,
    [lv.medianPrice.value]: lv.medianPrice.tableSettings,
    [lv.monthlySupplyOfInventory.value]: lv.monthlySupplyOfInventory.tableSettings,
    [lv.salesAbsorption.value]: lv.salesAbsorption.tableSettings,
    [lv.soldAvgVsMedianPrice.value]: lv.soldAvgVsMedianPrice.tableSettings,
    [lv.supplyAmpDemandNumUnits.value]: lv.supplyAmpDemandNumUnits.tableSettings,
    [lv.underContractUc.value]: lv.underContractUc.tableSettings,
};
