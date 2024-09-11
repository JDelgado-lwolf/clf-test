import { useMemo } from 'react';
import { getAdditionalTableHeaders } from '../components/tableSettings/OverviewTableSettings';
import { getGrowthTableSettings } from '../components/tableSettings/GrowthTableSettings';
import { getContactInfoTableSettings } from '../components/tableSettings/ContactInfoTableSettings';
import { getListingProficiencyTableSettings } from '../components/tableSettings/ListingProficiencyTableSettings'

export const useOverviewAdditionalHeaders = (columns, rowData, dates, currentSearchDates ) =>
    useMemo(() =>  getAdditionalTableHeaders(
        columns,
        rowData,
        dates,
        currentSearchDates
    ), [columns, rowData, currentSearchDates]);

export const useContactInfoAdditionalHeaders = (columns, dates) =>
    useMemo(() => getContactInfoTableSettings(columns, dates),[columns, dates]);


export const useGrowthAnalysisAdditionalHeaders = (columns) =>
    useMemo(() => getGrowthTableSettings(columns), [columns]);


export const useListingProfAdditionalHeaders = (columns) =>
    useMemo(() => getListingProficiencyTableSettings({ columns }), [columns]);
