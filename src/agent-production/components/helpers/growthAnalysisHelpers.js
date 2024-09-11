import { additionalTableHeaders, agentsColumns } from '../../constants/agentProductionConstants';
import { COLUMN_GROUP_CONTACT, COLUMN_GROUP_UNITS, COLUMN_GROUP_VOLUME,
  displayAllButSelected } from '../../helpers/agentProductionHelpers';
import { addPctSymbol, formatUnitOrPercentage, formatVolumeOrDays } from '../../helpers/dataFormatters';
import { agentProductionTerms } from '../../../constants';
import { addAdditionalTableHeader, getAdditionalColumnCount } from '../../helpers/schemaTableHelpers';
import { tableViews } from '../../../common/components/table/agGrid/tableViews';

export const getDefaultGrowthAnalysisColumnsLtm = () => {
  const columns = [
    { ...agentsColumns.officeId, headerPlacement: COLUMN_GROUP_CONTACT },
    { ...agentsColumns.officeAddress, headerPlacement: COLUMN_GROUP_CONTACT },
    { ...agentsColumns.officeCity, headerPlacement: COLUMN_GROUP_CONTACT },
    { ...agentsColumns.officeZipCode, headerPlacement: COLUMN_GROUP_CONTACT },
    { ...agentsColumns.officeCounty, headerPlacement: COLUMN_GROUP_CONTACT },

    { ...agentsColumns.ptmTotalUnits, headerPlacement: COLUMN_GROUP_UNITS },
    { ...agentsColumns.last12TotalUnits, headerPlacement: COLUMN_GROUP_UNITS },
    { ...agentsColumns.totalUnitsChange, headerPlacement: COLUMN_GROUP_UNITS },
    { ...agentsColumns.totalUnitsGrowth, headerPlacement: COLUMN_GROUP_UNITS },

    { ...agentsColumns.ptmTotalVolume, headerPlacement: COLUMN_GROUP_VOLUME },
    { ...agentsColumns.last12TotalVolume, headerPlacement: COLUMN_GROUP_VOLUME },
    { ...agentsColumns.totalVolumeChange, headerPlacement: COLUMN_GROUP_VOLUME },
    { ...agentsColumns.totalVolumeGrowth, headerPlacement: COLUMN_GROUP_VOLUME },
  ]

  const columnsToHide = [ agentsColumns.officeId, agentsColumns.officeAddress, agentsColumns.officeCity, agentsColumns.officeZipCode, agentsColumns.officeCounty ];

  return displayAllButSelected(columns, columnsToHide);
}

export const getDefaultGrowthAnalysisColumnsYtd = () => {
  const columns = [
    { ...agentsColumns.officeId, headerPlacement: COLUMN_GROUP_CONTACT },
    { ...agentsColumns.officeAddress, headerPlacement: COLUMN_GROUP_CONTACT },
    { ...agentsColumns.officeCity, headerPlacement: COLUMN_GROUP_CONTACT },
    { ...agentsColumns.officeZipCode, headerPlacement: COLUMN_GROUP_CONTACT },
    { ...agentsColumns.officeCounty, headerPlacement: COLUMN_GROUP_CONTACT },

    { ...agentsColumns.pytdTotalUnits, headerPlacement: COLUMN_GROUP_UNITS },
    { ...agentsColumns.lytdTotalUnits, headerPlacement: COLUMN_GROUP_UNITS },
    { ...agentsColumns.lytdPytdTotalUnitsChange, headerPlacement: COLUMN_GROUP_UNITS },
    { ...agentsColumns.lytdPytdTotalUnitsGrowth, headerPlacement: COLUMN_GROUP_UNITS },

    { ...agentsColumns.pytdTotalVolume, headerPlacement: COLUMN_GROUP_VOLUME },
    { ...agentsColumns.lytdTotalVolume, headerPlacement: COLUMN_GROUP_VOLUME },
    { ...agentsColumns.lytdPytdTotalVolumeChange, headerPlacement: COLUMN_GROUP_VOLUME },
    { ...agentsColumns.lytdPytdTotalVolumeGrowth, headerPlacement: COLUMN_GROUP_VOLUME },
  ]

  const columnsToHide = [ agentsColumns.officeId, agentsColumns.officeAddress, agentsColumns.officeCity, agentsColumns.officeZipCode, agentsColumns.officeCounty ];

  return displayAllButSelected(columns, columnsToHide);
}

export const growthAnalysisColumnsByPeriod = {
  [agentProductionTerms.last12Months]: getDefaultGrowthAnalysisColumnsLtm(),
  [agentProductionTerms.yearToDate]: getDefaultGrowthAnalysisColumnsYtd()
};

export const getGrowthAnalysisTableSettingsByPeriod = (period) => {
  if (period === agentProductionTerms.last12Months) {
    return tableViews.growthAnalysisLtm;
  }
  if (period === agentProductionTerms.yearToDate) {
    return tableViews.growthAnalysisYtd;
  }
};

export const getIsPeriodLast12Months = period => period === agentProductionTerms.last12Months;

export const mapGrowthAnalysisLtmCsvData = (agentData) => {
  const headers = [
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Office ID', key: agentsColumns.officeId.id },
    { label: 'Office Name', key: agentsColumns.officeName.id },
    { label: 'Office Address', key: agentsColumns.officeAddress.id },
    { label: 'Office City', key: 'officeCity' },
    { label: 'Office Zip', key: 'officeZipCode' },
    { label: 'Office County', key: 'officeCounty' },
    { label: 'PTM #', key: agentsColumns.ptmTotalUnits.id },
    { label: 'LTM #', key: agentsColumns.last12TotalUnits.id },
    { label: 'Change (#)', key: agentsColumns.totalUnitsChange.id },
    { label: '% Change (#)', key: agentsColumns.totalUnitsGrowth.id },
    { label: 'PTM $', key: agentsColumns.ptmTotalVolume.id },
    { label: 'LTM $', key: agentsColumns.last12TotalVolume.id },
    { label: 'Change ($)', key: agentsColumns.totalVolumeChange.id },
    { label: '% Change ($)', key: agentsColumns.totalVolumeGrowth.id },
  ]

  const data =
      (agentData.length > 0 &&
          agentData.map((a) => {
            const names = a?.agentName.split(' ') ?? []
            const firstName = names[0]
            const lastName = names[names.length - 1]

            return {
              ...a,
              firstName: firstName,
              lastName: lastName,
              [agentsColumns.ptmTotalVolume.id]: formatVolumeOrDays(a?.ptmTotalVolume, true),
              [agentsColumns.last12TotalVolume.id]: formatVolumeOrDays(
                  a?.last12TotalVolume,
                  true
              ),
              [agentsColumns.totalVolumeChange.id]: formatVolumeOrDays(
                  a?.totalVolumeChange,
                  true
              ),
              [agentsColumns.ptmTotalUnits.id]: formatUnitOrPercentage(
                  a?.ptmTotalUnits,
                  true
              ),
              [agentsColumns.last12TotalUnits.id]: formatUnitOrPercentage(
                  a?.last12TotalUnits,
                  true
              ),
              [agentsColumns.totalUnitsChange.id]: formatUnitOrPercentage(
                  a?.totalUnitsChange,
                  true
              ),
              [agentsColumns.totalUnitsGrowth.id]: addPctSymbol(formatUnitOrPercentage(
                  a?.totalUnitsGrowth,
                  true
              )),
              [agentsColumns.totalVolumeGrowth.id]: addPctSymbol(formatUnitOrPercentage(
                  a?.totalVolumeGrowth,
                  true
              )),
            }
          })) ||
      []

  return { headers, data }
}

export const mapGrowthAnalysisYtdCsvData = (agentData, year) => {
  const headers = [
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Office ID', key: agentsColumns.officeId.id },
    { label: 'Office Name', key: agentsColumns.officeName.id },
    { label: 'Office Address', key: agentsColumns.officeAddress.id },
    { label: 'Office City', key: 'officeCity' },
    { label: 'Office Zip', key: 'officeZipCode' },
    { label: 'Office County', key: 'officeCounty' },
    { label: `YTD ${year.previous} #`, key: agentsColumns.pytdTotalUnits.id },
    { label: `YTD ${year.last} #`, key: agentsColumns.lytdTotalUnits.id },
    { label: 'Change (#)', key: agentsColumns.lytdPytdTotalUnitsChange.id },
    { label: '% Change (#)', key: agentsColumns.lytdPytdTotalUnitsGrowth.id },
    { label: `YTD ${year.previous} $`, key: agentsColumns.pytdTotalVolume.id },
    { label: `YTD ${year.last} $`, key: agentsColumns.lytdTotalVolume.id },
    { label: 'Change ($)', key: agentsColumns.lytdPytdTotalVolumeChange.id },
    { label: '% Change ($)', key: agentsColumns.lytdPytdTotalVolumeGrowth.id },
  ]

  const data =
      (agentData.length > 0 &&
          agentData.map((a) => {
            const names = a?.agentName.split(' ') ?? []
            const firstName = names[0]
            const lastName = names[names.length - 1]

            return {
              ...a,
              firstName: firstName,
              lastName: lastName,
              [agentsColumns.pytdTotalVolume.id]: formatVolumeOrDays(
                  a?.pytdTotalVolume,
                  true
              ),
              [agentsColumns.lytdTotalVolume.id]: formatVolumeOrDays(
                  a?.lytdTotalVolume,
                  true
              ),
              [agentsColumns.lytdPytdTotalVolumeChange.id]: formatVolumeOrDays(
                  a?.lytdPytdTotalVolumeChange,
                  true
              ),
              [agentsColumns.pytdTotalUnits.id]: formatUnitOrPercentage(
                  a?.pytdTotalUnits,
                  true
              ),
              [agentsColumns.lytdTotalUnits.id]: formatUnitOrPercentage(
                  a?.lytdTotalUnits,
                  true
              ),
              [agentsColumns.lytdPytdTotalUnitsChange.id]: formatUnitOrPercentage(
                  a?.lytdPytdTotalUnitsChange,
                  true
              ),
              [agentsColumns.lytdPytdTotalUnitsGrowth.id]: addPctSymbol(formatUnitOrPercentage(
                  a?.lytdPytdTotalUnitsGrowth,
                  true
              )),
              [agentsColumns.lytdPytdTotalVolumeGrowth.id]: addPctSymbol(formatUnitOrPercentage(
                  a?.lytdPytdTotalVolumeGrowth,
                  true
              )),
            }
          })) ||
      []

  return { headers, data }
}

export const getCountDisplayedColumns = (columns, headerPlacement) =>
    columns?.filter(c => c.isDisplayed &&
    c.headerPlacement === headerPlacement).length || 0;

export const getAdditionalTableHeaders = (columns, contactColumnsToAlwaysDisplay) => {
  const additionalAddressColumns = getAdditionalColumnCount(columns, agentsColumns.officeAddress.id);
  const countDisplayedColumnsContact = getCountDisplayedColumns(columns, COLUMN_GROUP_CONTACT) +
      contactColumnsToAlwaysDisplay.length + additionalAddressColumns;
  const countDisplayedColumnsUnits = getCountDisplayedColumns(columns, COLUMN_GROUP_UNITS);
  const countDisplayedColumnsVolume = getCountDisplayedColumns(columns, COLUMN_GROUP_VOLUME);

  const headers = [];

  let headersRow2 = {};
  const classHeader = 'border text-center';
  const apt = agentProductionTerms;

  const addHeaderWithClass = classToUse => {
    return (lowers, count, title, addTabHeader) => addAdditionalTableHeader(
        lowers,
        count,
        title,
        addTabHeader,
        classToUse
    );
  };
  const addHeader = addHeaderWithClass(classHeader);
  const ath = additionalTableHeaders;

  headersRow2 = addHeader(headersRow2, countDisplayedColumnsContact, apt.officeInformation, ath.column1);
  headersRow2 = addHeader(headersRow2, countDisplayedColumnsUnits, apt.numberUnits, ath.column2);
  headersRow2 = addHeader(headersRow2, countDisplayedColumnsVolume, apt.dollarVolume, ath.column3);

  headers.push(headersRow2);

  return headers;
};
