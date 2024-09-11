import { format } from 'date-fns';
import { agentProductionTerms, marketShareListingStatuses } from '../../constants';
import { terms as t } from '../../market-dynamics/constants';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

const fullNumberFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
});

const volumeOrDaysFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    roundingMode: 'halfEven',
    maximumFractionDigits: 0
});

const unitOrPercentFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});

const maxTwoDecimalsUngrouped = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

const twoDecimalsPercentFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const oneDecimalPercentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});

const integerFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

const twoDecimalsPercentFormatterWithMultiplier = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const oneDecimalsPercentFormatterWithMultiplier = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});

const percentFormatter = (countDecimalPlaces = 0) => new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: countDecimalPlaces,
    maximumFractionDigits: countDecimalPlaces
    });

const csvVolumeOrDaysFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 0,
    useGrouping: false
});

const groupedIntegerFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    roundingMode: 'halfEven',
    maximumFractionDigits: 0,
    useGrouping: true
});

const twoDecimalsUngroupedPercentFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false
});

const csvUnitOrPercentFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: false
});

const groupedDecimalFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    useGrouping: true
});

const ungroupedMax2Decimals = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: false
});
const ungroupedMax1Decimals = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    useGrouping: false
});

const numberWithComas = new Intl.NumberFormat('en-Us', {
    style: 'decimal',
    maximumFractionDigits: 0
});

const getCompactDollarFormatter = countDecimalPlaces => new Intl.NumberFormat('en-US', {
    style: 'currency',
    notation: 'compact',
    currency: 'USD',
    minimumFractionDigits: countDecimalPlaces,
    maximumFractionDigits: countDecimalPlaces
    });

export const hasNoLength = value => ((value ?? '') + '').length === 0;
export const getCurrencyFormat = value => `${currencyFormatter.format(value)}`;
export const getFullNumbers = value => fullNumberFormatter.format(value).replace('$', '');
export const getIntegerFormat = value => integerFormatter.format(value);
export const getFormattedDate = (value, dateFormat) => value ? format(new Date(value), dateFormat) : null;
export const getNumberWithComas = (value) => numberWithComas.format(value);
export const getUngroupedMax2Decimals = (value) => value || value === 0 ? ungroupedMax2Decimals.format(value) : '';
export const getUngroupedNoDecimals = value => csvVolumeOrDaysFormatter.format(value);
export const getUngrouped2Decimals = value => twoDecimalsUngroupedPercentFormatter.format(value);
export const getUngroupedMax1Decimals = value => ungroupedMax1Decimals.format(value);
const getTransformedCompact = value => value.replace('K', 'k');
export const getCompactDollars = value => {
    const countDecimalPlaces = (value < 1000000) ? 0 : 1;
    return getTransformedCompact(getCompactDollarFormatter(countDecimalPlaces).format(value));
};
export const getDecimalNumber = value => groupedDecimalFormatter.format(value);
export const percentChangeFormatter = (value) => {
    if (isNaN(value)) {
        return '0%';
    }

    if (value === Infinity) {
        return agentProductionTerms.notApplicableAbbrv;
    }

    return `${unitOrPercentFormatter.format(value)}%`;
};

export const formatVolumeOrDays = (value, isCsvExport = false) => {
    if (isNaN(value) || value == null) return '';
    return isCsvExport
        ? csvVolumeOrDaysFormatter.format(value)
        : volumeOrDaysFormatter.format(value);
};

export const formatGroupedInteger = (value) => {
    if (isNaN(value) || value == null) return '';
    return groupedIntegerFormatter.format(value);
};

const decimalFormatterPlaces = (countDecimalPlaces = 0) => new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: countDecimalPlaces,
        maximumFractionDigits: countDecimalPlaces
    });
export const getListingStatus = value => marketShareListingStatuses[value];
export const formatDecimal = (value) => {
    return checkNullValue(value)
        ? percentFormatter(value).format(0)
        : percentFormatter(value).format(value / 100);
};

export const formatDecimalPlaces = (value, countDecimals) => {
    return checkNullValue(value)
        ? decimalFormatterPlaces(value).format(0)
        : decimalFormatterPlaces(value, countDecimals).format(value);
};

export const maxTwoDecimals = value => maxTwoDecimalsUngrouped.format(value);

export const boolToShortString = value => (value === true)
? agentProductionTerms.abbrY : agentProductionTerms.abbrN;

export const formatUnitOrPercentage = (value, isCsvExport = false, decimals = false) => {
    if (isNaN(value) || value == null) return unitOrPercentFormatter.format(0);
    return isCsvExport
        ? csvUnitOrPercentFormatter.format(value)
        : decimals
        ? twoDecimalsPercentFormatter.format(value)
        : unitOrPercentFormatter.format(value);
};

const checkNullValue = (value) => isNaN(value) || value == null;

export const formatPercent = (percentValue, countDecimalPlaces = 0) => {
    return checkNullValue(percentValue)
        ? percentFormatter(countDecimalPlaces).format(0)
        : percentFormatter(countDecimalPlaces).format(percentValue / 100);
};

export const formatStandardPct = value => formatPercent(value, 2);

const convertToNumber = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const numericValue = parseFloat(value);
        return !isNaN(numericValue) ? numericValue : null;
    }
    return null;
}

export const formatPercentage = (value) => {
    const convertedNumber = convertToNumber(value);
    if (checkNullValue(convertedNumber)) return oneDecimalPercentFormatter.format(0);
    return oneDecimalPercentFormatter.format(convertedNumber / 100);
};

export const formatClr = (value) => {
    if (!value) return '';
    return oneDecimalPercentFormatter.format(value);
};

export const blankEmptyFormatPercentage = (value) => {
    if (checkNullValue(value)) return null;
    return oneDecimalPercentFormatter.format(value / 100);
};

export const centupleDecimalFormatter = (value) => {
    if (checkNullValue(value)) return 0;
    return groupedDecimalFormatter.format(value * 100);
};

export const formatVolume = (value) => {
    if (checkNullValue(value)) return getCurrencyFormat(0);
    return getCurrencyFormat(value);
};

export const formatBlankEmptyVolume = (value) => {
    if (checkNullValue(value)) return null;
    return getCurrencyFormat(value);
};

export const formatInteger = (value) => {
    if (checkNullValue(value)) return 0;
    return getIntegerFormat(value);
};

export const formatVolumeTruncated = (value) => formatVolume(Math.trunc(value));

export const formatUnits = (value) => {
    if (checkNullValue(value)) return unitOrPercentFormatter.format(0);
    return unitOrPercentFormatter.format(value);
};

export const formatPercentageWithMultiplier = (value) => {
    if (checkNullValue(value)) return unitOrPercentFormatter.format(0);
    return twoDecimalsPercentFormatterWithMultiplier.format(value);
};

export const blankEmptyFormatPercentageWithMultiplier = (value) => {
    if (checkNullValue(value)) return null;
    return twoDecimalsPercentFormatterWithMultiplier.format(value);
};

export const formatOneDecimalPercentageWithMultiplier = (value) => {
    if (checkNullValue(value)) return oneDecimalsPercentFormatterWithMultiplier.format(0);
    if (!isFinite(value)) return null;
    return oneDecimalsPercentFormatterWithMultiplier.format(value);
};

export const mapIdToTableData = data => {
    const revisedData = [];
    Array.isArray(data) > 0 && data?.forEach((d) => revisedData.push({ ...d, id: d.agentId }));
    return revisedData;
};

export const roundIfNumber = input => {
    return !isNaN(parseInt(input)) ? Math.round(input) : input;
};

export const addPctSymbol = value => `${value} %`;

export const addPctFormatted = value => addPctSymbol(formatUnitOrPercentage(value, true));

//Date formatters
export const longDateFormat = (value) => format(new Date(value), 'MMM d, yyyy'); // Aug 2, 2022
export const longDateTwoDigitsFormat = (value) => format(new Date(value), 'MMM. dd, yyyy'); // Aug 02, 2022
export const shortDateFormatWithSlashes = (value) => value?.length ? format(new Date(value), 'MM/dd/yyyy') : ''; // 08/02/2022
export const monthAndYearFormat = (value) => value ? format(new Date(value), 'MMMM yyyy') : ''; // August 2022
export const yearFormat = (value) => format(new Date(value), 'yyyy'); // 2022
export const csvExportDateFormat = () => format(new Date(), 'yyyyMMddHHmmSS'); // 20230131201451
export const quarterNumYearFormat = (value) => `Q${Math.floor(new Date(value).getMonth() / 3 + 1)} ${new Date(value).getFullYear()}`; // Q3 2023
export const shortDateFormat = (value) => format(new Date(value), 'MM-dd-yyyy'); // 08-02-2022
export const yearMonthDayDashDateFormat = (value) => format(new Date(value), 'yyyy-MM-dd'); // 2022-08-02
export const shortMonthAndYearFormat = (value) => format(new Date(value), 'MMM yyyy'); // Aug 2022
export const shortMonthAndShortYearFormat = (value) => format(new Date(value), 'MMM-yy'); // Aug-22
export const dayFirstDateFormat = (value) => format(new Date(value), 'dd MMM yyyy'); // 02 Aug 2022

//Quarter Formatters
export const getQuarterFormatted = (date, getFormattedDate) => {
    const dateValue = new Date(date);
    const month = dateValue.getMonth();
    const quarter = Math.ceil((month + 1) / 3);
    const year = dateValue.getFullYear()
    return getFormattedDate(quarter, year);
};

export const longQuarterNumberAndYear = (quarter, year) => `${t.quarter} ${quarter} ${year}`;// Quarter ## YYYY
export const quarterNumberAndYear = (quarter, year) => `Q${quarter} ${year}`;// Q## YYYY
export const formattedQuarterNumber = (quarter) => `Q${quarter}`; // Q## 
export const formattedQuarterWithYear = (quarter, year) => 
    [formattedQuarterNumber(quarter), `'${year?.toString().slice(-2)}`]; // [Q##, 'YY].
export const formattedWeekWithMonthAndYear = ({dayOfMonth, formattedMonth, formattedYear}, shouldShowYear) =>  [`${dayOfMonth}`, formattedMonth, shouldShowYear ? `'${formattedYear}`: ''];

export const quarterNumber = (quarter, year) => quarter === 1 
    ? formattedQuarterWithYear(quarter, year) 
    : formattedQuarterNumber(quarter);  

export const getWeeklyFormatted = (date) => {
    return getTwoDigitDayOfMonth (date);
};

export const getMonthlyFormatted = (date, shouldRenderYear = false) => {
    const month = format(date, 'MMM');
    const year = format(date, 'yy');
    const formattedYear = `'${year}`
    return shouldRenderYear ? [month, formattedYear] : month;
};

export const getTwoDigitDayOfMonth  = (date) => date.getDate().toString().padStart(2, "0");

export const popOverDataFormatters = {
    volume: getCurrencyFormat,
    units: getUngroupedMax1Decimals,
    roundedUnits: getIntegerFormat
};

export const getBlankZeroFormatter = (value, defaultValueFormatter) => {
    if (!value) return '';
    if (!defaultValueFormatter) return value;
    return defaultValueFormatter({ value });
};
