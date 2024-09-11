import React from 'react';
import { getTitleWithTooltip } from '../../../../agent-production/helpers/schemaTableHelpers';
import CustomHeader from './CustomHeader';
import { tableViewNames } from '../../../../agent-production/constants/agentProductionConstants';
import { dividerClassNames } from './colSettings';
import { cellRenderers } from './tableViews';

function headerWrapper(text) {
    return (
        <p
            className='ag-header-group-text mx-auto ag-grid-cell-link text-uppercase text-wrap text-center m-2'
            role='presentation'
        >
            {text}
        </p>
    );
};

export function getAdditionalTableHeader(field, props) {
    const { additionalTableHeaders } = props;
    return headerWrapper(additionalTableHeaders[0][field]?.title);
}

export function getContact(props) {
    const { additionalTableHeaders } = props;
    return headerWrapper(additionalTableHeaders[0].contact.title);
}

export function getCurrentSearchLast6Months(props) {
    const { additionalTableHeaders } = props;
    return headerWrapper(additionalTableHeaders[0].search.title);
}

export function getAllMlsLast12Months(props) {
    const { additionalTableHeaders } = props;
    return headerWrapper(additionalTableHeaders[0].mls.title);
}

export function getGrowth(props) {
    const { additionalTableHeaders } = props;
    return headerWrapper(additionalTableHeaders[0].growth.title);
}

const setDefaultSort = (e, tableView) => {
    const { defaultSort } = tableView;
    if (defaultSort) {
        const columnState = {
            state: [
                {
                    colId: defaultSort.colId,
                    sort: defaultSort.sortDir
                }
            ]
        };
        e.columnApi.applyColumnState(columnState);
    }
};

const addRemoveHighlights = (elements, columnIndex, highlightClass) => {
    elements?.forEach(element => {
        const ATTR_COLUMN_INDEX = 'aria-colindex';
        if (element.getAttribute(ATTR_COLUMN_INDEX) === columnIndex.toString()) {
                element.classList.add(highlightClass);
            } else {
                element.classList.remove(highlightClass);
            }
    });
};

const drawHeaderGroupDivider = () => {
    const headerGroupCellElements = document.querySelectorAll(`.ag-header-group-cell`)
    headerGroupCellElements.forEach((element, index) => {
        const headerResizeElement = element.querySelectorAll('.ag-header-cell-resize')?.[0];
        headerResizeElement.classList.add(dividerClassNames.transparentResizeIcon);
        if (index !== headerGroupCellElements.length - 1){
            element.classList.add(dividerClassNames.dividerCol);
        }
    });
};

export const handleDrawDivider = (tableName, columnDefs) => {
    if (tableName !== tableViewNames.overview) return;
    drawHeaderGroupDivider();

    let colIndex = 0;
    let lastShownColumnDefWithIndex = [];

    const hiddenDividers = document.querySelectorAll(`.ag-header-cell > div.ag-header-cell-resize.${dividerClassNames.transparentResizeIcon}`);
    hiddenDividers?.forEach(divider => {
        divider.classList.remove(dividerClassNames.transparentResizeIcon)
    });

    const filterDividers = document.querySelectorAll(`.ag-floating-filter.${dividerClassNames.dividerCol}`);
    filterDividers?.forEach(divider => divider.classList.remove(dividerClassNames.dividerCol))

    lastShownColumnDefWithIndex?.forEach(({id}) => {
        const el = document.querySelector(`.ag-floating-filter[aria-colindex='${id}']`);
        el && el.classList.remove(dividerClassNames.dividerCol);
    });

    columnDefs.forEach((columDef, index) => {
        columDef.children.forEach((child, childIndex) => {
            colIndex++;
            const newArray = columDef.children.slice();
            const lastShownChild = newArray.reverse().find(child => !child.initialHide);
            const lastShownChildIndex = columDef.children.findIndex(child => {
                return child?.field === lastShownChild?.field;
            });
            const lastShownChildren = columDef.children[lastShownChildIndex];
            const lastIndex = columnDefs.length - 1;
            if (index !== lastIndex) {
                lastShownChildren.cellClass = lastShownChildren.cellClass + ` ${dividerClassNames.dividerCol}`;
            }
            if (childIndex === lastShownChildIndex && lastShownChildren) {
                lastShownColumnDefWithIndex.push({...child, id: colIndex, group: index});
            }
        })
    });
    lastShownColumnDefWithIndex.forEach(({id}) => {
        const floatingFilterElement = document.querySelector(`.ag-floating-filter[aria-colindex='${id}']`);
        floatingFilterElement && floatingFilterElement.classList.add(dividerClassNames.dividerCol);
        const headerElement = document.querySelector(`.ag-header-cell[aria-colindex='${id}']`);
        headerElement && headerElement.classList.add(dividerClassNames.dividerCol);
    });

    const dividers = document.querySelectorAll(`.ag-header-cell.${dividerClassNames.dividerCol} > div.ag-header-cell-resize`)
    dividers.forEach(divider => {
        divider.classList.add(dividerClassNames.transparentResizeIcon);
    });

};

export const handleSortedHighlight = (e, tableView) => {
    const columns = e.columnApi.getAllColumns();
    if (!!columns?.length === false || !tableView) return;
    const sortedColumn = columns?.find(column => column.isSorting());
    if (!sortedColumn) {
        setDefaultSort(e, tableView);
    } else {
        const filteredColumnElements = document.querySelectorAll(`#${tableView?.id} .ag-floating-filter.ag-header-cell`);
        const headerCellElements = document.querySelectorAll(`#${tableView?.id} .ag-header-cell`);
        let sortedColumnIndex = -1;
        const CLASS_HIGHLIGHT = 'highlighted-column';
        sortedColumnIndex = (e.columnApi.getAllColumns()?.indexOf(sortedColumn)) + 1;
        sortedColumn.getColDef().cellClass = `${sortedColumn.userProvidedColDef.cellClass} ${CLASS_HIGHLIGHT}`;
        addRemoveHighlights(headerCellElements, sortedColumnIndex, CLASS_HIGHLIGHT);
        addRemoveHighlights(filteredColumnElements, sortedColumnIndex, CLASS_HIGHLIGHT);
        columns?.forEach((column) => {
            if (column !== sortedColumn) {
                column.getColDef().cellClass = column.userProvidedColDef.cellClass;
            }
        });
        setTimeout(() => e.api.refreshCells({force: true, supressFlash: true}), 10);
    }
};

const generateChildDefs = (item, columns, columnDefs, additionalTableHeaders, tableTitleWithTooltips, externalParams ) => {
    const headerGroup = {
        headerGroupComponent: item.headerGroupTitle,
        headerGroupComponentParams: { additionalTableHeaders }
    };
    const childrenObjects = [];
    item.children.map(child => {
        const titleWithTooltip = getTitleWithTooltip(tableTitleWithTooltips[child.col.id]);
        const filterProps = child.filterOptions && {
            ...child.filterOptions,
            floatingFilter: true,
            suppressMenu: true
        };
        const extControl = columns?.filter(col => col.id === child.col.id)[0];
        childrenObjects.push({
            field: child.col.id,
            headerName: child.col.label,
            initialHide: !!extControl ? !extControl?.isDisplayed : !!child.initialHide,
            cellClassRules: child.cellClassRules,
            cellRendererSelector: (params) => {
                if(!params.node.rowPinned || !externalParams?.summaryPinnedConfig) return {
                    component: child.cellRenderer
                };
                const { cellsToShow, cellsToOverride } = externalParams?.summaryPinnedConfig;
                const colId = child.col.id;
                const isCellToShow = cellsToShow.includes(colId);
                const cellOverride = cellsToOverride[colId];
                if (isCellToShow) return {component: child.cellRenderer};
                if (!isCellToShow && !cellOverride) return {component: () => cellRenderers.pinnedRow()};
                if (cellOverride) return { component: () => cellRenderers.pinnedRow(cellOverride) };
            },
            cellRendererParams: externalParams || null,
            headerComponentParams: { titleWithTooltip },
            ...filterProps,
            ...child.colDef
        });
    });
    columnDefs.push({ ...headerGroup, children: childrenObjects });
};

export const generateTableColDefs = ({
                                         columns,
                                         tableView,
                                         additionalTableHeaders,
                                         tableTitleWithTooltips,
                                         externalParams
                                     }) => {
    let columnDefs = [];
    let columnDefsLevel2 = [];
    if (!tableView) return columnDefs;

    tableView?.tables?.map(item => {
        // superHeader level2 columnDefs building logic.
        const hasSecondLevelHeaders = item.children?.length > 0 && item.children[0]?.children;
        if (hasSecondLevelHeaders) {
            const headerGroupLevel2 = {
                headerGroupComponent: item.headerGroupTitle,
                headerGroupComponentParams: { additionalTableHeaders }
            };
            item.children.map(group => {
                generateChildDefs(group, columns, columnDefsLevel2, additionalTableHeaders, tableTitleWithTooltips, externalParams);
            });
            columnDefs.push({ ...headerGroupLevel2, children: columnDefsLevel2 });
            columnDefsLevel2 = [];
        }

        // superHeader level1 columnDefs building logic.
        const hasFirstLevelHeaders = item.children && Array.isArray(item.children);
        if (hasFirstLevelHeaders && !hasSecondLevelHeaders ) {
            generateChildDefs(item, columns, columnDefs, additionalTableHeaders, tableTitleWithTooltips, externalParams);
        }

        // No-superHeaders columnDefs building logic.
        if (!hasSecondLevelHeaders && !hasFirstLevelHeaders ) {
            const titleWithTooltip = <CustomHeader headerDetails={tableTitleWithTooltips[item.col?.id]} />;
            const filterOptions = item?.filterOptions ? item.filterOptions : {};
            const colDef = {
                field: item.col.keyField || item.col.id,
                sort: tableView?.defaultSort?.colId === item.col.id && tableView?.defaultSort?.sortDir,
                headerName: item.col.label,
                initialHide: !!item.initialHide,
                cellClassRules: item.cellClassRules,
                cellRenderer: item.cellRenderer,
                cellRendererParams: externalParams || null,
                headerComponentParams: { titleWithTooltip },
                ...filterOptions,
                ...item.colDef
            };
            if (tableView?.defaultSort?.isBreakdown) {
                const { sort, ...colDefWithoutSort } = colDef;
                columnDefs.push(colDefWithoutSort);
            } else {
                columnDefs.push(colDef);
            }
        }
    });
    return columnDefs;
};

export const AG_GRID_LICENSE = 'CompanyName=Lone Wolf Technologies and affiliates,LicensedApplication=BrokerMetrics,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=4,LicensedProductionInstancesCount=1,AssetReference=AG-031465,SupportServicesEnd=5_August_2023_[v2]_MTY5MTE5MDAwMDAwMA==099242bb87c29770cf8328fdf1733534';
