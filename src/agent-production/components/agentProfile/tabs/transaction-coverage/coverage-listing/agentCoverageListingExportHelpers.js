import { agentProductionTemplates, agentProductionTerms } from '../../../../../../constants';
import { dealStatusCodes } from '../../../../../constants/agentProductionConstants';
import { boolToShortString, longDateFormat, monthAndYearFormat, percentChangeFormatter, shortDateFormat } from '../../../../../helpers/dataFormatters';


const getFilename = ({ agent, mlsName, dealStatus, selectedArea, timePeriod, timeIntervals } ) => {

    return agentProductionTemplates.exportFilenames.transactionCoverageListings
            .replace('[AGENT_NAME]', agent.agentName)
            .replace('[DEAL_STATUS]', dealStatus)
            .replace('[SEARCH_AREA/MLS_NAME]', selectedArea.split(agentProductionTerms.listings)[0].trim() || mlsName)
        .replace('[DOWNLOAD_DATE]', timePeriod ? calcIntervalPeriod({ timePeriod, timeIntervals }) : longDateFormat(new Date()))
        + '.csv';
};

const calcIntervalPeriod = ({ timePeriod, timeIntervals }) => {
    if (!timeIntervals) return;
    if (timePeriod === agentProductionTerms.last24Months) {
        const endDate = new Date();
        endDate.setDate(0);
        const startDate = new Date(endDate);
        startDate.setDate(1);
        startDate.setFullYear(endDate.getFullYear() - 2);
        return `${monthAndYearFormat(startDate)} - ${monthAndYearFormat(endDate)}`;
    } else {
        let selectedInterval = timeIntervals.find(t => t.intervalType === timePeriod);
        return `${monthAndYearFormat(selectedInterval.last.from)} - ${monthAndYearFormat(selectedInterval.last.to)}`;
    }
}

const sortListingsByDate = (listingData, listingType) => {
   return listingData.map((listing) => ({
        ...listing,
        listingType,
        formattedDate: shortDateFormat(listing.dateLast),
        bankProperty: boolToShortString(listing.bankProperty),
        ...(listingType !== agentProductionTerms.underContractListing && listingType !== agentProductionTerms.forSaleListing) &&
        {splp: percentChangeFormatter(listing.splp), spop: percentChangeFormatter(listing.spop)},
    })).sort((a, b) => new Date(b.dateLast).getTime() - new Date(a.dateLast).getTime());
};

const getContentForExport = (data, dealStatus) => {

    let headers = [];
    let listingData = [];
    const apt = agentProductionTerms;
    const { totalSold, sellSide, listSide, underContract, forSale } = data;

    switch (dealStatus) {
        case dealStatusCodes.SOLD.label:
            headers = [
                { label: apt.status , key: 'listingType' },
                { label: apt.mlsNum, key: 'mlsNum' },
                { label: apt.type, key: 'typeName' },
                { label: apt.stNumber, key: 'streetNum' },
                { label: apt.street, key: 'streetName' },
                { label: apt.address, key: 'address' },
                { label: apt.city, key: 'city' },
                { label: apt.zipCode, key: 'zipCode' },
                { label: apt.area, key: 'areaId' },
                { label: apt.bankProperty, key: 'bankProperty' },
                { label: apt.originalPrice, key: 'orgPrice' },
                { label: apt.listPrice, key: 'listPrice' },
                { label: apt.soldPrice, key: 'lastPrice' },
                { label: apt.priceChangeCnt, key: 'priceChangeCnt' },
                { label: apt.spop, key: 'spop' },
                { label: apt.splp, key: 'splp' },
                { label: apt.soldDate, key: 'formattedDate' },
                { label: apt.dom, key: 'dom' },
                { label: apt.cdom, key: 'cdom' },
                { label: apt.pcdom, key: 'pcDom' },
                { label: apt.bd, key: 'bedrooms' },
                { label: apt.ba, key: 'fullBaths' },
                { label: apt.sqft, key: 'squareFt' },
                { label: apt.dollarsPerSqft, key: 'pricePerSquareFt' },
                { label: apt.lotSizeSqft, key: 'lotSizeSquareFt' },
                { label: apt.lotSizeAcres, key: 'lotSizeAcres' },
                { label: apt.yearBuilt, key: 'yearBuilt' },
                { label: apt.listAgent, key: 'listAgent' },
                { label: apt.sellAgent, key: 'sellAgent' },
                { label: apt.dbl, key: 'doubleSided' }
            ];

            const total = sortListingsByDate(totalSold, apt.totalSoldListing);

            const list = sortListingsByDate(listSide, apt.listSoldListing);

            const sell = sortListingsByDate(sellSide, apt.sellSoldListing);

            listingData = [...total, ...list, ...sell];

            break;
        case dealStatusCodes.UNDER_CONTRACT.label:

            headers = [
                { label: apt.status , key: 'listingType' },
                { label: apt.officeId , key: 'officeId' },
                { label: apt.officeName , key: 'officeName' },
                { label: apt.mlsNum, key: 'mlsNum' },
                { label: apt.type, key: 'typeName' },
                { label: apt.stNumber, key: 'streetNum' },
                { label: apt.street, key: 'streetName' },
                { label: apt.address, key: 'address' },
                { label: apt.city, key: 'city' },
                { label: apt.zipCode, key: 'zipCode' },
                { label: apt.area, key: 'areaId' },
                { label: apt.originalPrice, key: 'orgPrice' },
                { label: apt.listPrice, key: 'listPrice' },
                { label: apt.price, key: 'lastPrice' },
                { label: apt.ucDate, key: 'formattedDate' },
                { label: apt.dom, key: 'dom' },
                { label: apt.cdom, key: 'cdom' },
                { label: apt.bankProperty, key: 'bankProperty' },
                { label: apt.listAgent, key: 'listAgent' },
            ];

            const under = sortListingsByDate(underContract, apt.underContractListing);

            listingData = [...under];

            break;

        case dealStatusCodes.ACTIVE.label:
            headers = [
                { label: apt.status , key: 'listingType' },
                { label: apt.officeId , key: 'officeId' },
                { label: apt.officeName , key: 'officeName' },
                { label: apt.mlsNum, key: 'mlsNum' },
                { label: apt.type, key: 'typeName' },
                { label: apt.stNumber, key: 'streetNum' },
                { label: apt.street, key: 'streetName' },
                { label: apt.address, key: 'address' },
                { label: apt.city, key: 'city' },
                { label: apt.zipCode, key: 'zipCode' },
                { label: apt.area, key: 'areaId' },
                { label: apt.originalPrice, key: 'orgPrice' },
                { label: apt.listPrice, key: 'listPrice' },
                { label: apt.price, key: 'lastPrice' },
                { label: apt.listDate, key: 'formattedDate' },
                { label: apt.dom, key: 'dom' },
                { label: apt.cdom, key: 'cdom' },
                { label: apt.bankProperty, key: 'bankProperty' },
                { label: apt.listAgent, key: 'listAgent' },
            ];

            const sale = sortListingsByDate(forSale, apt.forSaleListing);

            listingData = [...sale];

            break;
        }


        return {
            headers,
            data: listingData
        };
}

export const getExportButtonProps = ({ data, agent, mlsName, isShowExportButton, dealStatus, selectedArea, timePeriod, timeIntervals }) => {
    const dataForExport = getContentForExport(data, dealStatus)

    if (!dataForExport.data || !dataForExport.data.length) {
        return {
            isVisible: false
        };
    }

    const filename = getFilename({agent, mlsName, dealStatus, selectedArea, timePeriod, timeIntervals})

    return {
        headers: dataForExport.headers,
        data: dataForExport.data,
        filename,
        isVisible: isShowExportButton,
    };
  }
