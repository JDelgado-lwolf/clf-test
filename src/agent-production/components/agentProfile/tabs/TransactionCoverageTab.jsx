import React, { useState, useEffect, useRef, useMemo } from 'react';
import Loader from '@lwt-helix/loader';
import { CustomInput } from '@lwt-helix/controls';
import { Button, ButtonGroup } from '@lwt-helix/buttons';
import { Input } from '@lwt-helix/controls';
import AgentTransactionCoverageChart from './transaction-coverage/AgentTransactionCoverageChart';
import TransactionCoverageTable from './transaction-coverage/TransactionCoverageTable';
import { tableChartModes } from '../../common/TableChartToggle';
import { coverageChartTooltips, dealStatusCodes } from '../../../constants/agentProductionConstants';
import { agentProductionTerms, areaRequestTypes } from '../../../../constants';
import { useQuery } from '../../../../common/hooks/location';
import { getElementTooltip } from '../../../helpers/uiHelpers';
import { getAgentTransactionCoverage } from '../../../../service/service-gateway';

const TransactionCoverageTab = props => {
    const {
        searchCriteria,
        mlsId,
        agentId,
        tableChartMode,
        timePeriod,
        setIsTimePeriodSelectorDisabled,
        sendToParent,
        isActive,
        agent,
        mappedAreas
    } = props;

    const query = useQuery();
    const queryAreaType = query.get('areaType');
    const graphStatusType = query.get('graphStatusType');
    const queryIsUnits = query.get('isUnits'); //tracks the volume or units value
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [areasMap, setAreasMap] = useState([]);
    const [areaType, setAreaType] = useState(null);
    const [statusType, setStatusType] = useState(dealStatusCodes.SOLD);
    const [isUnits, setIsUnits] = useState(queryIsUnits === 'true');
    const [shouldDisplayAreaPercentage, setShouldDisplayAreaPercentage] = useState(true);

    const dataRef = useRef(data);
    useEffect(() => {
        dataRef.current = data;
    });
    useEffect(() => {
        switch (graphStatusType) {
            case dealStatusCodes.SOLD.value:
                setStatusType(dealStatusCodes.SOLD);
                break;
            case dealStatusCodes.ACTIVE.value:
                setStatusType(dealStatusCodes.ACTIVE);
                break;
            case dealStatusCodes.UNDER_CONTRACT.value:
                setStatusType(dealStatusCodes.UNDER_CONTRACT);
                break;
        }
    }, [graphStatusType]);

    useEffect(() => {
        let areasMap, areaType;
        areasMap = mappedAreas && !!Object.values(mappedAreas).length ? Object.values(mappedAreas) : [];

        const searchFields = searchCriteria?.realEstateDatasourceIdsWithFilters[0]
            .searchFields ?? [];
        const isSearchAllMLS = searchCriteria?.realEstateDatasourceIdsWithFilters[0]
            .searchAllMLS;
        const searchFieldNames = searchFields.map(f => f.fieldName) || [];

        // Set areaType to the matching searchField columnName
        searchFieldNames.forEach(fieldName => {
            areasMap.forEach(area => {
                if (areaRequestTypes[area.columnName].toLowerCase() === fieldName.toLowerCase()) {
                    areaType = area.columnName;
                }
            });
        });

        // Set areaType to areaMap columnName with the viewName "MLS Areas"
        // if searching "All MLS" and areaType is still null
        if (areaType == null && isSearchAllMLS) {
            areasMap.forEach(area => {
                if (area.viewName.toLowerCase() === agentProductionTerms.mlsAreas.toLowerCase()) {
                    areaType = area.columnName;
                }
            });
        }

        // Default areaType to first option if areaType is still null
        if (areaType == null) {
            areaType = areasMap[0]?.columnName;
        }

        setAreasMap(areasMap);
        setAreaType(queryAreaType || areaType);
    }, [mappedAreas, searchCriteria]);

    useEffect(() => {
        if (!mlsId || !agentId || !areaType) return;

        const loadTransactionCoverageData = async () => {
            setIsLoading(true);
            const areaRequestType = areaRequestTypes[areaType];
            const response = await getAgentTransactionCoverage(
                searchCriteria, agentId, areaRequestType, statusType.value, timePeriod
            );
            !response.error && setData(response);
            setIsLoading(false);
        };
        const handleErrorInFutureTicket = e => e;  // TODO: - add error handling

        loadTransactionCoverageData().catch(handleErrorInFutureTicket);
    }, [agentId, searchCriteria, areaType, statusType, timePeriod, isActive]);

    useEffect(() => {
        if (!isActive || isLoading) return;
        const dataForParent = {
            data: dataRef.current,
            tableChartMode: tableChartMode,
            area: areasMap.find(a => a.columnName === areaType)?.viewName,
            statusType: statusType,
            shouldDisplayAreaPercentage
        };
        sendToParent(dataForParent);

    }, [isActive, tableChartMode, areaType, statusType, dataRef.current]);

    const chartButtons = tableChartMode === tableChartModes.CHART
        ? (
            <ButtonGroup dataLwtId='chart-buttons' size='xs'
                         className='float-right agent-coverage-controls-item xbm-toggles'>
                <Button
                    dataLwtId='volume-btn'
                    size='sm'
                    onClick={() => setIsUnits(false)}
                    className={!isUnits && 'btn-primary'}
                >
                    {getElementTooltip(coverageChartTooltips.volumeBtn)}
                </Button>
                <Button
                    dataLwtId='units-btn'
                    size='sm'
                    onClick={() => setIsUnits(true)}
                    className={isUnits && 'btn-primary'}
                >
                    {getElementTooltip(coverageChartTooltips.unitsBtn)}
                </Button>
            </ButtonGroup>
        ) : null;

    const chartContent = useMemo(() => {
        const sortedData = data?.slice();
        const sortBy = isUnits ? 'totalUnits' : 'totalVolume';
        sortedData.sort((a, b) => a[sortBy] < b[sortBy] ? 1 : -1);

        return (<AgentTransactionCoverageChart
            agentData={sortedData}
            isUnits={isUnits}
            statusType={statusType.value}
            areaType={areaType}
            tableType={statusType}
            agent={agent}
            timePeriod={timePeriod}
            shouldDisplayAreaPercentage={shouldDisplayAreaPercentage}
        />);
    }, [data, isUnits, statusType, areaType, shouldDisplayAreaPercentage]);

    const tableContent = useMemo(() => {
        const label = areaType
            ? areasMap.find(a => a.columnName === areaType)?.viewName
            : '';

        return (<TransactionCoverageTable
            areaLabel={label}
            data={data}
            isUnits={isUnits}
            statusType={statusType.value}
            areaType={areaType}
            tableType={statusType}
            agent={agent}
            timePeriod={timePeriod}
        />);
    }, [data, statusType]);

    let displayedContent;
    if (isLoading) {
        displayedContent = <Loader />;
    } else if (tableChartMode === tableChartModes.TABLE) {
        displayedContent = tableContent;
    } else {
        displayedContent = chartContent;
    }

    const options = [];
    areasMap?.forEach(a => {
        options.push(<option value={a.columnName}>{a.viewName}</option>);
    });

    const handleStatusButtonClick = (statusType, isDisabled) => {
        setStatusType(statusType);
        setIsTimePeriodSelectorDisabled(isDisabled);
    };

    return (
        <>
            <div className='d-flex justify-content-end align-items-center mb-3'>
                {tableChartMode === tableChartModes.CHART && <div className='d-flex mr-2 align-items-center'>
                    <CustomInput
                        dataLwtId='areaPercentageCheckbox'
                        type='checkbox'
                        checked={shouldDisplayAreaPercentage}
                        id='exampleCustomCheckbox'
                        label={getElementTooltip(coverageChartTooltips.marketAreaCheck)}
                        onChange={() => setShouldDisplayAreaPercentage(!shouldDisplayAreaPercentage)}
                    />
                </div>
                }
                <div className='agent-coverage-controls-item'>
                    <Input
                        dataLwtId='area-type-select'
                        value={areaType}
                        type='select'
                        bsSize='sm'
                        className='agent-coverage-cities-select mr-1'
                        onChange={e => setAreaType(e.target.value)}
                    >
                        {options}
                    </Input>
                </div>

                <ButtonGroup
                    dataLwtId='status-code-buttons' size='xs'
                    className='float-right agent-coverage-controls-item xbm-toggles'
                >
                    <Button
                        onClick={() => handleStatusButtonClick(dealStatusCodes.ACTIVE, true)}
                        className={statusType.value === dealStatusCodes.ACTIVE.value && 'btn-primary'}
                        size='sm'
                        dataLwtId='btn-toggle-for-sale'
                    >
                        {getElementTooltip(coverageChartTooltips.forSaleBtn)}
                    </Button>
                    <Button
                        onClick={() => handleStatusButtonClick(dealStatusCodes.UNDER_CONTRACT, true)}
                        className={statusType.value === dealStatusCodes.UNDER_CONTRACT.value && 'btn-primary'}
                        size='sm'
                        dataLwtId='btn-toggle-under-contract'
                    >
                        {getElementTooltip(coverageChartTooltips.underContractBtn)}
                    </Button>
                    <Button
                        onClick={() => handleStatusButtonClick(dealStatusCodes.SOLD, false)}
                        className={statusType.value === dealStatusCodes.SOLD.value && 'btn-primary'}
                        size='sm'
                        dataLwtId='btn-toggle-sold'
                    >
                        {getElementTooltip(coverageChartTooltips.soldBtn)}
                    </Button>
                </ButtonGroup>
                {chartButtons}
            </div>
            {displayedContent}
        </>
    );
};

TransactionCoverageTab.propTypes = {};

export default TransactionCoverageTab;
