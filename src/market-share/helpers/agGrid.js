import { gridClasses } from '../constants/gridColumns';

export const getBottomRowSettings = (resultsTableBottomParams) => {
    const { pinnedRowData, bottomRowType, gridRef, pinnedRowDrilldownSettingsType } = resultsTableBottomParams;

    let pinnedRowSettings = {};
    const columnDefs = gridRef.current?.columnApi?.columnModel?.columnDefs;

    columnDefs?.forEach(colDef => {

        const settings = colDef.pinnedRowSettings;

        if (!settings) {
            const cellSetting = {[colDef.field]: pinnedRowData?.[colDef.field] || null};
            pinnedRowSettings = { ...pinnedRowSettings, ...cellSetting };
            return;
        }

        const settingsToUse = settings.default ? 'default' : bottomRowType;

        if (!colDef.cellClass.includes(gridClasses.cellNumber)) {
            const cellSetting = {[colDef.field]: settings[settingsToUse]?.cellValue || null};
            pinnedRowSettings = { ...pinnedRowSettings, ...cellSetting };
            return;
        }
        if (settings[settingsToUse]?.cellValue !== undefined) {
            const cellSetting = { [colDef.field]: settings[settingsToUse]?.cellValue };
            pinnedRowSettings = { ...pinnedRowSettings, ...cellSetting };
            return;
        }
        if (settings[settingsToUse]?.getFieldValue) {
            const cellSetting = {
                [colDef.field]: settings[settingsToUse].getFieldValue({ ...resultsTableBottomParams,
                    keyField: settings[settingsToUse]?.keyField,
                    colDef
                })
            };
            pinnedRowSettings = { ...pinnedRowSettings, ...cellSetting };
            return;
        }
        const hasDrilldownSettings = settings[settingsToUse]?.total || settings[settingsToUse]?.breakdown;
        const pinnedDataKeyField = hasDrilldownSettings && settings[settingsToUse][pinnedRowDrilldownSettingsType]?.keyField;
        if (hasDrilldownSettings) {
            const cellSetting = {
                [colDef.field]: settings[settingsToUse][pinnedRowDrilldownSettingsType]?.getFieldValue({ ...resultsTableBottomParams,
                    keyField: pinnedDataKeyField,
                    colDef
                })
            };
            pinnedRowSettings = { ...pinnedRowSettings, ...cellSetting };
            return;
        }
        const pinnedDataAlternativeKeyField = settings[settingsToUse]?.altKeyField;
        const keyField = pinnedRowData?.[pinnedDataAlternativeKeyField] !== undefined
                            ? pinnedDataAlternativeKeyField
                            : settings[settingsToUse]?.keyField;
        const cellSetting = {[colDef.field]: pinnedRowData?.[pinnedDataKeyField || keyField || colDef.field]};
        pinnedRowSettings = {...pinnedRowSettings, ...cellSetting};
    });
    return [pinnedRowSettings];
};
