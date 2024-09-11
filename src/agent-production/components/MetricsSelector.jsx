import React from 'react';
import AgentsColumns from './AgentsColumns';

const MetricsSelector = ({ columns, setColumns, tabMode, customSettings }) => {

    const setSelectedColumnIds = selectedColumnIds => {
        const revisedColumns = [...columns];
        revisedColumns.forEach(column => {
            const foundColumn = selectedColumnIds.find(id => id === column.id || id === column.parentColumnId);
            column.isDisplayed = !!foundColumn;
        });
        setColumns(revisedColumns);
    };

    return <>
        <AgentsColumns defaultColumns={columns}
                       tabMode={tabMode}
                       inputIdPrefix='metrics-selector'
                       customSettings={customSettings}
                       setParentColumnIds={setSelectedColumnIds} />
    </>;
};

export default MetricsSelector;
