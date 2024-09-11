import { terms as t } from '.';

export const listingStatuses = Object.freeze({
    units0To90: { label: t.units0To90, id: 'units0To90' },
    units91To180: { label: t.units91To180, id: 'units91To180' },
    unitsOver180: { label: t.unitsOver180, id: 'unitsOver180' },
    averageCdom: { label: t.avgCdom, id: 'averageCdom'},
    averageDom: { label: t.avgDom, id: 'averageDom'},
    averagePrice: { label: t.avgPrice , id: 'averagePrice' },
    expired: { label: t.expired, id: 'expired' },
    forSale: { label: t.forSale, id: 'forSale' },
    forSaleLdm: { label: t.forSaleLdm, id: 'forSaleLdm' },
    medianPrice: { label: t.medianPrice, id: 'medianPrice' },
    newListings: { label: t.newListings, id: 'newListings' },
    sold: { label: t.sold, id: 'sold' },
    spLpNoPriceChanges: { label: t.spLpNoPriceChanges, id: 'spLpNoPriceChanges' },
    spLpPriceChanges: { label: t.spLpPriceChanges, id: 'spLpPriceChanges' },
    spOp: { label: t.spOp, id: 'spOp' },
    spOpNoPriceChanges: { label: t.spOpNoPriceChanges, id: 'spOpNoPriceChanges' },
    spOpPriceChanges: { label: t.spOpPriceChanges, id: 'spOpPriceChanges' },
    underContract: { label: t.underContract, id: 'underContract' },
    underContractUc: { label: t.underContractUc, id: 'underContractUc' },
    underContractMsi: { label: t.underContractMsi, id: 'underContractMsi' },
    msiSold: { label: t.msiSold, id: 'msiSold' }
});
