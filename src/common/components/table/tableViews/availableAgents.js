import { availableAgentsTooltips } from '../../../../agent-production/constants/agentProductionConstants';

const availableAgentsClassRules = {
    'available-agents-inactive': (params) => params.node.data.status === 'I'
};

const availableAgentsView = ({ colSettings, tableViewNames }) => {
    return {
        id: tableViewNames.availableAgents,
        sortable: false,
        tables: [
            {
                col: availableAgentsTooltips.agentName,
                colDef: colSettings.textSmall,
                cellClassRules: availableAgentsClassRules
            },
            {
                col: availableAgentsTooltips.agentId,
                colDef: {...colSettings.textSmRightAlign, minWidth: 140 },
                cellClassRules: availableAgentsClassRules
            },
            {
                col: availableAgentsTooltips.agentStatus,
                colDef: colSettings.textTinyRightAlign,
                cellClassRules: availableAgentsClassRules
            },
            {
                col: availableAgentsTooltips.officeName,
                colDef: colSettings.textSmRightAlign,
                cellClassRules: availableAgentsClassRules
            },
            {
                col: availableAgentsTooltips.officeCity,
                colDef: colSettings.textSmRightAlign,
                cellClassRules: availableAgentsClassRules
            },
            {
                col: availableAgentsTooltips.officeZipCode,
                colDef: colSettings.textTinyRightAlign,
                cellClassRules: availableAgentsClassRules
            },
            {
                col: availableAgentsTooltips.volume,
                colDef: colSettings.blankEmptyXsVolume,
                cellClassRules: availableAgentsClassRules
            }
        ]
    };
};

export default availableAgentsView;
