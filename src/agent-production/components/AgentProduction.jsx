import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from '@lwt-helix/loader';
import Tab from '@lwt-helix/tab';
import Modal from '@lwt-helix/modal';
import Overview from './tabs/Overview';
import ContactInformation from './tabs/ContactInformation';
import GrowthAnalysis from './tabs/GrowthAnalysis';
import ListingProficiency from './tabs/ListingProficiency';
import {
    getDefaultOverviewColumns,
    getDefaultContactInfoColumns,
    tabIndexes,
    getSearchDateYearDetails,
    getMlsRestrictionSettings,
    tabIndexedViews
} from '../helpers/agentProductionHelpers';
import getAgentChartSettings from './chart/AgentChartTableSettings.js';
import { agentProductionTerms, TimePeriods } from '../../constants';
import { agentsColumns, viewHideAgentsDropdownLabels } from '../constants/agentProductionConstants';
import {
    getDefaultGrowthAnalysisColumnsLtm,
    getDefaultGrowthAnalysisColumnsYtd
} from './helpers/growthAnalysisHelpers';
import TitleRow from '../components/common/TitleRow';
import { setStateData } from '../../common/helpers/state';
import { getKeyByValue } from '../../common/helpers/object';
import { getDefaultColumns as getDefaultListingProfColumns } from '../helpers/listingProficiencyHelpers';
import { setTimeIntervalData } from '../helpers/browserStorageHelper';
import { useCommonStore, useSearchStore } from '../../store/store';
import { NoResultsMessage } from '../../common/components/search/NoResultsMessage';
import { exportCsv } from './common/exportCsv.jsx';
import {
    useContactInfoAdditionalHeaders,
    useGrowthAnalysisAdditionalHeaders,
    useListingProfAdditionalHeaders,
    useOverviewAdditionalHeaders
} from '../hooks/agGrid.js';
import { getSortedObjectsNumeric } from '../../market-share/helpers/helpers.jsx';
import AddAgentListPopover from './common/AddAgentListPopover';
import { responseKeys } from '../../constants/service.js';

const AgentProduction = ({ agentData, module }) => {
    const {
        selectedMls,
        selectedSavedSearch,
        search,
        loadedSearchCriteria,
        isLoadingSearchData,
        setSummaryPinnedData,
        searchStatus,
    } = useSearchStore(state => ({
        selectedMls: state[module]?.selectedMls,
        selectedSavedSearch: state[module]?.selectedSavedSearch,
        search: state[module]?.search,
        loadedSearchCriteria: state[module]?.loadedSearchCriteria,
        isLoadingSearchData: state.isLoadingSearchData,
        setSummaryPinnedData: state.setSummaryPinnedData,
        searchStatus: state[module]?.searchStatus,
    }));

    const {
        officeInfo,
        timeIntervals,
        clearAgentListPopover
    } = useCommonStore(state => ({
        officeInfo: state.officeInfo,
        timeIntervals: state.timeIntervals,
        clearAgentListPopover: state.clearAgentListPopover
    }));

    const restrictedMlsSettings = getMlsRestrictionSettings(selectedMls?.mlsId);

    const [state, setState] = useState({
        showModal: false,
        modalProps: {
            dataLwtId: 'agent-production-modal',
            show: false,
            size: '',
            title: '',
            footerClassName: '',
            showFooter: false,
            onClose: () => null,
            children: null
        },
        currentTab: tabIndexes.OVERVIEW,
        currentAgentChart: null,
        growthAnalysisPeriod: agentProductionTerms.last12Months,
        listingProficiencyColumns: getDefaultListingProfColumns(),
        overviewColumns: getDefaultOverviewColumns(),
        contactInfoColumns: getDefaultContactInfoColumns(restrictedMlsSettings),
        growthAnalysisColumnsLtm: getDefaultGrowthAnalysisColumnsLtm(),
        growthAnalysisColumnsYtd: getDefaultGrowthAnalysisColumnsYtd(),
        sortedLtmGrowthAnalysisColumn: agentsColumns.totalVolume.id,
        sortedYtdGrowthAnalysisColumn: agentsColumns.totalVolume.id,
        sortedListingProfColumn: agentsColumns.totalVolume.id,
        selectedTimePeriod: null,
        currentSearchDates: {
            lastIntervalText: '',
            from: null,
            to: null
        },
        timeIntervals: [],
        mlsId: null,
        accessibleOfficeList: [],
        selectedData: agentData,
        userPrivileges: undefined,
        agentInfo: undefined
    });

    const setCurrentTab = (currentTab) => {
        setStateData('currentTab', currentTab, setState);
    };

    useEffect(() => {
        const tabIndexedView = tabIndexedViews[state.currentTab];
        loadedSearchCriteria && !searchStatus && setSummaryPinnedData(tabIndexedView, responseKeys.recruitingSoldTotals);
    }, [state.selectedData, state.currentTab]);

    const [viewHideAgentsDropdownValue, setViewHideAgentsDropdownValue] = useState(viewHideAgentsDropdownLabels.viewHideAgents);
    
    const accessibleOfficeSet = !!state?.accessibleOfficeList?.length ? new Set(state?.accessibleOfficeList?.map(obj => obj.mlsOfficeId?.officeId)) : new Set();

    const toggleModal = () => {
        setStateData('showModal', !state.showModal, setState);
    };

    useEffect(() => clearAgentListPopover(), []);

    useEffect(() => {
        officeInfo && setStateData('accessibleOfficeList', officeInfo, setState);
    }, [officeInfo]);

    useEffect(() => {
        if (timeIntervals) {
            setStateData('timeIntervals', timeIntervals, setState);
            setTimeIntervalData(timeIntervals);
        }
    }, [timeIntervals]);

    useEffect(() => {
        setStateData(
            'title',
            selectedSavedSearch?.savedSearch?.searchName || agentProductionTerms.proficiencyMetrics,
            setState
        );
    }, [selectedSavedSearch]);

    useEffect(() => {
        if (!search?.mlsId) return;
        setStateData('mlsId', search.mlsId, setState);
    }, [search]);

    useEffect(() => {
        if (loadedSearchCriteria?.timePeriod) {
            setStateData('selectedTimePeriod', loadedSearchCriteria.timePeriod, setState);
        }
    }, [loadedSearchCriteria]);

    useEffect(() => {
        if (agentData === undefined) {
            setStateData('selectedData', undefined, setState);
            setViewHideAgentsDropdownValue(viewHideAgentsDropdownLabels.viewHideAgents);
        } else if (agentData.constructor.name === 'Object' && agentData.error) {
            setStateData('showModal', true, setState);
        }
        resetTableColsAndSortsToDefault();
    }, [agentData]);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            overviewColumns: getDefaultOverviewColumns(),
            contactInfoColumns: getDefaultContactInfoColumns(restrictedMlsSettings),
            growthAnalysisColumnsLtm: getDefaultGrowthAnalysisColumnsLtm(),
            growthAnalysisColumnsYtd: getDefaultGrowthAnalysisColumnsYtd(),
            listingProficiencyColumns: getDefaultListingProfColumns()
        }));
    }, [state.mlsId]);

    useEffect(() => {
        if (agentData) {
            const sortedData = getSortedObjectsNumeric(agentData, agentsColumns.totalVolume.id);
            const revisedData = sortedData.map((agent, i) => ({ ...agent, rank: i + 1 }));
            switch (viewHideAgentsDropdownValue) {
                case viewHideAgentsDropdownLabels.viewOnlyMyAgents:
                    setStateData('selectedData', revisedData?.filter(element => accessibleOfficeSet?.has(element.officeId)), setState);
                    break;
                case viewHideAgentsDropdownLabels.hideMyAgents:
                    setStateData('selectedData', revisedData?.filter(element => !accessibleOfficeSet?.has(element.officeId)), setState);
                    break;
                case viewHideAgentsDropdownLabels.viewHideAgents:
                    setStateData('selectedData', revisedData, setState);
                    break;
                default:
                    setStateData('selectedData', revisedData, setState);
            }
        }
    }, [viewHideAgentsDropdownValue, agentData, state.accessibleOfficeList]);

    useEffect(() => {

        if (!state.selectedTimePeriod || !state.timeIntervals.length) return;
        let currentSearchDates;
        if (state.selectedTimePeriod.intervalType !== TimePeriods['Custom Date']) {
            const interval = state.timeIntervals?.find(i => i?.intervalType === state.selectedTimePeriod.intervalType);
            if (interval) {
                const lastIntervalText = getKeyByValue(TimePeriods, state.selectedTimePeriod.intervalType);
                const from = new Date(`${interval.last.from}Z`);
                const to = new Date(`${interval.last.to}Z`);
                currentSearchDates = { lastIntervalText, from, to };
            }
        } else {
            const lastIntervalText = state.selectedTimePeriod.intervalType;
            const from = new Date(state.selectedTimePeriod.startDate);
            const to = new Date(state.selectedTimePeriod.endDate);
            currentSearchDates = { lastIntervalText, from, to };
        }
        setStateData('currentSearchDates', currentSearchDates, setState);
    }, [state.selectedTimePeriod, state.timeIntervals]);

    useEffect(() => {
        setStateData(
            'currentAgentChart',
            state.selectedData?.length > 0 ? state.selectedData[0] : null,
            setState
        );
        !state.selectedData && setStateData('showModal', false, setState);
    }, [state.selectedData]);

    const handleAgentChart = (agent) =>
        setStateData('currentAgentChart', agent, setState);

    const { chartOptions, chartSchema } = getAgentChartSettings(handleAgentChart);

    const last12MonthsDates = state.timeIntervals.length ? state.timeIntervals?.find(t => t?.intervalType === TimePeriods['Last 12 Months'])?.last : {};

    const setSortedLtmGrowthAnalysisColumn = (field) => {
        setStateData('sortedLtmGrowthAnalysisColumn', field, setState);
    };

    const setSortedYtdGrowthAnalysisColumn = (field) => {
        setStateData('sortedYtdGrowthAnalysisColumn', field, setState);
    };

    const setSortedListingProfColumn = (field) => {
        setStateData('sortedListingProfColumn', field, setState);
    };

    const resetTableColsAndSortsToDefault = () => {
        setCurrentTab(0);
        [ setSortedLtmGrowthAnalysisColumn,
            setSortedYtdGrowthAnalysisColumn, setSortedListingProfColumn].map(setOption => {
            setOption('totalVolume');
        });
    };

    const additionalTableHeaders = useOverviewAdditionalHeaders(
        state.overviewColumns,
        state.selectedData?.length,
        last12MonthsDates,
        state.currentSearchDates
    );

    const growthTableHeadersLtm = useGrowthAnalysisAdditionalHeaders(
        state.growthAnalysisColumnsLtm
    );

    const growthTableHeadersYtd = useGrowthAnalysisAdditionalHeaders(
        state.growthAnalysisColumnsYtd
    );

    const contactInfoAdditionalHeaders = useContactInfoAdditionalHeaders(
        state.contactInfoColumns,
        state.currentSearchDates,
    );

    const proficiencyTableHeaders = useListingProfAdditionalHeaders(
        state.listingProficiencyColumns
    );

    const isExportDisabled = state.selectedData?.length === 0;

    const setListingProficiencyColumns = columns => {
        setStateData('listingProficiencyColumns', columns, setState);
    };

    const setOverviewColumns = (overviewColumns) => {
        setStateData('overviewColumns', overviewColumns, setState);
    };

    const setContactInfoColumns = (contactInfoColumns) => {
        setStateData('contactInfoColumns', contactInfoColumns, setState);
    };

    const setGrowthAnalysisColumnsYtd = cols => {
        setStateData('growthAnalysisColumnsYtd', cols, setState);
    };

    const setGrowthAnalysisColumnsLtm = (growthAnalysisColumnsLtm) => {
        setStateData('growthAnalysisColumnsLtm', growthAnalysisColumnsLtm, setState);
    };

    const setGrowthAnalysisPeriod = (period) => {
        setStateData('growthAnalysisPeriod', period, setState);
    };

    const yearDetails = getSearchDateYearDetails(state.currentSearchDates, state.currentTab);

    const headerProps = {
        module: module,
        isExportDisabled,
        exportCsv: () => exportCsv(state, setState, state.currentTab, state.selectedData),
        showExportButton: true,
        title: state.title,
        tab: state.currentTab,
        growthAnalysisPeriod: state.growthAnalysisPeriod,
        agentData: state.selectedData,
        year: yearDetails,
        showShareButton: false
    };

    const initialSearchNotRun = <>
        <TitleRow
            title={state.title}
            module={module}
            showExportButton={false}
            showHideAgentsDropdown={false}
        />
        <div className='text-center'>
            <br />
            <p className='initial-search'>
                {agentProductionTerms.initialLoad}
            </p>
        </div>
    </>;

    const loader = <div className='py-3'><Loader /></div>;

    const resultsFound = <>
        <Modal {...state.modalProps} show={state.showModal} />
        <TitleRow {...headerProps} showHideAgentsDropdown={true}
                  viewHideAgentsDropdownValue={viewHideAgentsDropdownValue}
                  setViewHideAgentsDropdownValue={setViewHideAgentsDropdownValue}
        />
        <div className='content'>
            <Tab
                tabTextTransform='none'
                navSize={4}
                contentSize={4}
                items={[
                    {
                        title: agentProductionTerms.overview,
                        content: {
                            jsx: (
                                <Overview
                                    agentData={state.selectedData}
                                    chartOptions={chartOptions}
                                    chartSchema={chartSchema}
                                    currentAgentChart={state.currentAgentChart}
                                    additionalTableHeaders={additionalTableHeaders}
                                    columns={state.overviewColumns}
                                    setColumns={setOverviewColumns}
                                    module={module}
                                />
                            )
                        }
                    },
                    {
                        title: agentProductionTerms.contactInformation,
                        content: {
                            jsx: (
                                <ContactInformation
                                    additionalTableHeaders={contactInfoAdditionalHeaders}
                                    agentData={state.selectedData}
                                    columns={state.contactInfoColumns}
                                    setColumns={setContactInfoColumns}
                                />
                            )
                        }
                    },
                    {
                        title: agentProductionTerms.growthAnalysis,
                        content: {
                            jsx: (
                                <GrowthAnalysis
                                    agentData={state.selectedData}
                                    additionalTableHeadersLtm={growthTableHeadersLtm}
                                    additionalTableHeadersYtd={growthTableHeadersYtd}
                                    growthAnalysisPeriod={state.growthAnalysisPeriod}
                                    setGrowthAnalysisPeriod={setGrowthAnalysisPeriod}
                                    ltmColumns={state.growthAnalysisColumnsLtm}
                                    ytdColumns={state.growthAnalysisColumnsYtd}
                                    setColumnsLtm={setGrowthAnalysisColumnsLtm}
                                    setColumnsYtd={setGrowthAnalysisColumnsYtd}
                                    currentSearchDates={state.currentSearchDates}
                                />
                            )
                        }
                    },
                    {
                        title: agentProductionTerms.listingProficiency,
                        content: {
                            jsx: (<ListingProficiency
                                    agentData={state.selectedData}
                                    additionalTableHeaders={proficiencyTableHeaders}
                                    setColumns={setListingProficiencyColumns}
                                    columns={state.listingProficiencyColumns}
                                />
                            )
                        }
                    }
                ]}
                tabs
                currentIndex={state.currentTab}
                setCurrentIndex={(index) => setCurrentTab(index)}
            />
            <AddAgentListPopover />
        </div>
    </>;


    const noResultsFound = <>
        <TitleRow
            title={state.title}
            module={module}
            showExportButton={false}
            showHideAgentsDropdown={false}
        />
        <div className='text-center'>
            <br />
            <NoResultsMessage/>
        </div>
    </>;

    const noResponse = <>
        <TitleRow
            title={state.title}
            module={module}
            showExportButton={false}
            showHideAgentsDropdown={false}
        />
        <div className='content text-center'>
            <br />
            <p className='initial-search'>{agentProductionTerms.initialLoad}</p>
        </div>
        {
            ![400, 404, 409].includes(state.selectedData?.response)
            && <Modal
                {...state.modalProps}
                title={<p style={{ fontWeight: 'bold' }}>Error</p>}
                children={
                    <div style={{ paddingBottom: '30px' }}>
                        {
                            !state.selectedData?.response || state.selectedData?.response !== 413
                                ? <>
                                    {agentProductionTerms.errorServerNoResponse}
                                    <a href='mailto:support@lwolf.com'
                                       style={{ textDecoration: 'underline' }}
                                    >
                                        support@lwolf.com
                                    </a>.
                                </>
                                : state.selectedData?.response === 413
                                && agentProductionTerms.errorServer413
                        }
                    </div>
                }
                showFooter={true}
                show={state.showModal}
                onClose={toggleModal}
            />
        }
    </>;

    const noOnlyMyAgentsResultsFound = <>
        <TitleRow
            {...headerProps}
            title={state.title}
            showHideAgentsDropdown={true}
            viewHideAgentsDropdownValue={viewHideAgentsDropdownValue}
            setViewHideAgentsDropdownValue={setViewHideAgentsDropdownValue}
        />
        <div className='content text-center'>
            <br />
            <p className='no-search-results-suggestion'>
                {agentProductionTerms.viewOnlyMyAgentsNoData}
            </p>
        </div>
    </>;

    const isInitialSearchNotRun = loadedSearchCriteria === undefined;

    const hasResults = !!state.selectedData?.length;

    const hasNoResults = state.selectedData?.length === 0;

    const hasNoResponse = state.selectedData?.constructor.name === 'Object';

    const hasNoOnlyMyAgentsResults = viewHideAgentsDropdownValue === viewHideAgentsDropdownLabels.viewOnlyMyAgents
        && state.selectedData?.constructor.name === 'Array' && state.selectedData?.length === 0;

    if (isLoadingSearchData) {
        return loader;
    }

    if (isInitialSearchNotRun) {
        return initialSearchNotRun;
    }

    if (hasNoResponse) {
        return noResponse;
    }

    if (hasResults) {
        return resultsFound;
    }

    if (hasNoOnlyMyAgentsResults) {
        return noOnlyMyAgentsResultsFound;
    }

    if (hasNoResults) {
        return noResultsFound;
    }
    return loader;
};

AgentProduction.propTypes = {
    agentData: PropTypes.object,
    module: PropTypes.string
};

export default AgentProduction;
