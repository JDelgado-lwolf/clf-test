import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer } from '@lwt-helix/toast';
import Loader from '@lwt-helix/loader';
import { setStateData } from '../../common/helpers/state';
import { getConfig, getCoverageConfig } from '../helpers/configGenerator';
import { getRowCount, usePreviousState } from '../helpers/helpers';
import { listingTypes, marketShareTerms, showHideTypes } from '../constants';
import { modules, searchTerms } from '../../constants';
import TitleRow from './common/TitleRow';
import { ResultsChart } from './ResultsChart';
import MarketShareTable from './ResultsTable';
import { getExportButton } from '../helpers/exportButton';
import { exportTypes } from '../helpers/export';
import { getBottomRowSettings } from '../helpers/agGrid';
import { getListingStatus } from '../helpers/listingStatus';
import { useLocation } from 'react-router-dom';
import { getPinnedRowRouteSettings } from '../../common/routes/routes';
import { useSearchStore } from '../../store/store';
import { NoResultsMessage } from '../../common/components/search/NoResultsMessage';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { getAllOtherOfficesIds } from '../helpers/officesBreakdown';

const MarketShare = ({ module, agentData }) => {
    const {
        areaTypeTitle,
        loadedSearchCriteria,
        selectedMls,
        isLoadingSearchData,
        selectedComparisonSetSearch,
        isSelectedCompSetAllOtherGroupClickable
    } = useSearchStore(state => ({
        areaTypeTitle: state[module]?.areaTypeTitle,
        loadedSearchCriteria: state[module]?.loadedSearchCriteria,
        selectedMls: state[module]?.selectedMls,
        isLoadingSearchData: state.isLoadingSearchData,
        selectedComparisonSetSearch: state[module]?.selectedComparisonSetSearch,
        isSelectedCompSetAllOtherGroupClickable: state[module]?.isSelectedCompSetAllOtherGroupClickable,
    }));

    const {
        isComparisonSetView,
    } = useComparisonSetsStore(state => ({
        isComparisonSetView: state.isComparisonSetView
    }));

    const [state, setState] = useState({
        listingTypeId: null,
        listingViewId: null,
        offices: [],
        brokers: [],
        comparisonSets: [],
        columnDefs: [],
        titleContent: null,
        showHideOptions: null,
        modifiedColId: null,
        isShowExportBtn: false,
        selectedRowsIds: [],
        toast: {},
        coverageSearchData: [],
        selectedAreaType: null,
        hasMlsIdChanged: undefined,
        selectedMlsId: undefined,
        isShowChart: true,
    });

    const comparisonSetsData = state.comparisonSets?.results;

    const [rowData, setRowData] = useState();
    const [coverageRowData, setCoverageRowData] = useState();

    const listingStatus = getListingStatus(module, loadedSearchCriteria);

    const isCoverageSearch = module === modules.marketShare.coverage;

    const gridRef = useRef();
    const location = useLocation();
    const previousMLS = usePreviousState(state.selectedMlsId);

    const hasData = !!(state.offices || state.brokers || comparisonSetsData);

    useEffect(() => {
        setStateData(
            'selectedAreaType',
            areaTypeTitle?.mainTitle.slice(searchTerms.selectedAreaTypeTitle.length),
            setState
        );
    }, [areaTypeTitle]);

    useEffect(() => {
        if (!loadedSearchCriteria) return
        setStateData('searchCriteria', loadedSearchCriteria, setState);
    }, [loadedSearchCriteria]);

    useEffect(() => {
        setState(state => ({
            ...state,
            offices: agentData?.officeSearch,
            brokers: agentData?.brokerSearch,
            coverageSearchData: agentData?.coverageSearch,
            comparisonSets: agentData?.comparisonSetSearch,
        }));
    }, [agentData]);

    useEffect(() => {
        setStateData('selectedMlsId', selectedMls?.mlsId, setState);
    }, [selectedMls]);

    useEffect(() => {
        if (state.selectedMlsId !== previousMLS) {
            setStateData('hasMlsIdChanged', true, setState);
        }
    }, [state.selectedMlsId]);

    useEffect(() => {
        if (isCoverageSearch) {
            if (!listingStatus) return;
        } else {
            if (!listingStatus ||
                !hasData)
                return;
        }
        let titleContent, options, coverageColumnDefs;

        if (isCoverageSearch) {

            titleContent = getCoverageConfig({
                listingStatus: listingStatus,
                listingViewId: state.listingViewId,
                data: state.coverageSearchData?.results,
                module
            });

            options = titleContent?.showHideOptions.options.map(option => {
                if (option.id === showHideTypes.onlyShowSelectedAreas.id) {
                    option = { ...option, hide: !option.isDefault };
                }
                return { ...option, hide: !option.isDefault };
            });

        } else {
            titleContent = getConfig({
                listingStatus,
                listingTypeId: isComparisonSetView ? listingTypes.comparisonSet.id : state.listingTypeId,
                listingViewId: state.listingViewId,
                data: {
                    offices: state.offices?.results,
                    brokers: state.brokers?.results,
                    comparisonSetData: comparisonSetsData,
                },
                module,
                isComparisonSetView
            });
            options = titleContent?.showHideOptions.options.map(option => {
                if (option.id === (
                    showHideTypes.onlyShowSelectedOffices.id ||
                    showHideTypes.onlyShowSelectedBrokerages.id ||
                    showHideTypes.onlyShowSelectedGroups.id)) {
                    option = { ...option, hide: !option.isDefault };
                }
                return { ...option, hide: !option.isDefault };
            });
        }

        if (isCoverageSearch && titleContent?.tableSettings) {
            let areaColumn;
            let updatedAreaColumn;
            areaColumn = titleContent.tableSettings?.columns.find(column => column.field === 'area');
            updatedAreaColumn = { ...areaColumn, headerName: state.selectedAreaType };
            coverageColumnDefs = titleContent.tableSettings?.columns.map(column => {
                if (column.field === 'area') {
                    return { ...column, ...updatedAreaColumn };
                }

                return column;
            });
        }

        const columnDefs = isCoverageSearch
            ? coverageColumnDefs
            : titleContent?.tableSettings.columns;

        setState(prevState => ({
            ...prevState,
            titleContent,
            columnDefs,
            showHideOptions: { ...titleContent?.showHideOptions, options }
        }));
    }, [state.offices, state.brokers, state.listingTypeId, state.listingViewId,
        state.coverageSearchData,listingStatus, isComparisonSetView, comparisonSetsData,]);

    useEffect(() => {
        const clickedColumn = state.showHideOptions?.columns?.find(col => col.id === state.modifiedColId);
        const columnDefs = state.columnDefs?.map(col => {
            if (col.field === clickedColumn?.id) {
                return { ...col, hide: !!clickedColumn?.hide };
            }
            if (col.groupId && col.groupId === clickedColumn?.groupId) {
                return { ...col, hide: !!clickedColumn?.hide };
            }
            return col;
        });
        if(!columnDefs?.length > 0) return;
        setState(prevState => ({
            ...prevState,
            modifiedColId: null,
            columnDefs
        }));
    }, [state.showHideOptions?.columns]);

    const updateParentColumns = ({ updatedColumns, updatedOptions, columnId }) => {
        const showHideOptions = state.showHideOptions;
        if (updatedColumns) showHideOptions.columns = updatedColumns;
        if (updatedOptions) showHideOptions.options = updatedOptions;
        setState(prevState => ({
            ...prevState,
            showHideOptions,
            modifiedColId: columnId || state.modifiedColId
        }));
    };

    const setListingTypeId = id => setStateData('listingTypeId', id, setState);
    const setListingViewId = id => setStateData('listingViewId', id, setState);
    const setSelectedRowsIds = data => setStateData('selectedRowsIds', data, setState);

    useEffect(() => {
        if (isCoverageSearch ||
            !state?.titleContent?.dataTransforms ||
            !hasData ) return;

        const listingTypeId = state.listingTypeId || listingTypes.byOffice.id;
        const supplementalData = {
            listingViewId: state?.titleContent?.listingViews?.find(lv => lv.id === state.listingViewId)?.keyField ||
                state?.titleContent?.listingViews?.find(lv => lv.isDefault).keyField,
            listingTypeId: isComparisonSetView ? listingTypes.byBrokerage.id : listingTypeId,
            sumOfColumn: state?.titleContent?.sumOfColumns?.[isComparisonSetView ? listingTypes.comparisonSet.id : listingTypeId],
            rowCount: getRowCount(state[listingTypes[listingTypeId].collectionKey])
        };

        let loopTransformedData = {
            offices: state.offices?.results.map(office => ({ ...office, ...supplementalData })) ?? [],
            brokers: state.brokers?.results.map(broker => ({ ...broker, ...supplementalData })) ?? [],
            comparisonSetData: comparisonSetsData?.map((group, i) => ({ ...group, supplementalData, groupId: i })) ?? [],
        };

        state.titleContent?.dataTransforms?.forEach(transform => {
            loopTransformedData = transform(loopTransformedData);
        });

        setState(prevState => ({
            ...prevState,
            selectedRowsIds: loopTransformedData?.filter(row => row.isSelected === true).map(row => row.officeId || row.brokerId || row.groupId),
            isShowExportBtn: !!loopTransformedData?.length
        }));

        setRowData(loopTransformedData?.length ? loopTransformedData : null);
    }, [state.titleContent, state.offices, state.brokers, state.listingTypeId,
        state.listingViewId, isCoverageSearch, comparisonSetsData]);

    useEffect(() => {
        if (!isCoverageSearch ||
            !state?.titleContent?.dataTransforms ||
            !state.coverageSearchData) return;

        const supplementalData = {
            listingViewId: state?.titleContent?.listingViews?.find(lv => lv.id === state.listingViewId)?.keyField ||
                state?.titleContent?.listingViews?.find(lv => lv.isDefault).keyField,
            sumOfColumn: state?.titleContent?.sumOfColumn,
            rowCount: state.titleContent?.rowCount
        };
        let transformedData = {
            data: [...state.coverageSearchData?.results].map(entry => ({ ...entry, ...supplementalData }))
        };
        state.titleContent?.dataTransforms?.forEach(transform => {
            transformedData = transform(transformedData);
        });

        setSelectedRowsIds(transformedData?.filter(row => row.isSelected === true).map(row => row.areaId));
        setCoverageRowData(transformedData?.length && transformedData[0]?.marketSharePct
            ? transformedData
            : null);
    }, [state.titleContent, state.coverageSearchData, isCoverageSearch]);

    useEffect(async () => {
        if(!isLoadingSearchData) return;
        const officesIds = await getAllOtherOfficesIds(selectedComparisonSetSearch);
        useSearchStore.setState(prevState => ({
            ...prevState,
            [module]: {
                ...prevState[module],
                isSelectedCompSetAllOtherGroupClickable: officesIds?.length > 0
            }
        }));
    }, [isLoadingSearchData]);

    const makeRowLinkClickable = (row, rowId) => ({
        ...row,
        isSelected: state.selectedRowsIds?.includes(rowId),
        isClickable: row.groupName === marketShareTerms.allOther
            ? isSelectedCompSetAllOtherGroupClickable
            : true
    });

    const updatedRowData = rowData?.map(row => {
        const rowId = row.officeId || row.brokerId || row.groupId;
        return makeRowLinkClickable(row, rowId);
    });

    const updatedCoverageSearchData = coverageRowData?.map(row => {
        const rowId = row.areaId;
        return { ...row, isSelected: state.selectedRowsIds?.includes(rowId) };
    });

    const isShowSelectedRows = state.showHideOptions?.options &&
        !state.showHideOptions?.options.find(option => option.id === showHideTypes.onlyShowSelectedOffices.id
            || option.id === showHideTypes.onlyShowSelectedBrokerages.id
            || option.id === showHideTypes.onlyShowSelectedAreas.id
            || option.id === showHideTypes.onlyShowSelectedGroups.id)?.hide;

    const showToast = toastType => {
        let toastProperties;
        if (toastType === marketShareTerms.MAX_ROWS_ARE_SELECTED) {
            toastProperties = {
                id: 1,
                message: marketShareTerms.maxReached,
                color: 'danger',
                icon: 'error_outline_icon',
                border: 'left'
            };
        }
        // The second setState prevents the toast from reappearing on a subsequent search.
        // The toast object gets reset, but this does not remove an already visible toast
        setStateData('toast', toastProperties, setState);
        setStateData('toast', {}, setState);
    };

    const getStatusMessage = ({ hasInitialSearchRun, messageContent }) => {
        return <>
            <TitleRow
                titleContent={state.titleContent}
                module={module}
                hasInitialSearchRun={hasInitialSearchRun}
                setListingViewId={setListingViewId}
            />
            <div className='text-center'>
                {messageContent}
            </div>
        </>;
    };

    const pinnedRowDrilldownSettingsType = getPinnedRowRouteSettings(location.pathname);
    let updatedData, searchNotRunMessage, chartData, bottomRowParams, resultsTableBottomRowData,
        bottomRowType;
    if (isCoverageSearch) {
        bottomRowType = 'coverageSearch';
        chartData = updatedCoverageSearchData?.filter(row => row.isSelected);
        updatedData = updatedCoverageSearchData;
        searchNotRunMessage = marketShareTerms.searchFilterAdjustCoverage;
        resultsTableBottomRowData = state.coverageSearchData?.totals;
        bottomRowParams = {
            bottomRowType,
            pinnedRowDrilldownSettingsType,
            gridRef,
            rowData: coverageRowData,
            pinnedRowData: resultsTableBottomRowData
        };
    } else {
        bottomRowType = 'totalsSearch';
        chartData = updatedRowData?.filter(row => row.isSelected);
        updatedData = updatedRowData;
        searchNotRunMessage = marketShareTerms.searchFilterAdjust;
        const nonComparisonSetsTotals = state[listingTypes[state.listingTypeId]?.collectionKey ||
            listingTypes.byOffice?.collectionKey]?.totals;
        resultsTableBottomRowData = isComparisonSetView ? state.comparisonSets?.totals : nonComparisonSetsTotals;
        bottomRowParams = {
            bottomRowType,
            pinnedRowDrilldownSettingsType,
            gridRef,
            rowData,
            pinnedRowData: resultsTableBottomRowData
        };
    }
    const initialSearchNotRun = getStatusMessage({
        hasInitialSearchRun: false,
        messageContent: <p className='initial-search'> {searchNotRunMessage}</p>
    });

    const noResultsFound = getStatusMessage({
        hasInitialSearchRun: true,
        messageContent: <>
            <NoResultsMessage />
        </>
    });

    const handleShowHideChart = () => setStateData('isShowChart', !state.isShowChart, setState);

    const chart = state.isShowChart && <ResultsChart
        data={chartData}
        config={state.titleContent}
        hasSelectedRows={state.selectedRowsIds?.length}
    />;

    const hasRowData = rowData || coverageRowData;
    let exportButton;
    if (hasRowData) {
        const exportDetails = {
            exportType: exportTypes.marketShareSearchResults,
            listingStatus: state.titleContent?.rank,
            searchType: state.titleContent?.searchType,
            listingType: state.titleContent?.listingTypes?.find(listing => listing.isDefault)?.label
        };
        exportButton = getExportButton(exportDetails, gridRef);
    }

    const resultsFound = <>
        <TitleRow
            titleContent={state.titleContent}
            setListingTypeId={setListingTypeId}
            setListingViewId={setListingViewId}
            showHideOptions={state.showHideOptions}
            updateParentColumns={updateParentColumns}
            module={module}
            exportButton={exportButton}
            hasInitialSearchRun={true}
            handleShowHideChart={handleShowHideChart}
            isShowChart={state.isShowChart}
            isComparisonSetView={isComparisonSetView}
        />
        {listingStatus && hasRowData &&
        <>
            {chart}
            <MarketShareTable
                gridRef={gridRef}
                rowData={updatedData}
                columnDefs={state.columnDefs}
                setSelectedRowsIds={setSelectedRowsIds}
                showToast={showToast}
                isShowSelectedRows={isShowSelectedRows}
                listingTypeId={state.listingTypeId}
                listingViewId={state.listingViewId}
                listingStatus={listingStatus}
                rank={state.titleContent?.rank}
                hasHeaderTooltips={true}
                selectedRowsIds={state.selectedRowsIds}
                getBottomRowSettings={() => bottomRowParams && getBottomRowSettings(bottomRowParams)}
            />
        </>
        }
        <ToastContainer
            dataLwtId='marketShare-toast'
            toastProps={state.toast}
            position={'toast-bottom-right'}
        />
    </>;

    const loader = <div className='py-3'><Loader /></div>;

    const isInitialSearchNotRun = loadedSearchCriteria === undefined;

    const hasResults = (isCoverageSearch && listingStatus && !!state.coverageSearchData?.results?.length)
        || (listingStatus && (!!state.brokers?.results?.length || !!state.offices?.results?.length))
        || comparisonSetsData?.length;

    const searchWithNoResults = (isCoverageSearch && state.coverageSearchData?.results?.length === 0)
        || (state.offices?.results?.length === 0 || state.brokers?.results?.length === 0)
        || comparisonSetsData?.length === 0;

    if (isLoadingSearchData) {
        return loader;
    }

    if (isInitialSearchNotRun) {
        return initialSearchNotRun;
    }

    if (state.hasMlsIdChanged && searchWithNoResults) {
        return noResultsFound;
    }

    if (state.hasMlsIdChanged && hasResults) {
        return resultsFound;
    }

    return loader;
};

export default MarketShare;
