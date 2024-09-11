import { endOfDay, format, isAfter, isBefore, isValid as isValidDate, startOfDay } from 'date-fns';
import { TimePeriods, validationMessages } from '../../constants';

const getMinTimePeriodDate = () => {
    let dateMin = new Date();
    dateMin.setMonth(dateMin.getMonth() - 39);
    dateMin.setDate(0);
    return dateMin;
};

export const formatTransformedDate = (date, formatString) => {
    const transformedDate = new Date(date.toISOString().slice(0, -1));
    return format(transformedDate, formatString);
};

export const formatMediumSimpleDate = date => {
    return format(date, 'MMM dd, yyyy');
};

export const formatMediumDate = date => {
    return formatTransformedDate(date, 'MMM dd, yyyy');
};

export const formatShortDate = date => {
    return formatTransformedDate(date, 'MM/dd/yyyy');
};

const hasValidYear = date => {
    return date.getFullYear().toString().length === 4;
};

export const validateTimeFrame = timeFrame => {
    let validationMessage = '';
    let isValid = true;
    let startDateInvalid = false;
    let endDateInvalid = false;
    const dateMin = getMinTimePeriodDate();
    const today = new Date(new Date().toISOString().slice(0, -1));
    if (!timeFrame.type) {
        isValid = false;
        validationMessage += validationMessages.missingTimePeriodType;
    }
    if (timeFrame.type === TimePeriods['Custom Date']) {
        let startDate, endDate;
        if (!timeFrame.startDate) {
            validationMessage += validationMessages.missingStartDate;
            isValid = false;
            startDateInvalid = true;
        } else {
            startDate = new Date(new Date(timeFrame.startDate).toISOString().slice(0, -1));
            if (!isValidDate(startDate) || !hasValidYear(startDate)) {
                validationMessage += validationMessages.invalidStartDateFormat;
                isValid = false;
                startDateInvalid = true;
            } else {
                if (isBefore(startDate, startOfDay(new Date(dateMin.toISOString()))) || isAfter(endOfDay(startDate), today)) {
                    validationMessage += validationMessages.invalidStartDate(formatMediumDate(dateMin), formatMediumDate(today));
                    isValid = false;
                    startDateInvalid = true;
                }
            }
        }

        if (!timeFrame.endDate) {
            validationMessage += validationMessages.missingEndDate;
            isValid = false;
            endDateInvalid = true;
        } else {
            endDate = new Date(new Date(timeFrame.endDate).toISOString().slice(0, -1));
            if (!isValidDate(endDate) || !hasValidYear(endDate)) {
                validationMessage += validationMessages.invalidEndDateFormat;
                isValid = false;
                endDateInvalid = true;
            } else {
                if (isBefore(endDate, startDate)) {
                    validationMessage += validationMessages.endDateTooEarly;
                    isValid = false;
                    startDateInvalid = true;
                }
                if (isAfter(endDate, endOfDay(today))) {
                    validationMessage += validationMessages.invalidEndDate(formatMediumDate(dateMin), formatMediumDate(today));
                    isValid = false;
                    endDateInvalid = true;
                }
            }
        }
        if (timeFrame.startDate === timeFrame.endDate) {
            validationMessage += validationMessages.sameStartAndEnd;
            isValid = false;
            startDateInvalid = true;
            endDateInvalid = true;
        }
    }
    return { isValid, validationMessage, startDateInvalid, endDateInvalid };
};
