import { modules, searchTerms } from '../../constants';

export const GROUP_FILTERS = Object.freeze({
    COMPARISON_SET: {
        id: searchTerms.comparisonSetFilter
    }
});

export const allFilterGroups = [
    {
        title: searchTerms.required,
        filters: [
            {
                id: searchTerms.mlsFilter,
                name: searchTerms.mls,
                permanent: true,
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.proficiencyMetrics.agents,
                    modules.proficiencyMetrics.offices,
                    modules.marketShare.totals,
                    modules.marketShare.coverage,
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: searchTerms.areaTypeFilter,
                name: searchTerms.areaType,
                path: 'computedFields/areaType',
                permanent: true,
                modules: [
                    modules.marketShare.coverage
                ]
            },
            {
                id: searchTerms.marketAreaFilter,
                name: {
                    [modules.proficiencyMetrics.transactions]: searchTerms.marketArea,
                    [modules.marketShare.totals]: searchTerms.marketArea,
                    [modules.marketDynamics.marketDynamics]: searchTerms.areaType
                },
                permanent: true,
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.marketShare.totals,
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: searchTerms.propTypeFilter,
                name: searchTerms.propertyType,
                permanent: true,
                path: 'searchFields/propertyType',
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.proficiencyMetrics.agents,
                    modules.marketShare.totals,
                    modules.marketShare.coverage,
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: searchTerms.timeFrameFilter,
                name: searchTerms.timeFrame,
                permanent: true,
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.proficiencyMetrics.agents,
                    modules.proficiencyMetrics.offices,
                    modules.marketShare.totals,
                    modules.marketShare.coverage,
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: searchTerms.listingStatusFilter,
                name: searchTerms.listingStatus,
                permanent: true,
                modules: [
                    modules.marketShare.totals,
                    modules.marketShare.coverage
                ],
                path: 'computedFields/transactionStatus'
            },
            {
                id: searchTerms.officesFilter,
                name: searchTerms.offices,
                permanent: true,
                modules: [
                    modules.proficiencyMetrics.offices,
                    modules.marketShare.coverage
                ],
                path: 'idFiltering/idType'
            },
            {
                id: searchTerms.agentsFilter,
                name: searchTerms.agents,
                permanent: true,
                modules: [modules.proficiencyMetrics.agents],
                path: 'idFiltering/idType'
            }
        ]
    },
    {
        title: searchTerms.optional,
        filters: [
            {
                id: searchTerms.totalVolumeFilter,
                name: searchTerms.totalVolume,
                path: 'computedFields/totalVolume',
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.proficiencyMetrics.offices,
                ]
            },
            {
                id: searchTerms.soldPriceFilter,
                name: searchTerms.soldPriceRange,
                path: 'searchFields/soldPrice',
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.proficiencyMetrics.agents,
                    modules.proficiencyMetrics.offices
                ]
            },
            {
                id: searchTerms.priceRangeFilter,
                name: searchTerms.priceRange,
                path: 'searchFields/lastPrice',
                modules: [
                    modules.marketShare.totals,
                    modules.marketShare.coverage,
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: searchTerms.totalUnitsFilter,
                name: searchTerms.totalUnits,
                path: 'computedFields/totalUnits',
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.proficiencyMetrics.offices,
                ]
            },
            {
                id: searchTerms.fullBathroomsFilter,
                name: searchTerms.fullBathrooms,
                path: 'searchFields/fullBathrooms',
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.marketShare.totals,
                    modules.marketShare.coverage,
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: searchTerms.bedroomsFilter,
                name: searchTerms.bedrooms,
                path: 'searchFields/bedrooms',
                modules: [
                    modules.proficiencyMetrics.transactions,
                    modules.marketShare.totals,
                    modules.marketShare.coverage,
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: searchTerms.squareFootageFilter,
                name: searchTerms.squareFootage,
                path: 'searchFields/squareFeet',
                modules: [
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: searchTerms.lotSizeFilter,
                name: searchTerms.lotSize,
                path: 'searchFields/lotSize',
                modules: [
                    modules.marketDynamics.marketDynamics
                ]
            },
            {
                id: GROUP_FILTERS.COMPARISON_SET.id,
                name: searchTerms.comparisonSet,
                path: 'searchFields/comparisonSet',
                modules: [
                    modules.marketShare.totals
                ]
            }
        ]
    }
];
