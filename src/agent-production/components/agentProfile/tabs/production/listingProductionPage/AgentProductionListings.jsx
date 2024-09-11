import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Select from '@lwt-helix/select';
import Tab from '@lwt-helix/tab';
import { Row } from '@lwt-helix/layout';
import Loader from '@lwt-helix/loader';
import { setStateData } from '../../../../../../common/helpers/state';
import AgentContactInfo from '../../../../agentSlideout/AgentContactInfo';
import { boolToShortString, formatVolumeOrDays, mapIdToTableData } from '../../../../../helpers/dataFormatters';
import { getExportButtonProps } from './agentListingExportHelpers';
import ExportButton from '../../../../common/ExportButton';
import { useQuery } from '../../../../../../common/hooks/location';
import { Routes } from '../../../../../../common/routes/routes';
import { selectMouseoverStyle } from '../../../../../helpers/uiHelpers';
import { agentProfileRoute, listingOptions, productionListingsTooltips } from '../../../../../constants/agentProductionConstants';
import { useAgentProfileStore, useCommonStore, useSearchStore } from '../../../../../../store/store';
import { getAgentHistory, getAgentListingDetailDrillDown } from '../../../../../../service/service-gateway';
import { tableViews } from '../../../../../../common/components/table/agGrid/tableViews';
import Table from '../../../../../../common/components/table/agGrid/Table';

export const AgentProductionListings = ({ agentData, module }) => {
    let query = useQuery();
    const id = query.get('id');
    const selectedPeriod = query.get('period')?.split(' ').join(' 20');
    const queryTabIndex = query.get('tabIndex');
    const queryIntervalType = query.get('intervalType');
    const history = useHistory();

    const {
        membership
    } = useCommonStore(state => ({
        membership: state.membership
    }));

    const {
        search,
        loadedSearchCriteria
    } = useSearchStore(state => ({
        search: state[module]?.search,
        loadedSearchCriteria: state[module]?.loadedSearchCriteria
    }));

    const {
        currentTab,
        setCurrentTab,
        setTimePeriod
    } = useAgentProfileStore(state => ({
        currentTab: state.currentTab,
        setCurrentTab: state.setCurrentTab,
        setTimePeriod: state.setTimePeriod
    }));

    const [state, setState] = useState({
        agentsData: null,
        agentId: id,
        agent: null,
        mlsId: null,
        mlsName: null,
        monthlyProductions: [],
        selectOptions: [],
        intervalType: null,
        totalSoldData: [],
        selectedPeriod,
        exportProps: {
            headers: null,
            data: null,
            filename: null,
            isVisible: false
        }
    });
    const [totalSoldData, setTotalSoldData] = useState([]);
    const [listSideData, setListSideData] = useState([]);
    const [sellSideData, setSellSideData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const dateOptions = { year: 'numeric', month: 'short' };

    const getListingsByPeriod = (data) => {
        return data.map((listing) => ({
            ...listing,
            id: 'id' + Math.random().toString(16).slice(2),
            soldDateShort: new Date(listing.dateLast).toLocaleDateString('default', dateOptions),
            bankStatus: boolToShortString(listing.bankStatus),
            pcDom: listing.pcDom ?? 0,
            bedrooms: listing.bedrooms ?? 0,
            bathrooms: listing.fullBaths ?? 0,
            pricePerSquareFt: listing.pricePerSquareFt ? formatVolumeOrDays(listing.pricePerSquareFt, true) : '',
            squareFt: listing.squareFt ?? 0,
            lotSizeSquareFt: listing.lotSizeSquareFt ?? 0,
            lotSizeAcres: listing.lotSizeAcres ?? 0,
            yearBuilt: listing.yearBuilt > 0 ? listing.yearBuilt : ''
        })).filter((listing) => state.selectedPeriod === listing.soldDateShort);
    };

    const processExportProps = (fromAgentListings) => {

        const { shouldShowExportButton, data, period } = fromAgentListings;

        const isShowExportButton = shouldShowExportButton;

        const paramsGetExportButtonProps = {
            isShowExportButton,
            agent: state.agent,
            mlsName: state.mlsName,
            period,
            data,
            timePeriod: state.productionTimePeriod
        };

        const exportProps = getExportButtonProps(paramsGetExportButtonProps);
        setStateData('exportProps', exportProps, setState);
    };

    let mlsProviders = useRef([]);

    const shouldRender = !!module;

    useEffect(() => {
        if (!shouldRender) {
            history.push('/');
        }
        setCurrentTab(parseInt(queryTabIndex) || 0);
        setTimePeriod(selectedPeriod);
    }, []);

    useEffect(() => {
        mlsProviders.current = membership;
    }, [membership]);

    useEffect(() => {
        if (loadedSearchCriteria?.realEstateDatasourceIdsWithFilters?.length) {
            setStateData(
                'mlsId',
                loadedSearchCriteria.realEstateDatasourceIdsWithFilters[0]
                    .realEstateDatasourceId,
                setState
            );
            setStateData(
                'intervalType',
                loadedSearchCriteria.timePeriod.intervalType,
                setState
            );
        }
    }, [loadedSearchCriteria]);

    useEffect(() => {
        if (agentData) {
            const revisedData = mapIdToTableData(agentData);
            setStateData('agentsData', revisedData || [], setState);
        }
    }, [agentData]);

    useEffect(() => {
        if (search.mlsId && mlsProviders.current) {
            const mlsName = mlsProviders.current.find(
                (p) => p?.mlsId === search.mlsId
            )?.shortDescription;
            setStateData('mlsName', mlsName, setState);
        }
    }, [search]);

    useEffect(() => {
        if (!shouldRender) return;
        if (state.agentsData != null) {
            const agentFound = state.agentsData.find((agent) => agent.agentId === state.agentId);
            if (agentFound) {
                setState({
                    ...state,
                    agent: agentFound
                });
            } else {
                window.location.replace(Routes.PROF_METRICS.BASE);
            }
        }
    }, [state.agentsData]);

    useEffect(() => {
        if (!shouldRender) return;
        const historyRequestProps = {
            agentId: state.agentId,
            mlsId: state.mlsId,
        };
        if (state.mlsId) {
            getAgentHistory(historyRequestProps)
                .then(data => {
                    setStateData('monthlyProductions', data.monthlyProductions, setState);
                });
        }
    }, [state.mlsId]);

    useEffect(() => {
        if (!shouldRender) return;
        if (state.intervalType) {
            const getRequestProps = (listingType) => {
                return {
                    agentId: state.agentId,
                    realEstateDatasourceId: state.mlsId,
                    intervalType: queryIntervalType,
                    listingType
                };
            };

            const getTotalSoldData = getAgentListingDetailDrillDown(getRequestProps('SoldBothSides'))
                .then(data => setTotalSoldData(data));

            const getListSideData = getAgentListingDetailDrillDown(getRequestProps('SoldListSide'))
                .then(data => setListSideData(data));

            const getSellSideData = getAgentListingDetailDrillDown(getRequestProps('SoldSellSide'))
                .then(data => setSellSideData(data));

            Promise.all([getTotalSoldData, getListSideData, getSellSideData])
                .then(() => setIsLoading(false));
        }

    }, [state.intervalType]);

    useEffect(() => {
        if (!shouldRender) return;
        const datePeriodOption = { year: 'numeric', month: 'long' };
        const period = totalSoldData.length && new Date(getListingsByPeriod(totalSoldData)[0]?.dateLast).toLocaleDateString('default', datePeriodOption);
        const forParent = {
            shouldShowExportButton: true,
            data: {
                totalSold: [...getListingsByPeriod(totalSoldData)],
                listSide: [...getListingsByPeriod(listSideData)],
                sellSide: [...getListingsByPeriod(sellSideData)]
            },
            period
        };
        processExportProps(forParent);
    }, [totalSoldData, sellSideData, listSideData, state.selectedPeriod]);

    if (!shouldRender) return (<></>);

    const selectDefaultValue = { value: state.selectedPeriod, label: `${state.selectedPeriod} Listings` };
    let selectOptions = state.monthlyProductions.length &&
        state.monthlyProductions?.sort((a, b) => new Date(b.month) - new Date(a.month)).map((month) => {
            const date = new Date(month.month).toLocaleDateString('default', dateOptions);
            return {
                value: date,
                label: `${date} Listings`
            };
        }).filter((period) => period.value !== state.selectedPeriod);
    selectOptions.length && selectOptions.unshift({
        value: state.selectedPeriod,
        label: `${state.selectedPeriod} Listings`
    });

    const totalSoldTableData = getListingsByPeriod(totalSoldData);
    const listSideTableData = getListingsByPeriod(listSideData);
    const sellSideTableData = getListingsByPeriod(sellSideData);

    const handleSelectedPeriod = (period) => {
        setState({
            ...state,
            selectedPeriod: period.value
        });
        setTimePeriod(period.value);
    };

    const handleBackClick = () => {
        const graphModeParam = query.get('graph');
        const chartMode = query.get('chartMode');
        const queryIsShowBarLabels = query.get('isShowBarLabels');
        history.push(
            `${agentProfileRoute}?id=${state.agentId}&tabIndex=${0}`
            + `${graphModeParam ? `&graph=${graphModeParam}` : ''}`
            + `${chartMode ? `&chartMode=${chartMode}` : ''}`
            + `${queryIsShowBarLabels ? `&isShowBarLabels=${queryIsShowBarLabels}` : ''}`
        );
    };

    const selectStyles = {
        control: selectMouseoverStyle,
        option: selectMouseoverStyle
    };

    const renderAgentProductionListingsTab = () => (
        <Tab
            tabTextTransform='none'
            navSize={2}
            contentSize={2}
            className='secondary'
            tabs
            currentIndex={currentTab}
            setCurrentIndex={setCurrentTab}
            items={[
                {
                    title: listingOptions.totalSold,
                    content: {
                        jsx: <div className='mt-3'>
                            <Table 
                                tableView={tableViews.agentProductionListingTotalSold}
                                rowData={totalSoldTableData}
                                tableTitleWithTooltips={productionListingsTooltips}
                            />
                        </div>
                    }
                },
                {
                    title: listingOptions.listSide,
                    content: {
                        jsx: <div className='mt-3'>
                            <Table 
                                tableView={tableViews.agentProductionListingListSide}
                                rowData={listSideTableData}
                                tableTitleWithTooltips={productionListingsTooltips}
                            />
                        </div>
                    }
                },
                {
                    title: listingOptions.sellSide,
                    content: {
                        jsx: <div className='mt-3'>
                            <Table 
                                tableView={tableViews.agentProductionListingSellSide}
                                rowData={sellSideTableData}
                                tableTitleWithTooltips={productionListingsTooltips}
                            />
                        </div>
                    }
                }
            ]}
        />
    );

    return (
        <>
            <Row className={'m-1 mb-2'}>
                {state.agent && <AgentContactInfo
                    agent={state.agent}
                    index={0}
                    module={module}
                />}

                <div className={'d-flex ml-sm-auto align-self-center'}>
                    <ExportButton {...state.exportProps} />
                </div>
            </Row>

            <div className='content listing-content'>
                <div className='mt-2 mb-4 d-flex align-items-center'>
                    <div className='d-flex'>
                        <span id='listing-breadcrumb' onClick={() => handleBackClick()}>Production</span>
                        <span className='mx-2'>{' > '}</span>
                    </div>
                    <Select
                        dataLwtId='agent-listing-time-periods'
                        className='listing-period-select'
                        isClearable={false}
                        options={selectOptions}
                        defaultValue={selectDefaultValue}
                        onChange={(period) => handleSelectedPeriod(period)}
                        matchFrom='start'
                        styles={selectStyles} />
                </div>
                {isLoading
                    ? <div className='align-top'><Loader /></div>
                    : renderAgentProductionListingsTab()
                }
            </div>
        </>
    );
};

AgentProductionListings.propTypes = {
    module: PropTypes.string,
    agentData: PropTypes.array
};
