import React, { createElement, lazy, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'zustand/shallow';
import { isEqual } from 'lodash-es';
import AddFilters from './AddFilters';
import PropertyTypeChip from './chips/PropertyTypeChip';
import TimeFrameChip from './chips/TimeFrameChip';
import ListingStatusChip from './chips/ListingStatusChip';
import MarketAreaChip from './chips/MarketAreaChip';
import AreaTypeChip from './chips/AreaTypeChip';
import SavedSearchesChip from './chips/SavedSearchesChip';
import MLSChip from './chips/MLSChip';
import { searchTerms } from '../../../constants';
import SaveSearchModal from './SaveSearchModal';
import RunSearchButton from './RunSearchButton';
import { hasRequiredCriteria } from '../../helpers/search';
import { getFilterGroups } from '../../helpers/filter-list';
import { useCommonStore, useSearchStore } from '../../../store/store';
import { useAuthStore } from '../../../store/auth/store';
import ClearSearchButton from './ClearSearchButton';
import ClearAllModal from './ClearAllModal';
import { getOwnerIdByTokenInfo } from '../../../constants/auth';
import { useComparisonSetsStore } from '../../../store/comparisonSets/store';
import { useFeatureToggles } from '../../hooks/featureToggles';

const VolumeChip = lazy(() => import('./chips/VolumeChip'));
const UnitsChip = lazy(() => import('./chips/UnitsChip'));
const BedroomsChip = lazy(() => import('./chips/BedroomsChip'));
const SoldPriceChip = lazy(() => import('./chips/SoldPriceChip'));
const BathroomsChip = lazy(() => import('./chips/BathroomsChip'));
const OfficesChip = lazy(() => import('./chips/OfficesChip'));
const AgentsChip = lazy(() => import('./chips/AgentsChip'));
const LotSizeChip = lazy(() => import('./chips/LotSizeChip'));
const SquareFootageChip = lazy(() => import('./chips/SquareFootageChip'));
const ComparisonSetChip = lazy(() => import('./chips/ComparisonSetChip'));

const SearchBar = props => {
    const { key, module, mlsProps } = props;

    const {
        searchFilters,
        search,
        selectedMls,
        updateSearchFilters,
        resetFilter,
        loadedSearch,
        selectedSavedSearch
    } = useSearchStore(state => ({
        searchFilters: state[module]?.searchFilters,
        search: state[module]?.search,
        selectedMls: state[module]?.selectedMls,
        updateSearchFilters: state.updateSearchFilters,
        resetFilter: state.resetFilter,
        loadedSearch: state[module]?.loadedSearchCriteria,
        selectedSavedSearch: state[module]?.selectedSavedSearch
    }), shallow);

    const {
        userInfo,
        membership,
        menuIsOpen,
    } = useCommonStore(state => ({
        membership: state.membership,
        menuIsOpen: state.menuIsOpen,
        userInfo: state.userInfo
    }));

    const {
        tokenInfo,
        tokenType
    } = useAuthStore(state => ({
        tokenInfo: state.tokenInfo,
        tokenType: state.tokenType,
    }));

    const {
        isLoading,
        isLoadingSearchData,
        setIsLoadingSearchData
    } = useSearchStore(state => ({
        isLoading: state.isLoading,
        isLoadingSearchData: state[module]?.isLoadingSearchData,
        setIsLoadingSearchData: state.setIsLoadingSearchData
    }));

    const ownerId = tokenType && getOwnerIdByTokenInfo[tokenType](tokenInfo);

    const chips = {
        savedSearches: SavedSearchesChip,
        mls: MLSChip,
        propertyType: PropertyTypeChip,
        timeFrame: TimeFrameChip,
        listingStatus: ListingStatusChip,
        marketArea: MarketAreaChip,
        areaType: AreaTypeChip,
        offices: OfficesChip,
        agents: AgentsChip,
        totalVolume: VolumeChip,
        soldPriceRange: SoldPriceChip,
        priceRange: SoldPriceChip,
        totalUnits: UnitsChip,
        fullBathrooms: BathroomsChip,
        bedrooms: BedroomsChip,
        lotSize: LotSizeChip,
        squareFootage: SquareFootageChip,
        comparisonSet: ComparisonSetChip
    };

    const {
        savedSearchFilter,
        mlsFilter,
        propTypeFilter,
        timeFrameFilter,
        marketAreaFilter,
        areaTypeFilter,
        listingStatusFilter,
        agentsFilter,
        officesFilter
    } = searchTerms;
    const staticFilters = [
        savedSearchFilter,
        mlsFilter,
        propTypeFilter,
        timeFrameFilter,
        marketAreaFilter,
        areaTypeFilter,
        listingStatusFilter,
        officesFilter,
        agentsFilter
    ];

    const [filters, setFilters] = useState();
    const [savedSearchIsDirty, setSavedSearchIsDirty] = useState();
    const [isCriteriaFulfilled, setIsCriteriaFulfilled] = useState(false);
    const [loadedSearchCriteria, setLoadedSearchCriteria] = useState();
    const [mlsMembershipInfo, setMlsMembershipInfo] = useState();
    const [isLoadingState, setIsLoadingState] = useState(false);
    const [isClearAllModalShown, setIsClearAllModalShown] = useState(false);
    const featureToggles = useFeatureToggles();

    useEffect(() => {
        if (!userInfo) return;
        useComparisonSetsStore.getState().getComparisonSetsByUser(userInfo.id);
    }, [userInfo]);

    useEffect(() => {
        setIsLoadingState(isLoading || isLoadingSearchData);
        setIsLoadingSearchData(isLoading)
    }, [isLoading, isLoadingSearchData]);

    useEffect(() => {
        if (searchFilters) {
            const filterGroups = getFilterGroups({
                isComparisonSetsEnabled: featureToggles.comparisonSets.isEnabled
            });
            const moduleTypeFilters = filterGroups
                .map(groups => groups.filters).reduce((a, b) => a.concat(b), [])
                .filter(filter => filter.modules.includes(module)).map(filter => filter.id);
            const currentModuleFilters = searchFilters.filter(filter =>
                filter === 'savedSearches' || moduleTypeFilters.includes(filter)
            );
            setFilters(currentModuleFilters);
        }
    }, [searchFilters, featureToggles.comparisonSets.isEnabled]);

    useEffect(() => {
        if (!!membership?.length) {
            const currentMlsMembershipInfo = membership?.find(mls => mls.mlsId === selectedMls?.mlsId) || [];
            setMlsMembershipInfo(currentMlsMembershipInfo);
        }
    }, [membership, selectedMls]);

    useEffect(() => {
        setLoadedSearchCriteria(loadedSearch);
    }, [loadedSearch]);

    const toggleFilter = filter => {
        const updatedFilters = [...filters];
        const filterIndex = updatedFilters.indexOf(filter);
        if (filterIndex >= 0) {
            resetFilterByType(filter);
            !staticFilters.includes(filter) && updatedFilters.splice(filterIndex, 1);
        } else {
            updatedFilters.push(filter);
        }
        updateSearchFilters(updatedFilters);
    };

    const resetFilterByType = filter => {
        resetFilter(filter);
    };

    useEffect(() => {
        let isDirty;
        if (search?.searchCriteria?.criteria) {
            if (!selectedSavedSearch) {
                isDirty = true;
            } else {
                isDirty = !isEqual(search?.searchCriteria?.criteria, selectedSavedSearch.savedSearch?.searchCriteria?.criteria);
            }
            setSavedSearchIsDirty(isDirty);
        }
    }, [search, selectedSavedSearch]);

    const enableSearch = !loadedSearchCriteria || !isEqual(search?.searchCriteria?.criteria, loadedSearchCriteria);

    useEffect(() => {
        const hasCriteriaFullFilled = hasRequiredCriteria(search, module)
        setIsCriteriaFulfilled(hasCriteriaFullFilled);
        if (hasCriteriaFullFilled) setIsLoadingState(false);
    }, [search, module]);

    const toggleClearAllModal = () => {
        setIsClearAllModalShown(prevState => !prevState);
    }

    return (<div className='bg-white border-bottom px-3 pt-3 pb-2 sticky-top' key={key}>
        <div style={{ width: 'calc(100% - 160px)', float: 'left' }}>
            {filters && [...filters].map(filter => {
                return createElement(chips[filter], {
                    key: filter,
                    disabled: isLoadingState || (![searchTerms.savedSearchFilter, searchTerms.mlsFilter].includes(filter) && !selectedMls),
                    onClose: !staticFilters.includes(filter) ? () => toggleFilter(filter) : undefined,
                    module: module,
                    selectedMls: selectedMls,
                    selectedSavedSearch: selectedSavedSearch,
                    mlsMembershipInfo: mlsMembershipInfo,
                    userId: ownerId,
                    mlsProps
                });
            })}
            <AddFilters
                toggleFilter={toggleFilter}
                disabled={isLoadingState || !selectedMls}
                searchObj={search}
                module={module}
                mlsMembershipInfo={mlsMembershipInfo}
            />
            <ClearSearchButton onClick={toggleClearAllModal} isDisabled={isLoadingState || !selectedMls} />
            <ClearAllModal shouldShowModal={isClearAllModalShown} onClose={toggleClearAllModal} />
        </div>
        <nav className='align-items-center float-right'>
            <div className='h-100 align-items-center float-right'>
                <RunSearchButton
                    disabled={!isCriteriaFulfilled || isLoadingState || !enableSearch || menuIsOpen }
                    module={module}
                    selectedSavedSearch={selectedSavedSearch}
                    userId={ownerId}
                />
                <SaveSearchModal
                    disabled={
                        !isCriteriaFulfilled ||
                        !savedSearchIsDirty ||
                        isLoadingState ||
                        menuIsOpen
                    }
                    userId={ownerId}
                    searchObj={{ ...search }}
                    module={module}
                />
            </div>
        </nav>
    </div>);
};

SearchBar.propTypes = {
    key: PropTypes.string,
    module: PropTypes.string,
    mlsProps: PropTypes.object,
};

export default SearchBar;
