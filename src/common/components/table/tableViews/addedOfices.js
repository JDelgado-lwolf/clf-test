import { agentsColumns, tableViewNames } from '../../../../agent-production/constants/agentProductionConstants';
import { colSettings } from '../agGrid/colSettings';

const addedOfficesColumns = {
        [tableViewNames.addedOffices]: {
            id: tableViewNames.addedOffices,
            sortable: false,
            showPagination: false,
            tables: [
                { col: agentsColumns.officeName, colDef: colSettings.textSm },
                { col: agentsColumns.officeId, colDef: colSettings.textSmRightAlign }
            ]
        }
};

export default addedOfficesColumns;
