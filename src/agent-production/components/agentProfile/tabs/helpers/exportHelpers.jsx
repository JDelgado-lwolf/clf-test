import { format, parse } from 'date-fns';

export const getParsedDate = toParse => {
  // expected format for incoming date is yyyy-MM-ddThh:mm:ss
  const partsDateTime = toParse.split('T')
  return parse(partsDateTime[0], 'yyyy-MM-dd', new Date())
}

export const getDateForFilename = date => format(date, 'MMMM d, yyyy')

export const getDateForAgentProductionFilename = date => format(date, 'MMMM yyyy')

export const getDateForTable = date => format(date, 'MMM - yyyy')

export const monthTextYearFormatter = date => getDateForTable(new Date(date));

const formatDateForExport = date => new Date(date).toLocaleDateString('en-US')

export const maskNullDate = date => date
    ? formatDateForExport(date)
    : null;
