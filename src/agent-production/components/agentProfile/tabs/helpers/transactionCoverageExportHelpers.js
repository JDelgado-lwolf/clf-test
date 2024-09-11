import { agentProductionTemplates, agentProductionTerms } from '../../../../../constants';
import { dealStatusCodes } from '../../../../constants/agentProductionConstants';
import { addPctSymbol, formatUnitOrPercentage, getUngrouped2Decimals } from '../../../../helpers/dataFormatters';
import { getDateForFilename } from './exportHelpers';
import { tableChartModes } from '../../../common/TableChartToggle';

const getFilename = ({ agent, mlsName, date, statusType }) => {

    const dateForFilename = getDateForFilename(date);

    return agentProductionTemplates.exportFilenames.transactionCoverage
            .replace('[AGENT_NAME]', agent.agentName)
            .replace('[DEAL_STATUS]', statusType.label)
            .replace('[SEARCH_AREA/MLS_NAME]', mlsName)
            .replace('[DOWNLOAD_DATE]', dateForFilename)
        + '.csv';
};

const getContentForExport = (data, area, statusType) => {

    const apt = agentProductionTerms;

    const headers = {
        [dealStatusCodes.SOLD.value]: [
            { label: [area], key: 'area' },
            { label: apt.listNumber, key: 'listUnits' },
            { label: apt.listDollars, key: 'listVolume' },
            { label: apt.sellNumber, key: 'sellUnits' },
            { label: apt.sellDollars, key: 'sellVolume' },
            { label: apt.totalNumber, key: 'totalUnits' },
            { label: apt.totalDollars, key: 'totalVolume' },
            { label: apt.totalNumberPct, key: 'totalUnitsPct' },
            { label: apt.totalDollarsPct, key: 'totalVolumePct' }
        ],
        [dealStatusCodes.ACTIVE.value]: [
            { label: [area], key: 'area' },
            { label: 'Currently For Sale #', key: 'totalUnits' },
            { label: 'Currently For Sale $', key: 'totalVolume' },
            { label: apt.totalNumberPct, key: 'totalUnitsPct' },
            { label: apt.totalDollarsPct, key: 'totalVolumePct' }
        ],
        [dealStatusCodes.UNDER_CONTRACT.value]: [
            { label: [area], key: 'area' },
            { label: 'Currently Under Contract #', key: 'totalUnits' },
            { label: 'Currently Under Contract $', key: 'totalVolume' },
            { label: apt.totalNumberPct, key: 'totalUnitsPct' },
            { label: apt.totalDollarsPct, key: 'totalVolumePct' }
        ]
    }[statusType.value];

    const mappedData = statusType.value === dealStatusCodes.SOLD.value
        ? data.map(d => {
            return {
                area: d.area,
                listUnits: formatUnitOrPercentage(d.listUnits, true),
                listVolume: d.listVolume,
                sellUnits: formatUnitOrPercentage(d.sellUnits, true),
                sellVolume: d.sellVolume,
                totalUnits: formatUnitOrPercentage(d.totalUnits, true),
                totalVolume: d.totalVolume,
                totalUnitsPct: addPctSymbol(getUngrouped2Decimals(d.totalUnitsPct)),
                totalVolumePct: addPctSymbol(getUngrouped2Decimals(d.totalVolumePct))
            };
        })
        : data.map(d => {
            return {
                area: d.area,
                totalUnits: formatUnitOrPercentage(d.totalUnits, true),
                totalVolume: formatUnitOrPercentage(d.totalVolume, true),
                totalUnitsPct: addPctSymbol(getUngrouped2Decimals(d.totalUnitsPct)),
                totalVolumePct: addPctSymbol(getUngrouped2Decimals(d.totalVolumePct))
            };
        });

    return {
        headers,
        data: mappedData
    };
};

export const getExportButtonProps = ({
                                         data, agent, mlsName, tableChartMode, statusType, area
                                     }) => {
    if (!data || !data.length) return { isVisible: false };

    const filename = getFilename({ agent, mlsName, date: new Date(), statusType });
    const dataForExport = getContentForExport(data, area, statusType);
    return {
        headers: dataForExport.headers,
        data: dataForExport.data,
        filename,
        isVisible: tableChartMode === tableChartModes.TABLE
    };
};
