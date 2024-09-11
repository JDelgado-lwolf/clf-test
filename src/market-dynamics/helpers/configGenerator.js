import { timePeriodMappings } from '../constants/timePeriodMappings';
import { marketDynamicsTimePeriods as timePeriods } from '../../constants';

export const getConfig = ({ timePeriod }) => {
    return timePeriodMappings[timePeriod];
};

export const getTimeFrameFromTitle = timeFrameTitle => {
    return timePeriods[timeFrameTitle] || null;
};
