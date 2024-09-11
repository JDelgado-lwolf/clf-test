import React from 'react';
import Card, { CardContainer } from '@lwt-helix/card';
import { percentChangeFormatter } from '../../helpers/dataFormatters';
import { getOverviewChartTableLabels, getTrendArrow } from '../../helpers/uiHelpers';
import { agentProductionTerms } from '../../../constants';

export const OverviewChartTable = ({ totals, timePeriod, chartData, dataIndexes, labelTotal,
	getFormattedAmount, labelAmountChange }) => {

	if (!totals) return null

	const labels = getOverviewChartTableLabels({ timePeriod, chartData, dataIndexes })

	const amountTrendArrow = getTrendArrow(totals.amountChange)
	const pctChangeTrendArrow = isNaN(totals.percentChange)? null : getTrendArrow(totals.percentChange)
	const lastPeriod = getFormattedAmount(totals.totalLastPeriod)
	const prevPeriod = getFormattedAmount(totals.totalPrevPeriod)
	const amountChange = getFormattedAmount(totals.amountChange)

	return <>
		<CardContainer dataLwtId={'overview-chart-card'} type="group" className="text-center border rounded mt-3">
			<h6 className="text-center w-100 p bold py-2 mb-0 card-header border-0">
				{labelTotal}</h6>
			<Card dataLwtId={'overview-chart-table-last-period'}
						body
						className="border-0 pt-2">
				<p className="mb-0 text-nowrap mb-0 bold dot-dot-dot"
					 title={lastPeriod}>
					{lastPeriod}
				</p>
				<div className="small text-muted dot-dot-dot">
					{labels.labelLastPeriod} ({labels.dateRangeLast})
				</div>
			</Card>
			<Card dataLwtId={'overview-chart-table-prev-period'}
						body
						className="border-0 pt-2">
				<p className="mb-0 text-nowrap mb-0 bold dot-dot-dot"
					 title={prevPeriod}>
					{prevPeriod}
				</p>
				<div className="small text-muted dot-dot-dot">
					{labels.labelPrevPeriod} ({labels.dateRangePrev})
				</div>
			</Card>
			<Card dataLwtId={'overview-chart-table-amt-change'}
						body
						className="border-0 pt-2">
				<p className="mb-0 text-nowrap mb-0 bold dot-dot-dot"
					 title={amountChange}>
					{amountChange}
					{amountTrendArrow}
				</p>
				<div className="small text-muted">{labelAmountChange}</div>
			</Card>
			<Card dataLwtId={'overview-chart-table-pct-change'}
						body
						className="border-0 pt-2">
				<p className="mb-0 text-nowrap mb-0 bold dot-dot-dot">
					{percentChangeFormatter(totals.percentChange)}
					{pctChangeTrendArrow}</p>
				<div className="small text-muted">{agentProductionTerms.pctChange}</div>
			</Card>
		</CardContainer>
	</>
}
