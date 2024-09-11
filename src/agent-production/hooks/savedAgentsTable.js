import { tableViews } from '../../common/components/table/agGrid/tableViews';
import { setStateData } from '../../common/helpers/state';
import { agentProductionTerms as terms } from '../../constants';
import { useCommonStore } from '../../store/store';
import { getGrowthAnalysisTableSettingsByPeriod } from '../components/helpers/growthAnalysisHelpers';
import { getLast12MonthDates } from '../components/helpers/savedAgents';
import { contactToolTips, growthAnalysisTooltips, listingProficiencyTooltips, overviewToolTips } from '../constants/agentProductionConstants';
import { views } from '../constants/savedAgents';
import {
    useContactInfoAdditionalHeaders,
    useGrowthAnalysisAdditionalHeaders,
    useListingProfAdditionalHeaders,
    useOverviewAdditionalHeaders,
} from './agGrid';

export const useSavedAgentsTable = (state, setState) => {
    const {
        timeIntervals,
    } = useCommonStore(state => ({
        timeIntervals: state.timeIntervals,
    }));

    const last12MonthsDates = timeIntervals?.length && getLast12MonthDates(timeIntervals, terms.annually);

    const setOverviewColumns = (overviewColumns) => {
        setStateData('overviewColumns', overviewColumns, setState);
    };

    const setContactInfoColumns = (contactInfoColumns) => {
        setStateData('contactInfoColumns', contactInfoColumns, setState);
    };

    const setGrowthAnalysisColumns = (growthAnalysisColumns) => {
        setStateData('growthAnalysisColumns', growthAnalysisColumns, setState);
    };

    const setListingProfColumns = (listingProfColumns) => {
        setStateData('listingProfColumns', listingProfColumns, setState);
    };

    const tableSettingsByView = {
        [views.overview]: {
            additionalTableHeaders: useOverviewAdditionalHeaders(
                state.overviewColumns,
                state.rowData?.length,
                last12MonthsDates,
                state.currentSearchDates
            ),
            tableTitleWithTooltips: overviewToolTips,
            columns: state.overviewColumns,
            setColumns: setOverviewColumns,
            tableView: tableViews.overview,
            className: 'overview'
        },
        [views.contactInformation]: {
            additionalTableHeaders: useContactInfoAdditionalHeaders(
                state.contactInfoColumns,
                state.currentSearchDates,
            ),
            tableTitleWithTooltips: contactToolTips,
            columns: state.contactInfoColumns,
            setColumns: setContactInfoColumns,
            tableView: tableViews.contactInformation,
            className: 'contact-information'
        },
        [views.growthAnalysis]: {
            additionalTableHeaders: useGrowthAnalysisAdditionalHeaders(
                state.growthAnalysisColumns ?? []
            ),
            tableTitleWithTooltips: growthAnalysisTooltips,
            columns: state.growthAnalysisColumns,
            setColumns: setGrowthAnalysisColumns,
            tableView: getGrowthAnalysisTableSettingsByPeriod(state.growthAnalysisPeriod),
            className: 'growth-analysis'
        },
        [views.listingProficiency]: {
            additionalTableHeaders: useListingProfAdditionalHeaders(
                state.listingProfColumns
            ),
            tableTitleWithTooltips: listingProficiencyTooltips,
            columns: state.listingProfColumns,
            setColumns: setListingProfColumns,
            tableView: tableViews.listingProficiency,
            className: 'listing-proficiency'
        },
    };

    return tableSettingsByView;
};
