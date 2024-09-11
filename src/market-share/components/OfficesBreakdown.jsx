import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory } from 'react-router-dom';
import Loader from '@lwt-helix/loader';
import { getCoverageOfficeBreakdownList } from '../../service/service-gateway';
import { setStateData } from '../../common/helpers/state';
import { useQuery } from '../../common/hooks/location';
import { marketShareTerms } from '../constants';
import { settingsOfficesBreakdown } from '../constants/breakdownViews';
import { getSortedColumns, transformData } from '../helpers/helpers';
import TitleInfo from './common/TitleInfo';
import ResultsTable from './ResultsTable';
import { modules, searchTerms } from '../../constants';
import { coverageSettingsOfficesBreakdown } from '../constants/coverageBreakdownViews';
import { exportTypes } from '../helpers/export';
import { getExportButton } from '../helpers/exportButton';
import { getAdditionalColDefinitions } from '../helpers/resultsTable';
import { getListingStatus } from '../helpers/listingStatus';
import { getBottomRowSettings } from '../helpers/agGrid';
import { getPinnedRowRouteSettings } from '../../common/routes/routes';
import { useSearchStore } from '../../store/store';
import { getTotalsOfficeBreakdownList } from '../helpers/officesBreakdown';

const OfficesBreakdown = ({ module }) => {
        const query = useQuery();
        const gridRef = useRef();
        const location = useLocation();
        const history = useHistory();
        const areaId = query.get('areaId');
        const areaName = location.state?.area;
        const isCoverageSearch = module === modules.marketShare.coverage;
        const officeGroupName = query.get('officeGroupName');
        const title = isCoverageSearch ? areaName : query.get('brokerage') || officeGroupName;
        const brokerId = query.get('id');
        const listingViewId = query.get('view');
        const listingTypeId = location.state?.type;
        const sumOfColumn = location.state?.sumOfColumn;
        const rowCount = location.state?.rowCount;

        const {
            loadedSearchCriteria,
            search,
            areaTypeTitle,
            selectedComparisonSetSearch
        } = useSearchStore(state => ({
            loadedSearchCriteria: state[module]?.loadedSearchCriteria,
            search: state[module]?.search,
            areaTypeTitle: state[module]?.areaTypeTitle,
            selectedComparisonSetSearch: state[module]?.selectedComparisonSetSearch,
        }));

        const [state, setState] = useState({
            searchCriteria: null,
            offices: [],
            columnDefs: [],
            isShowAdditionalInfo: false,
            isLoading: true,
            selectedAreaType: null,
            totalsAverages: {}
        });

        const listingStatus = getListingStatus(module, state.searchCriteria);

        const shouldRender = !!module;

        useEffect(() => {
            if (!shouldRender) {
                history.push('/');
            }
        }, []);

        useEffect(() => {
            setStateData('searchCriteria', loadedSearchCriteria, setState);
        }, [loadedSearchCriteria]);

        useEffect(() => {
            const criteria = search.searchCriteria.criteria;
            if (criteria === undefined) return history.goBack();
            setState(prevState => ({
                ...prevState,
                searchCriteria: criteria
            }));
        }, [search]);

        useEffect(() => {
            setStateData('selectedAreaType', areaTypeTitle?.mainTitle.slice(searchTerms.selectedAreaTypeTitle.length), setState);
        }, [areaTypeTitle]);

        useEffect(() => {
            if (!shouldRender) return;
            if (!state.searchCriteria) return;
            const columnToRankBy = isCoverageSearch ? coverageSettingsOfficesBreakdown[listingViewId]?.settings.translatedFieldViews[listingViewId]
                : settingsOfficesBreakdown[listingViewId]?.settings.translatedFieldViews[listingViewId];
            const sortedColumns = isCoverageSearch ? getSortedColumns(coverageSettingsOfficesBreakdown[listingViewId]?.settings.columns, columnToRankBy)
                : getSortedColumns(settingsOfficesBreakdown[listingViewId]?.settings.columns, columnToRankBy);
            const columnDefs = getAdditionalColDefinitions(sortedColumns, false);

            let transformedData = null;
            const loadOfficesListings = async () => {
                let error = null;
                let data;
                if (isCoverageSearch) {
                    data = await getCoverageOfficeBreakdownList(areaId, state.searchCriteria).catch(e => {
                        error = e;
                    });
                    const stats = { sumOfColumn, rowCount };
                    transformedData = transformData(data?.results, stats, columnToRankBy, isCoverageSearch).map(area => ({
                        ...area,
                        areaId,
                        listingViewId,
                        isCoverageSearch
                    }));
                } else {
                    data = await getTotalsOfficeBreakdownList(brokerId, selectedComparisonSetSearch, officeGroupName, state);
                    const stats = { sumOfColumn, rowCount };
                    transformedData = transformData(data?.results, stats, columnToRankBy, isCoverageSearch).map(office => ({
                        ...office,
                        listingTypeId,
                        listingViewId
                    }));
                }
                if (error) {
                    console.log('Office Breakdown error: ', error);
                    return;
                }
                Promise.resolve(data).then(() => setStateData('isLoading', false, setState));
                setState(prevState => ({
                    ...prevState,
                    columnDefs,
                    offices: transformedData,
                    totalsAverages: data?.totals
                }));
            };

            const detailError = (e) => console.log(e);

            loadOfficesListings().catch(detailError);

        }, [state.searchCriteria]);

        useEffect(() => {
            if (!shouldRender) return;
            if (!listingViewId || !gridRef.current?.columnApi) return;
            const sortedColumn = gridRef.current.columnApi.columnModel.gridColumns.find(colDef => colDef.sort);
            const defaultColumnDefs = isCoverageSearch
                ? getSortedColumns(coverageSettingsOfficesBreakdown[listingViewId]?.settings.columns, sortedColumn?.colId, sortedColumn?.sort)
                : getSortedColumns(settingsOfficesBreakdown[listingViewId]?.settings.columns, sortedColumn?.colId, sortedColumn?.sort);
            const columnDefs = getAdditionalColDefinitions(defaultColumnDefs, state.isShowAdditionalInfo);
            setStateData('columnDefs', columnDefs, setState);
        }, [listingViewId, state.isShowAdditionalInfo]);

        if (!shouldRender) return (<></>);

        const handleAdditionalInfoToggleChange = () => setStateData('isShowAdditionalInfo', !state.isShowAdditionalInfo, setState);

        const exportDetails = {
            exportType: exportTypes.officesBreakdown,
            listingViewId,
            tableName: title,
            listingStatusTitle: listingStatus
        };
        const exportButton = state.offices?.length ? getExportButton(exportDetails, gridRef) : null;

        const bottomRowType = isCoverageSearch ? 'coverageSearch' : 'totalsSearch';
        const pinnedRowDrilldownSettingsType = getPinnedRowRouteSettings(location.pathname);
        const bottomRowParams = {
            bottomRowType,
            pinnedRowDrilldownSettingsType,
            gridRef,
            rowData: state.offices,
            pinnedRowData: state.totalsAverages
        };

        return <>
            <TitleInfo
                title={title}
                areaType={isCoverageSearch && state.selectedAreaType}
                subtitle={marketShareTerms.officeBreakdown}
                hasToggle={true}
                module={module}
                exportButton={exportButton}
                handleAdditionalInfoToggleChange={handleAdditionalInfoToggleChange}
                isAdditionalInfoToggleChecked={state.isShowAdditionalInfo}
            />
            {state.isLoading
                ? <Loader />
                : <ResultsTable
                    gridRef={gridRef}
                    rowData={state.offices}
                    columnDefs={state.columnDefs}
                    getBottomRowSettings={() => bottomRowParams && getBottomRowSettings(bottomRowParams)} />}
        </>;
    }
;

OfficesBreakdown.propTypes = {
    module: PropTypes.string
};

export default OfficesBreakdown;
