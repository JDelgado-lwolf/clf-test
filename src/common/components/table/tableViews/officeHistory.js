import { officeHistoryTooltips } from "../../../../agent-production/constants/agentProductionConstants";

const officeHistoryView = ({ colSettings, tableViewNames, cellRenderers }) => {
    return {
        id: tableViewNames.officeHistory,
        defaultSort: { colId: officeHistoryTooltips.moveDate.id, sortDir: 'desc' },
        tables: [
            { col: officeHistoryTooltips.officeId, colDef: colSettings.textLg },
            { col: officeHistoryTooltips.officeName, colDef: colSettings.textLg },
            { col: officeHistoryTooltips.moveDate, colDef: colSettings.dateSm, cellRenderer: cellRenderers.moveDate }
        ]
    };
};

export default officeHistoryView;
