import { getCurrencyFormat, getIntegerFormat } from '../../agent-production/helpers/dataFormatters';
import { searchTerms, validationMessages } from '../../constants';

const limits = {
    totalVolume: { limit: 999999000, formatter: getCurrencyFormat },
    soldPriceRange: { limit: 999999000, formatter: getCurrencyFormat },
    lotSize: { limit: 999999, formatter: getIntegerFormat },
    squareFootage: { limit: 999999, formatter: getIntegerFormat }
};

export const validateRange = (searchTerm, range) => {
    let validationMessage = '';
    let isValid = true;
    let minInvalid = false;
    let maxInvalid = false;

    if (range?.max || range?.min) {
        if ((range.min && isNaN(range.min)) || (range.max && isNaN(range.max))) {
            isValid = false;
            validationMessage += validationMessages.notNumeric;
            minInvalid = isNaN(range.min);
            maxInvalid = isNaN(range.max);
        }

        if (range.min && range.max && range.max < range.min) {
            isValid = false;
            validationMessage += validationMessages.maxLessThanMin(searchTerms[searchTerm]);
            maxInvalid = true;
        }
        if (limits[searchTerm]) {
            if (range.min > limits[searchTerm].limit || range.max > limits[searchTerm].limit) {
                isValid = false;
                validationMessage += validationMessages.greaterThanLimit(searchTerms[searchTerm],
                    limits[searchTerm].formatter(limits[searchTerm].limit));
                minInvalid = minInvalid || range.min > limits[searchTerm].limit;
                maxInvalid = maxInvalid || range.max > limits[searchTerm].limit;
            }
        }
        if (range.min < 0 || range.max < 0) {
            isValid = false;
            validationMessage += validationMessages.isNegative(searchTerms[searchTerm]);
            minInvalid = minInvalid || range.min < 0;
            maxInvalid = maxInvalid || range.max < 0;
        }
    }

    return { isValid, validationMessage, minInvalid, maxInvalid };
};

export const validateEmail = (email) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    return regex.test(email);
};

export const normalizeText = (text) => {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const getHasDuplicatedText = (array, textFieldKey, searchTerm) => {
    return !!array?.find(item => normalizeText(item[textFieldKey]) === normalizeText(searchTerm));
};
