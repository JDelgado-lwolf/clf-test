
export const getLast12MonthDates = (timeIntervals, period) => {
    return timeIntervals?.find(t => t?.intervalType === period)?.last;
};

export const getCurrentSearchDates = (timeIntervals, period, intervalText) => {
    const { from, to } = timeIntervals.find(interval => interval.intervalType === period)?.last;
    const lastIntervalText = intervalText;
    const newDateTo = new Date(to);
    const newDateToWithOffset = new Date(newDateTo.setUTCHours(newDateTo.getUTCHours() - 5));
    return { lastIntervalText, from: new Date(from), to: newDateToWithOffset};
};
