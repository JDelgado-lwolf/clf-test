import { agentsColumns, tableViewNames } from "../../../../agent-production/constants/agentProductionConstants";
import { searchTerms } from "../../../../constants";
import TextFloatingFilterComponent from "../agGrid/FloatingFilter";
import { colSettings } from "../agGrid/colSettings";

export const availableOfficesColumns = {
    [tableViewNames.availableOffices]: {
        id: tableViewNames.availableOffices,
        sortable: false,
        showPagination: false,
        tables: [
            {col: agentsColumns.officeName, sortable: false, colDef: colSettings.textSm, filterPlaceholder: searchTerms.searchName },
            {col: agentsColumns.officeId, sortable: false, colDef: colSettings.textSmall, filterPlaceholder: searchTerms.searchId },
            {col: agentsColumns.streetName, sortable: false, colDef: colSettings.textSm, filterPlaceholder: searchTerms.searchAddress },
            {col: agentsColumns.city, sortable: false, colDef: colSettings.textXs, filterPlaceholder: agentsColumns.city.label },
            {col: agentsColumns.zipCode, sortable: false, colDef: colSettings.textXs, filterPlaceholder: agentsColumns.zipCode.label },
            {col: agentsColumns.county, sortable: false, colDef: colSettings.textSmall, filterPlaceholder: agentsColumns.county.label },
            {col: agentsColumns.producingAgentCount, sortable: false, colDef: colSettings.numberSmTiny },
            {col: agentsColumns.totalVolume, sortable: false, colDef: colSettings.blankEmptyXsVolume }
        ]
    }
};

export const getColumnsWithFilters = () => {
    return ({
        ...availableOfficesColumns.availableOffices,
        tables: availableOfficesColumns.availableOffices?.tables.map(col => {
            if (
                col.col.id === agentsColumns.producingAgentCount.id ||
                col.col.id === agentsColumns.totalVolume.id
            ) return col;

            return ({
                ...col,
                filterOptions: {
                    filter: 'agTextColumnFilter',
                    floatingFilterComponent: TextFloatingFilterComponent,
                    floatingFilter: true,
                    floatingFilterComponentParams: { placeholder: col?.filterPlaceholder },
                    supressMenu: true,
                    suppressFiltersToolPanel: true
                }
            })
        })
    })
};
