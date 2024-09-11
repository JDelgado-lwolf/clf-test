import React, { useState, useRef } from 'react';
import { Button } from '@lwt-helix/buttons';
import AgentsColumns from './AgentsColumns';
import { CSVLink } from 'react-csv';
import {
    csvFileNameFormatter,
    getOverviewCsvHeaders,
    getContactInfoCsvHeaders
} from '../helpers/agentProductionHelpers';
import {
    formatVolumeOrDays,
    formatUnitOrPercentage,
    addPctSymbol,
    addPctFormatted
} from '../helpers/dataFormatters';
import { agentsColumns, tabModes } from '../constants/agentProductionConstants';
import { buttonTerms } from '../../constants';
import { getIsPeriodLast12Months } from './helpers/growthAnalysisHelpers';
import {
    getGrowthAnalysisCsvHeaders,
    getListingProficiencyCsvHeaders,
    getAgentsAndSummaryData
} from '../helpers/exportHelpers';
import { useSearchStore } from '../../store/store';

const AgentsExport = ({
    defaultColumns,
    selectedAgents,
    handleClose,
    tabMode,
    currentSearchDates,
    growthAnalysisPeriod
}) => {
    const [selectedColumnIds, setSelectedColumnIds] = useState([
        ...defaultColumns.flatMap((c) => (c.isDisplayed ? c.id : []))
    ]);

    const selectedModule = useSearchStore((state) => state.selectedModule);
    const summaryPinnedData = useSearchStore((state) => state[selectedModule]?.summaryPinnedData);

    const revisedSelectedAgents = selectedAgents.map((agent) => ({
        ...agent,
        averagePrice: formatVolumeOrDays(agent.averagePrice, true),
        firstName: agent.agentName.split(' ')[0],
        last12AvgDom: formatVolumeOrDays(agent.last12AvgDom, true),
        last12ListUnits: formatUnitOrPercentage(agent.last12ListUnits, true),
        last12ListVolume: formatVolumeOrDays(agent.last12ListVolume, true),
        last12SellUnits: formatUnitOrPercentage(agent.last12SellUnits, true),
        last12SellVolume: formatVolumeOrDays(agent.last12SellVolume, true),
        last12Spop: addPctSymbol(formatUnitOrPercentage(agent.last12Spop, true)),
        last12TotalUnits: formatUnitOrPercentage(agent.last12TotalUnits, true),
        last12TotalVolume: formatVolumeOrDays(agent.last12TotalVolume, true),
        lastName: agent.agentName.split(' ')[1] === undefined ? '' : agent.agentName.split(' ')[1],
        listUnits: formatUnitOrPercentage(agent.listUnits, true),
        listVolume: formatVolumeOrDays(agent.listVolume, true),
        lytdPytdTotalUnitsGrowth: addPctSymbol(agent.lytdPytdTotalUnitsGrowth),
        lytdPytdTotalVolumeGrowth: addPctSymbol(
            formatUnitOrPercentage(agent.lytdPytdTotalVolumeGrowth, true)
        ),
        lytdTotalVolume: formatVolumeOrDays(agent.lytdTotalVolume, true),
        noPcLast12ListCdom: formatVolumeOrDays(agent.noPcLast12ListCdom, true),
        noPcLast12ListDom: formatVolumeOrDays(agent.noPcLast12ListDom, true),
        noPcLast12ListUnitsPct: addPctFormatted(agent?.noPcLast12ListUnitsPct),
        noPcLast12ListVolumePct: addPctFormatted(agent?.noPcLast12ListVolumePct),
        noPcLast12SpOp: addPctFormatted(agent?.noPcLast12SpOp),
        pcLast12ListAvgNumPc: formatUnitOrPercentage(agent.pcLast12ListAvgNumPc, true),
        pcLast12ListCdom: formatVolumeOrDays(agent.pcLast12ListCdom, true),
        pcLast12ListDom: formatVolumeOrDays(agent.pcLast12ListDom, true),
        pcLast12ListPcDom: formatVolumeOrDays(agent.pcLast12ListPcDom, true),
        pcLast12ListSpLp: addPctFormatted(agent?.pcLast12ListSpLp),
        pcLast12ListSpOp: addPctFormatted(agent?.pcLast12ListSpOp),
        pcLast12ListUnitsPct: addPctFormatted(agent?.pcLast12ListUnitsPct),
        pcLast12ListVolumePct: addPctFormatted(agent?.pcLast12ListVolumePct),
        ptmTotalVolume: formatVolumeOrDays(agent.ptmTotalVolume, true),
        sellUnits: formatUnitOrPercentage(agent.sellUnits, true),
        sellVolume: formatVolumeOrDays(agent.sellVolume, true),
        totalUnits: formatUnitOrPercentage(agent.totalUnits, true),
        totalUnitsChange: formatUnitOrPercentage(agent.totalUnitsChange, true),
        totalUnitsGrowth: addPctFormatted(agent?.totalUnitsGrowth),
        totalVolume: formatVolumeOrDays(agent.totalVolume, true),
        totalVolumeChange: formatVolumeOrDays(agent.totalVolumeChange, true),
        totalVolumeGrowth: addPctSymbol(formatUnitOrPercentage(agent.totalVolumeGrowth, true))
    }));

    const revisedSummaryPinnedData = {
		...summaryPinnedData,
        last12AvgDom: formatVolumeOrDays(summaryPinnedData.last12AvgDom, true),
        last12TotalVolume: formatVolumeOrDays(summaryPinnedData?.last12TotalVolume, true),
        last12SellVolume: formatVolumeOrDays(summaryPinnedData.last12SellVolume, true),
        last12ListVolume: formatVolumeOrDays(summaryPinnedData.last12ListVolume, true),
        noPcLast12ListCdom: formatVolumeOrDays(summaryPinnedData?.noPcLast12ListCdom, true),
        noPcLast12ListDom: formatVolumeOrDays(summaryPinnedData?.noPcLast12ListDom, true),
        noPcLast12ListVolume: formatVolumeOrDays(summaryPinnedData?.noPcLast12ListVolume, true),
        noPcLast12ListUnitsPct: addPctFormatted(summaryPinnedData?.noPcLast12ListUnitsPct),
        noPcLast12SpOp: addPctFormatted(summaryPinnedData?.noPcLast12SpOp),
        pcLast12ListAvgNumPc: formatUnitOrPercentage(summaryPinnedData?.pcLast12ListAvgNumPc, true),
        pcLast12ListCdom: formatVolumeOrDays(summaryPinnedData?.pcLast12ListCdom, true),
        pcLast12ListDom: formatVolumeOrDays(summaryPinnedData?.pcLast12ListDom, true),
        pcLast12ListPcDom: formatVolumeOrDays(summaryPinnedData?.pcLast12ListPcDom, true),
        pcLast12ListSpLp: addPctFormatted(summaryPinnedData?.pcLast12ListSpLp),
        pcLast12ListSpOp: addPctFormatted(summaryPinnedData?.pcLast12ListSpOp),
        pcLast12ListUnitsPct: addPctFormatted(summaryPinnedData?.pcLast12ListUnitsPct),
        pcLast12ListVolume: formatVolumeOrDays(summaryPinnedData?.pcLast12ListVolume, true),
        totalVolume: formatVolumeOrDays(summaryPinnedData?.totalVolume, true),
        sellVolume: formatVolumeOrDays(summaryPinnedData?.sellVolume, true),
        listVolume: formatVolumeOrDays(summaryPinnedData?.listVolume, true),
    };

    let revisedSelectedColumnIds, agentsAndSummaryData;
    switch (tabMode) {
        case tabModes.OVERVIEW:
            agentsAndSummaryData = getAgentsAndSummaryData(
                revisedSelectedAgents,
                revisedSummaryPinnedData
            );
            revisedSelectedColumnIds = selectedColumnIds.concat([
                'firstName',
                'lastName',
                'office'
            ]);
            break;
        case tabModes.CONTACT_INFORMATION:
            revisedSelectedColumnIds = selectedColumnIds.concat([
                'firstName',
                'lastName',
                'office',
                'city',
                'county',
                'zipCode',
                'county',
                'altZipCode',
                'altCity'
            ]);
            break;
        case tabModes.GROWTH_ANALYSIS:
            revisedSelectedColumnIds = selectedColumnIds.concat([
                'firstName',
                'lastName',
                'office'
            ]);
            break;
        case tabModes.LISTING_PROFICIENCY:
            agentsAndSummaryData = getAgentsAndSummaryData(
                revisedSelectedAgents,
                revisedSummaryPinnedData
            );
            revisedSelectedColumnIds = selectedColumnIds.concat([
                'firstName',
                'lastName',
                'office'
            ]);
            break;
    }

    const fileName = csvFileNameFormatter(tabMode);

    const customSettings = {
        isPeriodLast12Months: getIsPeriodLast12Months(growthAnalysisPeriod),
        currentSearchDates
    };

    const csvHeaders = {
        [tabModes.OVERVIEW]: getOverviewCsvHeaders(revisedSelectedColumnIds, currentSearchDates),
        [tabModes.CONTACT_INFORMATION]: getContactInfoCsvHeaders(
            revisedSelectedColumnIds,
            currentSearchDates
        ),
        [tabModes.GROWTH_ANALYSIS]: getGrowthAnalysisCsvHeaders(
            revisedSelectedColumnIds,
            customSettings
        ),
        [tabModes.LISTING_PROFICIENCY]: getListingProficiencyCsvHeaders(revisedSelectedColumnIds)
    }[tabMode];

    const rankedCsvHeaders = [
        { label: agentsColumns.rank.label, key: agentsColumns.rank.id },
        ...csvHeaders
    ];

    const csvLink = useRef();
    const handleCancelClick = () => handleClose();
    const handleSubmitClick = () => {
        csvLink.current.link.click();
        handleClose();
    };

    const isSubmitButtonDisabled = selectedColumnIds?.length === 0;
    const countAgentsText = `${selectedAgents.length} ${
        selectedAgents.length === 1 ? 'agent' : 'agents'
    } selected`;

    return (
        <div id={'agents-export'}>
            <p className="helix-heading">Select which agent data to export.</p>
            <AgentsColumns
                defaultColumns={defaultColumns}
                inputIdPrefix={'agents-export'}
                tabMode={tabMode}
                setParentColumnIds={setSelectedColumnIds}
                customSettings={customSettings}
            />

            <div className={'text-right'}>
                <div className={'d-inline-block mr-2'}>
                    <span className="helix-heading">{countAgentsText}</span>
                </div>
                <Button
                    dataLwtId={'btn-agents-export-cancel'}
                    onClick={handleCancelClick}
                >
                    {buttonTerms.cancel}
                </Button>
                <Button
                    dataLwtId={'btn-agents-export-submit'}
                    onClick={handleSubmitClick}
                    color={'primary'}
                    disabled={isSubmitButtonDisabled}
                >
                    {buttonTerms.export}
                </Button>
                <CSVLink
                    headers={rankedCsvHeaders}
                    data={agentsAndSummaryData || revisedSelectedAgents}
                    filename={fileName}
                    className={'hidden'}
                    ref={csvLink}
                    target={'_blank'}
                />
            </div>
        </div>
    );
};

export default AgentsExport;
