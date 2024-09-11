import { 
    marketSharePctTip,
    totalAvgPriceTip,
    transformAreaType,
    transformByModule,
    transformListingStatus,
    transformListingView
} from "../helpers/tips";

export const tipReplacements = {
    areaType: "[area type]",
    listingSide: '[listing side]',
    listingStatus: '[listing status]',
    listingView: '[listing view]'
};

export const columnTips = {
    rank: { id: 'rank', tip: `Rank based on ${tipReplacements.listingView}`, transform: (t) => transformListingView(t) },
    officeId: { id: 'officeId', tip: 'ID code assigned by MLS' },
    officeName: { id: 'officeName', tip: 'Office Name - derived from MLS records' },
    brokerName: { id: 'brokerName', tip: 'Broker Name - derived from MLS records' },
    streetName1: { id: 'streetName1', tip: 'Office Address from MLS records' },
    streetName: { id: 'streetName', tip: 'Office Address from MLS records' },
    city: { id: 'city', tip: 'Office City' },
    stateCode: { id: 'stateCode', tip: 'Office State' },
    zipCode: { id: 'zipCode', tip: 'Zip Code' },
    zipcode: { id: 'zipcode', tip: 'Zip Code' },
    county: { id: 'county', tip: 'Office County' },
    phoneNumber: { id: 'phoneNumber', tip: 'Office telephone number' },
    ucVolume: { id: 'ucVolume', tip: 'The ($) volume of listings that went under contract in the given time period' },
    ucUnits: { id: 'ucUnits', tip: 'The (#) of listings that went under contract in the given time period' },
    newListingVolume: { id: 'newListVolume', tip: 'The ($) volume of new listings in the given time period' },
    newListingUnits: { id: 'newListUnits', tip: 'The (#) of new listings in the given time period' },
    newListVolume: { id: 'newListVolume', tip: 'The ($) volume of new listings in the given time period' },
    newListUnits: { id: 'newListUnits', tip: 'The (#) of new listings in the given time period' },
    forSaleVolume: { id: 'actVolume', tip: 'The ($) volume of current listings with status = Active' },
    forSaleUnits: { id: 'actUnits', tip: 'The (#) of current listings with status = Active' },
    officeCount: { id: 'officeCount', tip: 'Number of offices associated with the underlying broker code' },
    averageDom: { id: 'averageDom', tip: 'Average number of Days on Market for list-side transactions only' },
    avgDom: { id: 'avgDom', tip: 'Average number of Days on Market for list-side transactions only' },
    mlsId: { id: 'mlsId', tip: 'Number of Active MLS Members reported by the MLS' },
    agentCount: { id: 'agentCount', tip: 'Number of Active MLS Members reported by the MLS' },
    avgPrice: { id: 'avgPrice', tip: `Average price of all ${tipReplacements.listingStatus}`, transform: (t) => transformListingStatus(t) },
    averagePrice: { id: 'averagePrice', tip: `Average price of all ${tipReplacements.listingStatus}`, transform: (t) => transformListingStatus(t) },
    listVolume: { id: 'listVolume', tip: 'The ($) volume of list-side transactions' },
    listUnits: { id: 'listUnits', tip: 'The (#) of list-side transactions' },
    sellVolume: { id: 'sellVolume', tip: 'The ($) volume of sell-side transactions' },
    sellUnits: { id: 'sellUnits', tip: 'The (#) of sell-side transactions' },
    totalVolume: { id: 'totalVolume', tip: 'The total ($) volume of transaction sides (list + sell)' },
    totalUnits: { id: 'totalUnits', tip: 'The total (#) number of transaction sides (list + sell)' },
    dom: { id: 'dom', tip: 'Average number of Days on Market for list-side transactions only' },
    avgListDom: { id: 'avgListDom', tip: 'Average number of Days on Market for list-side transactions only' },
    spOp: { id: 'spOp', tip: 'Ratio of Sold prices to Original prices' },
    listSpop: { id: 'listSpop', tip: 'Ratio of Sold prices to Original prices' },
    sellSpop: { id: 'sellSpop', tip: 'Ratio of Sold prices to Original prices' },
    prodAgentTotalUnits: { id: 'prodAgentTotalUnits', tip: 'Average number of listings sold per Producing Agent' },
    prodAgentTotalVolume: { id: 'prodAgentTotalVolume', tip: 'Average ($) volume per Producing Agent' },
    prodAgentSellVolume: { id: 'prodAgentSellVolume', tip: 'Average ($) volume per Producing Agent' },
    prodAgentSellUnits: { id: 'prodAgentSellUnits', tip: 'Average number of listings sold per Producing Agent' },
    prodAgentListUnits: { id: 'prodAgentListUnits', tip: 'Average number of listings sold per Producing Agent' },
    prodAgentListVolume: { id: 'prodAgentListVolume', tip: 'Average ($) volume per Producing Agent' },
    prodAgentCount: { id: 'prodAgentCount', tip: 'Number of members with at least one transaction side that meets the search criteria' },
    sellAvgPrice: { id: 'sellAvgPrice', tip: 'Average price of all sell-side transactions' },
    listAvgPrice: { id: 'listAvgPrice', tip: 'Average price of all list-side transactions' },
    prodAgentSearchCount: { id: 'prodAgentSearchCount', tip: 'Number of members with at least one transaction side that meets the search criteria' },
    totalProdAgentSearchCount: { id: 'totalProdAgentSearchCount', tip: 'Number of members with at least one transaction side in the area in the last 12 months' },
    listProdAgentSearchCount: { id: 'listProdAgentSearchCount', tip: 'Number of members with at least one transaction side in the area in the last 12 months' },
    mlsOfficeCount: { id: 'mlsOfficeCount', tip: 'Number of offices that had at least one transaction side (list or sell) in the area in the last 12 months' },
    totalProdAgentCount: { id: 'totalProdAgentCount', tip: 'Number of members with at least one transaction side in the area in the last 12 months' },
    listProdAgentCount: { id: 'listProdAgentCount', tip: 'Number of members with at least one transaction side in the area in the last 12 months' },
    sellProdAgentSearchCount: { id: 'sellProdAgentSearchCount', tip: 'Number of members with at least one transaction side in the area in the last 12 months' },
    mlsAgentCount: { id: 'mlsAgentCount', tip: 'Number of Active members reported by the MLS for the offices that had at least one transaction side (list or sell) in the area in the last 12 months' },
    area: { id: 'area', tip: ` ${tipReplacements.areaType}`, transform: (t) => transformAreaType(t) }, 
    unitSharePct: { id: 'unitSharePct', tip: 'Number of For Sale listings for the area as a percentage of the total' },
    volumeSharePct: { id: 'unitSharePct', tip: '($) Volume of For Sale listings for the area as a percentage of the total' },
    clr: { 
        id: 'clr', 
        tip: { 
            totals: 'Closed-to-List Ratio',
            coverage: 'Number of closed transactions compared to the number of listings taken in the last 12 months as a ratio. There is not a one-to-one correspondence, i.e. a closed listing could have a list date before the 12-month time period started; a listing taken on the last day of the 12 month period would be counted, etc.'
        }, 
        transform: (t) => transformByModule(t) 
    },
    totalAvgPrice: { 
        id: 'totalAvgPrice',
        tip: {
            totals: 'Average price of Active listings',
            coverage: {
                sold: 'Average price of all transactions (list + sell)', 
                forSale: 'Average price of For Sale listings'
            }
        }, 
        transform: (t) => totalAvgPriceTip(t) 
    },
    marketSharePct: { 
        id: 'marketSharePct',
        tip: {
            totals: 'Market Percent',
            coverage: `${tipReplacements.listingView} for the area as a percentage of the ${tipReplacements.listingView}`
        }, 
        transform: (t) => marketSharePctTip(t) 
    },
    actVolume: { 
        id: 'actVolume', 
        tip: {
            totals: 'The ($) volume of current listings with status = Active',
            coverage: '($) Volume of For Sale listings' 
        }, 
        transform: (t) => transformByModule(t)
    },
    actUnits: { 
        id: 'actUnits', 
        tip: {
            totals:'The (#) of current listings with status = Active',
            coverage: 'Number of For Sale listings'
        }, 
        transform: (t) => transformByModule(t)
    },
    groupName: { id: 'groupName', tip: 'Office group name' }
};
