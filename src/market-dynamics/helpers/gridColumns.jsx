import React from 'react';
import { caret_down, caret_up } from '@lwt-helix/helix-icon/outlined';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { formatOneDecimalPercentageWithMultiplier } from '../../agent-production/helpers/dataFormatters';
import { terms as t } from '../constants';

const iconProps = (icon, iconName) => {
    return {
        icon,
        title: `${iconName} icon`,
        className: 'align-middle'
    };
};

const icons = {
    increase: <HelixIcon {...iconProps(caret_up, 'up')} />,
    decrease: <HelixIcon {...iconProps(caret_down, 'down')} />
};

const getCellStyling = (value) => {
    if (!isFinite(value)) return { className: null, icon: null};
    if (value > 0) {
        return {
            className: 'ag-cell-increase-value',
            icon: icons.increase
        };
    }
    if (value < 0) {
        return {
            className: 'ag-cell-decrease-value',
            icon: icons.decrease
        };
    }
    return { className: null, icon: null };
};

const getCellWithIcon = (value, format) => {
    if (!value) return null;
    const getValue = format === t.custom ? value.data : value;
    const getFormatter = format === t.custom ? value.formatter : format;
    return (
        <span className={getCellStyling(getValue).className}>
            <span>{getFormatter(getValue)}</span>
            <span>{getCellStyling(getValue).icon}</span>
        </span>
    );
};

export const cellRenderers = {
    percentage: (props) => getCellWithIcon(props.value, formatOneDecimalPercentageWithMultiplier),
    custom: (props) => getCellWithIcon(props.value, t.custom),
    status: (props) => {
        return (
            <span className="d-flex align-items-center">
                <span
                    className="status-ellipse mr-2"
                    style={{ background: `${props.data.color}` }}
                ></span>
                <span>{props.value}</span>
            </span>
        );
    }
};

export const columnSettings = {
    columnDefault: {
        cellClass: 'ag-cell-general-key-info',
        headerClass: 'font-weight-bold',
        suppressMenu: true,
        minWidth: 200,
        flex: 1
    },
    columnNumber: {
        headerClass: 'align-top no-wrap header-number',
        cellClass: 'ag-cell-general-key-info text-right',
        suppressMenu: true,
        minWidth: 200,
        flex: 1
    }
};
