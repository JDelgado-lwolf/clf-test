import { marketDynamicsTimePeriods as tp, marketDynamicsTerms as mdt } from '../../../constants';
import { years3Quarterly } from './years3Quarterly';
import { years2Monthly } from './years2Monthly';
import { years1Monthly } from './years1Monthly';
import { months6Weekly } from './months6Weekly';

export const timePeriodMappings = {
    [tp[mdt.years3Quarterly]]: years3Quarterly,
    [tp[mdt.years2Monthly]]: years2Monthly,
    [tp[mdt.years1Monthly]]: years1Monthly,
    [tp[mdt.months6Weekly]]: months6Weekly
};
