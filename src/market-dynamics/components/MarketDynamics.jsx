import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Loader from '@lwt-helix/loader';
import TitleRow from './common/TitleRow';
import ChartToggle from './common/chartToggle';
import OptionsSelector from './common/OptionsSelector';
import ListingViewOptions from './common/ListingViewOptions';
import KeyInformation from './common/KeyInformation';
import ResultsChart from '../components/chart/ResultsChart';
import { marketDynamicsTerms, buttonTerms } from '../../constants';
import { useSearchStore, useCommonStore } from '../../store/store';
import { useMarketDynamicsStore } from '../../store/marketDynamics/store';
import { setStateData } from '../../common/helpers/state';
import { getConfig } from '../helpers/configGenerator';
import { translateListingViewGroups } from '../helpers/listingViews';
import { setDefaultOptionsToChecked, getStatusOptions } from '../helpers/listingStatuses';
import { terms as t, periodKeys } from '../constants';
import { NoResultsMessage } from '../../common/components/search/NoResultsMessage';
import { hasAllZeroValues, getConfigData, getTransformData, getTransformKeyFields } from '../helpers/helpers';
import { getRevisedColumnDefs, getRevisedTooltipSettings } from '../helpers/agGrid';
import { marketDynamicsTooltips } from '../constants/tooltipDefinitions';
import Table from '../../common/components/table/agGrid/Table';
import { getExportButton } from '../../market-share/helpers/exportButton';
import { exportTypes } from '../../market-share/helpers/export';
import { listingStatuses as ls} from '../constants/listingStatuses';
import { marketDynamicsColumns } from '../constants/marketDynamicsColumns';
import { officeBreakdownRoute } from '../constants/routes';
import { cdomBreakout } from '../constants/listingViews/cdomBreakout';
import { useFeatureToggles } from '../../common/hooks/featureToggles';

const MarketDynamics = ({ module, agentData }) => {
    const {
        isLoading,
        loadedSearchCriteria,
    } = useSearchStore(state => ({
        isLoading: state.isLoading,
        loadedSearchCriteria: state[module]?.loadedSearchCriteria,
    }));

    const {
        checkedStatusOptions,
        setSelectedBreakdownPeriod,
        setTableView,
        setCheckedStatusOptions,
        tableView,
    } = useMarketDynamicsStore(state => ({
        checkedStatusOptions: state.checkedStatusOptions,
        setSelectedBreakdownPeriod: state.setSelectedBreakdownPeriod,
        setTableView: state.setTableView,
        setCheckedStatusOptions: state.setCheckedStatusOptions,
        tableView: state.tableView,
    }));

    const history = useHistory();
    const featureToggles = useFeatureToggles();

    const {
        selectedBeginValue,
        selectedEndValue,
        setBackNavbarTitle,
    } = useCommonStore(state => ({
        selectedBeginValue: state.selectedBeginValue,
        selectedEndValue: state.selectedEndValue,
        setBackNavbarTitle: state.setBackNavbarTitle,
    }));

    const [state, setState] = useState({
        config: undefined,
        listingViewId: undefined,
        listingViewOptions: undefined,
        statusOptions: undefined,
        shouldShowChart: true,
        selectedPeriodComparison: periodKeys.beginVsEndMonth,
        tooltipsSettings: {}
    });

    const gridRef = useRef();

    const listingConfig = getConfigData(state.listingViewId, state.config);

    const searchResults = getTransformData(agentData?.marketDynamicsSearch);
    const keysToDisregard = [marketDynamicsColumns.timePeriodStart.id, 'timePeriodEnd'];
    const hasSearchResults = useMemo(() => !hasAllZeroValues(searchResults, keysToDisregard), [searchResults]);

    const handleListingViewItemClick = id => {
        setStateData('listingViewId', id, setState);
    };

    const shouldHideCdomOption = (option) => {
        const { keyField } = option;
        return option.id === ls.averageCdom.id &&
            searchResults?.every(result => !result?.[keyField]);
    };

    useEffect(() => {
        const timePeriod = loadedSearchCriteria?.timePeriod.intervalType;

        const config = getConfig({ timePeriod });

        const { listingViewOptions, defaultListingViewId, statusOptions  } = translateListingViewGroups({
            listingViewGroups: config,
            selectedListingViewId: null,
            handleListingViewItemClick
        });

        setState(prevState => ({
            ...prevState,
            config,
            listingViewOptions,
            listingViewId: defaultListingViewId,
            statusOptions
        }));
    }, [loadedSearchCriteria]);

    useEffect(() => {
        const statusOptions = setDefaultOptionsToChecked(getStatusOptions(state.config, state.listingViewId), shouldHideCdomOption);

        setState(prevState => ({
            ...prevState,
            statusOptions
        }));
    }, [state.listingViewId, loadedSearchCriteria]);

    useEffect(() => {
        setStateData('selectedPeriodComparison', periodKeys.beginVsEndMonth, setState);
    }, [loadedSearchCriteria, state.listingViewId]);

    useEffect(() => {
        const periodColumnSettings = listingConfig?.groupConfig?.columnSettings;
        const tableView = listingConfig?.listingConfig?.tableSettings;
        const tooltipsSettings = getRevisedTooltipSettings({
            tableView,
            periodColumnSettings,
            marketDynamicsTooltips
        });
        const selectedStatusOptionsIds = state.statusOptions?.filter(status => status.checked)
            .map(status => status.id);
        const revisedColumnDefs = getRevisedColumnDefs(tableView, periodColumnSettings, selectedStatusOptionsIds);
        setTableView({ tableView: revisedColumnDefs });
        setStateData('tooltipsSettings', tooltipsSettings, setState);
    }, [state.listingViewId, loadedSearchCriteria, listingConfig?.groupConfig, state.statusOptions, selectedBeginValue, selectedEndValue]);

    useEffect(() => {
        const checkedStatusOptions = getTransformKeyFields(state.statusOptions, state.listingViewId)?.filter(status => status.checked) ?? [];
        setCheckedStatusOptions(checkedStatusOptions);
    }, [state.statusOptions]);

    const setSelectedPeriodComparison = (selectedPeriod) => {
        setStateData('selectedPeriodComparison', selectedPeriod, setState);
    };
    const getStatusMessage = ({messageContent}) => {
        return <>
             <TitleRow module={module} />
             <div className="text-center"> { messageContent } </div>
         </>
    };

    const isInitialSearchNotRun = loadedSearchCriteria === undefined;

    const loader = <div className='py-3'><Loader /></div>;
    const initialSearchNotRun = getStatusMessage({
        messageContent: <p className="initial-search"> {marketDynamicsTerms.searchFilterAdjust} </p>
    });

    if (isLoading) {
        return loader
    }

    if (isInitialSearchNotRun) {
        return initialSearchNotRun;
    }
    if (!hasSearchResults) {
        return getStatusMessage({ messageContent: <NoResultsMessage /> });
    }

    let listingViewOptions, statusOptionsSelector, chartToggle, exportButton;

    const setSelectedStatusOptions = options => {
        setStateData('statusOptions', options, setState);
    };

    if (state.listingViewOptions?.length) {
        listingViewOptions = <ListingViewOptions options={state.listingViewOptions}
                                                 listingViewId={state.listingViewId}
                                                 title={t.listingViews} />;
    }

    const setShouldShowChart = () => setStateData('shouldShowChart', !state.shouldShowChart, setState);

    if (state.statusOptions?.length) {
        chartToggle = <ChartToggle shouldShowChart={state.shouldShowChart}
                                   setShouldShowChart={setShouldShowChart} />;
        statusOptionsSelector = <OptionsSelector id='statusOptions'
                                                 setOptions={setSelectedStatusOptions}
                                                 options={state.statusOptions}
                                                 title={buttonTerms.statuses} />;
    }

    const shouldShowExportButton = () => state.statusOptions;

    if (hasSearchResults) {
        const exportDetails = {
            exportType: exportTypes.marketDynamicsSearchResults,
            listingView: t[state.listingViewId]
        };
        exportButton = shouldShowExportButton && getExportButton(exportDetails, gridRef);
    }

    const titleRowProps = {
        exportButton,
        statusOptionsSelector,
        chartToggle,
        listingViewOptions,
        module
    };
    const handleBarClick = (index) => {
        const isMDOfficeBreakdownEnabled = featureToggles.mdOfficeBreakdown.isEnabled;
        const isCdomBreakoutView = state.listingViewId === cdomBreakout.value;
        if (!isMDOfficeBreakdownEnabled || isCdomBreakoutView) return;

        const chartData = searchResults.slice().reverse();
        const period = chartData[index].timePeriodStart;
        const formatter = tableView.tables[0].colDef.valueFormatter;
        const valueFormatted = formatter({value: period});
        setBackNavbarTitle(valueFormatted);
        setSelectedBreakdownPeriod(chartData[index]);
        history.push(officeBreakdownRoute);
    };

    const updatedStatusOptions = getTransformKeyFields(state.statusOptions, state.listingViewId);
    const renderChart = () => {
        const chartData = (searchResults && [...searchResults])?.slice().reverse();
        const selectedBeginIndex = chartData?.findIndex(data => data.timePeriodStart === selectedBeginValue);
        const selectedEndIndex = chartData?.findIndex(data => data.timePeriodStart === selectedEndValue);
        return (<ResultsChart
            data={chartData}
            checkedStatusOptions={checkedStatusOptions}
            config={listingConfig}
            selectedPeriodComparison={state.selectedPeriodComparison}
            setSelectedPeriodComparison={setSelectedPeriodComparison}
            agentData={agentData?.marketDynamicsSearch}
            selectedBeginIndex={selectedBeginIndex}
            selectedEndIndex={selectedEndIndex}
            handleBarClick={handleBarClick}
        />);
    };

    return <>
        <TitleRow  {...titleRowProps} />
        { state.shouldShowChart &&
            <>
                {renderChart()}
                <KeyInformation
                    selectedPeriodComparison={state.selectedPeriodComparison}
                    searchResults={searchResults}
                    statusOptions={updatedStatusOptions}
                    searchCriteria={loadedSearchCriteria}
                    listingConfig={listingConfig}
                    beginPeriodDate={selectedBeginValue}
                    endPeriodDate={selectedEndValue}
                />
            </>
        }
        {searchResults && tableView &&
            <div className="mt-2">
                <Table
                    gridRef={gridRef}
                    tableView={tableView}
                    rowData={searchResults}
                    tableTitleWithTooltips={state.tooltipsSettings}
                />
            </div>
        }
    </>;
};

MarketDynamics.propTypes = {
    module: PropTypes.string,
    agentData: PropTypes.array
};

export default MarketDynamics;
