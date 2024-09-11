import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { agentProductionTerms } from '../../../constants'
import AgentsTableControls from './AgentsTableControls'
import { growthAnalysisTooltips, tabModes } from '../../constants/agentProductionConstants'
import { getClassNameSuppressHeaders } from '../../helpers/schemaTableHelpers'
import { getIsPeriodLast12Months } from '../helpers/growthAnalysisHelpers'
import Table from '../../../common/components/table/agGrid/Table'
import { tableViews } from '../../../common/components/table/agGrid/tableViews';

const GrowthAnalysis = ({
    agentData,
    additionalTableHeadersLtm,
    additionalTableHeadersYtd,
    growthAnalysisPeriod,
    setGrowthAnalysisPeriod,
    ltmColumns,
    ytdColumns,
    setColumnsLtm,
    setColumnsYtd,
    currentSearchDates
}) => {

    const gridRef = useRef();
    const isPeriodLast12Months = getIsPeriodLast12Months(growthAnalysisPeriod)
    const columns = isPeriodLast12Months ? ltmColumns : ytdColumns

    useEffect(() => {
        setGrowthAnalysisPeriod(agentProductionTerms.last12Months)
    }, [agentData])

    const setColumnsLocal = cols => {
        if (isPeriodLast12Months) {
            setColumnsLtm(cols)
        } else {
            setColumnsYtd(cols)
        }
    }

    const customSettings = {
        isPeriodLast12Months,
        currentSearchDates
    }

    const classNameContainerLtm = getClassNameSuppressHeaders(additionalTableHeadersLtm)
    const classNameContainerYtd = getClassNameSuppressHeaders(additionalTableHeadersYtd)

    return (
        <>
            <AgentsTableControls
                isTableSelected={true}
                tabMode={tabModes.GROWTH_ANALYSIS}
                columns={columns}
                setColumns={setColumnsLocal}
                hasShowHideColumnsButton={true}
                hasTableChartToggle={false}
                growthAnalysisPeriod={growthAnalysisPeriod}
                setGrowthAnalysisPeriod={setGrowthAnalysisPeriod}
                popoverClassName={'growth-analysis'}
                customSettings={customSettings}
            />
            {isPeriodLast12Months ? (
                <div className={classNameContainerLtm}>
                <Table
                    gridRef={gridRef}
                    tableView={tableViews.growthAnalysisLtm}
                    rowData={agentData}
                    columns={columns}
                    additionalTableHeaders={additionalTableHeadersLtm}
                    tableTitleWithTooltips={growthAnalysisTooltips}
                />
                </div>
            ) : (
                <div className={classNameContainerYtd}>
                    <Table
                        gridRef={gridRef}
                        tableView={tableViews.growthAnalysisYtd}
                        rowData={agentData}
                        columns={columns}
                        additionalTableHeaders={additionalTableHeadersYtd}
                        tableTitleWithTooltips={growthAnalysisTooltips}
                    /> 
                </div>
            )}
        </>
    )
}

GrowthAnalysis.propTypes = {
    agentData: PropTypes.arrayOf(PropTypes.object),
    options: PropTypes.object,
    schema: PropTypes.object,
    additionalTableHeaders: PropTypes.arrayOf(PropTypes.object),
}

export default GrowthAnalysis;
