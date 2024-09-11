import React, { useEffect, useRef, useState } from 'react'
import { Row, Col } from '@lwt-helix/layout'
import { FormGroup } from '@lwt-helix/form'
import { CustomInput } from '@lwt-helix/controls'
import {
    contactToolTips as contactColumns,
    growthAnalysisTooltips as growthAnalysisColumns,
    listingProficiencyTooltips as listingProficiencyColumns,
    overviewToolTips as overviewColumns,
    tabModes
} from '../constants/agentProductionConstants'
import { agentProductionTerms as apt } from '../../constants'
import { getLabelTextWithDate, getTooltipText } from '../helpers/uiHelpers'
import ReactTooltip from 'react-tooltip';
import ReactDOMServer from 'react-dom/server';
import { useSearchStore, useSavedAgentsStore } from '../../store/store'
import { getMlsRestrictionSettings, getOptionsByMlsRestriction } from '../helpers/agentProductionHelpers'

const AgentsColumns = ({ defaultColumns, setParentColumnIds, tabMode, inputIdPrefix, customSettings }) => {
    const ref = useRef();

    const selectedModule = useSearchStore(state => state.selectedModule);
    const selectedMls = useSearchStore(state => state[selectedModule]?.selectedMls);

    const {
        selectedList,
    } = useSavedAgentsStore(state => ({
        selectedList: state.selectedListByModule[selectedModule],
    }));

    const restrictedMlsSettings = getMlsRestrictionSettings(selectedMls?.mlsId || selectedList?.mlsId);

    useEffect(() => {
        ReactTooltip.rebuild();
    }, []);

    const renderMetricsTooltip = data => {
        const metricDescription = JSON.parse(data);
        return metricDescription?.metricDescription && ReactDOMServer.renderToString(
            <div className="text-left">
                <div className="w-100">{metricDescription.metricDescription}</div>
            </div>
        );
    };

    const [selectedColumnIds, setSelectedColumnIds] = useState(
        defaultColumns.flatMap((c) => (c.isDisplayed && !c.parentColumnId ? c.id : []))
    );

    const handleItemClick = (e) => {
        const item = e.target;
        const clickedColumnId = item.value;

        if (item.checked) {
            const revisedSelectedItems = [ ...selectedColumnIds, clickedColumnId ];
            setSelectedColumnIds(revisedSelectedItems);
            setParentColumnIds(revisedSelectedItems);
            return;
        }

        const revisedSelectedItems = selectedColumnIds.filter(col => col !== clickedColumnId);
        setSelectedColumnIds(revisedSelectedItems);
        setParentColumnIds(revisedSelectedItems);
    };

    const writeInput = (column, index) => {
        const foundColumn = selectedColumnIds.find(id => id === column.id);
        const elementId = `${inputIdPrefix}${column.id}`;
        const label = getLabelTextWithDate(column);
        const tooltipProps = {
            'data-for': 'metrics-selector-tooltip',
            'data-tip': JSON.stringify({
                metricDescription: getTooltipText(column),
            })
        };
        return <>
            <div {...tooltipProps} ref={ref}>
                <CustomInput
                        dataLwtId={elementId}
                        id={elementId}
                        key={index}
                        value={column.id}
                        defaultChecked={foundColumn}
                        disabled={false}
                        type="checkbox"
                        label={label}
                        onClick={handleItemClick} />
            </div>
            <ReactTooltip
                id="metrics-selector-tooltip"
                className="metrics-selector-tooltip"
                type="info"
                effect='solid'
                place='left'
                backgroundColor='black'
                getContent={renderMetricsTooltip}
                html={true}
            />
        </>;
    };
    const writeColumn = rows => rows.map((row, index) => writeInput(row, index));

    const groupsToWrite = [];

    if (tabMode === tabModes.OVERVIEW) {

        const officeOptions = [
            overviewColumns.agentId,
            overviewColumns.officeId,
            overviewColumns.officeAddress,
        ];
        const currentTimePeriodOptions = [
            overviewColumns.listVolume,
            overviewColumns.sellVolume,
            overviewColumns.totalVolume,
            overviewColumns.listUnits,
            overviewColumns.sellUnits,
            overviewColumns.totalUnits,
        ];
        const allMlsOptions = [
            overviewColumns.averagePrice,
            overviewColumns.last12Spop,
            overviewColumns.last12AvgDom,
            overviewColumns.totalUnitsChange,
            overviewColumns.totalVolumeChange,
            overviewColumns.last12ListVolume,
            overviewColumns.last12SellVolume,
            overviewColumns.last12TotalVolume,
            overviewColumns.last12ListUnits,
            overviewColumns.last12SellUnits,
            overviewColumns.last12TotalUnits,
        ];

        groupsToWrite.push(
            <Col xs={12} sm={3} md={3}>
                <FormGroup>
                    <div dataLwtId={'lbl-office-info'} className="filter-header">
                        Office Information
                    </div>
                    {writeColumn(officeOptions)}
                </FormGroup>
            </Col>
        );

        groupsToWrite.push(
            <Col xs={12} sm={4} md={4}>
                <FormGroup>
                    <div dataLwtId={'lbl-current-period'} className="filter-header">
                        Current Time Period/Search
                    </div>
                    {writeColumn(currentTimePeriodOptions)}
                </FormGroup>
            </Col>
        );

        groupsToWrite.push(
            <Col xs={12} sm={5} md={5}>
                <FormGroup>
                    <div dataLwtId={'lbl-last-12-mths'} className="filter-header">
                        All MLS Transactions Last 12 Months
                    </div>
                    {writeColumn(allMlsOptions)}
                </FormGroup>
            </Col>
        );
    }

    if (tabMode === tabModes.CONTACT_INFORMATION) {

        const officeOptions = [
            contactColumns.agentId,
            contactColumns.officeId,
            contactColumns.officeAddress,
        ];
        const contactInformationOptions = [
            contactColumns.agentPhone1,
            contactColumns.agentPhone2,
            contactColumns.agentPhone3,
            contactColumns.agentEmail,
            contactColumns.agentAddress
        ];
        const currentSearchOptions = [
            contactColumns.totalUnits,
            contactColumns.totalVolume
        ];
        const allMlsOptions = [
            contactColumns.last12TotalUnits,
            contactColumns.last12TotalVolume
        ];
        const growthOptions = [
            contactColumns.totalVolumeChange,
            contactColumns.totalVolumeGrowth
        ];

        groupsToWrite.push(
            <Col xs={12} sm={6} md={4} lg={3}>
                <FormGroup>
                    <div dataLwtId={'lbl-office-info'} className="filter-header">
                        {apt.officeInformation}
                    </div>
                    {writeColumn(officeOptions)}
                </FormGroup>
            </Col>
        );
        groupsToWrite.push(
            <Col xs={12} sm={6} md={4} lg={3}>
                <FormGroup>
                    <div dataLwtId={'lbl-office-info'} className="filter-header">
                        {apt.contactInformation}
                    </div>
                    {writeColumn(getOptionsByMlsRestriction(contactInformationOptions, restrictedMlsSettings))}
                </FormGroup>
            </Col>
        );
        groupsToWrite.push(
            <Col xs={12} sm={6} md={4} lg={2}>
                <FormGroup>
                    <div dataLwtId={'lbl-office-info'} className="filter-header">
                        {apt.currentSearch}
                    </div>
                    {writeColumn(currentSearchOptions)}
                </FormGroup>
            </Col>
        );
        groupsToWrite.push(
            <Col xs={12} sm={6} md={4} lg={2}>
                <FormGroup>
                    <div dataLwtId={'lbl-office-info'} className="filter-header">
                        {apt.allMlsTransactionsLast12Months}
                    </div>
                    {writeColumn(allMlsOptions)}
                </FormGroup>
            </Col>
        );
        groupsToWrite.push(
            <Col xs={12} sm={6} md={4} lg={2}>
                <FormGroup>
                    <div dataLwtId={'lbl-office-info'} className="filter-header">
                        {apt.growth}
                    </div>
                    {writeColumn(growthOptions)}
                </FormGroup>
            </Col>
        );
    }

    if (tabMode === tabModes.GROWTH_ANALYSIS) {

        const officeOptions = [growthAnalysisColumns.officeId, growthAnalysisColumns.officeAddress];
        const unitOptions = [];
        const volumeOptions = [];

        if (customSettings?.isPeriodLast12Months) {

            unitOptions.push(growthAnalysisColumns.ptmTotalUnits);
            unitOptions.push(growthAnalysisColumns.last12TotalUnits);
            unitOptions.push(growthAnalysisColumns.totalUnitsChange);
            unitOptions.push(growthAnalysisColumns.totalUnitsGrowth);

            volumeOptions.push(growthAnalysisColumns.ptmTotalVolume);
            volumeOptions.push(growthAnalysisColumns.last12TotalVolume);
            volumeOptions.push({
                ...growthAnalysisColumns.totalVolumeChange,
                tip: growthAnalysisColumns.totalVolumeChange.tip
            });
            volumeOptions.push({
                ...growthAnalysisColumns.totalVolumeGrowth,
                tip: growthAnalysisColumns.totalVolumeGrowth.tip
            });
        } else {

            unitOptions.push(growthAnalysisColumns.pytdTotalUnits);
            unitOptions.push(growthAnalysisColumns.lytdTotalUnits);
            unitOptions.push({
                ...growthAnalysisColumns.lytdPytdTotalUnitsChange,
                tip: growthAnalysisColumns.lytdPytdTotalUnitsChange.tip
            });
            unitOptions.push({
                ...growthAnalysisColumns.lytdPytdTotalUnitsGrowth,
                tip: growthAnalysisColumns.lytdPytdTotalUnitsGrowth.tip
            });

            volumeOptions.push(growthAnalysisColumns.pytdTotalVolume);
            volumeOptions.push(growthAnalysisColumns.lytdTotalVolume);
            volumeOptions.push(growthAnalysisColumns.lytdPytdTotalVolumeChange);
            volumeOptions.push(growthAnalysisColumns.lytdPytdTotalVolumeGrowth);
        }

        // Values for Col 'md' props target individual columns. They are overridden in the CSS to tighten space b/w columns
        groupsToWrite.push(
            <Col xs={12} sm={12} md={4}>
                <FormGroup>
                    <div dataLwtId={'lbl-office-info'} className="filter-header">
                        {apt.officeInformation}
                    </div>
                    {writeColumn(officeOptions)}
                </FormGroup>
            </Col>
        )
        groupsToWrite.push(
            <Col xs={12} sm={12} md={4}>
                <FormGroup>
                    <div dataLwtId={'lbl-units'} className="filter-header">
                        {apt.numberUnits}
                    </div>
                    {writeColumn(unitOptions)}
                </FormGroup>
            </Col>
        )
        groupsToWrite.push(
            <Col xs={12} sm={12} md={4}>
                <FormGroup>
                    <div dataLwtId={'lbl-volume'} className="filter-header">
                        {apt.dollarVolume}
                    </div>
                    {writeColumn(volumeOptions)}
                </FormGroup>
            </Col>
        )
    }

    if (tabMode === tabModes.LISTING_PROFICIENCY) {

        const officeOptions = [
            listingProficiencyColumns.officeId,
            listingProficiencyColumns.officeAddress
        ];
        const totalSellOptions = [
            listingProficiencyColumns.last12SellUnits,
            listingProficiencyColumns.last12SellVolume,
        ];
        const totalListOptions = [
           listingProficiencyColumns.last12ListUnits,
           listingProficiencyColumns.last12ListVolume,
        ];
        const noPriceChangeOptions = [
            listingProficiencyColumns.noPcLast12ListUnits,
            listingProficiencyColumns.noPcLast12ListUnitsPct,
            listingProficiencyColumns.noPcLast12ListVolume,
            listingProficiencyColumns.noPcLast12ListVolumePct,
            listingProficiencyColumns.noPcLast12ListDom,
            listingProficiencyColumns.noPcLast12ListCdom,
            listingProficiencyColumns.noPcLast12SpOp
        ];
        const priceChangeOptions = [
            listingProficiencyColumns.pcLast12ListUnits,
            listingProficiencyColumns.pcLast12ListUnitsPct,
            listingProficiencyColumns.pcLast12ListVolume,
            listingProficiencyColumns.pcLast12ListVolumePct,
            listingProficiencyColumns.pcLast12ListDom,
            listingProficiencyColumns.pcLast12ListCdom,
            listingProficiencyColumns.pcLast12ListPcDom,
            listingProficiencyColumns.pcLast12ListSpOp,
            listingProficiencyColumns.pcLast12ListSpLp,
            listingProficiencyColumns.pcLast12ListAvgNumPc
        ];

        groupsToWrite.push(<Col xs={12} sm={4} md={3} lg={2}>
            <FormGroup>
                <div dataLwtId={'lbl-office-info'} className="filter-header">
                    {apt.officeInformation}
                </div>
                {writeColumn(officeOptions)}
            </FormGroup>
        </Col>);
        groupsToWrite.push(<Col xs={12} sm={4} md={2} lg={2}>
            <FormGroup>
                <div dataLwtId={'lbl-total-sell'} className="filter-header">
                    {apt.totalSell}
                </div>
                {writeColumn(totalSellOptions)}
            </FormGroup>
        </Col>);
        groupsToWrite.push(<Col xs={12} sm={4} md={2} lg={2}>
            <FormGroup>
                <div dataLwtId={'lbl-total-list'} className="filter-header">
                    {apt.totalList}
                </div>
                {writeColumn(totalListOptions)}
            </FormGroup>
        </Col>);
        groupsToWrite.push(<Col xs={12} sm={4} md={2} lg={3}>
            <FormGroup>
                <div dataLwtId={'lbl-no-price-change'} className="filter-header">
                    {apt.noPriceChangeListings}
                </div>
                {writeColumn(noPriceChangeOptions)}
            </FormGroup>
        </Col>);
        groupsToWrite.push(<Col xs={12} sm={4} md={3} lg={3}>
            <FormGroup>
                <div dataLwtId={'lbl-price-change'} className="filter-header">
                    {apt.priceChangeListings}
                </div>
                {writeColumn(priceChangeOptions)}
            </FormGroup>
        </Col>);
    }

    return (
        <>
            <Row>
                {groupsToWrite.map((group, index) => (
                    <React.Fragment key={index}>{group}</React.Fragment>
                ))}
            </Row>
        </>
    )
}

export default AgentsColumns;
