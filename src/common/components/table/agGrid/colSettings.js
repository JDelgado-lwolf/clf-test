import {
    formatPercentage,
    formatGroupedInteger,
    formatInteger,
    formatVolume,
    getDecimalNumber,
    getFormattedDate,
    centupleDecimalFormatter,
    formatBlankEmptyVolume,
    blankEmptyFormatPercentage,
    blankEmptyFormatPercentageWithMultiplier,
    formatOneDecimalPercentageWithMultiplier,
    formatStandardPct,
    boolToShortString
} from '../../../../agent-production/helpers/dataFormatters';

export const unitWidth = Object.freeze({
    icon: 40,
    dom: 80,
    tiny: 92,
    small: 100,
    compact: 120,
    regular: 155,
    moderate: 180,
    medium: 230,
    mediumLarge: 275,
    large: 330
});

export const defaultColumnDef = {
    flex: 1,
    sortingOrder: ['desc', 'asc'],
    suppressMenu: true,
    sortable: true
};

const iconDefaults = {
    cellClass: 'd-flex justify-content-center align-items-center pr-0',
    minWidth: unitWidth.icon,
    resizable: false
}

const textDefaults = {
    headerClass: 'font-weight-bold',
    minWidth: unitWidth.regular,
    resizable: true
};

const textDefaultsRightAlign = {
    headerClass: 'align-top no-wrap td-num d-flex justify-content-end',
    cellClass: 'td-num',
    minWidth: unitWidth.regular,
    resizable: true
};

const numberDefaults = {
    cellClass: 'td-num',
    headerClass: 'align-top no-wrap td-num d-flex justify-content-end',
    minWidth: unitWidth.regular,
    resizable: true
};

export const dividerClassNames = {
    dividerCol: 'divider-col',
    transparentResizeIcon: 'transparent-resize-icon'
};

export const colSettings = {
    textTinyRightAlign: {
        ...textDefaultsRightAlign,
        minWidth: 55
    },
    icon: {
        ...iconDefaults
    },
    textTiny: {
        ...textDefaults,
        minWidth: 55
    },
    textXs: {
        ...textDefaults,
        minWidth: unitWidth.tiny
    },
    textXsRightAlign: {
        ...textDefaultsRightAlign,
        minWidth: unitWidth.tiny
    },
    textSmall: {
        ...textDefaults,
        minWidth: unitWidth.compact
    },
    textSmRightAlign: {
        ...textDefaultsRightAlign,
        minWidth: unitWidth.compact
    },
    textSm: {
        ...textDefaults
    },
    textMd: {
        ...textDefaults,
        minWidth: unitWidth.medium
    },
    textLg: {
        ...textDefaults,
        minWidth: unitWidth.large
    },
    numberXsInteger: {
        ...numberDefaults,
        minWidth: unitWidth.tiny,
        valueFormatter: v => formatInteger(v.value)
    },
    numberSmRightAlign: {
        ...numberDefaults
    },
    numberSmTiny: {
        ...numberDefaults,
        minWidth: 55,
        valueFormatter: v => formatInteger(v.value)
    },
    numberSmInteger: {
        ...numberDefaults,
        valueFormatter: v => formatInteger(v.value)
    },
    numberMdInteger: {
        ...numberDefaults,
        minWidth: unitWidth.moderate,
        valueFormatter: v => formatInteger(v.value)
    },
    numberLgInteger: {
        ...numberDefaults,
        minWidth: unitWidth.medium,
        valueFormatter: v => formatInteger(v.value)
    },
    numberMdLgInteger: {
        ...numberDefaults,
        minWidth: unitWidth.mediumLarge,
        valueFormatter: v => formatInteger(v.value)
    },
    numberXsPercentage: {
        ...numberDefaults,
        minWidth: unitWidth.small,
        valueFormatter: v => formatPercentage(v.value)
    },
    numberSmPercentage: {
        ...numberDefaults,
        valueFormatter: v => formatPercentage(v.value)
    },
    numberMdPercentage: {
        ...numberDefaults,
        minWidth: unitWidth.moderate,
        valueFormatter: v => formatPercentage(v.value)
    },
    numberSmGroupedInteger: {
        ...numberDefaults,
        valueFormatter: v => formatGroupedInteger(v.value)
    },
    blankEmptyNumberSmPercentage: {
        ...numberDefaults,
        valueFormatter: v => blankEmptyFormatPercentage(v.value)
    },
    numberSmCentuplePercentage: {
        ...numberDefaults,
        valueFormatter: v => centupleDecimalFormatter(v.value)
    },
    blankEmptyNumberSmPercentageWithMultiplier: {
        ...numberDefaults,
        valueFormatter: v => blankEmptyFormatPercentageWithMultiplier(v.value)
    },
    numberSmVolume: {
        ...numberDefaults,
        valueFormatter: v => formatVolume(v.value)
    },
    numberMdVolume: {
        ...numberDefaults,
        minWidth: unitWidth.moderate,
        valueFormatter: v => formatVolume(v.value)
    },
    numberLgVolume: {
        ...numberDefaults,
        minWidth: unitWidth.medium,
        valueFormatter: v => formatVolume(v.value)
    },
    blankEmptyTinyVolume: {
        ...numberDefaults,
        minWidth: unitWidth.tiny,
        valueFormatter: v => formatBlankEmptyVolume(v.value)
    },
    blankEmptyXsVolume: {
        ...numberDefaults,
        minWidth: 104,
        valueFormatter: v => formatBlankEmptyVolume(v.value)
    },
    numberMdLgVolume: {
        ...numberDefaults,
        minWidth: unitWidth.mediumLarge,
        valueFormatter: v => formatVolume(v.value)
    },
    numberExLgVolume: {
        ...numberDefaults,
        minWidth: unitWidth.large,
        valueFormatter: v => formatVolume(v.value)
    },
    blankEmptySmVolume : {
        ...numberDefaults,
        valueFormatter: v => formatBlankEmptyVolume(v.value)
    },
    numberSmUnits: {
        ...numberDefaults,
        valueFormatter: v => getDecimalNumber(v.value)
    },
    numberMdUnits: {
        ...numberDefaults,
        minWidth: unitWidth.medium,
        valueFormatter: v => getDecimalNumber(v.value)
    },
    numberMdLgUnits: {
        ...numberDefaults,
        minWidth: unitWidth.mediumLarge,
        valueFormatter: v => getDecimalNumber(v.value)
    },
    numberLgUnits: {
        ...numberDefaults,
        minWidth: unitWidth.large,
        valueFormatter: v => getDecimalNumber(v.value)
    },
    dateSm: {
        ...textDefaults,
        valueFormatter: v => getFormattedDate(v.value, 'yyyy-MM-dd')
    },
    numberLgPercentageOneDecimal:{
        ...numberDefaults,
        minWidth: unitWidth.medium,
        valueFormatter: v => formatOneDecimalPercentageWithMultiplier(v.value)
    },
    bankStatus:{
        ...textDefaults,
        minWidth: unitWidth.moderate,
        valueFormatter: v => boolToShortString(v.value)
    },
    numberTwoDecimalsPercentage: {
        ...numberDefaults,
        valueFormatter: v => formatStandardPct(v.value)
    },
};
