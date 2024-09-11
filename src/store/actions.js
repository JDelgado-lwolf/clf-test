import * as _ from 'lodash-es';
import {
    agentProductionTerms,
    areaRequestTypes,
    areaSearchTypes, marketShareListingStatuses, moduleRoutes,
    modules,
    modulesByRouteAndNameAssociation,
    searchTerms, searchTypes, TimePeriods, lotSizeTypes
} from '../constants';
import { getAreasMap, getMlsAgentsByIds, getPropertyTypes } from '../service/mlsInfo';
import { produce } from 'immer';
import { getFilterGroups, getFiltersByGroupTitle } from '../common/helpers/filter-list';
import {
    currencyFields, defaultPropTypeTitle,
    getAgentsTitle,
    getLotSizeTitle,
    getMarketAreaListTitle,
    getMarketAreaTitle, getOfficeListTitle, getOfficesTitle,
    getPropertyTypeTitle, getRangeTitle,
    getTimeFrameTitle
} from '../common/helpers/titles';
import { getUserSavedSearches } from '../service/savedLists';
import { getParentFromValue } from '../common/helpers/object';
import { defaultTitles, viewByModule } from './constants';
import { initialSearchState, initialView, useCommonStore } from './store';
import { isComparisonSetsEnabled } from '../common/helpers/featureToggles';
import { getComparisonSetResults, getTotalsBrokerSearch, getTotalsOfficeSearch } from '../service/market-share';
import { useComparisonSetsStore } from './comparisonSets/store';
import { getOfficesByModule } from '../common/helpers/search';
import { allFilterGroups } from '../common/constants/filter-list';
import { getSummaryPinnedData } from '../common/components/table/agGrid/pinnedRowSettings';
import { responseKeys } from '../constants/service';

const wrapCriteria = (criteria) => ({
    criteria,
    offset: 0,
    size: 0
});

const getCriteria = (realEstateDatasourceId) => wrapCriteria(realEstateDatasourceId && {
    realEstateDatasourceIdsWithFilters: [
        {
            realEstateDatasourceId: realEstateDatasourceId || -1,
            searchFields: [],
            searchAllMLS: false,
            computedFields: [],
            idFiltering: []
        }
    ]
});

const resetSelectedSavedSearch = (state) => {
    if (state?.selectedSavedSearch) {
        state.selectedSavedSearch = undefined;
        state.search = _.omit(state.search, [
            'isDefault',
            'application',
            'searchName',
            'notes',
            'module',
            'ownerId',
            'ownerType',
            'representationCriteria'
        ]);
    }
};

const setDefaultTitles = (module) => ({
        propertyTypeTitle: defaultTitles.propertyTypeTitle,
        timeFrameTitle: defaultTitles.timeFrameTitle,
        totalVolumeTitle: defaultTitles.totalVolumeTitle,
        soldPriceRangeTitle: defaultTitles.soldPriceRangeTitle,
        priceRangeTitle: defaultTitles.priceRangeTitle,
        totalUnitsTitle: defaultTitles.totalUnitsTitle,
        bedroomsTitle: defaultTitles.bedroomsTitle,
        fullBathroomsTitle: defaultTitles.fullBathroomsTitle,
        marketAreaTitle: defaultTitles.marketAreaTitle(module),
        areaTypeTitle: defaultTitles.areaTypeTitle,
        listingStatusTitle: defaultTitles.listingStatusTitle,
        officesTitle: defaultTitles.officesTitle,
        agentsTitle: defaultTitles.agentsTitle,
        lotSizeTitle: defaultTitles.lotSizeTitle,
        squareFootageTitle: defaultTitles.squareFootageTitle,
        comparisonSetTitle: defaultTitles.comparisonSetTitle
    }
);

const setOfficeDefaultTimeframe = (selectedModule, timeIntervals, mls, set) => {
    set(produce(state => {
        if (selectedModule === modules.proficiencyMetrics.offices) {
            const newTimePeriodCriteria = {
                intervalType: TimePeriods[agentProductionTerms.last12Months]
            };
            const criteria = getCriteria(mls.mlsId);
            criteria.criteria.timePeriod = newTimePeriodCriteria;
            state[selectedModule] = {
                ...state[selectedModule],
                selectedMls: mls,
                search: {
                    searchCriteria: {
                        ...criteria
                    },
                    mlsId: mls.mlsId
                },
                timeFrameTitle: getTimeFrameTitle(
                    newTimePeriodCriteria,
                    timeIntervals,
                    selectedModule
                ),
                selectedSavedSearch: undefined
            };
        }
    }), false, 'setOfficeDefaultTimeFrame');
};

const getAgentCriteriaIds = (search) => {
    return search
        .savedSearch
        .searchCriteria
        .criteria
        .realEstateDatasourceIdsWithFilters.find(i =>
            i.realEstateDatasourceId === search.savedSearch.mlsId
        )?.idFiltering?.find(o =>
            o.idType.toLowerCase() === searchTerms.agentIdType.toLowerCase()
        )?.idValues;
};

const setMls = (selectedModule, mls, timeIntervals, set, get) => {
    const isMultipleMlsUser = useCommonStore.getState()?.mlsProviders?.length > 1;
    const isMlsSelected = !!get()[selectedModule]?.selectedMls;
    if (isMultipleMlsUser || (!isMultipleMlsUser && !isMlsSelected)) {
        set(produce(state => {
            state[selectedModule] = {
                ...state[selectedModule],
                selectedMls: mls,
                search: {
                    searchCriteria: getCriteria(mls.mlsId),
                    mlsId: mls.mlsId
                },
                searchFilters: state[selectedModule].searchFilters.filter(filterName =>
                    !getFiltersByGroupTitle(allFilterGroups, searchTerms.optional).includes(filterName)
                ),
                selectedSavedSearch: undefined,
                agents: undefined,
                ...setDefaultTitles(selectedModule)
            };
        }), false, 'setMls');
    }
    timeIntervals && setOfficeDefaultTimeframe(selectedModule, timeIntervals, mls, set);
};

export const actions = (set, get) => ({
    setSelectedModule: async (selectedModule) => {
        selectedModule && set({ selectedModule }, false, 'setSelectedModule');
    },
    setIsLoading: isLoading => set({ isLoading: isLoading }, false, 'setisLoading'),
    setSelectedMls: async (mls, selectedModule, timeIntervals) => {
        set({ isLoading: true });
        if (selectedModule) {
            setMls(selectedModule, mls, timeIntervals, set, get);
        } else {
            _.forEach(modulesByRouteAndNameAssociation.map(assoc => assoc.module), module => {
                setMls(module, mls, timeIntervals, set, get);
            });
        }
        set({ isLoading: false });
    },
    setSelectedSavedSearch: async ({
                                       search,
                                       accountId,
                                       selectedMls,
                                       timeIntervals,
                                       marketAreaLists,
                                       officeLists
                                   }) => {
        const selectedModule = get().selectedModule;
        const searchMlsId = search?.savedSearch.mlsId;
        let searchFilters = ['savedSearches'];
        const mappedAreas = await getAreasMap(searchMlsId);
        let propTypes = selectedModule !== modules.proficiencyMetrics.offices && await getPropertyTypes(searchMlsId);
        const offices = [modules.proficiencyMetrics.offices, modules.marketShare.coverage].includes(selectedModule) &&
            await getOfficesByModule(searchMlsId)[selectedModule]();
        const selectedAgents = selectedModule === modules.proficiencyMetrics.agents && getAgentCriteriaIds(search) &&
            await getMlsAgentsByIds(search.savedSearch.mlsId, getAgentCriteriaIds(search));
        set({ isLoading: true });
        set(produce(state => {
            let module = {
                ...state[selectedModule],
                ...setDefaultTitles(selectedModule)
            };
            module.recruiting = {};
            module.marketShare = {};
            module.selectedMls = selectedMls;
            module.search = search.savedSearch;
            module.selectedSavedSearch = search;
            const mls = _.find(
                search.savedSearch.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                (i) => i.realEstateDatasourceId === search.savedSearch.mlsId
            );

            const filterGroups = getFilterGroups({ isComparisonSetsEnabled });
            _.forEach(filterGroups, (g) => {
                _.forEach(g.filters, async (f) => {
                    let addFilter;
                    switch (f.id) {
                        case searchTerms.mlsFilter:
                            addFilter = true;
                            break;
                        case searchTerms.areaTypeFilter:
                            addFilter = true;
                            const areaType = search.savedSearch.searchCriteria.criteria.realEstateDatasourceIdsWithFilters[0]
                                .computedFields.find(field => field.fieldName === 'areaType')?.fieldValues[0];
                            if (areaType) {
                                let columnName;
                                for (const [key, value] of Object.entries(areaRequestTypes)) {
                                    if (value === areaType) {
                                        columnName = key;
                                    }
                                }
                                const viewName = !mappedAreas.error && Object.values(mappedAreas).find(area => area.columnName === columnName).viewName;
                                module.areaTypeTitle = { mainTitle: `${searchTerms.areaType}: ${viewName}` };
                            }
                            break;
                        case searchTerms.propTypeFilter:
                            addFilter = true;
                            if (!propTypes?.error) {
                                const propTypeField = mls?.searchFields.find(
                                    (searchField) => searchField.fieldName === 'propertyType'
                                );
                                if (propTypeField) {
                                    module.propertyTypeTitle = getPropertyTypeTitle(
                                        propTypes,
                                        propTypeField.fieldValues
                                    );
                                }
                            }
                            break;
                        case searchTerms.timeFrameFilter:
                            addFilter = true;
                            if (timeIntervals) {
                                const timePeriod = search.savedSearch.searchCriteria?.criteria?.timePeriod;
                                if (timePeriod) {
                                    module.timeFrameTitle = getTimeFrameTitle(
                                        timePeriod,
                                        timeIntervals,
                                        selectedModule
                                    );
                                }
                            }
                            break;
                        case searchTerms.marketAreaFilter:
                            addFilter = true;
                            const selectedAreas = mls?.searchFields?.filter(f => areaSearchTypes.includes(f.fieldName));
                            if (selectedAreas?.length > 0) {
                                const marketAreaListField = selectedAreas.find(area => area.savedAreaId);
                                module.marketAreaTitle = !marketAreaListField?.savedAreaId
                                    ? getMarketAreaTitle({
                                        selectedAreas,
                                        searchAllMls: false,
                                        module: selectedModule
                                    })
                                    : getMarketAreaListTitle(
                                        marketAreaLists?.find(l => l.id === marketAreaListField.savedAreaId)?.name,
                                        marketAreaListField.fieldTypeName
                                    );
                            } else if (mls?.searchAllMLS) {
                                module.marketAreaTitle = getMarketAreaTitle({
                                    selectedAreas: null,
                                    searchAllMls: true,
                                    module: selectedModule
                                });
                            }
                            break;
                        case searchTerms.listingStatusFilter:
                            addFilter = true;
                            const selectedStatus = mls?.computedFields?.find(f => f.fieldName === searchTerms.transactionStatus);
                            if (selectedStatus && !!selectedStatus.fieldValues?.length) {
                                module.listingStatusTitle = {
                                    mainTitle: marketShareListingStatuses[selectedStatus.fieldValues[0]]
                                };
                            }
                            break;
                        case searchTerms.officesFilter:
                            addFilter = true;
                            const officeCriteria = mls?.idFiltering?.find(o => o.idType.toLowerCase() === searchTerms.officeIdType.toLowerCase());
                            if (!officeCriteria) break;

                            if (officeCriteria.listId) {
                                const officeList = officeLists?.find(list => list.officeListId === officeCriteria.listId);
                                module.selectedOfficeList = officeList;
                                module.officesTitle = getOfficeListTitle(officeList?.name);
                            } else if (officeCriteria.idValues?.length) {
                                module.officesTitle = getOfficesTitle(officeCriteria.idValues, offices);
                            }
                            break;
                        case searchTerms.agentsFilter:
                            addFilter = true;
                            if (!selectedAgents?.error) {
                                module.agents = selectedAgents;
                            }
                            module.agentsTitle = getAgentsTitle(selectedAgents);
                            break;
                        case searchTerms.comparisonSetFilter:
                            if (mls?.mlsObjectId) {
                                const selectedComparisonSet = useComparisonSetsStore
                                    .getState().comparisonSets?.list.find(cs => cs.id === mls.mlsObjectId);
                                module.selectedComparisonSetSearch = selectedComparisonSet;
                                module.comparisonSetTitle = { mainTitle: selectedComparisonSet.name };
                                addFilter = true;
                            }
                            break;
                        default:
                            if (f.id) {
                                const path = f.path.split('/');
                                const searchField = f.id === searchTerms.lotSizeFilter
                                    ? mls && mls[path[0]]?.find((f) =>
                                        f.fieldName === searchTerms.lotSizeAcresFilter || f.fieldName === searchTerms.lotSquareFeetFilter)
                                    : mls && mls[path[0]]?.find((f) => f.fieldName === path[1]);
                                addFilter =
                                    !!searchField?.fieldValues?.length ||
                                    !!searchField?.fieldMinValue ||
                                    !!searchField?.fieldMaxValue;
                                if (addFilter) {
                                    module[`${f.id}Title`] = getRangeTitle(
                                        searchTerms[f.id],
                                        {
                                            min: searchField.fieldMinValue,
                                            max: searchField.fieldMaxValue
                                        },
                                        currencyFields.includes(searchField.fieldName)
                                    );
                                }
                            }
                            break;
                    }
                    if (addFilter) {
                        searchFilters.push(f.id);
                    }
                });
            });
            module.searchFilters = searchFilters;
            state[selectedModule] = module;
        }), false, 'setSelectedSavedSearch');
        set({ isLoading: false });
    },

    resetSearchCriteria: () => {
        set(produce(state => {
            const module = state[get().selectedModule];
            module.loadedSearchCriteria = undefined;
            resetSelectedSavedSearch(module);
        }), false, 'resetSearchCriteria');
    },
    getSavedSearchList: async (userId) => {
        try {
            const response = await getUserSavedSearches(
                userId,
                getParentFromValue(modules, get().selectedModule),
                searchTypes[moduleRoutes[get().selectedModule]].type
            );
            if (!response.error) {
                set(produce(state => {
                    const module = state[get().selectedModule];
                    module.savedSearchList = response?.savedSearches;
                }), false, 'getSavedSearchList');
            }
        } catch (err) {
            set({ isLoading: false, error: err.message });
        }
    },
    setMarketAreaType: (mappedArea) => {
        set(produce(state => {
            const module = state[get().selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                (i) => i.realEstateDatasourceId === search.mlsId
            );
            // clear existing area selections
            mls.searchFields = mls.searchFields.filter((sf) => !areaSearchTypes.includes(sf.fieldName));
            mls.searchAllMLS = false;
            mls.searchFields.push({
                fieldName: areaRequestTypes[mappedArea.columnName],
                fieldTypeName: mappedArea.viewName
            });
            module.search = search;
            resetSelectedSavedSearch(module);
        }));
    },
    setSelectedAreas: ({ fieldName, selectedAreas, listIsDirty, marketAreaLists }) => {
        set(produce(state => {
            const module = state[get().selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                (i) => i.realEstateDatasourceId === search.mlsId
            );
            const marketAreaCriteria = mls.searchFields.find((f) => f.fieldName === fieldName);
            if (marketAreaCriteria) {
                marketAreaCriteria.fieldValues = selectedAreas.map(a => a.areaValue);
                if (fieldName === 'areaKey' || fieldName === 'area2Key') {
                    marketAreaCriteria.fieldValues = selectedAreas.map(a => a.areaKey);
                    marketAreaCriteria.fieldValueDescriptions = selectedAreas.map(a => a.areaValue);
                }

                if (listIsDirty) {
                    marketAreaCriteria.savedAreaId = undefined;
                }

                module.marketAreaTitle = marketAreaCriteria.savedAreaId
                    ? getMarketAreaListTitle(
                        marketAreaLists.find(l => l.id === marketAreaCriteria.savedAreaId).name,
                        marketAreaCriteria.fieldTypeName)
                    : getMarketAreaTitle({
                        selectedAreas: [marketAreaCriteria],
                        module: get().selectedModule
                    });
                module.search = search;
            }
        }));
    },
    setSelectedOffices: (selectedOffices, listIsDirty, offices) => {
        set(produce(state => {
            const module = state[get().selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                (i) => i.realEstateDatasourceId === search.mlsId
            );
            const officeCriteria = mls.idFiltering.find(filter => filter.idType.toLowerCase() === searchTerms.officeIdType.toLowerCase());
            const selectedOfficeIds = selectedOffices.map(o => o.officeId);
            if (officeCriteria) {
                officeCriteria.idValues = selectedOfficeIds;
                if (listIsDirty) {
                    officeCriteria.listId = undefined;
                }
            } else {
                mls.idFiltering.push({
                    idType: searchTerms.officeIdType,
                    idValues: selectedOfficeIds
                });
            }
            module.officesTitle = getOfficesTitle(selectedOfficeIds, offices);
            module.selectedOffices = selectedOffices;
            module.listIsDirty = listIsDirty;
            resetSelectedSavedSearch(module);
        }));
    },
    setSelectedAgents: (selectedAgents, listIsDirty) => {
        set(produce(state => {
            const module = state[get().selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                (i) => i.realEstateDatasourceId === search.mlsId
            );
            const agentCriteria = mls.idFiltering.find(f => f.idType.toLowerCase() === searchTerms.agentIdType.toLowerCase());
            if (agentCriteria) {
                agentCriteria.idValues = selectedAgents.map(a => a.agentId);
            } else {
                mls.idFiltering.push({
                    idType: searchTerms.agentIdType,
                    idValues: selectedAgents.map(a => a.agentId)
                });
            }
            module.agentsTitle = getAgentsTitle(selectedAgents);
            module.listIsDirty = listIsDirty;
            resetSelectedSavedSearch(module);
        }));
    },
    setAgentsTitle: (selectedAgents) => {
        set(produce(state => {
            const module = state[get().selectedModule];
            module.agentsTitle = getAgentsTitle(selectedAgents);
        }));
    },
    setAllMls: () => {
        set(produce(state => {
            const module = state[get().selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                (i) => i.realEstateDatasourceId === search.mlsId
            );
            // clear existing area selections
            mls.searchFields = mls.searchFields.filter((sf) => !areaSearchTypes.includes(sf.fieldName));
            mls.searchAllMLS = true;
            module.search = search;
            module.marketAreaTitle = getMarketAreaTitle({ searchAllMls: true, viewId: module.id });
            resetSelectedSavedSearch(module);
        }));
    },
    setSelectedPropTypes: (selectedPropertyTypes, propTypes) => {
        set(produce(state => {
            const module = state[get().selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                (i) => i.realEstateDatasourceId === search.mlsId
            );
            mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'propertyType');
            if (!selectedPropertyTypes) {
                module.propertyTypeTitle.mainTitle = defaultPropTypeTitle;
                module.selectedPropTypes = [];
            } else {
                const fieldValueDescriptions = [];
                const selectedPropTypes = _.map(selectedPropertyTypes, (t) => t.toString());
                module.selectedPropTypes = [...selectedPropTypes];
                module.propertyTypeTitle = getPropertyTypeTitle(
                    propTypes,
                    module.selectedPropTypes
                );
                _.forEach(propTypes, (propType) => {
                    propType.types?.map((type) => {
                        selectedPropertyTypes.forEach((selectedPropType) => {
                            if (type.typeId === selectedPropType) {
                                fieldValueDescriptions.push(type.longName);
                            }
                        });
                    });
                });
                mls.searchFields.push({
                    fieldName: 'propertyType',
                    fieldValues: [..._.map(selectedPropTypes, (t) => t.toString())],
                    fieldValueDescriptions: [..._.map(fieldValueDescriptions, (t) => t.toString())]
                });
            }
            resetSelectedSavedSearch(module);
            module.search = search;
        }));
    },
    setTimePeriod: (intervalType, startDate, endDate, timeIntervals) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const newTimePeriodCriteria = {
                intervalType
            };
            // add custom dates if applicable
            if (intervalType === TimePeriods['Custom Date']) {
                newTimePeriodCriteria.startDate = startDate;
                newTimePeriodCriteria.endDate = endDate;
            }
            search.searchCriteria.criteria.timePeriod = newTimePeriodCriteria;
            module.timeFrameTitle = getTimeFrameTitle(
                newTimePeriodCriteria,
                timeIntervals,
                selectedModule
            );
            module.search = search;
            resetSelectedSavedSearch(module);
        }));
    },
    updateSearchFilters: (updatedFilters) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            module.searchFilters = updatedFilters;
        }), false, 'updateSearchFilters');
    },
    resetFilter: (type) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search?.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            switch (type) {
                case searchTerms.fullBathroomsFilter:
                    mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'fullBathrooms');
                    module.fullBathroomsTitle = defaultTitles.fullBathroomsTitle;
                    break;
                case searchTerms.bedroomsFilter:
                    mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'bedrooms');
                    module.bedroomsTitle = defaultTitles.bedroomsTitle;
                    break;
                case searchTerms.soldPriceFilter:
                    mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'soldPrice');
                    module.soldPriceRangeTitle = defaultTitles.soldPriceRangeTitle;
                    break;

                case searchTerms.priceRangeFilter:
                    mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'lastPrice');
                    module.priceRangeTitle = defaultTitles.priceRangeTitle;
                    break;

                case searchTerms.totalUnitsFilter:
                    mls.computedFields = mls.computedFields.filter(f => f.fieldName !== 'totalUnits');
                    module.totalUnitsTitle = defaultTitles.totalUnitsTitle;
                    break;

                case searchTerms.totalVolumeFilter:
                    mls.computedFields = mls.computedFields.filter(f => f.fieldName !== 'totalVolume');
                    module.totalVolumeTitle = defaultTitles.totalVolumeTitle;
                    break;

                case searchTerms.lotSizeFilter:
                    mls.searchFields = mls.searchFields.filter(f => !lotSizeTypes.includes(f.fieldName));
                    module.lotSizeTitle = defaultTitles.lotSizeTitle;
                    break;

                case searchTerms.squareFootageFilter:
                    mls.searchFields = mls.searchFields.filter(f => f.fieldName !== searchTerms.squareFeetFilter);
                    module.squareFootageTitle = defaultTitles.squareFootageTitle;
                    break;
                case searchTerms.comparisonSetFilter:
                    if (mls?.searchFields) mls.searchFields =
                        mls.searchFields.filter(f => f.fieldName !== searchTerms.comparisonSetFilter);
                        module.comparisonSetTitle = defaultTitles.comparisonSetTitle;
                    break;
            }
        }), false, 'resetFilter');
    },
    setTotalVolume: (totalVolume) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.computedFields = mls.computedFields.filter(f => f.fieldName !== 'totalVolume');
            mls.computedFields.push({
                fieldName: 'totalVolume',
                ...(totalVolume.min && { fieldMinValue: totalVolume.min }),
                ...(totalVolume.max && { fieldMaxValue: totalVolume.max })
            });
            module.totalVolumeTitle = getRangeTitle(
                searchTerms.totalVolume,
                {
                    min: totalVolume.min,
                    max: totalVolume.max
                },
                true
            );
            resetSelectedSavedSearch(module);
        }));
    },
    setTotalUnits: (totalUnits) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.computedFields = mls.computedFields.filter(f => f.fieldName !== 'totalUnits');
            mls.computedFields.push({
                fieldName: 'totalUnits',
                ...(totalUnits.min && { fieldMinValue: totalUnits.min }),
                ...(totalUnits.max && { fieldMaxValue: totalUnits.max })
            });
            module.totalUnitsTitle = getRangeTitle(
                searchTerms.totalUnits,
                {
                    min: totalUnits.min,
                    max: totalUnits.max
                },
                false
            );
            resetSelectedSavedSearch(module);
        }));
    },
    setSoldPrice: (soldPrice) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'soldPrice');
            mls.searchFields.push({
                fieldName: 'soldPrice',
                ...(soldPrice.min && { fieldMinValue: soldPrice.min }),
                ...(soldPrice.max && { fieldMaxValue: soldPrice.max })
            });
            module.soldPriceRangeTitle = getRangeTitle(
                searchTerms.soldPriceRange,
                {
                    min: soldPrice.min,
                    max: soldPrice.max
                },
                true
            );
            resetSelectedSavedSearch(module);
        }));
    },
    setLastPrice: (lastPrice) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'lastPrice');
            mls.searchFields.push({
                fieldName: 'lastPrice',
                ...(lastPrice.min && { fieldMinValue: lastPrice.min }),
                ...(lastPrice.max && { fieldMaxValue: lastPrice.max })
            });
            module.priceRangeTitle = getRangeTitle(
                searchTerms.priceRange,
                {
                    min: lastPrice.min,
                    max: lastPrice.max
                },
                true
            );
            resetSelectedSavedSearch(module);
        }));
    },
    setBathrooms: (bathrooms) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'fullBathrooms');
            mls.searchFields.push({
                fieldName: 'fullBathrooms',
                ...(bathrooms.min && { fieldMinValue: bathrooms.min }),
                ...(bathrooms.max && { fieldMaxValue: bathrooms.max })
            });
            module.fullBathroomsTitle = getRangeTitle(
                searchTerms.fullBathrooms,
                {
                    min: bathrooms.min,
                    max: bathrooms.max
                },
                false
            );
            resetSelectedSavedSearch(module);
        }));
    },
    setBedrooms: (bedrooms) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.searchFields = mls.searchFields.filter(f => f.fieldName !== 'bedrooms');
            mls.searchFields.push({
                fieldName: 'bedrooms',
                ...(bedrooms.min && { fieldMinValue: bedrooms.min }),
                ...(bedrooms.max && { fieldMaxValue: bedrooms.max })
            });
            module.bedroomsTitle = getRangeTitle(
                searchTerms.bedrooms,
                {
                    min: bedrooms.min,
                    max: bedrooms.max
                },
                false
            );
            resetSelectedSavedSearch(module);
        }));
    },
    setComparisonSetSearch: (comparisonSet) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            if (!mls) return;
            if(mls.mlsObjectId || comparisonSet?.id) mls.mlsObjectId = comparisonSet?.id;
            module.comparisonSetTitle = {
                mainTitle: comparisonSet?.name
                    ? comparisonSet.name
                    : defaultTitles.comparisonSetTitle.mainTitle
            };
            module.selectedComparisonSetSearch = comparisonSet;
        }), false, 'setComparisonSetSearch');
    },
    setListingStatus: (listingStatus) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.computedFields = mls.computedFields.filter(f => f.fieldName !== searchTerms.transactionStatus);
            mls.computedFields.push({
                fieldName: searchTerms.transactionStatus,
                fieldValues: [listingStatus.value]
            });
            module.listingStatusTitle = { mainTitle: listingStatus.title };
            resetSelectedSavedSearch(module);
        }));
    },
    setLotSize: (lotSize) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.searchFields = mls.searchFields.filter(f => !lotSizeTypes.includes(f.fieldName));
            mls.searchFields.push({
                fieldName:
                    lotSize.measureType === searchTerms.acres.toLowerCase()
                        ? searchTerms.lotSizeAcresFilter
                        : searchTerms.lotSquareFeetFilter,
                ...(lotSize.min && { fieldMinValue: lotSize.min }),
                ...(lotSize.max && { fieldMaxValue: lotSize.max })
            });
            module.lotSizeTitle = getLotSizeTitle(
                searchTerms.lotSize,
                {
                    min: lotSize.min,
                    max: lotSize.max,
                    measureType: lotSize.measureType
                }
            );
            resetSelectedSavedSearch(module);
        }));
    },
    setSquareFootage: (squareFootage) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.searchFields = mls.searchFields.filter(f => f.fieldName !== searchTerms.squareFeetFilter);
            mls.searchFields.push({
                fieldName: searchTerms.squareFeetFilter,
                ...(squareFootage.min && { fieldMinValue: squareFootage.min }),
                ...(squareFootage.max && { fieldMaxValue: squareFootage.max })
            });
            module.squareFootageTitle = getRangeTitle(
                searchTerms.squareFootage,
                {
                    min: squareFootage.min,
                    max: squareFootage.max
                },
                false
            );
            resetSelectedSavedSearch(module);
        }));
    },
    setAreaType: (title, areaType) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.computedFields = mls.computedFields.filter(f => f.fieldName !== searchTerms.areaTypeFilter);
            mls.computedFields.push({
                fieldName: searchTerms.areaTypeFilter,
                fieldValues: [areaType]
            });
            module.areaTypeTitle = { mainTitle: title };
            resetSelectedSavedSearch(module);
        }));
    },
    setListIsDirty: (isDirty) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            module.listIsDirty = isDirty;
        }), false, 'setListIsDirty');
    },
    setSelectedMarketAreaList: (marketAreaList, selectedSavedSearch) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            const savedSearchAreaId = module.selectedSavedSearch?.savedSearch.searchCriteria
                .criteria.realEstateDatasourceIdsWithFilters[0].searchFields.find((sf) => areaSearchTypes.includes(sf.fieldName))?.savedAreaId;
            mls.searchFields = mls.searchFields.filter((sf) => !areaSearchTypes.includes(sf.fieldName));
            mls.searchAllMLS = false;
            mls.searchFields.push({
                ...marketAreaList.elements,
                savedAreaId: marketAreaList.id
            });
            if (selectedSavedSearch && savedSearchAreaId !== marketAreaList.id) {
                resetSelectedSavedSearch(module);
            }
            module.marketAreaTitle = getMarketAreaListTitle(marketAreaList.name, marketAreaList.elements.fieldTypeName);
        }));
    },
    setSelectedOfficeList: (officeList, selectedSavedSearch) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            const savedSearchListId = module.selectedSavedSearch?.savedSearch.searchCriteria
                .criteria.realEstateDatasourceIdsWithFilters[0].idFiltering.find(f => f.idType.toLowerCase() === searchTerms.officeIdType.toLowerCase()).listId;
            mls.idFiltering = [{
                idType: searchTerms.officeIdType,
                idValues: officeList.officeIds,
                listId: officeList.officeListId
            }];
            if (selectedSavedSearch && savedSearchListId !== officeList.id) {
                resetSelectedSavedSearch(module);
            }
            module.officesTitle = getOfficeListTitle(officeList.name);
        }));
    },
    setListInSearchByAgentSearch: (agentList, searchListId) => {
        set(produce(state => {
            const search = state[modules.proficiencyMetrics.agents].search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.idFiltering = [{
                idType: searchTerms.agentIdType,
                idValues: agentList,
                listId: searchListId
            }];
        }));
        get().setAgentNameRerunOnLoad(true);
    },
    setSelectedAgentList: (agentList, selectedSavedSearch) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            const savedSearchListId = selectedSavedSearch?.savedSearch.searchCriteria
                .criteria.realEstateDatasourceIdsWithFilters[0].idFiltering.find(f => f.idType.toLowerCase() === searchTerms.agentIdType.toLowerCase()).listId;
            mls.idFiltering = [{
                idType: searchTerms.agentIdType,
                idValues: agentList.agentIds,
                listId: agentList.agentListId
            }];
            if (selectedSavedSearch && savedSearchListId !== agentList.agentListId) {
                resetSelectedSavedSearch(module);
            }
        }));
    },
    resetSelectedAgentList: () => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.idFiltering = mls.idFiltering.filter(idFilter => idFilter.idType.toLowerCase() !== searchTerms.agentIdType.toLowerCase());
            module.agentsTitle = defaultTitles.agentsTitle;
        }));
    },
    resetSelectedAgentListTitle: (agentList, selectedAgents) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            module.agentsTitle = getAgentsTitle(selectedAgents);
            mls.idFiltering = mls.idFiltering.filter(idFilter => idFilter.idType.toLowerCase() !== searchTerms.agentIdType.toLowerCase());
        }));
    },
    resetSelectedOfficeList: () => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            mls.idFiltering = mls.idFiltering.filter(idFilter => idFilter.idType.toLowerCase() !== searchTerms.officeIdType.toLowerCase());
            module.selectedOfficeList = undefined;
            module.officesTitle = defaultTitles.officesTitle;
        }));
    },
    resetSelectedOfficeListTitle: (officeList, selectedOffices) => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const search = module.search;
            const mls = _.find(
                search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters,
                i => i.realEstateDatasourceId === search.mlsId
            );
            module.selectedOfficeList = undefined;
            module.officesTitle = getOfficesTitle(officeList.officeIds, selectedOffices);
            mls.idFiltering = [{
                idType: searchTerms.officeIdType,
                idValues: officeList.officeIds
            }];
        }));
    },
    setLoadedSearch: (reset) => {
        set(produce(state => {
            state[state.selectedModule].loadedSearchCriteria = reset
                ? undefined
                : { ...state[state.selectedModule].search?.searchCriteria?.criteria };
        }), false, 'setLoadedSearch');
    },
    setSearchStatus: (status) => {
        set(produce(state => {
            state[state.selectedModule].searchStatus = status;
        }), false, 'setSearchStatus');
    },
    setTotalsRowData: (soldTotals, keyToStore) => {
        if (!soldTotals) {
            set(produce(state => {
                state[state.selectedModule].recruitingSoldTotals = soldTotals;
            }), false, responseKeys.recruitingSoldTotals);
            return;
        }
        set(produce(state => {
            state[state.selectedModule][keyToStore] = soldTotals;
        }), false, keyToStore);
    },
    setSummaryPinnedData: (view, keyToRead) => {
        if (!view) return;
        const selectedModule = get().selectedModule;
        const soldTotals = get()[selectedModule][keyToRead];
        const summaryPinnedData = getSummaryPinnedData(soldTotals, view);
        set(produce(state => {
            state[state.selectedModule].summaryPinnedData = summaryPinnedData;
        }), false, 'summaryPinnedData');
    },
    setIsLoadingSearchData: (isLoading) => {
        set({ isLoadingSearchData: isLoading });
    },
    resetStore: () => {
        set(initialSearchState({ ...initialView }), false, 'resetStore');
    },
    clearAllSearch: () => {
        set(produce(state => {
            const module = state.selectedModule;
            const moduleState = { ...state[module] };
            state.isLoading = false,
            state.isLoadingSearchData = false,
            state.listIsDirty = false,
            state.shouldCloseChips = true
            state[module] = { 
                ...moduleState,
                ...viewByModule[module]({...initialView}),
                searchFilters: moduleState.searchFilters.filter(filterName =>
                    !getFiltersByGroupTitle(allFilterGroups, searchTerms.optional).includes(filterName)
                ),
                savedSearchList: moduleState.savedSearchList,
                loadedSearchCriteria: undefined,
                selectedMls: undefined,
                selectedSavedSearch: undefined,
                search: undefined,
            }
        }))
    },
    setShouldCloseChips: (shouldCloseChips) => set({ shouldCloseChips }, false, 'setShouldCloseChips'),
    setAgentNameRerunOnLoad: (shouldAgentNameRerunOnLoad) => set({ shouldAgentNameRerunOnLoad }),
    resetComparisonSetSavedSearch: () => {
        set(produce(state => {
            const selectedModule = get().selectedModule;
            const module = state[selectedModule];
            const savedSearchMlsObjectId = module.selectedSavedSearch?.savedSearch?.searchCriteria?.
                criteria?.realEstateDatasourceIdsWithFilters[0]?.mlsObjectId;
            if(savedSearchMlsObjectId !== module.selectedComparisonSetSearch?.id)
                resetSelectedSavedSearch(module);
        }));
    },
    runMarketShareTotalsSearch: async (searchCriteria, setAgentData) => {
        const selectedModule = get().selectedModule;
        const comparisonSetStore = useComparisonSetsStore.getState();
        const isComparisonSetSearch = !!searchCriteria.criteria.realEstateDatasourceIdsWithFilters[0]?.mlsObjectId;
        comparisonSetStore.setIsComparisonSetView(isComparisonSetSearch);
        if (isComparisonSetSearch) {
            const comparionSetSearchResponse = await getComparisonSetResults(searchCriteria.criteria);
            setAgentData(agentData => ({
                ...agentData,
                [selectedModule]: {
                    officeSearch: undefined,
                    brokerSearch: undefined,
                    comparisonSetSearch: comparionSetSearchResponse,
            }}));
            return;
        }
        const officeSearchResponse = await getTotalsOfficeSearch(searchCriteria);
        const brokerSearchResponse = await getTotalsBrokerSearch(searchCriteria);
        if (!officeSearchResponse.error && !brokerSearchResponse.error) {
            setAgentData(agentData => ({
                ...agentData,
                [selectedModule]: {
                    officeSearch: officeSearchResponse,
                    brokerSearch: brokerSearchResponse,
                    comparisonSetSearch: undefined
            }}));
        }
    },
});
