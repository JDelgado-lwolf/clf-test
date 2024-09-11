import { agentProductionTemplates, agentProductionTerms } from '../../../../../constants';
import { tableChartModes } from '../../../common/TableChartToggle';
import { getDateForAgentProductionFilename, getDateForTable, getParsedDate } from './exportHelpers';

const getFilename = ({ agent, mlsName, dates } ) => {

  const dateStart = getParsedDate(dates[0])
  const dateFinish = getParsedDate(dates[1])

  const periodStart = getDateForAgentProductionFilename(dateStart),
    periodFinish = getDateForAgentProductionFilename(dateFinish)

  return agentProductionTemplates.exportFilenames.production
          .replace('[AGENT_NAME]', agent.agentName)
          .replace('[MLS_NAME]', mlsName)
          .replace('[PERIOD_START]', periodStart)
          .replace('[PERIOD_FINISH]', periodFinish)
      + '.csv'
}

const getContentForExport = data => {

  const apt = agentProductionTerms

  const headers = [
    { label: apt.month, key: 'month' },
    { label: apt.listNumber, key: 'listUnits' },
    { label: apt.listDollars, key: 'listVolume' },
    { label: apt.sellNumber, key: 'sellUnits' },
    { label: apt.sellDollars, key: 'sellVolume' },
    { label: apt.totalNumber, key: 'totalUnits' },
    { label: apt.totalDollars, key: 'totalVolume' }
  ];

  const mappedData = data.map(d => {

    const parsedDate = getParsedDate(d.month)
    const dateForExport = getDateForTable(parsedDate)

    return {
      month: dateForExport,
      listUnits: d.listUnits,
      listVolume: d.listVolume,
      sellUnits: d.sellUnits,
      sellVolume: d.sellVolume,
      totalUnits: d.totalUnits,
      totalVolume: d.totalVolume
    }
  })

  return {
    headers,
    data: mappedData
  }
}

export const getExportButtonProps = ({ data, agent, mlsName, dates, tableChartMode }) => {

  if (!data || !data.length) return { isVisible: false };

  const filename = getFilename({ agent, mlsName, dates })
  const dataForExport = getContentForExport(data)

  return {
    headers: dataForExport.headers,
    data: dataForExport.data,
    filename,
    isVisible: tableChartMode === tableChartModes.TABLE
  }
}
