import _ from 'lodash';
import moment from 'moment';

export function phoneFormatter(number) {
    console.log('Before formatting: ', number);
    return number ? `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}` : '';
}

export function phoneNormalizer(number) {
    const normalized = number ? number.replace(/\D/g, '') : '';
    console.log('Normalized: ', number, normalized);
    return normalized;
}

export function phoneValidator(number) {
    return !!number && number.length === 10;
}

export function arrayFormatter(numberArray) {
    return numberArray ? numberArray.map(phoneFormatter).join(',') : '';
}

export function arrayParser(numberString) {
    return numberString ? numberString.split(',').map(phoneNormalizer) : '';
}

export function arrayValidator(numberArray) {
    if (numberArray && numberArray.length) {
        const valid = _.reduce(numberArray, (result, current) => {
            if (!result || !phoneValidator(current)) {
                return false;
            }
            return true;
        }, true);
        if (valid) {
            return '';
        } else {
            return 'Phone numbers must be ten digits, separated by commas';
        }
    } else {
        return 'Please enter one or more recipients.';
    }
}

export function textFormatter(text) {
    return text
        .replace(/\\\'/g, '\'')
        .replace(/\\\"/g, '"');
}

export function textNormalizer(text) {
    return text
        .replace(/\'/g, '\\\'')
        .replace(/\"/g, '\\"');
}

export function integerNormalizer(value) {
    return parseInt(value, 10);
}

export function dateFormatter(dateObject) {
    return dateObject.isValid && dateObject.isValid() ?
        dateObject.format('MM/DD/YYYY hh:mm a') : dateObject;
}

export function dateParser(dateString) {
    return moment(dateString, 'MM/DD/YYYY hh:mm a');
}

export function stripSpecialChars(input) {
    return input.replace(/[^\w\'!\$\?\*@#]/g, '');
}

export function normalizeCallerId(input) {
    return input.replace(/\W/g, '');
}
