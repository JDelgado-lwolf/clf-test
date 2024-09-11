import { marketShareListingStatuses, marketShareListingStatusesCoverage } from '../../constants';
import { columnTips, tipReplacements } from '../constants/tips';
import { marketShareTerms } from '../constants';

export const getTipText = (props) => {
    const { 
        areaType, 
        columnId, 
        isCoverage,
        listingStatus, 
        listingView,
        tooltip
    } = props;

    if (tooltip) {
        return columnTips[tooltip]?.tip
    }
    if (columnTips[columnId]?.transform) {
        const text = {
            tip: columnTips[columnId].tip,
            listingView,
            listingStatus,
            areaType,
            isCoverage
        };
        return columnTips[columnId].transform(text);
    }
    return columnTips[columnId]?.tip;
};

export const transformListingView = (value) => {
    return value.tip.replace(tipReplacements.listingView, value.listingView);
};

export const transformListingStatus = (value) => {
    if (marketShareListingStatuses.New === value.listingStatus) {
        return value.tip.replace(tipReplacements.listingStatus, value.listingStatus);
    }
    return value.tip.replace(tipReplacements.listingStatus, value.listingStatus + ' listings');
};

export const transformAreaType = (tipDetails) => {
    return tipDetails.tip.replace(tipReplacements.areaType, tipDetails.areaType) 
};

export const marketSharePctTip = (tipDetails) => {
    if (tipDetails.isCoverage){
        const isListSide = 
            tipDetails.listingView === marketShareTerms.listSide$Volume || 
            tipDetails.listingView === marketShareTerms.listSideNumUnits;
        const isSellSide = 
            tipDetails.listingView === marketShareTerms.sellSide$Volume || 
            tipDetails.listingView === marketShareTerms.sellSideNumUnits;
            const listingView = tipDetails.listingView.replace(`${marketShareTerms.side} `, '');
            const listingTotal = tipDetails.listingView.replace(`${marketShareTerms.total} `, '');

        if (isListSide || isSellSide) {
            return tipDetails.tip.coverage
                .replace(tipReplacements.listingView, listingView)
                .replace(tipReplacements.listingView, `${marketShareTerms.total.toLocaleLowerCase()} of ${listingView}`);
          }
        else {
            return tipDetails.tip.coverage
                .replace(tipReplacements.listingView, listingTotal)
                .replace(tipReplacements.listingView, listingView);
        }
    } else return tipDetails.tip.totals
};
export const transformByModule = (value) => {
    return  value.isCoverage 
        ? value.tip.coverage
        : value.tip.totals
};

export const totalAvgPriceTip = (value) => {
    return !value.isCoverage 
        ? value.tip.totals
        : value.listingStatus === marketShareListingStatusesCoverage.ForSale
            ? value.tip.coverage.forSale
            : value.tip.coverage.sold
};
