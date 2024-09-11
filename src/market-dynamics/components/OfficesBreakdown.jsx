import React, { useEffect, useMemo, useRef, useState } from 'react';
import StickyFooter from '@lwt-helix/sticky-footer';
import Table from '../../common/components/table/agGrid/Table';
import ShowAdditionalInfo from '../../common/components/table/ShowAdditionalInfo';
import ExportButton from '../../common/components/ExportButton';
import Tab from '@lwt-helix/tab';
import { setStateData } from '../../common/helpers/state';
import { useSearchStore } from '../../store/store';
import { searchTerms } from '../../constants';
import { useMarketDynamicsStore } from '../../store/marketDynamics/store';
import { getDataByDisplayedColumns, getDefaultSortColumnSettings, getRevisedOfficeBreakdownColumns } from '../helpers/agGrid';
import { getUpdatedObjectByKeyfield } from '../../common/helpers/utilities';
import Loader from '@lwt-helix/loader';
import { yearMonthDayDashDateFormat } from '../../agent-production/helpers/dataFormatters';
import { marketDynamicsTooltips } from '../constants/tooltipDefinitions';
import { getBreakdownTooltips } from '../constants/tooltipDefinitions';
import { getSummaryPinnedConfig } from '../../common/components/table/agGrid/pinnedRowSettings';
import { responseKeys } from '../../constants/service';

const OfficesBreakdown = () => {

    const gridRef = useRef();
    const [state, setState] = useState({
        currentTab: 0,
        offices: [],
        breakdownTooltips: {},
    });

    const {
        searchCriteria,
        timeFrameTitle,
        summaryPinnedData,
        setTotalsRowData,
        setSummaryPinnedData,
    } = useSearchStore(state => ({
        searchCriteria: state[state.selectedModule]?.search?.searchCriteria,
        timeFrameTitle: state[state.selectedModule]?.timeFrameTitle,
        summaryPinnedData: state[state.selectedModule]?.summaryPinnedData,
        setTotalsRowData: state.setTotalsRowData,
        setSummaryPinnedData: state.setSummaryPinnedData,
    }));

    const {
        checkedStatusOptions,
        getOfficesBreakdown,
        selectedBreakdownPeriod,
        tableView,
    } = useMarketDynamicsStore(state => ({
        checkedStatusOptions: state.checkedStatusOptions,
        getOfficesBreakdown: state.getOfficesBreakdown,
        selectedBreakdownPeriod: state.selectedBreakdownPeriod,
        tableView: state.tableView,
    }));

    const revisedTableView = useMemo(() => {
        const revisedColumnDefs = getRevisedOfficeBreakdownColumns(tableView);
        return {
            ...tableView,
            tables: revisedColumnDefs,
            defaultSort: getDefaultSortColumnSettings(revisedColumnDefs, tableView.id)
        };
    }, [tableView, state.offices]);

    const revisedData = useMemo(() => {
        if (!revisedTableView || !state.offices?.results) return [];
        return getDataByDisplayedColumns(state.offices?.results, revisedTableView.tables);
    }, [state.offices, revisedTableView]);

    const summaryPinnedConfig = getSummaryPinnedConfig(tableView.id);

    const columnProps = [
        {
            children: (
                <div className='ml-auto d-flex w-auto align-self-center'>
                    <ShowAdditionalInfo onClick={() => {
                        // TODO: Implementation pending
                    }} />
                    <ExportButton
                        isDisabled={false}
                        onClick={() => {
                            // TODO: Implementation pending
                        }}
                    />
                </div>
            ),
            sm: 12,
            align: 'right'
        }
    ];

    const setCurrentTab = (currentTab) => {
        setStateData('currentTab', currentTab, setState);
    };

    // TODO: This one will be used in https://pr-corpnet.atlassian.net/browse/XBM-6797
    const listingStatusTabs = checkedStatusOptions.map(status => ({
        title: status.label,
        content: {
            // TODO: Replace this div with listing status Table
            jsx: (<div
                style={{height: '78vh'}}
                className='content bg-white mb-3 raised-border mt-12'>
                </div>)
        }
    }));

    useEffect(() => {
        if (!searchCriteria || !selectedBreakdownPeriod) return;
        const timePeriodParameter = {
            intervalType: "Custom",
            startDate: yearMonthDayDashDateFormat(selectedBreakdownPeriod.timePeriodStart),
            endDate: yearMonthDayDashDateFormat(selectedBreakdownPeriod.timePeriodEnd)
        };
        const revisedSearchCriteria = getUpdatedObjectByKeyfield(searchCriteria, 'timePeriod', timePeriodParameter);
        const getOffices = async () => {
            const offices = await getOfficesBreakdown(revisedSearchCriteria)
            setStateData('offices', offices, setState);
            setTotalsRowData(offices?.totals, responseKeys.totals);
            setSummaryPinnedData(tableView.id, responseKeys.totals);
        };
        getOffices();
    }, [searchCriteria, selectedBreakdownPeriod]);

    useEffect(() => {
        if (!timeFrameTitle) return;
        const breakdownTooltips = getBreakdownTooltips(timeFrameTitle.mainTitle, tableView.id);
        setStateData('breakdownTooltips', {...marketDynamicsTooltips, ...breakdownTooltips}, setState);
    }, [timeFrameTitle]);

    const hasResults = !!state.offices?.results?.length;

    return (
        <div className='px-3 office-breakdown-wrapper'>
            <Tab
                className='mt-4 mb-4'
                tabTextTransform='none'
                navSize={checkedStatusOptions.length}
                contentSize={checkedStatusOptions.length}
                items={[
                    {
                        title: searchTerms.offices,
                        content: {
                            jsx: (<div className='bg-white mb-3 raised-border mt-12'>
                                {hasResults
                                    ? <Table
                                        gridRef={gridRef}
                                        tableView={revisedTableView}
                                        rowData={revisedData}
                                        tableTitleWithTooltips={state.breakdownTooltips}
                                        pinnedBottomRowData={summaryPinnedConfig && [{...summaryPinnedData }]}
                                        externalParams={{ summaryPinnedConfig }}
                                    />
                                    : <div className='py-3 office-breakdown-wrapper d-flex justify-content-center'>
                                        <div><Loader /></div>
                                    </div>
                                }
                            </div>)
                        }
                    },
                    // TODO: Uncomment and adjust this for https://pr-corpnet.atlassian.net/browse/XBM-6797
                    // ...listingStatusTabs
                ]}
                tabs
                currentIndex={state.currentTab}
                setCurrentIndex={(index) => setCurrentTab(index)}
            />
            <StickyFooter columnProps={columnProps}/>
        </div>
    );
};

export default OfficesBreakdown;
