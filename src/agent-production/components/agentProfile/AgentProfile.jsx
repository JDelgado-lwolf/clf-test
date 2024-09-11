import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Tab from '@lwt-helix/tab';
import { Row } from '@lwt-helix/layout';
import { agentProductionTerms, TimePeriods } from '../../../constants';
import AgentContactInfo from '../agentSlideout/AgentContactInfo';
import TransactionCoverageTab from './tabs/TransactionCoverageTab';
import Inventory from './tabs/inventory/Inventory';
import { useQuery } from '../../../common/hooks/location';
import Production from './tabs/production/Production';
import TableChartToggle, { tableChartModes } from '../common/TableChartToggle';
import { setStateData } from '../../../common/helpers/state';
import TimePeriodSelector from './tabs/TimePeriodSelector';
import ExportButton from '../common/ExportButton';
import { mapIdToTableData } from '../../helpers/dataFormatters';
import {
    agentProfileTabs as tabIndex,
    productionOptions,
    transactionCoverageOptions
} from '../../constants/agentProductionConstants';
import { maskNullDate } from './tabs/helpers/exportHelpers';
import { getExportButtonProps as getProductionExportButtonProps } from './tabs/helpers/productionExportHelpers';
import { getExportButtonProps as getInventoryExportButtonProps } from './tabs/helpers/inventoryExportHelpers';
import { getExportButtonProps as getTransactionCoverageExportButtonProps } from './tabs/helpers/transactionCoverageExportHelpers';
import { chartModes } from '../../helpers/agentDataCalculators';
import { Routes } from '../../../common/routes/routes';
import { setTimePeriodData } from '../../helpers/browserStorageHelper';
import OfficeHistoryTab from './tabs/officeHistory/OfficeHistoryTab';
import { useAgentProfileStore, useCommonStore, useSearchStore } from '../../../store/store';

const AgentProfile = ({ agentData, module, mlsProps }) => {
    const query = useQuery();
    const agentId = query.get('id');
    const chosenIndex = parseInt(query.get('tabIndex'));
    const graphModeParam = query.get('graph');
    const chartModeParam = query.get('chartMode');
    const queryIntervalType = query.get('timeInterval');
    const queryIsShowBarLabels = query.get('isShowBarLabels') !== 'false';
    const history = useHistory();

    const {
        setSelectedAgentId
    } = useAgentProfileStore(state => ({
        setSelectedAgentId: state.setSelectedAgentId
    }));

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

    const [state, setState] = useState({
        agent: null,
        agentsData: null,
        mlsId: null,
        agentId: null,
        productionTimePeriod: TimePeriods['Last 24 Months'],
        productionMode: chartModeParam || tableChartModes.CHART,
        productionGraphMode: graphModeParam || chartModes.VOLUME,
        productionIsLabelEnabled: queryIsShowBarLabels,
        transactionTimePeriod: TimePeriods['Last 12 Months'],
        transactionCoverageMode: tableChartModes.CHART,
        currentTabIndex: chosenIndex ? chosenIndex : tabIndex.PRODUCTION,
        isShowTimePeriodSelector: chosenIndex !== tabIndex.INVENTORY,
        currentListingMonth: null,
        isTimePeriodSelectorDisabled: false,
        searchCriteria: null,
        mlsName: null,
        exportProps: {
            headers: null,
            data: null,
            filename: null,
            isVisible: false
        }
    });

    useEffect(() => {
        setSelectedAgentId(agentId);
    }, [agentId]);


    const processFromProduction = (fromProduction) => {
        const paramsGetExportButtonProps = {
            data: sortExportData(fromProduction.data),
            dates: fromProduction.currentIntervalDates,
            tableChartMode: fromProduction.tableChartMode,
            agent: state.agent,
            mlsName: state.mlsName
        };

        const exportProps = getProductionExportButtonProps(paramsGetExportButtonProps);
        return setState((prevState) => {
            return {
                ...prevState,
                exportProps
            };
        });
    };

    const sortExportData = (exportData) => {
        return [...exportData].sort((a, b) => new Date(b.month) - new Date(a.month));
    };

    const processFromInventory = (fromInventory) => {
        const { underContractRawData, forSaleRawData, shouldShowExportButton } = fromInventory;

        const data = [];

        const transformForExport = (d) => {
            const item = {
                ...d,
                dateList: maskNullDate(d.dateList),
                dateCont: maskNullDate(d.dateCont)
            };
            data.push(item);
        };

        forSaleRawData?.forEach(transformForExport);
        underContractRawData?.forEach(transformForExport);

        const isShowExportButton = shouldShowExportButton && !!data?.length;
        const paramsGetExportButtonProps = {
            data,
            agent: state.agent,
            mlsName: state.mlsName,
            isShowExportButton
        };
        const exportProps = getInventoryExportButtonProps(paramsGetExportButtonProps);

        setState((prevState) => {
            return {
                ...prevState,
                exportProps
            };
        });
    };

    const processFromTransactionCoverage = (fromTransactionCoverage) => {
        const paramsGetExportButtonProps = {
            data: fromTransactionCoverage.data,
            area: fromTransactionCoverage.area,
            statusType: fromTransactionCoverage.statusType,
            tableChartMode: state.transactionCoverageMode,
            agent: state.agent,
            mlsName: state.mlsName
        };

        const exportProps = getTransactionCoverageExportButtonProps(paramsGetExportButtonProps);
        setState((prevState) => {
            return {
                ...prevState,
                exportProps
            };
        });
    };

    const processFromOfficeHistory = () => {
        const exportProps = {
            isVisible: false
        };
        setState((prevState) => {
            return {
                ...prevState,
                exportProps
            };
        });
    };

    const mlsProviders = useRef([]);

    const shouldRender = !!module;

    useEffect(() => {
        if (!shouldRender) {
            history.push('/');
        }
    }, []);

    useEffect(() => {
        mlsProviders.current = membership;
    }, [membership]);

    useEffect(() => {
        if (!shouldRender) return;
        if (search.mlsId && mlsProviders.current) {
            const mlsName = mlsProviders.current.find(
                (p) => p?.mlsId === search.mlsId
            )?.shortDescription;
            setStateData('mlsName', mlsName, setState);
        }
    }, [mlsProviders.current, search]);

    useEffect(() => {
        if (!loadedSearchCriteria?.realEstateDatasourceIdsWithFilters?.length) return;
        const searchCriteria = loadedSearchCriteria;
        const mlsId =
            loadedSearchCriteria.realEstateDatasourceIdsWithFilters[0]
                .realEstateDatasourceId;
        const intervalType = queryIntervalType || loadedSearchCriteria.timePeriod.intervalType;
        const productionTimePeriod = TimePeriods['Last 24 Months'];
        const transactionTimePeriod =
            (transactionCoverageOptions.some((o) => o.value === intervalType) &&
                intervalType) ||
            TimePeriods['Last 12 Months'];

        setState((prevState) => ({
            ...prevState,
            searchCriteria,
            mlsId,
            productionTimePeriod,
            transactionTimePeriod,
            agentId
        }));
    }, [loadedSearchCriteria]);

    useEffect(() => {
        const revisedData = mapIdToTableData(agentData);
        setStateData('agentsData', revisedData || [], setState);
    }, [agentData]);

    useEffect(() => {
        if (!shouldRender) return;
        const idParam = new URL(window.location.href).searchParams.get('id');
        if (state.agentsData != null) {
            const agentFound = state.agentsData.find((agent) => agent.agentId === idParam);
            if (agentFound) {
                setStateData('agent', agentFound, setState);
            } else {
                window.location.replace(Routes.PROF_METRICS.BASE);
            }
        }
    }, [state.agentsData]);

    if (!shouldRender) return (<></>);

    const profileProps = {
        agentId: state.agentId,
        mlsId: state.mlsId,
        timePeriod: state.timePeriod,
        module: module
    };

    const agentProductionListingRoute = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.PROD_LISTING}`;

    const handleClickChartGraph = (period) => history.push(
        `${agentProductionListingRoute}?id=${state.agentId}`
        + `&period=${period}&graph=${state.productionGraphMode}`
        + `&chartMode=${state.productionMode}`
        + `&isShowBarLabels=${state.productionIsLabelEnabled}`
        + `&intervalType=${state.productionTimePeriod.replaceAll(' ', '')}`
    );

    const getIsActive = (index) => state.currentTabIndex === index;

    const productionProps = {
        ...profileProps,
        agentData: state.agent,
        mlsId: state.mlsId,
        agentId: state.agentId,
        handleClickChartGraph,
        tableChartMode: state.productionMode,
        timePeriod: state.productionTimePeriod,
        sendToParent: processFromProduction,
        isActive: getIsActive(tabIndex.PRODUCTION),
        productionGraphMode: state.productionGraphMode,
        productionIsLabelEnabled: state.productionIsLabelEnabled,
        setProductionLabels: (mode) =>
            setState(prevState => ({
                ...prevState,
                productionIsLabelEnabled: mode
            })),
        setProductionGraphView: (mode) =>
            setState(prevState => ({
                ...prevState,
                productionGraphMode: mode
            })),
        currentTabIndex: state.currentTabIndex
    };

    const transactionCoverageProps = {
        ...profileProps,
        tableChartMode: state.transactionCoverageMode,
        searchCriteria: state.searchCriteria,
        timePeriod: state.transactionTimePeriod,
        agent: state.agent,
        setIsTimePeriodSelectorDisabled: (b) => setStateData('isTimePeriodSelectorDisabled', b, setState),
        sendToParent: processFromTransactionCoverage,
        isActive: getIsActive(tabIndex.TRANSACTION_COVERAGE),
        currentTabIndex: state.currentTabIndex,
        mappedAreas: mlsProps?.mappedAreas
    };

    const officeHistoryProps = {
        ...profileProps,
        agent: state.agent,
        setIsTimePeriodSelectorDisabled: (b) => setStateData('isTimePeriodSelectorDisabled', b, setState),
        sendToParent: processFromOfficeHistory,
        isActive: getIsActive(tabIndex.OFFICE_HISTORY),
        currentTabIndex: state.currentTabIndex
    };

    let timePeriodOptions, timePeriodToSet, currentTabPeriod;
    if (state.currentTabIndex === tabIndex.PRODUCTION) {
        timePeriodOptions = productionOptions;
        timePeriodToSet = 'productionTimePeriod';
        currentTabPeriod = state.productionTimePeriod;
        setTimePeriodData(state.productionTimePeriod);
    }
    if (state.currentTabIndex === tabIndex.TRANSACTION_COVERAGE) {
        timePeriodOptions = transactionCoverageOptions;
        timePeriodToSet = 'transactionTimePeriod';
        currentTabPeriod = state.transactionTimePeriod;
        setTimePeriodData(state.transactionTimePeriod);
    }

    const setCurrentTabIndex = (currentTabIndex) => {
        const isShowTimePeriodSelector = [
            tabIndex.PRODUCTION,
            tabIndex.TRANSACTION_COVERAGE
        ].includes(currentTabIndex);

        setState((prevState) => ({
            ...prevState,
            isShowTimePeriodSelector,
            currentTabIndex
        }));
    };

    return (
        <>
            <Row className={'mr-0 m-1 mb-2'}>
                {state.agent && <AgentContactInfo
                    agent={state.agent}
                    setCurrentTabIndex={setCurrentTabIndex}
                    handleClickChartGraph={handleClickChartGraph}
                    module={module}
                />}

                <div className={'ml-auto d-flex w-auto align-self-center'}>
                    {state.isShowTimePeriodSelector && (
                        <TimePeriodSelector
                            options={timePeriodOptions}
                            currentValue={currentTabPeriod}
                            setTimePeriod={(t) => {
                                setTimePeriodData(t.target.value);
                                setStateData(timePeriodToSet, t.target.value, setState);
                            }
                            }
                            isDisabled={state.isTimePeriodSelectorDisabled
                            && state.currentTabIndex !== tabIndex.PRODUCTION}
                        />
                    )}
                </div>
                {state.exportProps?.isVisible &&
                <div className='align-self-center ml-3'>
                    <ExportButton {...state.exportProps} />
                </div>}
            </Row>
            <div className='content mt-2 pb-3'>
                <Tab
                    tabTextTransform='none'
                    navSize={2}
                    contentSize={2} 
                    className='secondary'
                    items={[
                        {
                            title: agentProductionTerms.production,
                            content: {
                                jsx: (
                                    <>
                                        <Row noGutters className={'xbm-tabs-adjustment-mod'}>
                                            <TableChartToggle
                                                defaultMode={state.productionMode}
                                                parentSetMode={(m) =>
                                                    setStateData('productionMode', m, setState)
                                                }
                                                mlsName={state.mlsName}
                                            />
                                        </Row>
                                        <div>
                                            <Production {...productionProps} />
                                        </div>
                                    </>
                                )
                            }
                        },
                        {
                            title: agentProductionTerms.inventory,
                            content: {
                                jsx: (
                                    <Inventory
                                        mlsId={state.mlsId}
                                        agentId={state.agentId}
                                        mlsName={state.mlsName}
                                        isActive={getIsActive(tabIndex.INVENTORY)}
                                        sendToParent={processFromInventory}
                                    />
                                )
                            }
                        },
                        {
                            title: agentProductionTerms.transactionCoverage,
                            content: {
                                jsx: (
                                    <>
                                        <Row noGutters className={'xbm-tabs-adjustment-mod'}>
                                            <TableChartToggle
                                                defaultMode={state.transactionCoverageMode}
                                                parentSetMode={(m) =>
                                                    setStateData(
                                                        'transactionCoverageMode',
                                                        m,
                                                        setState
                                                    )
                                                }
                                                hasAreaSelector={true}
                                                mlsName={state.mlsName}
                                            />
                                        </Row>
                                        <div>
                                            <TransactionCoverageTab
                                                {...transactionCoverageProps}
                                            />
                                        </div>
                                    </>
                                )
                            }
                        },
                        {
                            title: agentProductionTerms.officeHistory,
                            content: {
                                jsx: (
                                    <>
                                        {state.agent && <div>
                                            <OfficeHistoryTab
                                                {...officeHistoryProps}
                                            />
                                        </div>}
                                    </>
                                )
                            }
                        }
                    ]}
                    tabs
                    currentIndex={state.currentTabIndex}
                    setCurrentIndex={setCurrentTabIndex}
                />
            </div>
        </>
    );
};

export default AgentProfile;
