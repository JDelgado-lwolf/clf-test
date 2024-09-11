import React from 'react';
import { Link } from 'react-router-dom';
import {
    formatInteger,
    formatPercentage,
    formatVolume,
    getDecimalNumber,
    formatPercent,
    shortDateFormatWithSlashes,
    boolToShortString,
    formatClr
} from '../../agent-production/helpers/dataFormatters';
import { Routes } from '../../common/routes/routes';
import CustomGridHeader from '../components/common/CustomGridHeader';
import { uriEncode } from '../helpers/helpers';
import { marketShareTerms } from './index';
import { marketShareColumns } from './marketShareColumns';
import { getCustomPinnedRow } from '../helpers/gridColumns';
import {
    csvFormats,
    getCalculatedPct,
    getColumnSum,
    getEncodedCellValue,
    getPinnedCellValue
} from '../../common/helpers/agGrid';
import { agentProductionTerms } from '../../constants';
import { unitWidth } from '../../common/components/table/agGrid/colSettings';
import { OfficeGroupName } from '../components/cellRenderers/OfficeGroupName';
import { OfficeName } from '../components/cellRenderers/OfficeName';

export const gridDefaultProps = {
    pagination: true,
    paginationPageSize: 10
};

export const defaultColumnDef = {
    sortable: true,
    resizable: true,
    minWidth: 120,
    flex: 1
};

export const  agGridComponents = {
    agColumnHeader: CustomGridHeader
};

export const columnDefaults = {
    cellClass: '',
    sortable: true,
    headerClass: 'font-weight-bold',
    sortingOrder: ['asc', 'desc'],
    suppressMenu: true,
    cellRendererSelector: getCustomPinnedRow
};

export const gridClasses = {
    cellNumber: 'td-num',
    headerNumber: 'header-number'
};

export const colSettingsNumber = {
    cellClass: gridClasses.cellNumber,
    headerClass: `align-top no-wrap ${gridClasses.headerNumber}`,
    sortable: true,
    width: unitWidth.compact,
    sortingOrder: ['asc', 'desc'],
    suppressMenu: true,
    resizable: true,
    cellRendererSelector: getCustomPinnedRow
};

export const valueFormatters = {
    decimalNumber: { valueFormatter: v => getDecimalNumber(v.value) },
    percentage: { valueFormatter: v => formatPercentage(v.value) },
    centuplePercentage: { valueFormatter: v => formatPercent(v.value, 2) },
    volume: { valueFormatter: v => formatVolume(v.value) },
    integer: { valueFormatter: v => formatInteger(v.value) },
    clrFormatter: { valueFormatter: v => formatClr(v.value) },
    dateFormat: { valueFormatter: v => shortDateFormatWithSlashes(v.value) },
    bankStatus: { valueFormatter: v => boolToShortString(v.value) }
};

const caseInsensitiveComparator = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());

export const colSettingsName = {
    ...columnDefaults,
    floatingFilter: true,
    comparator: caseInsensitiveComparator,
    filter: 'agTextColumnFilter'
};

export const colSettingsVolume = {
    ...colSettingsNumber,
    ...valueFormatters.volume,
    minWidth: 180
};

const pinnedRowSettingsCalculatedPct = {
    totalsSearch: {
        getFieldValue: getCalculatedPct
    },
    coverageSearch: {
        getFieldValue: getPinnedCellValue
    }
};

const pinnedRowSettingsEmptyCell = {
    cellValue: getEncodedCellValue('')
};

export const gridColumnDefinitions = Object.freeze({
    [marketShareColumns.officeId.id]: {
        field: marketShareColumns.officeId.id,
        minWidth: 140,
        headerName: marketShareTerms.officeId,
        ...columnDefaults
    },
    [marketShareColumns.officeName.id]: {
        field: marketShareColumns.officeName.id,
        minWidth: unitWidth.large,
        headerName: marketShareColumns.officeName.label,
        exportHeaderLabel: marketShareTerms.officeName,
        ...colSettingsName,
        cellRenderer: (props) => <OfficeName {...props} />,
        pinnedRowSettings: {
            'default': {
                cellValue: agentProductionTerms.totalsAverages
            }
        }
    },
    [marketShareColumns.office.id]: {
        field: marketShareColumns.officeName.id,
        minWidth: 320,
        headerName: marketShareColumns.office.label,
        ...colSettingsName
    },
    /* Address Group */
    [marketShareColumns.streetName1.id]: {
        field: marketShareColumns.streetName1.id,
        minWidth: 260,
        headerName: marketShareColumns.streetName1.label,
        ...columnDefaults
    },
    [marketShareColumns.streetName.id]: {
        field: marketShareColumns.streetName.id,
        minWidth: 260,
        headerName: marketShareColumns.streetName.label,
        ...columnDefaults
    },
    [marketShareColumns.streetNum.id]: {
        field: marketShareColumns.streetNum.id,
        headerName: marketShareColumns.streetNum.label,
        ...columnDefaults
    },
    [marketShareColumns.address.id]: {
        field: marketShareColumns.address.id,
        minWidth: 230,
        headerName: marketShareColumns.address.label,
        ...columnDefaults,
        cellRenderer: (props) => {
            const addressParam = uriEncode(props.data.address);
            return (
                <Link
                    to={{
                        pathname: `${Routes.MARKET_SHARE.BASE}${Routes.MARKET_SHARE.LISTING_INFO}`,
                        search: `?mlsNum=${props.data.mlsNum}&address=${addressParam}&id=${props.data.areaId}`,
                        state: {
                            id: props.data.areaId,
                            office: addressParam,
                            listingTypeId: props.data.listingTypeId
                        }
                    }}>
                    {props.value}
                </Link>
            );
        }
    },
    [marketShareColumns.listOfficeId.id]: {
        field: marketShareColumns.listOfficeId.id,
        headerName: marketShareColumns.listOfficeId.label,
        ...colSettingsName,
        minWidth: unitWidth.moderate
    },
    [marketShareColumns.listOfficeName.id]: {
        field: marketShareColumns.listOfficeName.id,
        headerName: marketShareColumns.listOfficeName.label,
        ...colSettingsName,
        minWidth: 200
    },
    [marketShareColumns.sellOfficeId.id]: {
        field: marketShareColumns.sellOfficeId.id,
        headerName: marketShareColumns.sellOfficeId.label,
        ...colSettingsName,
        minWidth: unitWidth.moderate
    },
    [marketShareColumns.sellOfficeName.id]: {
        field: marketShareColumns.sellOfficeName.id,
        headerName: marketShareColumns.sellOfficeName.label,
        ...colSettingsName,
        minWidth: 200
    },
    [marketShareColumns.averageDom.id]: {
        field: marketShareColumns.averageDom.id,
        headerName: marketShareColumns.averageDom.label,
        minWidth: unitWidth.dom,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.integer.format,
        width: unitWidth.small,
        pinnedRowSettings: {
            'default': {
                keyField: marketShareColumns.avgDom.id
            }
        }
    },
    [marketShareColumns.avgDom.id]: {
        field: marketShareColumns.avgDom.id,
        headerName: marketShareColumns.averageDom.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.integer.format,
        minWidth: unitWidth.dom
    },
    [marketShareColumns.underContractVolume.id]: {
        field: marketShareColumns.underContractVolume.id,
        headerName: marketShareTerms.underContract$,
        exportHeaderLabel: marketShareTerms.underContractVolume,
        minWidth: 200,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.ucVolumeAlt.id]: {
        field: marketShareColumns.ucVolumeAlt.keyField,
        headerName: marketShareTerms.underContract$,
        exportHeaderLabel: marketShareTerms.underContractVolume,
        minWidth: 200,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.underContractUnits.id]: {
        field: marketShareColumns.underContractUnits.id,
        headerName: marketShareTerms.underContractNum,
        exportHeaderLabel: marketShareTerms.underContractUnits,
        minWidth: 200,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.decimal.format
    },
    [marketShareColumns.ucUnitsAlt.id]: {
        field: marketShareColumns.ucUnitsAlt.keyField,
        headerName: marketShareTerms.underContractNum,
        exportHeaderLabel: marketShareTerms.underContractUnits,
        minWidth: 200,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.decimal.format
    },
    [marketShareColumns.newListingVolume.id]: {
        field: marketShareColumns.newListingVolume.id,
        headerName: marketShareTerms.newListing$,
        exportHeaderLabel: marketShareTerms.newListingVolume,
        ...colSettingsVolume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.newVolume.id]: {
        field: marketShareColumns.newVolume.keyField,
        headerName: marketShareTerms.newListing$,
        exportHeaderLabel: marketShareTerms.newListingVolume,
        ...colSettingsVolume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.newListingUnits.id]: {
        field: marketShareColumns.newListingUnits.id,
        headerName: marketShareTerms.newListingNum,
        exportHeaderLabel: marketShareTerms.newListingUnits,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.decimal.format,
        width: unitWidth.small
    },
    [marketShareColumns.newUnits.id]: {
        field: marketShareColumns.newUnits.keyField,
        headerName: marketShareTerms.newListingNum,
        exportHeaderLabel: marketShareTerms.newListingUnits,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.decimal.format,
        width: unitWidth.small
    },
    [marketShareColumns.forSaleVolume.id]: {
        field: marketShareColumns.forSaleVolume.id,
        headerName: marketShareTerms.forSale$,
        ...colSettingsVolume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.fsVolume.id]: {
        field: marketShareColumns.fsVolume.keyField,
        headerName: marketShareTerms.forSale$,
        ...colSettingsVolume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.forSaleUnits.id]: {
        field: marketShareColumns.forSaleUnits.id,
        headerName: marketShareTerms.forSaleNum,
        minWidth: 190,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.decimal.format,
        width: unitWidth.small
    },
    [marketShareColumns.fsUnits.id]: {
        field: marketShareColumns.fsUnits.keyField,
        headerName: marketShareTerms.forSaleNum,
        minWidth: 140,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.decimal.format
    },
    [marketShareColumns.averagePrice.id]: {
        field: marketShareColumns.averagePrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        minWidth: unitWidth.compact,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format,
        pinnedRowSettings: {
            totalsSearch: {
                keyField: marketShareColumns.avgPrice.id
            },
            coverageSearch: {
                keyField: marketShareColumns.avgPrice.id
            }
        }
    },
    [marketShareColumns.avgPrice.id]: {
        field: marketShareColumns.avgPrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth: unitWidth.compact,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.agentCount.id]: {
        field: marketShareColumns.agentCount.id,
        headerName: marketShareColumns.agentCount.label,
        ...colSettingsNumber,
        exportFormatter: csvFormats.integer.format,
        ...valueFormatters.integer,
        width: unitWidth.small
    },
    [marketShareColumns.mlsAgentCount.id]: {
        field: marketShareColumns.mlsAgentCount.id,
        headerName: marketShareColumns.agentCount.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        width: unitWidth.small,
        pinnedRowSettings: {
            'default': pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.city.id]: {
        field: marketShareColumns.city.id,
        headerName: marketShareColumns.city.label,
        minWidth: 190,
        ...columnDefaults
    },
    [marketShareColumns.stateCode.id]: {
        field: marketShareColumns.stateCode.id,
        minWidth: 73,
        headerName: marketShareColumns.stateCode.label,
        ...columnDefaults
    },
    [marketShareColumns.zipCode.id]: {
        field: marketShareColumns.zipCode.id,
        minWidth: 93,
        headerName: marketShareColumns.zipCode.label,
        ...columnDefaults
    },
    [marketShareColumns.zipcode.id]: {
        field: marketShareColumns.zipcode.id,
        minWidth: 93,
        headerName: marketShareColumns.zipcode.label,
        ...columnDefaults
    },
    [marketShareColumns.county.id]: {
        field: marketShareColumns.county.id,
        minWidth: unitWidth.regular,
        headerName: marketShareColumns.county.label,
        ...columnDefaults
    },
    [marketShareColumns.phoneNumber.id]: {
        field: marketShareColumns.phoneNumber.id,
        minWidth: 150,
        headerName: marketShareColumns.phoneNumber.label,
        ...columnDefaults
    },
    [marketShareColumns.brokerName.id]: {
        field: marketShareColumns.brokerName.id,
        headerName: marketShareColumns.brokerName.label,
        minWidth: unitWidth.large,
        ...colSettingsName,
        cellRenderer: (props) => {
            const brokerageParam = encodeURIComponent(props.data.brokerName);
            return <Link to={{
                pathname: `${Routes.MARKET_SHARE.BASE}${Routes.MARKET_SHARE.TOTALS}${Routes.MARKET_SHARE.OFFICES_BREAKDOWN}`,
                search: `?brokerage=${brokerageParam}&id=${props.data.brokerId}&view=${props.data.listingViewId}`,
                state: {
                    brokerage: brokerageParam,
                    id: props.data.brokerId,
                    type: props.data.listingTypeId,
                    sumOfColumn: props.data.sumOfColumn,
                    rowCount: props.data.rowCount
                }
            }}>
                {props.value}
            </Link>;
        },
        pinnedRowSettings: {
            'default': {
                cellValue: agentProductionTerms.totalsAverages
            }
        }
    },
    [marketShareColumns.listVolume.id]: {
        field: marketShareColumns.listVolume.id,
        headerName: marketShareColumns.listVolume.label,
        exportHeaderLabel: marketShareTerms.listSideVolume,
        ...colSettingsVolume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.listUnits.id]: {
        field: marketShareColumns.listUnits.id,
        headerName: marketShareColumns.listUnits.label,
        exportHeaderLabel: marketShareTerms.listSideUnit,
        ...colSettingsNumber,
        ...valueFormatters.decimalNumber,
        exportFormatter: csvFormats.decimal.format,
        width: unitWidth.small
    },
    [marketShareColumns.sellVolume.id]: {
        field: marketShareColumns.sellVolume.id,
        headerName: marketShareColumns.sellVolume.label,
        exportHeaderLabel: marketShareTerms.sellSideVolume,
        ...colSettingsVolume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.sellUnits.id]: {
        field: marketShareColumns.sellUnits.id,
        headerName: marketShareColumns.sellUnits.label,
        exportHeaderLabel: marketShareTerms.sellSideUnit,
        ...colSettingsNumber,
        ...valueFormatters.decimalNumber,
        exportFormatter: csvFormats.decimal.format,
        width: unitWidth.small
    },
    [marketShareColumns.totalVolume.id]: {
        field: marketShareColumns.totalVolume.id,
        headerName: marketShareTerms.total$,
        ...colSettingsVolume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.totalUnits.id]: {
        field: marketShareColumns.totalUnits.id,
        headerName: marketShareColumns.totalUnits.label,
        minWidth: 140,
        ...colSettingsNumber,
        ...valueFormatters.decimalNumber,
        exportFormatter: csvFormats.decimal.format,
        width: 110
    },
    [marketShareColumns.totalAverageDom.id]: {
        field: marketShareColumns.totalAverageDom.id,
        headerName: marketShareColumns.totalAverageDom.label,
        minWidth: unitWidth.dom,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.integer.format,
        width: unitWidth.small
    },
    [marketShareColumns.officeCount.id]: {
        field: marketShareColumns.officeCount.id,
        headerName: marketShareColumns.officeCount.label,
        minWidth: unitWidth.compact,
        ...colSettingsNumber
    },
    [marketShareColumns.mlsOfficeCount.id]: {
        field: marketShareColumns.mlsOfficeCount.id,
        headerName: marketShareColumns.officeCount.label,
        minWidth: unitWidth.compact,
        ...colSettingsNumber,
        pinnedRowSettings: {
            'default': pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.avgListDom.id]: {
        field: marketShareColumns.avgListDom.id,
        headerName: marketShareColumns.avgListDom.label,
        maxWidth: unitWidth.dom,
        minWidth: unitWidth.dom,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.integer.format,
        pinnedRowSettings: {
            coverageSearch: {
                keyField: marketShareColumns.avgDom.id
            }
        }
    },
    [marketShareColumns.listAverageDom.id]: {
        field: marketShareColumns.listAverageDom.id,
        headerName: marketShareColumns.avgListDom.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        minWidth: unitWidth.dom,
        exportFormatter: csvFormats.integer.format,
        pinnedRowSettings: {
            'default': {
                keyField: 'listAvgDom'
            }
        }
    },
    [marketShareColumns.avgSellDom.id]: {
        field: marketShareColumns.avgSellDom.id,
        headerName: marketShareColumns.avgSellDom.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.integer.format,
        width: unitWidth.small
    },
    [marketShareColumns.listAvgPrice.id]: {
        field: marketShareColumns.listAvgPrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth:unitWidth.compact,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.listAveragePrice.id]: {
        field: marketShareColumns.listAveragePrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        minWidth:unitWidth.compact,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format,
        pinnedRowSettings: {
            totalsSearch: {
                keyField: marketShareColumns.listAvgPrice.id
            },
            coverageSearch: {
                keyField: marketShareColumns.listAvgPrice.id
            }
        }
    },
    [marketShareColumns.sellAveragePrice.id]: {
        field: marketShareColumns.sellAveragePrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth: unitWidth.compact,
        exportFormatter: csvFormats.volume.format,
        pinnedRowSettings: {
            totalsSearch: {
                keyField: marketShareColumns.sellAvgPrice.id
            },
            coverageSearch: {
                keyField: marketShareColumns.sellAvgPrice.id
            }
        }
    },
    [marketShareColumns.totalAvgPrice.id]: {
        field: marketShareColumns.totalAvgPrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        minWidth: unitWidth.compact,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format,
        pinnedRowSettings: {
            coverageSearch: {
                altKeyField: 'actAvgPrice'
            }
        }
    },
    [marketShareColumns.totalAveragePrice.id]: {
        field: marketShareColumns.totalAveragePrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format,
        minWidth:unitWidth.compact,
        pinnedRowSettings: {
            totalsSearch: {
                keyField: marketShareColumns.totalAvgPrice.id
            },
            coverageSearch: {
                keyField: marketShareColumns.totalAvgPrice.id
            }
        }
    },
    [marketShareColumns.listAvgPrice.id]: {
        field: marketShareColumns.listAvgPrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        minWidth:unitWidth.compact,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.sellAvgPrice.id]: {
        field: marketShareColumns.sellAvgPrice.id,
        headerName: marketShareTerms.avg$,
        exportHeaderLabel: marketShareTerms.avgPrice,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format
    },
    [marketShareColumns.spOp.id]: {
        field: marketShareColumns.spOp.id,
        headerName: marketShareColumns.spOp.label,
        exportHeaderLabel: marketShareTerms.spOpPct,
        minWidth: 100,
        ...colSettingsNumber,
        ...valueFormatters.percentage,
        exportFormatter: csvFormats.percentage.format
    },
    [marketShareColumns.spop.id]: {
        field: marketShareColumns.spop.id,
        headerName: marketShareColumns.spop.label,
        exportHeaderLabel: marketShareTerms.spOpPct,
        exportFormatter: csvFormats.percent2Decimals.format,
        ...colSettingsNumber,
        ...valueFormatters.centuplePercentage
    },
    [marketShareColumns.splp.id]: {
        field: marketShareColumns.splp.id,
        headerName: marketShareColumns.splp.label,
        exportHeaderLabel: marketShareColumns.spLp.label,
        exportFormatter: csvFormats.percent2Decimals.format,
        ...colSettingsNumber,
        ...valueFormatters.centuplePercentage
    },
    [marketShareColumns.listSpop.id]: {
        field: marketShareColumns.listSpop.id,
        headerName: marketShareColumns.listSpop.label,
        exportHeaderLabel: marketShareTerms.spOpPct,
        ...colSettingsNumber,
        ...valueFormatters.percentage,
        exportFormatter: csvFormats.percent2Decimals.format,
        pinnedRowSettings: {
            totalsSearch: {
                total: {
                    keyField: marketShareColumns.listSpop.id,
                    getFieldValue: getCalculatedPct
                },
                breakdown: {
                    keyField: marketShareColumns.listSpop.id,
                    getFieldValue: getPinnedCellValue
                }
            },
            coverageSearch: {
                total: {
                    keyField: marketShareColumns.listSpop.id,
                    getFieldValue: getCalculatedPct
                },
                breakdown: {
                    keyField: marketShareColumns.listSpop.id,
                    getFieldValue: getPinnedCellValue
                }
            }
        }
    },
    [marketShareColumns.sellSpop.id]: {
        field: marketShareColumns.sellSpop.id,
        headerName: marketShareColumns.sellSpop.label,
        exportHeaderLabel: marketShareTerms.spOpPct,
        ...colSettingsNumber,
        ...valueFormatters.percentage,
        exportFormatter: csvFormats.percent2Decimals.format,
        pinnedRowSettings: {
            totalsSearch: {
                total: {
                    keyField: marketShareColumns.sellSpop.id,
                    getFieldValue: getCalculatedPct
                },
                breakdown: {
                    keyField: marketShareColumns.sellSpop.id,
                    getFieldValue: getPinnedCellValue
                }
            },
            coverageSearch: {
                total: {
                    keyField: marketShareColumns.sellSpop.id,
                    getFieldValue: getCalculatedPct
                },
                breakdown: {
                    keyField: marketShareColumns.sellSpop.id,
                    getFieldValue: getPinnedCellValue
                }
            }
        }
    },
    [marketShareColumns.prodAgentTotalUnits.id]: {
        field: marketShareColumns.prodAgentTotalUnits.id,
        headerName: marketShareTerms.prodAgentUnits,
        minWidth: 100,
        ...colSettingsNumber,
        ...valueFormatters.decimalNumber,
        exportFormatter: csvFormats.decimal.format,
        width: unitWidth.small,
        pinnedRowSettings: {
            'default': pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.prodAgentSellUnits.id]: {
        field: marketShareColumns.prodAgentSellUnits.id,
        headerName: marketShareTerms.prodAgentUnits,
        ...colSettingsNumber,
        ...valueFormatters.decimalNumber,
        exportFormatter: csvFormats.decimal.format,
        width: unitWidth.small,
        pinnedRowSettings: {
            totalsSearch: pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.prodAgentTotalVolume.id]: {
        field: marketShareColumns.prodAgentTotalVolume.id,
        headerName: marketShareTerms.prodAgentVolume,
        minWidth: 140,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format,
        pinnedRowSettings: {
            totalsSearch: pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.prodAgentVolume.id]: {
        field: marketShareColumns.prodAgentVolume.id,
        headerName: marketShareTerms.prodAgentVolume,
        minWidth: 140,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        exportFormatter: csvFormats.volume.format,
        pinnedRowSettings: {
            totalsSearch: pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.prodAgentUnits.id]: {
        field: marketShareColumns.prodAgentUnits.id,
        headerName: marketShareTerms.prodAgentUnits,
        minWidth: 100,
        ...colSettingsNumber,
        ...valueFormatters.decimalNumber,
        exportFormatter: csvFormats.decimal.format,
        width: unitWidth.small,
        pinnedRowSettings: {
            'default': pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.prodAgentSellVolume.id]: {
        field: marketShareColumns.prodAgentSellVolume.id,
        headerName: marketShareTerms.prodAgentVolume,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth: unitWidth.compact,
        exportFormatter: csvFormats.volume.format,
        pinnedRowSettings: {
            totalsSearch: pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.prodAgentListUnits.id]: {
        field: marketShareColumns.prodAgentListUnits.id,
        headerName: marketShareTerms.prodAgentUnits,
        ...colSettingsNumber,
        ...valueFormatters.decimalNumber,
        exportFormatter: csvFormats.decimal.format,
        pinnedRowSettings: {
            totalsSearch: pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.prodAgentListVolume.id]: {
        field: marketShareColumns.prodAgentListVolume.id,
        headerName: marketShareTerms.prodAgentVolume,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth: unitWidth.compact,
        exportFormatter: csvFormats.volume.format,
        pinnedRowSettings: {
            totalsSearch: pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.clr.id]: {
        field: marketShareColumns.clr.id,
        headerName: marketShareTerms.clrPct,
        minWidth: 100,
        ...colSettingsNumber,
        ...valueFormatters.clrFormatter,
        width: unitWidth.small,
        exportFormatter: csvFormats.percentageEmptyCell.format,
        pinnedRowSettings: {
            totalsSearch: {
                total: {
                    keyField: marketShareColumns.clr.id,
                    getFieldValue: getPinnedCellValue
                },
                breakdown: {
                    keyField: marketShareColumns.closeListRatio.id,
                    getFieldValue: getPinnedCellValue
                }
            },
            coverageSearch: {
                total: {
                    keyField: marketShareColumns.closeListRatio.id,
                    getFieldValue: getPinnedCellValue
                }
            }
        }
    },
    [marketShareColumns.closeListRatio.id]: {
        field: marketShareColumns.closeListRatio.id,
        headerName: marketShareTerms.clrPct,
        minWidth: 100,
        ...colSettingsNumber,
        ...valueFormatters.percentage,
        exportFormatter: csvFormats.percent2Decimals.format,
        width: unitWidth.small,
        pinnedRowSettings: {
            coverageSearch: {
                total: {
                    keyField: marketShareColumns.clr.id,
                    getFieldValue: getPinnedCellValue
                },
                breakdown: {
                    keyField: marketShareColumns.closeListRatio.id,
                    getFieldValue: getPinnedCellValue
                }
            }
        }
    },
    [marketShareColumns.marketSharePct.id]: {
        field: marketShareColumns.marketSharePct.id,
        headerName: marketShareTerms.mktPct,
        minWidth: 100,
        ...colSettingsNumber,
        ...valueFormatters.percentage,
        exportFormatter: csvFormats.percent2Decimals.format,
        width: unitWidth.small,
        pinnedRowSettings: {
            'default': {
                getFieldValue: getColumnSum
            }
        }
    },
    [marketShareColumns.unitSharePct.id]: {
        field: marketShareColumns.unitSharePct.id,
        headerName: marketShareTerms.unitPct,
        minWidth: 110,
        ...colSettingsNumber,
        ...valueFormatters.percentage,
        exportFormatter: csvFormats.percentage.format,
        width: unitWidth.small,
        pinnedRowSettings: {
            coverageSearch: {
                getFieldValue: getColumnSum
            }
        }
    },
    [marketShareColumns.volumeSharePct.id]: {
        field: marketShareColumns.volumeSharePct.id,
        headerName: marketShareTerms.volumePct,
        minWidth: unitWidth.compact,
        ...colSettingsNumber,
        ...valueFormatters.percentage,
        exportFormatter: csvFormats.percentage.format,
        pinnedRowSettings: {
            coverageSearch: {
                getFieldValue: getColumnSum
            }
        }
    },
    [marketShareColumns.prodAgentCount.id]: {
        field: marketShareColumns.prodAgentCount.id,
        headerName: marketShareTerms.prodAgentCount,
        exportHeaderLabel: marketShareTerms.prodAgents,
        minWidth: unitWidth.small,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        width: unitWidth.small,
        pinnedRowSettings: {
            totalsSearch: {
                keyField: marketShareColumns.prodAgentCount.id
            }
        }
    },
    [marketShareColumns.prodAgentSearchCount.id]: {
        field: marketShareColumns.prodAgentSearchCount.id,
        headerName: marketShareTerms.prodAgentCount,
        exportHeaderLabel: marketShareTerms.prodAgents,
        minWidth: unitWidth.small,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        pinnedRowSettings: {
            'default': {
                getFieldValue: getColumnSum
            }
        }
    },
    [marketShareColumns.listProdAgentSearchCount.id]: {
        field: marketShareColumns.listProdAgentSearchCount.id,
        headerName: marketShareTerms.prodAgentCount,
        exportHeaderLabel: marketShareTerms.prodAgents,
        minWidth: unitWidth.small,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        pinnedRowSettings: {
            totalsSearch: {
                keyField: marketShareColumns.prodAgentCount.id
            },
            coverageSearch: pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.sellProdAgentSearchCount.id]: {
        field: marketShareColumns.sellProdAgentSearchCount.id,
        headerName: marketShareTerms.prodAgentCount,
        exportHeaderLabel: marketShareTerms.prodAgents,
        minWidth: unitWidth.small,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        pinnedRowSettings: {
            'default': pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.totalProdAgentSearchCount.id]: {
        field: marketShareColumns.totalProdAgentSearchCount.id,
        headerName: marketShareTerms.prodAgentCount,
        exportHeaderLabel: marketShareTerms.prodAgents,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        width: unitWidth.small,
        pinnedRowSettings: {
            totalsSearch: {
                keyField: marketShareColumns.prodAgentCount.id
            },
            coverageSearch: pinnedRowSettingsEmptyCell
        }
    },
    [marketShareColumns.area.id]: {
        field: marketShareColumns.area.id,
        headerName: marketShareColumns.area.label,
        minWidth: unitWidth.large,
        ...columnDefaults,
        cellRenderer: (props) => {
            if (!props.data?.areaId) return props.data?.area;
            return <Link to={{
                pathname: `${Routes.MARKET_SHARE.BASE}${Routes.MARKET_SHARE.COVERAGE}${Routes.MARKET_SHARE.OFFICES_BREAKDOWN}`,
                search: `?areaId=${encodeURIComponent(props.data.areaId)}&view=${props.data.listingViewId}`,
                state: {
                    id: props.data.areaId,
                    area: props.data.area,
                    type: props.data.listingTypeId,
                    sumOfColumn: props.data.sumOfColumn,
                    rowCount: props.data.rowCount
                }
            }}>
                {props.value}
            </Link>;
        },
        pinnedRowSettings: {
            totalsSearch: {
                cellValue: agentProductionTerms.totalsAverages
            },
            coverageSearch: {
                cellValue: agentProductionTerms.totalsAverages
            }
        }
    },
    [marketShareColumns.mlsArea.id]: {
        field: marketShareColumns.mlsArea.id,
        headerName: marketShareColumns.area.label,
        ...columnDefaults,
        width: unitWidth.small
    },
    [marketShareColumns.rank.id]: {
        field: marketShareColumns.rank.id,
        headerName: marketShareColumns.rank.label,
        ...colSettingsNumber,
        maxWidth: 83,
        minWidth: 83
    },
    [marketShareColumns.isSelected.id]: {
        field: marketShareColumns.isSelected.id,
        headerName: '',
        ...columnDefaults,
        checkboxSelection: true,
        shouldExport: false,
        maxWidth: 45,
        minWidth: 45,
        valueFormatter: () => ''
    },
    [marketShareColumns.mlsId.id]: {
        field: marketShareColumns.mlsId.id,
        headerName: marketShareColumns.mlsId.label,
        minWidth: 85,
        maxWidth: 85,
        ...columnDefaults,
        width: unitWidth.small
    },
    [marketShareColumns.orgPrice.id]: {
        field: marketShareColumns.orgPrice.id,
        headerName: marketShareColumns.orgPrice.label,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth: unitWidth.regular
    },
    [marketShareColumns.listPrice.id]: {
        field: marketShareColumns.listPrice.id,
        headerName: marketShareColumns.listPrice.label,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth: unitWidth.compact
    },
    [marketShareColumns.price.id]: {
        field: marketShareColumns.price.id,
        headerName: marketShareColumns.price.label,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth: unitWidth.compact
    },
    [marketShareColumns.soldPrice.id]: {
        field: marketShareColumns.soldPrice.id,
        headerName: marketShareColumns.price.label,
        ...colSettingsNumber,
        ...valueFormatters.volume,
        minWidth: unitWidth.compact
    },
    [marketShareColumns.date.id]: {
        field: marketShareColumns.date.id,
        headerName: marketShareColumns.date.label,
        ...columnDefaults,
        exportFormatter: csvFormats.date.format,
        ...valueFormatters.dateFormat,
        minWidth:130
    },
    [marketShareColumns.listingStatus.id]: {
        field: marketShareColumns.listingStatus.field,
        headerName: marketShareColumns.listingStatus.label,
        exportFormatter: csvFormats.listingStatus.format
    },
    [marketShareColumns.typeName.id]: {
        field: marketShareColumns.typeName.id,
        headerName: marketShareColumns.typeName.label,
        ...columnDefaults,
        width: unitWidth.small
    },
    [marketShareColumns.mlsNum.id]: {
        field: marketShareColumns.mlsNum.id,
        headerName: marketShareColumns.mlsNum.label,
        ...columnDefaults,
        minWidth:130
    },
    [marketShareColumns.areaId.id]: {
        field: marketShareColumns.areaId.id,
        headerName: marketShareColumns.areaId.label,
        ...columnDefaults,
        width: unitWidth.small
    },
    [marketShareColumns.dom.id]: {
        field: marketShareColumns.dom.id,
        headerName: marketShareColumns.dom.label,
        minWidth: unitWidth.dom,
        ...colSettingsNumber,
        ...valueFormatters.integer
    },
    [marketShareColumns.cdom.id]: {
        field: marketShareColumns.cdom.id,
        headerName: marketShareColumns.cdom.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        width: unitWidth.small
    },
    [marketShareColumns.bankProperty.id]: {
        field: marketShareColumns.bankProperty.id,
        headerName: marketShareColumns.bankProperty.label,
        ...columnDefaults
    },
    [marketShareColumns.bankStatus.id]: {
        field: marketShareColumns.bankStatus.id,
        headerName: marketShareColumns.bankStatus.label,
        ...columnDefaults,
        exportFormatter: csvFormats.booleanShort.format,
        ...valueFormatters.bankStatus,
        minWidth: unitWidth.regular
    },
    [marketShareColumns.priceChangeCnt.id]: {
        field: marketShareColumns.priceChangeCnt.id,
        headerName: marketShareColumns.priceChangeCnt.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        minWidth: 195
    },
    [marketShareColumns.bedrooms.id]: {
        field: marketShareColumns.bedrooms.id,
        headerName: marketShareColumns.bedrooms.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.integer.format,
        width: unitWidth.small
    },
    [marketShareColumns.fullBaths.id]: {
        field: marketShareColumns.fullBaths.id,
        headerName: marketShareColumns.fullBaths.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.integer.format,
        width: unitWidth.small
    },
    [marketShareColumns.squareFt.id]: {
        field: marketShareColumns.squareFt.id,
        headerName: marketShareColumns.squareFt.label,
        ...colSettingsNumber,
        exportFormatter: csvFormats.integer.format,
        ...valueFormatters.integer
    },
    [marketShareColumns.costPerSqft.id]: {
        field: marketShareColumns.costPerSqft.id,
        headerName: marketShareColumns.costPerSqft.label,
        ...colSettingsNumber,
        exportFormatter: csvFormats.integer.format,
        ...valueFormatters.volume
    },
    [marketShareColumns.lotSizeSquareFt.id]: {
        field: marketShareColumns.lotSizeSquareFt.id,
        headerName: marketShareColumns.lotSizeSquareFt.label,
        ...colSettingsNumber,
        ...valueFormatters.integer,
        exportFormatter: csvFormats.integer.format,
        minWidth: unitWidth.moderate
    },
    [marketShareColumns.lotSizeAcres.id]: {
        field: marketShareColumns.lotSizeAcres.id,
        headerName: marketShareColumns.lotSizeAcres.label,
        ...colSettingsNumber,
        exportFormatter: csvFormats.decimal.format,
        ...valueFormatters.decimalNumber
    },
    [marketShareColumns.yearBuilt.id]: {
        field: marketShareColumns.yearBuilt.id,
        headerName: marketShareColumns.yearBuilt.label,
        ...colSettingsNumber,
        minWidth:130
    },
    [marketShareColumns.listAgent.id]: {
        field: marketShareColumns.listAgent.id,
        headerName: marketShareColumns.listAgent.label,
        minWidth: 200,
        ...colSettingsName
    },
    [marketShareColumns.sellAgent.id]: {
        field: marketShareColumns.sellAgent.id,
        headerName: marketShareColumns.sellAgent.label,
        minWidth: 200,
        ...colSettingsName
    },
    [marketShareColumns.doubleSided.id]: {
        field: marketShareColumns.doubleSided.id,
        headerName: marketShareColumns.doubleSided.label,
        minWidth: 200,
        ...columnDefaults
    },
    [marketShareColumns.groupName.id]: {
        field: marketShareColumns.groupName.id,
        headerName: marketShareColumns.groupName.label,
        minWidth: unitWidth.large,
        ...colSettingsName,
        pinnedRowSettings: {
            'default': {
                cellValue: agentProductionTerms.totalsAverages
            }
        },
        cellRenderer: (props) => <OfficeGroupName {...props} />
    },
});
