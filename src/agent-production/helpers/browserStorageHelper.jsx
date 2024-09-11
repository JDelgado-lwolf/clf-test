export const setTimeIntervalData = (value) => {
    sessionStorage.setItem('timeIntervals', JSON.stringify(value));
};

export const getTimeIntervalData = () => {
    return JSON.parse(sessionStorage.getItem('timeIntervals'));
};

export const setTimePeriodData = (value) => {
    sessionStorage.setItem('timePeriod', JSON.stringify(value));
};

export const getTimePeriodData = () => {
    return JSON.parse(sessionStorage.getItem('timePeriod'));
};
