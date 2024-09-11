import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import Tab from '@lwt-helix/tab';
import {
    getCoverageListingBreakdown,
    getListingBreakdown,
    getBreakdownOfficeDetails,
    getOfficeBreakdownList
} from '../../service/service-gateway';
import { setStateData } from '../../common/helpers/state';
import { useQuery } from '../../common/hooks/location';
import { listingsBreakdownKeys, marketShareTerms } from '../constants';
import { settingsListingsBreakdown } from '../constants/breakdownViews';
import { getSortedColumns, useURIDecoder } from '../helpers/helpers';
import TitleInfo from './common/TitleInfo';
import ResultsTable from './ResultsTable';
import NoRowsTitle from '../../common/components/table/NoRowsTitle';
import { searchTypes } from '../constants';
import Loader from '@lwt-helix/loader';
import { coverageSettingsListingsBreakdown } from '../constants/coverageBreakdownViews';
import { modules } from '../../constants';
import OfficeDetails from './OfficeDetailsBreakdown';
import { getExportButton } from '../helpers/exportButton';
import { exportTypes } from '../helpers/export';
import { getAdditionalColDefinitions } from '../helpers/resultsTable';
import { getListingStatusForSearchType } from '../constants/listingStatuses';
import { useCommonStore, useSearchStore } from '../../store/store';

const ListingsBreakdown = ({ module }) => {

        const gridRef = useRef();
        const query = useQuery();
        const location = useLocation();
        const history = useHistory();
        const title = useURIDecoder('office');
        const officeId = query.get('id');
        const listingTypeId = location.state?.listingTypeId;
        const listingViewId = location.state?.view;
        const areaId = location.state?.area;
        const isCoverageSearch = module === modules.marketShare.coverage;

        const {
            search,
            loadedSearchCriteria
        } = useSearchStore(state => ({
            search: state[module]?.search,
            loadedSearchCriteria: state[module]?.loadedSearchCriteria
        }));

        const mlsProviders = useCommonStore(state => state.mlsProviders);

        const [state, setState] = useState({
            soldBothSides: [],
            soldListSide: [],
            soldSellSide: [],
            forSale: [],
            underContract: [],
            newListings: [],
            officeDetails: [],
            searchCriteria: null,
            isLoading: true,
            selectedMlsId: null,
            isShowAdditionalInfo: false,
            sortedColumns: { 0: undefined },
            currentTabIndex: 0
        });

        const searchType = state.searchCriteria?.realEstateDatasourceIdsWithFilters[0]?.computedFields
            .find(computedField => computedField.fieldName === 'transactionStatus')?.fieldValues[0];

        const shouldRender = !!module;

        useEffect(() => {
            if (!shouldRender) {
                history.push('/');
            }
        }, []);

        useEffect(() => {
            if (search?.searchCriteria?.criteria === undefined) {
                setState(prevState => ({
                    ...prevState,
                    isLoading: false
                }));
                history.goBack();
            }
        }, [search]);

        useEffect(() => {
            setStateData('searchCriteria', loadedSearchCriteria, setState);
        }, [loadedSearchCriteria]);

        useEffect(() => {
            setStateData('selectedMlsId', search?.mlsId, setState);
        }, [search]);

        const getRows = async (transactionStatus, officeId, searchCriteria, selectedMlsId) => {
            let error;
            const getListings = isCoverageSearch ? getCoverageListingBreakdown : getListingBreakdown;
            const listingsRows = await getListings(officeId, searchCriteria, transactionStatus, areaId).catch(e => {
                error = e;
            });
            let officeDetailsRow = await getBreakdownOfficeDetails(selectedMlsId, officeId).catch(e => {
                error = e;
            });
            const brokerId = officeDetailsRow?.brokerId;
            const offices = await getOfficeBreakdownList(brokerId, state.searchCriteria).catch(e => {
                error = e;
            });
            const selectedMls = mlsProviders.find(mls => mls.mlsId === selectedMlsId)?.shortDescription;
            const agentCount = offices?.results?.find(office => office.officeId === officeId)?.agentCount;
            officeDetailsRow = { ...officeDetailsRow, mlsId: agentCount, mls: selectedMls };
            return { listingsRows, officeDetailsRow, error };
        };

        const processError = (e, errorType) => console.log(`Listing Breakdown ${errorType} error: ${e}`);

        useEffect(() => {
            if (!shouldRender) return;
            if (!state.searchCriteria) return;
            let soldBothSides = [];
            let soldListSide = [];
            let soldSellSide = [];
            let forSale = [];
            let underContract = [];
            let newListings = [];
            let officeDetails = [];

            const loadListings = async () => {

                setStateData('isLoading', true, setState);
                if (searchType === searchTypes.soldBothSides) {
                    const result = await getRows(searchTypes.soldBothSides, officeId, state.searchCriteria, state.selectedMlsId);
                    if (result.error) {
                        processError(result.error, searchTypes.soldBothSides);
                        return;
                    }
                    soldBothSides = result.listingsRows;
                    officeDetails = result.officeDetailsRow;
                }
                if ([searchTypes.soldListSide, searchTypes.soldBothSides].find(t => t === searchType)) {
                    const result = await getRows(searchTypes.soldListSide, officeId, state.searchCriteria, state.selectedMlsId);
                    if (result.error) {
                        processError(result.error, searchTypes.soldListSide);
                        return;
                    }
                    soldListSide = result.listingsRows;
                    officeDetails = result.officeDetailsRow;
                }
                if ([searchTypes.soldSellSide, searchTypes.soldBothSides].find(t => t === searchType)) {
                    const result = await getRows(searchTypes.soldSellSide, officeId, state.searchCriteria, state.selectedMlsId);
                    if (result.error) {
                        processError(result.error, searchTypes.soldSellSide);
                        return;
                    }
                    soldSellSide = result.listingsRows;
                    officeDetails = result.officeDetailsRow;
                }
                if (searchType === searchTypes.forSale) {
                    const result = await getRows(searchTypes.forSale, officeId, state.searchCriteria, state.selectedMlsId);
                    if (result.error) {
                        processError(result.error, searchTypes.forSale);
                        return;
                    }
                    forSale = result.listingsRows;
                    officeDetails = result.officeDetailsRow;
                }
                if (searchType === searchTypes.underContract) {
                    const result = await getRows(searchTypes.underContract, officeId, state.searchCriteria, state.selectedMlsId);
                    if (result.error) {
                        processError(result.error, searchTypes.underContract);
                        return;
                    }
                    underContract = result.listingsRows;
                    officeDetails = result.officeDetailsRow;
                }
                if (searchType === searchTypes.newListings) {
                    const result = await getRows(searchTypes.newListings, officeId, state.searchCriteria, state.selectedMlsId);
                    if (result.error) {
                        processError(result.error, searchTypes.newListings);
                        return;
                    }
                    newListings = result.listingsRows;
                    officeDetails = result.officeDetailsRow;
                }
                Promise.all([soldBothSides, soldListSide, soldSellSide, forSale, underContract, newListings, officeDetails])
                    .then(() => setStateData('isLoading', false, setState));

                setState({
                    ...state,
                    soldBothSides,
                    soldListSide,
                    soldSellSide,
                    forSale,
                    underContract,
                    newListings,
                    officeDetails
                });
            };

            const detailError = (e) => console.error(e);

            loadListings().catch(detailError);

        }, [state.searchCriteria]);

        if (!shouldRender) return (<></>);

        const tabItems = isCoverageSearch ? coverageSettingsListingsBreakdown[listingViewId]?.settings
            : settingsListingsBreakdown[listingViewId]?.settings;

        const onSortChanged = (e) => {
            const sortedColumn = e?.columnApi.columnModel.gridColumns.find(colDef => colDef.sort);
            const sortedColumnsByTab = {
                ...state.sortedColumns,
                [state.currentTabIndex]: sortedColumn
            };
            setStateData('sortedColumns', sortedColumnsByTab, setState);
        };

        const updatedTabItems = tabItems?.map((listing, tabIndex) => {
            if (tabIndex !== state.currentTabIndex) {
                return {
                    title: listing.label,
                    content: {
                        jsx: <></>
                    }
                };
            }
            if (listing.id === listingsBreakdownKeys.officeDetails) {
                return {
                    title: listing.label,
                    content: {
                        jsx: <div className='d-flex mt-2' id='office-details'>
                            <OfficeDetails data={state.officeDetails} mlsProviders={mlsProviders} />
                        </div>
                    }
                };
            }
            const colDefs = isCoverageSearch ? listing.columns : listing.columns[listingTypeId];
            const rowData = state[listing.id];
            const currentSortedColumn = state.sortedColumns[state.currentTabIndex];
            const sortedColumnsDefs = rowData?.length
                ? getSortedColumns(colDefs, currentSortedColumn?.colId || 'date', currentSortedColumn?.sort)
                : [];
            const columnDefs = getAdditionalColDefinitions(sortedColumnsDefs, state.isShowAdditionalInfo);
            let noRowMessage = null;

            if (listing.id.toLowerCase() === searchTypes.soldListSide.toLowerCase() ||
                listing.id.toLowerCase() === searchTypes.soldSellSide.toLowerCase()) {
                noRowMessage = { message: marketShareTerms.noListingRowsToShow(listing.label) };
            }

            return {
                title: listing.label,
                content: {
                    jsx: (
                        <div className='mt-2'>
                            <ResultsTable
                                gridRef={gridRef}
                                rowData={rowData}
                                columnDefs={columnDefs}
                                noRowsComponent={NoRowsTitle}
                                noRowMessage={noRowMessage}
                                onSortChanged={onSortChanged}
                            />
                        </div>
                    )
                }
            };
        }) || [];

        const handleAdditionalInfoToggleChange = () => setStateData('isShowAdditionalInfo', !state.isShowAdditionalInfo, setState);
        const setCurrentTabIndex = (tabIndex) => setStateData('currentTabIndex', tabIndex, setState);
        const hasToggle = tabItems && tabItems[state.currentTabIndex].id !== listingsBreakdownKeys.officeDetails;

        let exportButton;
        const currentTabHasRows = tabItems && state[tabItems[state.currentTabIndex]?.id]?.length;

        if (currentTabHasRows) {
            const searchType = tabItems[state.currentTabIndex]?.id;
            const listingBreakdownStatus = getListingStatusForSearchType(searchType);
            const exportDetails = {
                exportType: exportTypes.listingsBreakdown,
                tableName: title,
                listingBreakdownStatus
            };
            exportButton = getExportButton(exportDetails, gridRef);
        }

        return <>
            <TitleInfo
                title={title}
                subtitle={marketShareTerms.listingBreakdown}
                hasToggle={hasToggle}
                exportButton={exportButton}
                isAdditionalInfoToggleChecked={state.isShowAdditionalInfo}
                handleAdditionalInfoToggleChange={handleAdditionalInfoToggleChange} />
            {state.isLoading
                ? <Loader />
                : <Tab
                    tabTextTransform='none'
                    items={updatedTabItems}
                    currentIndex={state.currentTabIndex}
                    setCurrentIndex={setCurrentTabIndex}
                    contentSize={updatedTabItems?.length}
                    navSize={updatedTabItems?.length}
                />
            }
        </>;
    }
;

ListingsBreakdown.propTypes = {
    module: PropTypes.string,
    mlsProviders: PropTypes.array
};

export default ListingsBreakdown;
