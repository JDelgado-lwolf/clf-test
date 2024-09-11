import { isMarketDynamics } from './modules';
import { agentProductionTerms, marketDynamicsTerms, marketDynamicsTimePeriods, TimePeriods } from '../../constants';

export const isCustomDate = value => value === TimePeriods['Custom Date'];

export const getTimePeriods = module => isMarketDynamics(module) ? marketDynamicsTimePeriods : TimePeriods;

export const getTimePeriodsByModule = ({ module, mlsMembershipList, selectedMlsId }) => {
    const timePeriods = getTimePeriods(module);
    const isMarketDynamicsModule = isMarketDynamics(module);
    return Object.keys(timePeriods).filter(t => t !== agentProductionTerms.last24Months).map((timePeriod) => {
        let option = {
            value: timePeriods[timePeriod],
            label: timePeriod
        };

        if (isMarketDynamicsModule &&
            timePeriods[timePeriod] === marketDynamicsTimePeriods[marketDynamicsTerms.years3Quarterly]) {
            const isMlsSupport3YearsOption = mlsMembershipList?.find(mls => mls.mlsId === selectedMlsId)?.supports13Quarters;
            return { ...option, isDisabled: !isMlsSupport3YearsOption };
        }
        return option;
    });
};
