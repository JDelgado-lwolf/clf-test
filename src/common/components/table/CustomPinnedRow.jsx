import React from 'react';
import { getDecodedCellValue, isEncodedCellValue } from '../../helpers/agGrid';

export const CustomPinnedRow = props => {
    const valueToDisplay = (isEncodedCellValue(props.value?.toString() || ''))
        ? getDecodedCellValue(props.value.toString())
        : props.valueFormatted || props.value;

    return <span className="font-weight-bold"> {valueToDisplay} </span>;
};
