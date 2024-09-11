import React, { useEffect, useState } from 'react';
import Icon from '@lwt-helix/icon';

const ColumnHeader = (props) => {
    const {
        api,
        column,
        setSort,
        enableSorting,
        titleWithTooltip
    } = props;

    const [state, setState] = useState({
        ascSort: column.colDef?.sort === 'asc' ? 'd-block' : 'd-none',
        descSort: column.colDef?.sort === 'desc' ? 'd-block' : 'd-none',
        isSortDescending: column.colDef?.sort === 'desc'
    });

    const onSortChanged = (event) => {
        const api = event.api;
        if (api.columnModel.displayedColumns) {
            const currentSortedColName = api.columnModel.displayedColumns.filter(item => item.sort);
            if (currentSortedColName.length === 1 && currentSortedColName[0].sortIndex !== 0) {
                setState({
                    ascSort: 'd-none',
                    descSort: 'd-none',
                    isSortDescending: false
                });
            }
            // Setting Down-Arrow for current sorted column
            if (currentSortedColName.length > 1) {
                setSort('desc');
                setState({
                    ascSort: 'd-none',
                    descSort: 'd-block',
                    isSortDescending: true
                });
            }
        }
    };

    const onBodyScroll = (e) => {
        const sortedCol = e.api.columnModel?.displayedColumns.filter(item => item.sort);
        if (column.colId === sortedCol[0]?.colId) {
            setSort(sortedCol[0].sort);
            setState({
                ascSort: sortedCol[0].sort === 'asc' ? 'd-block' : 'd-none',
                descSort: sortedCol[0].sort === 'asc' ? 'd-none' : 'd-block',
                isSortDescending: !(sortedCol[0].sort === 'asc')
            });
        } else {
            setState({
                ascSort: 'd-none',
                descSort: 'd-none',
                isSortDescending: false
            });
        }
    };

    useEffect(() => {
        column.addEventListener('sortChanged', onSortChanged);
        api.addEventListener('bodyScroll', onBodyScroll);
        return () => {
            column.removeEventListener('sortChanged', onSortChanged);
            api.removeEventListener('bodyScroll', onBodyScroll);
        };
    }, []);

    const handleSort = (event) => {
        setSort(`${state.isSortDescending ? 'asc' : 'desc'}`, event.shiftKey);
        setState({
            ascSort: state.isSortDescending ? 'd-block' : 'd-none',
            descSort: state.isSortDescending ? 'd-none' : 'd-block',
            isSortDescending: !state.isSortDescending
        });
    };

    let sort = null;
    if (enableSorting) {
        sort = (
            <div className='d-inline-block'>
                <div className={`div_arrow_drop_down ${state.descSort}`}>
                    <Icon dataLwtId='icon' iconName='arrow_drop_down' />
                </div>
                <div className={`div_arrow_drop_up ${state.ascSort}`}>
                    <Icon dataLwtId='icon' iconName='arrow_drop_up' />
                </div>
            </div>
        );
    }

    return (
        <div
            className={'w-100 ag-header-cell-text d-inline-block ag-header-col-text'}
            onClick={event => handleSort(event)}
        >
            {titleWithTooltip}
            {sort}
        </div>
    );
};

export default ColumnHeader;
