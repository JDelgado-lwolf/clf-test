import { agentProductionTerms } from '../../constants';
import { agentsColumns } from '../constants/agentProductionConstants';
import { getTimeIntervalData } from './browserStorageHelper';
import { yearFormat } from './dataFormatters';

export const getListingProficiencyCsvHeaders = selectedColumnIds => {

  let headers = [];

  const getHeaders = (agentsColumns, headers, selectedColumnIds, label, key) => {
    const revisedHeaders = [...headers];
    if (!selectedColumnIds.includes(agentsColumns[key].id)) return revisedHeaders;
    revisedHeaders.push({
      label,
      key: agentsColumns[key].id
    });
    return revisedHeaders;
  };

  const getHeadersLocal = (headers, label, key) => {
    return getHeaders(agentsColumns, headers, selectedColumnIds, label, key);
  };

  headers.push(
      { label: 'First Name', key: 'firstName' },
      { label: 'Last Name', key: 'lastName' },
      { label: 'Office Name', key: agentsColumns.officeName.id }
  );

  headers = getHeadersLocal(headers, 'Office ID', agentsColumns.officeId.id);

  selectedColumnIds.includes(agentsColumns.officeAddress.id) && headers.push(
      { label: 'Office Address', key: agentsColumns.officeAddress.id },
      { label: 'Office City', key: 'officeCity' },
      { label: 'Office Zip', key: 'officeZipCode' },
      { label: 'Office County', key: 'officeCounty' }
  );

  const keysToCheck = [];
  const addCheck = (label, key) => keysToCheck.push({label, key});

  addCheck('Total Sell # Units', agentsColumns.last12SellUnits.id);
  addCheck('Total Sell $ Volume', agentsColumns.last12SellVolume.id);
  addCheck( 'Total List # Units', agentsColumns.last12ListUnits.id);
  addCheck( 'Total List $ Volume', agentsColumns.last12ListVolume.id);

  addCheck( 'No PC # Units', agentsColumns.noPcLast12ListUnits.id);
  addCheck( 'No PC % of Total Units', agentsColumns.noPcLast12ListUnitsPct.id);
  addCheck( 'No PC $ Volume', agentsColumns.noPcLast12ListVolume.id);
  addCheck( 'No PC % of Total Volume', agentsColumns.noPcLast12ListVolumePct.id);
  addCheck( 'No PC DOM', agentsColumns.noPcLast12ListDom.id);
  addCheck( 'No PC CDOM', agentsColumns.noPcLast12ListCdom.id);
  addCheck( 'No PC SP/OP', agentsColumns.noPcLast12SpOp.id);

  addCheck( 'PC # Units', agentsColumns.pcLast12ListUnits.id);
  addCheck( 'PC % of Total Units', agentsColumns.pcLast12ListUnitsPct.id);
  addCheck( 'PC $ Volume', agentsColumns.pcLast12ListVolume.id);
  addCheck( 'PC % of Total Volume', agentsColumns.pcLast12ListVolumePct.id);
  addCheck( 'PC Avg DOM', agentsColumns.pcLast12ListDom.id);
  addCheck( 'PC CDOM', agentsColumns.pcLast12ListCdom.id);
  addCheck( 'PC DOM', agentsColumns.pcLast12ListPcDom.id);
  addCheck( 'PC SP/OP', agentsColumns.pcLast12ListSpOp.id);
  addCheck( 'PC SP/LP', agentsColumns.pcLast12ListSpLp.id);
  addCheck( 'Avg # PC', agentsColumns.pcLast12ListAvgNumPc.id);

  keysToCheck.forEach(keyValue => {
    headers = getHeadersLocal(headers, keyValue.label, keyValue.key);
  });

  return headers;
};

export const getGrowthAnalysisCsvHeaders = (selectedColumnIds, customSettings) => {
    let headers = [];

    const getHeaders = (agentsColumns, headers, selectedColumnIds, label, dataKey) => {
      const revisedHeaders = [...headers];

      if (!selectedColumnIds.includes(agentsColumns[dataKey].id)) return revisedHeaders;
      revisedHeaders.push({
        label,
        key: agentsColumns[dataKey].id
      });
      return revisedHeaders;
    }

    const getHeadersLocal = (headers, label, dataKey) => {
        return getHeaders(agentsColumns, headers, selectedColumnIds, label, dataKey);
    };

    headers = getHeadersLocal(headers, 'Agent ID', agentsColumns.agentId.id, agentsColumns.agentId.id);

    headers.push(
        { label: 'First Name', key: 'firstName' },
        { label: 'Last Name', key: 'lastName' },
        { label: 'Office Name', key: agentsColumns.officeName.id }
    );

    headers = getHeadersLocal(headers, 'Office ID', agentsColumns.officeId.id, agentsColumns.officeId.id);

    selectedColumnIds.includes(agentsColumns.officeAddress.id) && headers.push(
        { label: 'Office Address', key: agentsColumns.officeAddress.id },
        { label: 'Office City', key: 'officeCity' },
        { label: 'Office Zip', key: 'officeZipCode' },
        { label: 'Office County', key: 'officeCounty' }
    );

    const keysToCheck = [];
    const timePeriods = getTimeIntervalData();
    const previousYear = timePeriods?.find(value => value.intervalType === 'YTD')?.previous.from;
    const currentYear = timePeriods?.find(value => value.intervalType === 'YTD')?.last.from;

    const addCheck = (label, key, dataKey) => keysToCheck.push({label, key, dataKey});

    if (customSettings?.isPeriodLast12Months) {
        addCheck( 'PTM #', agentsColumns.ptmNum.id, agentsColumns.ptmTotalUnits.id);
        addCheck( 'LTM #', agentsColumns.ltmNum.id, agentsColumns.last12TotalUnits.id);
        addCheck( 'Change (#)', agentsColumns.changeNum.id, agentsColumns.totalUnitsChange.id);
        addCheck( '% Change (#)', agentsColumns.pctChangeNum.id, agentsColumns.totalUnitsGrowth.id);
        addCheck( 'PTM $', agentsColumns.ptm$.id, agentsColumns.ptmTotalVolume.id);
        addCheck( 'LTM $', agentsColumns.ltm$.id, agentsColumns.last12TotalVolume.id);
        addCheck( 'Change ($)', agentsColumns.change$.id, agentsColumns.totalVolumeChange.id);
        addCheck( '% Change ($)', agentsColumns.pctChange$.id, agentsColumns.totalVolumeGrowth.id);
    } else {
        addCheck( `YTD ${yearFormat(previousYear)} #`, agentsColumns.ytdPrevYearNum.id, agentsColumns.pytdTotalUnits.id);
        addCheck( `YTD ${yearFormat(currentYear)} #`, agentsColumns.ytdCurrentYearNum.id, agentsColumns.lytdTotalUnits.id);
        addCheck( 'Change (#)', agentsColumns.changeNum.id, agentsColumns.lytdPytdTotalUnitsChange.id);
        addCheck( '% Change (#)', agentsColumns.pctChangeNum.id, agentsColumns.lytdPytdTotalUnitsGrowth.id);      
        addCheck( `YTD ${yearFormat(previousYear)} $`, agentsColumns.ytdPrevYear$.id, agentsColumns.pytdTotalVolume.id);
        addCheck( `YTD ${yearFormat(currentYear)} $`, agentsColumns.ytdCurrentYear$.id, agentsColumns.lytdTotalVolume.id);      
        addCheck( 'Change $', agentsColumns.change$.id, agentsColumns.lytdPytdTotalVolumeChange.id);
        addCheck( '% Change $', agentsColumns.pctChange$.id, agentsColumns.lytdPytdTotalVolumeGrowth.id);      
    };

    keysToCheck.forEach(keyValue => {
      headers = getHeadersLocal(headers, keyValue.label, keyValue.dataKey);
    });
  
    return headers;
};

export const getAgentsAndSummaryData = (selectedAgents, summaryPinnedData) => {
    const summaryPinnedRow = {
        ...summaryPinnedData,
        firstName: agentProductionTerms.summary
    };
    return [...selectedAgents, summaryPinnedRow];
};
