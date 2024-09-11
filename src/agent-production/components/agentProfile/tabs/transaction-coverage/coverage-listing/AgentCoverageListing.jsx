import React, { useEffect, useState, useRef }from 'react';
import PropTypes from 'prop-types';
import Select from '@lwt-helix/select';
import { Link, useLocation, useHistory } from 'react-router-dom';
import Loader from '@lwt-helix/loader';
import Tab from '@lwt-helix/tab';
import AgentContactInfo from '../../../../agentSlideout/AgentContactInfo';
import { setStateData } from '../../../../../../common/helpers/state';
import { agentProductionTerms, areaRequestTypes } from '../../../../../../constants';
import { getExportButtonProps as getAgentListingExportButtonProps } from './agentCoverageListingExportHelpers';
import { agentProfileRoute, coverageListingsTooltips, dealStatusCodes, listingOptions } from '../../../../../constants/agentProductionConstants';
import ExportButton from '../../../../common/ExportButton';
import { selectMouseoverStyle } from '../../../../../helpers/uiHelpers';
import { getFirstToolRoute } from '../../../../../../common/helpers/routes';
import { useAgentProfileStore, useCommonStore, useSearchStore } from '../../../../../../store/store';
import { getAgentTransactionCoverageDrillDown } from '../../../../../../service/service-gateway';
import Table from '../../../../../../common/components/table/agGrid/Table';
import { tableViews } from '../../../../../../common/components/table/agGrid/tableViews';

const AgentCoverageListing = ({ module }) => {
    const history = useHistory();
    const location = useLocation();
    const incomingState = useRef(location.state);
    const [state, setState] = useState({
        isShowAgentListingView: true,
        intervalType: null,
        agent: incomingState.current?.agent,
        criteriaObj: null,
        mlsId: null,
        mlsName: null,
        agentId: null,
        areaType: null,
        areaList: null,
        tableType: null,
        currentTab: null,
        selectOptions: [],
        timeIntervals: null,
        exportProps: {
            headers: null,
            data: null,
            filename: null,
            isVisible: true
        }
    });

    const {
        selectedAgentId,
        selectedMlsId,
        areaType,
        areaList,
        tableType,
        isUnits,
        agentCoverageListingTab,
        timePeriod,
        selectedArea,
        displayMode,
        setSelectedArea,
        setAgentCoverageListingTab
    } = useAgentProfileStore(state => ({
        selectedAgentId: state.selectedAgentId,
        selectedMlsid: state.selectedMlsId,
        areaType: state.areaType,
        areaList: state.areaList,
        tableType: state.tableType,
        isUnits: state.isUnits,
        agentCoverageListingTab: state.agentCoverageListingTab,
        timePeriod: state.timePeriod,
        selectedArea: state.selectedArea,
        displayMode: state.displayMode,
        setSelectedArea : state.setSelectedArea,
        setAgentCoverageListingTab: state.setAgentCoverageListingTab
    }));

    const {
        membership,
        timeIntervals
    } = useCommonStore(state => ({
        membership: state.membership,
        timeIntervals: state.timeIntervals
    }));

    const {
        search,
        loadedSearchCriteria
    } = useSearchStore(state => ({
        search: state[module]?.search,
        loadedSearchCriteria: state[module]?.loadedSearchCriteria
    }));

    const [isLoading, setIsLoading] = useState(true);
    const [totalSoldData, setTotalSoldData] = useState([]);
    const [listSideData, setListSideData] = useState([]);
    const [sellSideData, setSellSideData] = useState([]);
    const [forSaleData, setForSaleDataData] = useState([]);
    const [underContractData, setUnderContractDataData] = useState([]);

    const shouldRender = !!module;

    useEffect(()=> {
        setSelectedArea({
            value: incomingState.current?.selectedArea,
            label: `${incomingState.current?.selectedArea} ${agentProductionTerms.listings}`
        })
    },[])

    useEffect(() => {
        if (!shouldRender) {
            history.push('/');
        }
    }, []);

    useEffect(() => {
        setStateData('agentId', selectedAgentId, setState);
    }, [selectedAgentId]);

    useEffect(() => {
        setStateData('mlsId', selectedMlsId, setState);
    }, [selectedMlsId]);

    useEffect(() => {
        if (!shouldRender) return;
        let selectOptions = state.areaList?.length && state.areaList?.map((area) => {
            return {
                value: area,
                label: `${area} ${agentProductionTerms.listings}`
            };
        });

        let option;
        if (incomingState.current.selectedArea === selectedArea?.value) {
            option = selectOptions?.splice(selectOptions?.findIndex(option => option.value === incomingState.current.selectedArea), 1);
        } else {
            option = selectOptions?.splice(selectOptions?.findIndex(option => option.value === selectedArea?.value), 1);
        }
        selectOptions?.unshift(option[0]);
        setState((prevState) => {
            return {
                ...prevState,
                selectOptions: selectOptions
            };

        });
    }, [selectedArea, state.areaList]);

    useEffect(() => {
        if (!shouldRender) return;
        if (!incomingState.current) window.location.replace(getFirstToolRoute());
    }, [incomingState]);

    let mlsProviders = useRef([]);

    useEffect(() => {
        setStateData('areaList', areaList, setState);
    }, [areaList]);

    useEffect(() => {
        setStateData('areaType', areaType, setState);
    }, [areaType]);

    useEffect(() => {
        setStateData('tableType', tableType, setState);
    }, [tableType]);

    useEffect(() => {
        setStateData('intervalType', timePeriod, setState);
    }, [timePeriod]);

    useEffect(() => {
        setStateData('isUnits', isUnits, setState);
    }, [isUnits]);

    useEffect(() => {
        setStateData('currentTab', agentCoverageListingTab, setState);
    }, [agentCoverageListingTab]);

    useEffect(() => {
        mlsProviders.current = membership;
    }, [membership]);

    useEffect(() => {
        if (loadedSearchCriteria?.realEstateDatasourceIdsWithFilters?.length) {
            setState(prevState => ({
                ...prevState,
                criteriaObj: loadedSearchCriteria
            }));
        }
    }, [loadedSearchCriteria]);

    useEffect(() => {
        if (search?.mlsId && mlsProviders.current) {
            const mlsName = mlsProviders.current.find(
                (p) => p?.mlsId === search.mlsId
            )?.shortDescription;
            setStateData('mlsName', mlsName, setState);
        }
    }, [search]);

    useEffect(() => {
        if (timeIntervals) {
            setStateData('timeIntervals', timeIntervals, setState);
        }
    }, [timeIntervals]);

    useEffect(() => {
        if (!shouldRender) return;
        let forParent = {};
        switch (state.tableType?.label) {
            case dealStatusCodes.SOLD.label:
                forParent = {
                    shouldShowExportButton: true,
                    data: {
                        totalSold: totalSoldData,
                        listSide: listSideData,
                        sellSide: sellSideData
                    },
                    period: state.intervalType,
                    timeIntervals: state.timeIntervals
                };
                processExportProps(forParent);
                break;
            case dealStatusCodes.UNDER_CONTRACT.label:
                forParent = {
                    shouldShowExportButton: true,
                    data: {
                        underContract: underContractData
                    }
                };
                processExportProps(forParent);
                break;
            case dealStatusCodes.ACTIVE.label:
                forParent = {
                    shouldShowExportButton: true,
                    data: {
                        forSale: forSaleData
                    }
                };
                processExportProps(forParent);
                break;
        }
    }, [totalSoldData, sellSideData, listSideData, underContractData, forSaleData, selectedArea, state.tableType, state.intervalType, state.timeIntervals]);


    useEffect(() => {
        if (!shouldRender) return;
        if (state.intervalType && state.criteriaObj) {
            const getRequestProps = (statusCode) => {
                const areaName = selectedArea.value.split(' ');
                const areaType = state.areaType === 'area_id';
                return {
                    criteria: state.criteriaObj,
                    agentId: state.agentId,
                    mlsId: state.mlsId,
                    areaType: areaRequestTypes[state.areaType],
                    statusCode,
                    areaName: areaType ? areaName[0] : selectedArea.value,
                    intervalType: state.intervalType
                };
            };
            setIsLoading(true);
            switch (state.tableType?.label) {
                case dealStatusCodes.SOLD.label:
                    getAgentTransactionCoverageDrillDown(getRequestProps('SoldBothSides'))
                        .then(data => {
                            setTotalSoldData(data);
                            setIsLoading(false);
                        });

                    getAgentTransactionCoverageDrillDown(getRequestProps('SoldListSide'))
                        .then(data => {
                            setListSideData(data);
                            setIsLoading(false);
                        });

                    getAgentTransactionCoverageDrillDown(getRequestProps('SoldSellSide'))
                        .then(data => {
                            setSellSideData(data);
                            setIsLoading(false);
                        });
                    break;
                case dealStatusCodes.UNDER_CONTRACT.label:
                    getAgentTransactionCoverageDrillDown(getRequestProps('UnderContract'))
                        .then(data => {
                            setUnderContractDataData(data);
                            setIsLoading(false);
                        });
                    break;
                case dealStatusCodes.ACTIVE.label:
                    getAgentTransactionCoverageDrillDown(getRequestProps('ForSale'))
                        .then(data => {
                            setForSaleDataData(data);
                            setIsLoading(false);
                        });
                    break;
            }
        }
    }, [state.intervalType, state.criteriaObj, selectedArea]);

    if (!shouldRender) return (<></>);

    const changeSelectedArea = (option) => {
        setSelectedArea(option)
    };

    const processExportProps = (fromAgentListings) => {
        const { shouldShowExportButton, data, period, timeIntervals } = fromAgentListings;
        const isShowExportButton = shouldShowExportButton;
        const paramsGetExportButtonProps = {
            isShowExportButton,
            agent: state.agent,
            mlsName: state.mlsName,
            dealStatus: state.tableType.label,
            selectedArea: selectedArea.label,
            data,
            timePeriod: period,
            timeIntervals
        };
        const exportProps = getAgentListingExportButtonProps(paramsGetExportButtonProps);
        setStateData('exportProps', exportProps, setState);
    };
    const selectDefaultValue = {
        value: incomingState.current?.selectedArea,
        label: `${incomingState.current?.selectedArea} ${agentProductionTerms.listings}`
    };
    const setCurrentTab = index => {
        setAgentCoverageListingTab(index);
    };

    const selectStyles = {
        control: selectMouseoverStyle,
        option: selectMouseoverStyle
    };

    const tabByStatus = {
        [dealStatusCodes.SOLD.label]: 
            <Tab
                tabTextTransform='none'
                className={'mt-2 secondary'}
                navSize={2}
                contentSize={2}
                tabs
                currentIndex={state.currentTab}
                setCurrentIndex={(index) => setCurrentTab(index)}
                items={[
                    {
                        title: listingOptions.totalSold,
                        content: {
                            jsx: <div className='mt-3'>
                                {isLoading ? <Loader /> : <Table
                                    tableView={tableViews.agentCoverageListingSold}
                                    rowData={totalSoldData}
                                    tableTitleWithTooltips={coverageListingsTooltips}
                                    />}
                            </div>
                        }
                    },
                    {
                        title: listingOptions.listSide,
                        content: {
                            jsx: <div className='mt-3'>
                                {isLoading ? <Loader /> : <Table
                                    tableView={tableViews.agentCoverageListingSold}
                                    tableTitleWithTooltips={coverageListingsTooltips}
                                    rowData={listSideData} />}
                            </div>
                        }
                    },
                    {
                        title: listingOptions.sellSide,
                        content: {
                            jsx: <div className='mt-3'>
                                {isLoading ? <Loader /> : <Table
                                    tableView={tableViews.agentCoverageListingSold}
                                    tableTitleWithTooltips={coverageListingsTooltips}
                                    rowData={sellSideData} />}
                            </div>
                        }
                    }
                ]}
            />,
        [dealStatusCodes.UNDER_CONTRACT.label]: 
            <Tab
                tabTextTransform='none'
                className={'mt-2 secondary'}
                navSize={2}
                contentSize={2}
                tabs
                currentIndex={0}
                items={[
                    {
                        title: dealStatusCodes.UNDER_CONTRACT.label,
                        content: {
                            jsx: <div className='mt-3'>
                                {isLoading ? <Loader /> :
                                <Table
                                    tableView={tableViews.agentCoverageListingUc}
                                    tableTitleWithTooltips={coverageListingsTooltips}
                                    rowData={underContractData} />}
                            </div>
                        }
                    }
                ]}
            />,
        [dealStatusCodes.ACTIVE.label]: 
            <Tab
                tabTextTransform='none'
                className={'mt-2 secondary'}
                navSize={2}
                contentSize={2}
                tabs
                currentIndex={0}
                items={[
                    {
                        title: dealStatusCodes.ACTIVE.label,
                        content: {
                            jsx: <div className='mt-3'>
                            {isLoading ? <Loader /> : <Table
                                    tableView={tableViews.agentCoverageListingForSale}
                                    tableTitleWithTooltips={coverageListingsTooltips}
                                    rowData={forSaleData} />}
                            </div>
                        }
                    }
                ]}
            />
    }

    return (
        <>
            <div className='m-1 mb-2 row'>
                {incomingState.current?.agent &&
                <AgentContactInfo
                    agent={incomingState.current?.agent}
                    isShowAgentListingView={state.isShowAgentListingView}
                    isCoverageListing={true}
                    index={2}
                    displayMode={displayMode}
                    statusType={state.tableType?.value}
                    isUnits={isUnits}
                    intervalType={state.intervalType}
                    areaType={state.areaType}
                    module={module}
                />}
                <div className={'d-flex ml-sm-auto align-self-center'}>
                    <ExportButton {...state.exportProps} />
                </div>
            </div>
            <div className='content mt-2 pb-3 d-flex flex-column listing-content'>
                <div className='agent-coverage-listings-header'>
                    <div className='d-flex align-items-center'>
                        <Link className='btn btn-link w-max text-decoration-none agent-coverage-listing-breadcrumb'
                              to={agentProfileRoute + '?id=' + incomingState.current?.agent.agentId
                              + '&tabIndex=2&graphStatusType=' + state.tableType?.value
                              + '&isUnits=' + isUnits
                              + '&timeInterval=' + state?.intervalType
                              + '&areaType=' + state?.areaType
                              + '&displayMode=' + displayMode}>
                            Transaction Coverage <span>&gt;</span>
                        </Link>
                        <Select
                            dataLwtId='agent-coverage-listing'
                            onChange={changeSelectedArea}
                            className='agent-coverage-listing-select'
                            isClearable={false}
                            options={state.selectOptions}
                            defaultValue={selectDefaultValue}
                            styles={selectStyles} />
                    </div>
                </div>
                {tabByStatus[state.tableType?.label]}
            </div>
        </>
    );
};

AgentCoverageListing.propTypes = {
    module: PropTypes.string
};

export default AgentCoverageListing;
