import { format } from 'date-fns';
import { agentsColumns, tabModes, tableViewNames } from '../constants/agentProductionConstants';
import { formatShortDate } from '../../common/helpers/date';
import { MLS_SID } from '../../constants';
import { views } from '../constants/savedAgents';
import { formatUnitOrPercentage, formatVolumeOrDays } from './dataFormatters';

export const COLUMN_GROUP_CONTACT = 'contact';
export const COLUMN_GROUP_SEARCH = 'search';
export const COLUMN_GROUP_MLS = 'mls';
export const COLUMN_GROUP_GROWTH = 'growth';
export const COLUMN_GROUP_VOLUME = 'volume';
export const COLUMN_GROUP_UNITS = 'units';

export const tabIndexes = Object.freeze({
    OVERVIEW: 0,
    CONTACT_INFORMATION: 1,
    GROWTH_ANALYSIS: 2,
    LISTING_PROFICIENCY: 3
});

export const tabIndexedViews = Object.freeze({
    [tabIndexes.OVERVIEW]: views.overview,
    [tabIndexes.CONTACT_INFORMATION]: views.contactInformation,
    [tabIndexes.GROWTH_ANALYSIS]: views.growthAnalysis,
    [tabIndexes.LISTING_PROFICIENCY]: views.listingProficiency
});

export const displayAllButSelected = (columns, columnsToHide) => {

    return columns.map(column => {
        return {
            ...column,
            isDisplayed: !(columnsToHide.find(columnToHide => columnToHide.id === column.id))
        };
    });
};

const getGrowthAnalysisYtdYears = dateTo => {
    return {
      currentYear: dateTo.getFullYear(),
      previousYear: dateTo.getFullYear() - 1,
    }
};

export const getSearchDateYearDetails = (searchDates, tabIndex) => {
    const yearDetails = {
        previous: searchDates?.from?.getFullYear() || '',
        last: searchDates?.to?.getFullYear() || ''
    };

    if (tabIndex === tabIndexes.GROWTH_ANALYSIS && searchDates?.to) {
        const years = getGrowthAnalysisYtdYears(searchDates.to);
        yearDetails.last = years.currentYear;
        yearDetails.previous = years.previousYear;
    }

    return yearDetails;
};

export const getDefaultOverviewColumns = () => {
    const overviewColumns = [
        agentsColumns.agentId,
        agentsColumns.officeId,
        agentsColumns.officeAddress,
        agentsColumns.officeCity,
        agentsColumns.officeZipCode,
        agentsColumns.officeCounty,

        agentsColumns.listVolume,
        agentsColumns.sellVolume,
        agentsColumns.totalVolume,
        agentsColumns.listUnits,
        agentsColumns.sellUnits,
        agentsColumns.totalUnits,

        agentsColumns.averagePrice,
        agentsColumns.last12Spop,
        agentsColumns.last12AvgDom,
        agentsColumns.totalUnitsChange,
        agentsColumns.totalVolumeChange,
        agentsColumns.last12ListVolume,
        agentsColumns.last12ListUnits,
        agentsColumns.last12SellVolume,
        agentsColumns.last12SellUnits,
        agentsColumns.last12TotalVolume,
        agentsColumns.last12TotalUnits
    ];

    const currentAreaColumns = [
        agentsColumns.agentId,
        agentsColumns.officeId,
        agentsColumns.officeAddress,
        agentsColumns.officeCity,
        agentsColumns.officeZipCode,
        agentsColumns.officeCounty,
        agentsColumns.listVolume,
        agentsColumns.sellVolume,
        agentsColumns.totalVolume,
        agentsColumns.listUnits,
        agentsColumns.sellUnits,
        agentsColumns.totalUnits
    ];

    const mlsColumns = [
        agentsColumns.averagePrice,
        agentsColumns.last12Spop,
        agentsColumns.last12AvgDom,
        agentsColumns.totalUnitsChange,
        agentsColumns.totalVolumeChange,
        agentsColumns.last12ListVolume,
        agentsColumns.last12ListUnits,
        agentsColumns.last12SellVolume,
        agentsColumns.last12SellUnits,
        agentsColumns.last12TotalVolume,
        agentsColumns.last12TotalUnits
    ];

    const columnsToDisplay = [
        agentsColumns.listVolume,
        agentsColumns.sellVolume,
        agentsColumns.totalVolume,
        agentsColumns.listUnits,
        agentsColumns.sellUnits,
        agentsColumns.totalUnits,
        agentsColumns.last12ListVolume,
        agentsColumns.last12SellVolume,
        agentsColumns.last12TotalVolume,
        agentsColumns.last12ListUnits,
        agentsColumns.last12SellUnits,
        agentsColumns.last12TotalUnits
    ];

    return overviewColumns.map((column) => {
        return {
            id: column.id,
            label: column.label,
            hasBorder:
                overviewColumns.find(
                    (columnToDisplay, index) =>
                        columnToDisplay.headerPlacement === 'area' &&
                        overviewColumns[index + 1].isDisplayed === false
                ) !== undefined,
            parentColumnId: column.parentColumnId,
            isDisplayed:
                columnsToDisplay.find((columnToDisplay) => columnToDisplay.id === column.id) !==
                undefined,
            ...(currentAreaColumns.find((areaColumn) => areaColumn.id === column.id)
                ? { headerPlacement: 'area' }
                : {}),
            ...(mlsColumns.find((mlsColumn) => mlsColumn.id === column.id)
                ? { headerPlacement: 'mls' }
                : {})
        };
    });
};

const mlsRestrictionSettings = [
    { mlsId: MLS_SID.MCRTC, columns: [agentsColumns.agentEmail], view: tableViewNames.contactInformation }
];

export const getMlsRestrictionSettings = (selectedMlsId) => {
    return mlsRestrictionSettings.find(mls => mls.mlsId === selectedMlsId);
};

export const getOptionsByMlsRestriction = (options, restrictedMlsSettings) =>
    options.filter(col => !restrictedMlsSettings?.columns.map(rc => rc.label).includes(col.label));

export const getDefaultContactInfoColumns = (restrictedMlsSettings) => {
    const tableViewName = tableViewNames.contactInformation;
    const contactInfoColumns = [
        { ...agentsColumns.agentId, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.officeId, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.officeAddress, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.officeCity, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.officeZipCode, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.officeCounty, headerPlacement: COLUMN_GROUP_CONTACT },

        { ...agentsColumns.agentPhone1, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.agentPhone2, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.agentPhone3, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.agentEmail, headerPlacement: COLUMN_GROUP_CONTACT },
        { ...agentsColumns.agentAddress, headerPlacement: COLUMN_GROUP_CONTACT },

        { ...agentsColumns.totalUnits, headerPlacement: COLUMN_GROUP_SEARCH },
        { ...agentsColumns.totalVolume, headerPlacement: COLUMN_GROUP_SEARCH },

        { ...agentsColumns.last12TotalUnits, headerPlacement: COLUMN_GROUP_MLS },
        { ...agentsColumns.last12TotalVolume, headerPlacement: COLUMN_GROUP_MLS },

        { ...agentsColumns.ciTotalVolumeChange, headerPlacement: COLUMN_GROUP_GROWTH },
        { ...agentsColumns.totalVolumeGrowth, headerPlacement: COLUMN_GROUP_GROWTH }
    ];

    return contactInfoColumns.map((c) => {
        const shouldHideColumn = restrictedMlsSettings?.columns.map(rc => rc.id)?.includes(c.id) &&
            restrictedMlsSettings?.view === tableViewName;
        return { ...c, isDisplayed: !shouldHideColumn };
    });
};

export const isColumnBordered = (columnId, columns) => {
    const areaCols = columns.filter(
        (column) => column.headerPlacement === 'area' && column.isDisplayed === true
    );
    const lastAreaColElement = areaCols.pop();
    columns.forEach((column) => {
        column.hasBorder = lastAreaColElement && column.id === lastAreaColElement.id;
    });
    const borderedCol = columns.find(
        (column) => column.id === columnId && column.isDisplayed && column.hasBorder
    );

    return (
        borderedCol &&
        columns.filter((column) => column.headerPlacement === 'mls' && column.isDisplayed === true)
            .length > 0
    );
};

export const isHiddenColumn = (columnId, columns) => {
    if (!columns) return true;
    return !columns.find((column) => column.id === columnId && column.isDisplayed);
};

export const getOverviewCsvHeaders = (selectedColumnIds, dates) => {
    let headers = [];
    const fromDate = formatShortDate(dates.from);
    const toDate = formatShortDate(dates.to);

    selectedColumnIds.includes(agentsColumns.agentId.id)
        && headers.push({ label: 'Agent ID', key: agentsColumns.agentId.id });
    headers.push({ label: 'First Name', key: 'firstName' });
    headers.push({ label: 'Last Name', key: 'lastName' });
    selectedColumnIds.includes(agentsColumns.officeId.id)
        && headers.push({ label: 'Office ID', key: agentsColumns.officeId.id });
    headers.push({ label: 'Office Name', key: agentsColumns.officeName.id });
    selectedColumnIds.includes(agentsColumns.officeAddress.id)
        && headers.push(
            { label: 'Office Address', key: agentsColumns.officeAddress.id },
            { label: 'Office City', key: agentsColumns.officeCity.id },
            { label: 'Office Zip', key: agentsColumns.officeZipCode.id },
            { label: 'Office County', key: agentsColumns.officeCounty.id },
        );
    selectedColumnIds.includes(agentsColumns.listVolume.id)
        && headers.push({ label: 'List $', key: agentsColumns.listVolume.id });
    selectedColumnIds.includes(agentsColumns.sellVolume.id)
        && headers.push({ label: 'Sell $', key: agentsColumns.sellVolume.id });
    selectedColumnIds.includes(agentsColumns.totalVolume.id)
        && headers.push({
            label: `Total $ (${fromDate} - ${toDate})`,
            key: agentsColumns.totalVolume.id
        });
    selectedColumnIds.includes(agentsColumns.listUnits.id)
        && headers.push({ label: 'List #', key: agentsColumns.listUnits.id });
    selectedColumnIds.includes(agentsColumns.sellUnits.id)
        && headers.push({ label: 'Sell #', key: agentsColumns.sellUnits.id });
    selectedColumnIds.includes(agentsColumns.totalUnits.id)
        && headers.push({
            label: `Total # (${fromDate} - ${toDate})`,
            key: agentsColumns.totalUnits.id
        });
    selectedColumnIds.includes(agentsColumns.averagePrice.id)
        && headers.push({ label: 'Avg $ LTM', key: agentsColumns.averagePrice.id });
    selectedColumnIds.includes(agentsColumns.last12Spop.id)
        && headers.push({ label: 'SP/OP', key: agentsColumns.last12Spop.id });
    selectedColumnIds.includes(agentsColumns.last12AvgDom.id)
        && headers.push({ label: 'Avg DOM', key: agentsColumns.last12AvgDom.id });
    selectedColumnIds.includes(agentsColumns.totalUnitsChange.id)
        && headers.push({ label: 'Growth # Units', key: agentsColumns.totalUnitsChange.id });
    selectedColumnIds.includes(agentsColumns.totalVolumeChange.id)
        && headers.push({ label: 'Growth $ Volume', key: agentsColumns.totalVolumeChange.id });
    selectedColumnIds.includes(agentsColumns.last12ListVolume.id)
        && headers.push({ label: 'List $ (LTM)', key: agentsColumns.last12ListVolume.id });
    selectedColumnIds.includes(agentsColumns.last12SellVolume.id)
        && headers.push({ label: 'Sell $ (LTM)', key: agentsColumns.last12SellVolume.id });
    selectedColumnIds.includes(agentsColumns.last12TotalVolume.id)
        && headers.push({ label: 'Total $ (LTM)', key: agentsColumns.last12TotalVolume.id });
    selectedColumnIds.includes(agentsColumns.last12ListUnits.id)
        && headers.push({ label: 'List # (LTM)', key: agentsColumns.last12ListUnits.id });
    selectedColumnIds.includes(agentsColumns.last12SellUnits.id)
        && headers.push({ label: 'Sell # (LTM)', key: agentsColumns.last12SellUnits.id });
    selectedColumnIds.includes(agentsColumns.last12TotalUnits.id)
        && headers.push({ label: 'Total # (LTM)', key: agentsColumns.last12TotalUnits.id });

    return headers;
};

export const getContactInfoCsvHeaders = (selectedColumnIds, dates) => {
    let headers = [];
    const fromDate = formatShortDate(dates.from);
    const toDate = formatShortDate(dates.to);

    selectedColumnIds.includes(agentsColumns.agentId.id)
        && headers.push({ label: 'Agent ID', key: agentsColumns.agentId.id });
    headers.push({ label: 'First Name', key: 'firstName' });
    headers.push({ label: 'Last Name', key: 'lastName' });
    selectedColumnIds.includes(agentsColumns.officeId.id)
        && headers.push({ label: 'Office ID', key: agentsColumns.officeId.id });
    headers.push({ label: 'Office Name', key: agentsColumns.officeName.id });
    selectedColumnIds.includes(agentsColumns.officeAddress.id)
        && headers.push(
            { label: 'Office Address', key: agentsColumns.officeAddress.id },
            { label: 'Office City', key: agentsColumns.officeCity.id },
            { label: 'Office Zip', key: agentsColumns.officeZipCode.id },
            { label: 'Office County', key: agentsColumns.officeCounty.id },
        );
    selectedColumnIds.includes(agentsColumns.agentPhone1.id)
        && headers.push({ label: 'Phone 1', key: agentsColumns.agentPhone1.id });
    selectedColumnIds.includes(agentsColumns.agentPhone2.id)
        && headers.push({ label: 'Phone 2', key: agentsColumns.agentPhone2.id });
    selectedColumnIds.includes(agentsColumns.agentPhone3.id)
        && headers.push({ label: 'Phone 3', key: agentsColumns.agentPhone3.id });
    selectedColumnIds.includes(agentsColumns.agentEmail.id)
        && headers.push({ label: 'Email', key: agentsColumns.agentEmail.id });
    selectedColumnIds.includes(agentsColumns.agentAddress.id)
        && headers.push(
            { label: 'Alternate Address', key: agentsColumns.agentAddress.id },
            { label: 'Alternate City', key: 'agentCity' },
            { label: 'Alternate Zip', key: 'agentZipcode' }
        );
    selectedColumnIds.includes(agentsColumns.totalUnits.id)
        && headers.push({
            label: `Total # (${fromDate} - ${toDate})`,
            key: agentsColumns.totalUnits.id
        });
    selectedColumnIds.includes(agentsColumns.totalVolume.id)
        && headers.push({
            label: `Total $ (${fromDate} - ${toDate})`,
            key: agentsColumns.totalVolume.id
        });
    selectedColumnIds.includes(agentsColumns.last12TotalUnits.id)
        && headers.push({ label: 'Total # (LTM)', key: agentsColumns.last12TotalUnits.id });
    selectedColumnIds.includes(agentsColumns.last12TotalVolume.id)
        && headers.push({ label: 'Total $ (LTM)', key: agentsColumns.last12TotalVolume.id });
    selectedColumnIds.includes(agentsColumns.ciTotalVolumeChange.id)
        && headers.push({ label: '$ Change', key: agentsColumns.ciTotalVolumeChange.id });
    selectedColumnIds.includes(agentsColumns.totalVolumeGrowth.id)
        && headers.push({ label: '% Change', key: agentsColumns.totalVolumeGrowth.id });

    return headers;
};

export const csvFileNameFormatter = (tabMode) => {
    const formattedDateTime = `${format(new Date(), 'yyyyMMddHHmmss')}`;
    return {
        [tabModes.OVERVIEW.toUpperCase()]: `Agent Production Overview Export - ${formattedDateTime}.csv`,
        [tabModes.CONTACT_INFORMATION.toUpperCase()]: `Agent Production Contact Information Export - ${formattedDateTime}.csv`,
        [tabModes.GROWTH_ANALYSIS.toUpperCase()]: `Agent Production Growth Analysis Export - ${formattedDateTime}.csv`,
        [tabModes.LISTING_PROFICIENCY.toUpperCase()]: `Agent Production Listing Proficiency Export - ${formattedDateTime}.csv`
    }[tabMode.toUpperCase()];
};

export const mapListingProfCsvData = (agentData) => {
    const headers = [
        { label: 'First Name', key: 'firstName' },
        { label: 'Last Name', key: 'lastName' },
        { label: 'Office Name', key: agentsColumns.officeName.id },
        { label: 'Office ID', key: agentsColumns.officeId.id },
        { label: 'Office Address', key: agentsColumns.officeAddress.id },
        { label: 'Office City', key: agentsColumns.officeCity.id },
        { label: 'Office Zip', key: agentsColumns.officeZipCode.id },
        { label: 'Office County', key: agentsColumns.officeCounty.id },
        { label: 'Total Sell # Units', key: agentsColumns.last12SellUnits.id },
        { label: 'Total Sell $ Volume', key: agentsColumns.last12SellVolume.id },
        { label: 'Total List # Units', key: agentsColumns.last12ListUnits.id },
        { label: 'Total List $ Volume', key: agentsColumns.last12ListVolume.id },
        { label: 'No PC # Units', key: agentsColumns.noPcLast12ListUnits.id },
        { label: 'No PC % of Total Units', key: agentsColumns.noPcLast12ListUnitsPct.id },
        { label: 'No PC $ Volume', key: agentsColumns.noPcLast12ListVolume.id },
        { label: 'No PC % of Total Volume', key: agentsColumns.noPcLast12ListVolumePct.id },
        { label: 'No PC DOM', key: agentsColumns.noPcLast12ListDom.id },
        { label: 'No PC CDOM', key: agentsColumns.noPcLast12ListCdom.id },
        { label: 'No PC SP/OP', key: agentsColumns.noPcLast12SpOp.id },
        { label: 'PC # Units', key: agentsColumns.pcLast12ListUnits.id },
        { label: 'PC % of Total Units', key: agentsColumns.pcLast12ListUnitsPct.id },
        { label: 'PC $ Volume', key: agentsColumns.pcLast12ListVolume.id },
        { label: 'PC % of Total Volume', key: agentsColumns.pcLast12ListVolumePct.id },
        { label: 'PC Avg DOM', key: agentsColumns.pcLast12ListDom.id },
        { label: 'PC CDOM', key: agentsColumns.pcLast12ListCdom.id },
        { label: 'PC DOM', key: agentsColumns.pcLast12ListPcDom.id },
        { label: 'PC SP/OP', key: agentsColumns.pcLast12ListSpOp.id },
        { label: 'PC SP/LP', key: agentsColumns.pcLast12ListSpLp.id },
        { label: 'Avg # PC', key: agentsColumns.pcLast12ListAvgNumPc.id }
    ];

    const data = (agentData.length > 0
        && agentData.map((a) => {
            const names = a?.agentName.split(' ') ?? [];
            const firstName = names[0];
            const lastName = names[names.length - 1];

            return {
                ...a,
                firstName: firstName,
                lastName: lastName,
                [agentsColumns.sellVolume.id]: formatVolumeOrDays(a?.sellVolume, true),
                [agentsColumns.last12ListVolume.id]: formatVolumeOrDays(a?.last12ListVolume, true),
                [agentsColumns.noPcLast12ListDom.id]: formatVolumeOrDays(
                    a?.noPcLast12ListDom,
                    true
                ),
                [agentsColumns.noPcLast12ListCdom.id]: formatVolumeOrDays(
                    a?.noPcLast12ListCdom,
                    true
                ),
                [agentsColumns.pcLast12ListPcDom.id]: formatVolumeOrDays(
                    a?.pcLast12ListPcDom,
                    true
                ),
                [agentsColumns.pcLast12ListCdom.id]: formatVolumeOrDays(a?.pcLast12ListCdom, true),
                [agentsColumns.pcLast12ListDom.id]: formatVolumeOrDays(a?.pcLast12ListDom, true),
                [agentsColumns.sellUnits.id]: formatUnitOrPercentage(a?.sellUnits, true),
                [agentsColumns.last12ListUnits.id]: formatUnitOrPercentage(
                    a?.last12ListUnits,
                    true
                ),
                [agentsColumns.noPcLast12ListUnits.id]: formatUnitOrPercentage(
                    a?.noPcLast12ListUnits,
                    true
                ),
                [agentsColumns.noPcLast12ListUnitsPct.id]: formatUnitOrPercentage(
                    a?.noPcLast12ListUnitsPct,
                    true
                ),
                [agentsColumns.noPcLast12SpOp.id]: formatUnitOrPercentage(a?.noPcLast12SpOp, true),
                [agentsColumns.pcLast12ListUnits.id]: formatUnitOrPercentage(
                    a?.pcLast12ListUnits,
                    true
                ),
                [agentsColumns.pcLast12ListUnitsPct.id]: formatUnitOrPercentage(
                    a?.pcLast12ListUnitsPct,
                    true
                ),
                [agentsColumns.pcLast12ListSpOp.id]: formatUnitOrPercentage(
                    a?.pcLast12ListSpOp,
                    true
                ),
                [agentsColumns.pcLast12ListSpLp.id]: formatUnitOrPercentage(
                    a?.pcLast12ListSpLp,
                    true
                ),
                [agentsColumns.pcLast12ListAvgNumPc.id]: formatUnitOrPercentage(
                    a?.pcLast12ListAvgNumPc,
                    true
                )
            };
        })) ?? [{}];

    return { headers, data };
};
