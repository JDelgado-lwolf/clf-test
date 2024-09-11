import { agentsColumns } from '../constants/agentProductionConstants';
import { format } from 'date-fns';
import { agentProductionTemplates, agentProductionTerms } from '../../constants';
import { getReplacedTemplate } from './stringConstantHelpers';

export const columnGroups = Object.freeze({
    CONTACT: 0,
    TOTAL_SELL: 1,
    TOTAL_LIST: 2,
    NO_PRICE_CHANGE: 3,
    PRICE_CHANGE: 4,
});

export const getHeaderText = () => {

    const currentLast12MonthsText = getCurrentLast12MonthsText();

    const substitutions = [];
    substitutions.push({ searchText: '[LAST_12_MONTHS]', replaceWith: agentProductionTerms.last12Months });
    substitutions.push({ searchText: '[CURRENT_LAST_12_MONTHS_RANGE]', replaceWith: currentLast12MonthsText });

    return getReplacedTemplate(agentProductionTemplates.headerListSideTransactions, substitutions);
};

const getCurrentLast12MonthsText = () => {

    const today = new Date();
    const DATE_FORMAT = 'MMM dd, yyyy';

    const formattedLast12MonthsFrom
        = format(new Date(new Date(today.setFullYear(today.getFullYear() - 1)).setDate(1)), DATE_FORMAT);
    const formattedLast12MonthsTo = format(new Date(today.getFullYear() + 1, today.getMonth(), 0), DATE_FORMAT);

    return `${formattedLast12MonthsFrom} - ${formattedLast12MonthsTo}`;
};

export const getDefaultColumns = () => {
    const columns = [
        { ...agentsColumns.rank, headerPlacement: columnGroups.CONTACT },
        { ...agentsColumns.agentId, headerPlacement: columnGroups.CONTACT },
        { ...agentsColumns.agentName, headerPlacement: columnGroups.CONTACT },
        { ...agentsColumns.officeId, headerPlacement: columnGroups.CONTACT },
        { ...agentsColumns.officeAddress, headerPlacement: columnGroups.CONTACT },
        { ...agentsColumns.officeCity, headerPlacement: columnGroups.CONTACT },
        { ...agentsColumns.officeZipCode, headerPlacement: columnGroups.CONTACT },
        { ...agentsColumns.officeCounty, headerPlacement: columnGroups.CONTACT },

        { ...agentsColumns.last12SellUnits, headerPlacement: columnGroups.TOTAL_SELL },
        { ...agentsColumns.last12SellVolume, headerPlacement: columnGroups.TOTAL_SELL },

        { ...agentsColumns.last12ListUnits, headerPlacement: columnGroups.TOTAL_LIST },
        { ...agentsColumns.last12ListVolume, headerPlacement: columnGroups.TOTAL_LIST },

        { ...agentsColumns.noPcLast12ListUnits, headerPlacement: columnGroups.NO_PRICE_CHANGE },
        { ...agentsColumns.noPcLast12ListUnitsPct, headerPlacement: columnGroups.NO_PRICE_CHANGE },
        { ...agentsColumns.noPcLast12ListVolume, headerPlacement: columnGroups.NO_PRICE_CHANGE },
        { ...agentsColumns.noPcLast12ListVolumePct, headerPlacement: columnGroups.NO_PRICE_CHANGE },
        { ...agentsColumns.noPcLast12ListDom, headerPlacement: columnGroups.NO_PRICE_CHANGE },
        { ...agentsColumns.noPcLast12ListCdom, headerPlacement: columnGroups.NO_PRICE_CHANGE },
        { ...agentsColumns.noPcLast12SpOp, headerPlacement: columnGroups.NO_PRICE_CHANGE },

        { ...agentsColumns.pcLast12ListUnits, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListUnitsPct, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListVolume, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListVolumePct, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListDom, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListCdom, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListPcDom, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListSpOp, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListSpLp, headerPlacement: columnGroups.PRICE_CHANGE },
        { ...agentsColumns.pcLast12ListAvgNumPc, headerPlacement: columnGroups.PRICE_CHANGE },
    ];

    const columnsToHide = [
        agentsColumns.officeId,
        agentsColumns.officeAddress,
        agentsColumns.officeCity,
        agentsColumns.officeZipCode,
        agentsColumns.officeCounty,
        agentsColumns.last12SellUnits,
        agentsColumns.last12SellVolume,
        agentsColumns.last12ListVolume,
        agentsColumns.noPcLast12ListVolume,
        agentsColumns.noPcLast12ListVolumePct,
        agentsColumns.pcLast12ListVolume,
        agentsColumns.pcLast12ListVolumePct
    ];

    return columns.map((c) => {
        const isDisplayed = !columnsToHide.some(cth => cth.id === c.id);
        return { ...c, isDisplayed };
    });
};
