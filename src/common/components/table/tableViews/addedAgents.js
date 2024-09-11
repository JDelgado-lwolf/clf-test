import { availableAgentsTooltips } from '../../../../agent-production/constants/agentProductionConstants';

const addedAgentsView = ({ colSettings, tableViewNames }) => {
    return {
        id: tableViewNames.addedAgents,
        tables: [
            { col: availableAgentsTooltips.agentName, colDef: colSettings.textSmall },
            { col: availableAgentsTooltips.agentId, colDef: colSettings.textSmRightAlign }
        ]
    };
};

export default addedAgentsView;
