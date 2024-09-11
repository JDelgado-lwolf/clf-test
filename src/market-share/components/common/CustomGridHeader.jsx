import { useEffect, useState } from 'react';
import React from 'react';
import Tooltip from '@lwt-helix/tooltip';
import PropTypes from 'prop-types';
import { getTipText } from '../../helpers/tips';
import Icon from '@lwt-helix/icon';
import { setStateData } from '../../../common/helpers/state';
import { gridClasses } from '../../constants/gridColumns';

const CustomGridHeader = (props) => {
    const {
        column,
        listingStatus,
        listingView,
        displayName,
        setSort,
        enableSorting,
        hasHeaderTooltips
    } = props;

    const isNumericColumn = column.colDef.headerClass.includes(gridClasses.headerNumber);
    const wrapperClassName = `w-100 ${isNumericColumn ? gridClasses.headerNumber : ''}`;

    const tipTextObject = {
        columnId: column.colId,
        listingStatus,
        listingView,
        areaType: props.displayName,
        isCoverage: column.colDef.isCoverage,
        tooltip: column.colDef.tooltip
    };
    const [state, setState] = useState({
        ascSort: 'd-none',
        descSort: 'd-none',
        isSortDescending: false
    });

    const onSortChanged = () => {
        setState((prevState) => {
            return {
                ...prevState,
                ascSort: column.isSortDescending() ? 'd-block' : 'd-none',
                descSort: column.isSortAscending() ? 'd-block' : 'd-none'
            };
        });
    };

    const onSortRequested = (order, event) => {
        setSort(order, event.shiftKey);
    };

    useEffect(() => {
        column.addEventListener('sortChanged', onSortChanged);
        onSortChanged();
    }, []);

    let sort = null;

    const handleSort = (event) => {
        onSortRequested(`${state.isSortDescending ? 'asc' : 'desc'}`, event);
        setStateData('isSortDescending', !state.isSortDescending, setState);
    };

    if (enableSorting) {
        sort = (
            <div className='d-inline-block'>
                <div className={`m0 float-right ${state.ascSort}`}>
                    <Icon dataLwtId="icon" iconName="arrow_drop_down" />
                </div>
                <div className={`m0 float-right ${state.descSort}`}>
                    <Icon dataLwtId="icon" iconName="arrow_drop_up" />
                </div>
            </div>
        );
    }
    return (
        <div
            className={wrapperClassName}
            onClick={ event => handleSort(event) }
            onTouchEnd={ event => handleSort(event) }>
            <span className="ag-header-cell-text" id={`${column.colId}-tooltip`}>
                {displayName}
            </span>
            {sort}
            {hasHeaderTooltips && <Tooltip target={`${column.colId}-tooltip`}>
                <span className="helix-small">{getTipText(tipTextObject)}</span>
            </Tooltip>}
        </div>
    );
};

CustomGridHeader.propTypes = {
    column: PropTypes.object,
    listingStatus: PropTypes.string,
    displayName: PropTypes.string,
    setSort: PropTypes.func,
    enableSorting: PropTypes.bool
};

export default CustomGridHeader;
