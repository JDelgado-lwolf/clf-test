import { format } from 'date-fns';
import { agentProductionTemplates, agentProductionTerms } from '../../../../../../constants';
import { boolToShortString, formatStandardPct } from '../../../../../helpers/dataFormatters';

const getFilename = ({ agent, mlsName, period }) => {

    return agentProductionTemplates.exportFilenames.productionAgentListings
            .replace('[AGENT_NAME]', agent?.agentName)
            .replace('[SEARCH_AREA/MLS_NAME]', mlsName)
            .replace('[TIME_PERIOD]', period)
        + '.csv';
};

const getContentForExport = (data) => {

    const { totalSold, sellSide, listSide } = data;

    const apt = agentProductionTerms;

    const headers = [
        { label: apt.status, key: 'listingType' },
        { label: apt.mlsNum, key: 'mlsNum' },
        { label: apt.type, key: 'typeName' },
        { label: apt.stNumber, key: 'streetNum' },
        { label: apt.street, key: 'streetName' },
        { label: apt.address, key: 'address' },
        { label: apt.city, key: 'city' },
        { label: apt.zip, key: 'zipCode' },
        { label: apt.area, key: 'areaId' },
        { label: apt.bankProperty, key: 'bankProperty' },
        { label: apt.originalPrice, key: 'orgPrice' },
        { label: apt.listPrice, key: 'listPrice' },
        { label: apt.soldPrice, key: 'lastPrice' },
        { label: apt.priceChangeCnt, key: 'priceChangeCnt' },
        { label: apt.spop, key: 'spop' },
        { label: apt.splp, key: 'splp' },
        { label: apt.soldDate, key: 'formattedSoldDate' },
        { label: apt.dom, key: 'dom' },
        { label: apt.cdom, key: 'cdom' },
        { label: apt.pcdom, key: 'pcDom' },
        { label: apt.bd, key: 'bedrooms' },
        { label: apt.ba, key: 'bathrooms' },
        { label: apt.sqft, key: 'squareFt' },
        { label: apt.dollarsPerSqft, key: 'pricePerSquareFt' },
        { label: apt.lotSizeSqft, key: 'lotSizeSquareFt' },
        { label: apt.lotSizeAcres, key: 'lotSizeAcres' },
        { label: apt.yearBuilt, key: 'yearBuilt' },
        { label: apt.listAgent, key: 'listAgent' },
        { label: apt.sellAgent, key: 'sellAgent' },
        { label: apt.dbl, key: 'doubleSided' }
    ];

    const total = totalSold.map((listing) => ({
        ...listing,
        listingType: 'Total Sold List + Sell',
        formattedSoldDate: format(new Date(listing.dateLast), 'MM-dd-yyyy'),
        bankProperty: boolToShortString(listing.bankStatus),
        splp: formatStandardPct(listing.splp),
        spop: formatStandardPct(listing.spop)
    })).sort((a, b) => new Date(b.dateLast).getTime() - new Date(a.dateLast).getTime());

    const list = listSide.map((listing) => ({
        ...listing,
        listingType: 'Sold List-Side',
        formattedSoldDate: format(new Date(listing.dateLast), 'MM-dd-yyyy'),
        bankProperty: boolToShortString(listing.bankStatus),
        splp: formatStandardPct(listing.splp),
        spop: formatStandardPct(listing.spop)
    })).sort((a, b) => new Date(b.dateLast).getTime() - new Date(a.dateLast).getTime());

    const sell = sellSide.map((listing) => ({
        ...listing,
        listingType: 'Sold Sell-Side',
        formattedSoldDate: format(new Date(listing.dateLast), 'MM-dd-yyyy'),
        bankProperty: boolToShortString(listing.bankStatus),
        splp: formatStandardPct(listing.splp),
        spop: formatStandardPct(listing.spop)
    })).sort((a, b) => new Date(b.dateLast).getTime() - new Date(a.dateLast).getTime());

    const listingData = [...total, ...list, ...sell];

    return {
        headers,
        data: listingData
    };
};

export const getExportButtonProps = ({ data, agent, mlsName, isShowExportButton, period }) => {

    const dataForExport = getContentForExport(data);

    if (!dataForExport.data || !dataForExport.data.length) {
        return {
            isVisible: false
        };
    }

    const filename = getFilename({ agent, mlsName, period });

    return {
        headers: dataForExport.headers,
        data: dataForExport.data,
        filename,
        isVisible: isShowExportButton
    };
};
