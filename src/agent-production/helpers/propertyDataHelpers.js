import { listingStatus } from '../../constants';

export const getStatusValue = value => {

  switch (value) {
    case 'A':
      return listingStatus.active;
    case 'P':
      return listingStatus.pending;
    case 'C':
      return listingStatus.contingent;
    case 'S':
      return listingStatus.sold;
    default:
      return '';
  }
};
