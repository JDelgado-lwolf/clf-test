import { agentProductionTemplates, agentProductionTerms } from '../../../../../constants';
import { getUngroupedMax2Decimals, getUngroupedNoDecimals } from '../../../../helpers/dataFormatters';
import { getDateForFilename } from './exportHelpers';

const getFilename = ({ agent, mlsName, date } ) => {

  const dateForFilename = getDateForFilename(date);

  return agentProductionTemplates.exportFilenames.inventory
          .replace('[AGENT_NAME]', agent.agentName)
          .replace('[SEARCH_AREA/MLS_NAME]', mlsName)
          .replace('[DOWNLOAD_DATE]', dateForFilename)
      + '.csv';
}

const getContentForExport = data => {

  const apt = agentProductionTerms;

  const headers = [
    { label: apt.type, key: 'typeName' },
    { label: apt.address, key: 'address' },
    { label: apt.city, key: 'city' },
    { label: apt.zip, key: 'zipCode' },
    { label: apt.originalPrice, key: 'orgPrice' },
    { label: apt.listPrice, key: 'listPrice' },
    { label: apt.numPriceChanges, key: 'priceChangeCnt' },
    { label: apt.listDate, key: 'dateList' },
    { label: apt.ucDate, key: 'dateCont' },
    { label: apt.daysUnderContract, key: 'duc' },
    { label: apt.cdom, key: 'cdom' },
    { label: apt.status, key: 'statusCode' },
    { label: apt.bd, key: 'bedrooms' },
    { label: apt.ba, key: 'fullBaths' },
    { label: apt.sqft, key: 'squareFt' },
    { label: apt.dollarsPerSqft, key: 'dollarPerSquareFt' },
    { label: apt.lotSizeAcres, key: 'lotSizeAcres' },
    { label: apt.yearBuilt, key: 'yearBuilt' },
    { label: apt.mlsNum, key: 'mlsNum' },
  ];

  const mappedData = data.map(d => {
    return {
      typeName: d.typeName,
      address: d.address,
      city: d.city,
      zipCode: d.zipCode,
      orgPrice: d.orgPrice,
      listPrice: d.listPrice,
      priceChangeCnt: d.priceChangeCnt,
      dateList: d.dateList,
      dateCont: d.dateCont,
      duc: d.duc,
      cdom: d.cdom,
      statusCode: d.statusCode,
      bedrooms: d.bedrooms,
      fullBaths: d.fullBaths,
      squareFt: d.squareFt,
      dollarPerSquareFt: getUngroupedNoDecimals(d.dollarPerSquareFt),
      lotSizeAcres: getUngroupedMax2Decimals(d.lotSizeAcres),
      yearBuilt: d.yearBuilt,
      mlsNum: d.mlsNum
    }
  })

  return {
    headers,
    data: mappedData
  }
}

export const getExportButtonProps = ({ data, agent, mlsName, isShowExportButton }) => {

  if (!data || !data.length) {
    return {
      isVisible: false
    };
  }

  const filename = getFilename({ agent, mlsName, date: new Date() });
  const dataForExport = getContentForExport(data)

  return {
    headers: dataForExport.headers,
    data: dataForExport.data,
    filename,
    isVisible: isShowExportButton
  }
}
