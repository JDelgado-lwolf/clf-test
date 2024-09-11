import { agentProductionTerms } from '../../../../../constants';
import { getCurrencyFormat, maxTwoDecimals } from '../../../../helpers/dataFormatters';
import { chartModes, getOverviewGraphProps } from '../../../../helpers/agentDataCalculators';
import { OverviewChartGraph } from '../../../chart/OverviewChartGraph';
import React from 'react';
import { productionChartTabToolTips } from '../../../../constants/agentProductionConstants';

const getLwtId = (dataLwtIdSuffix, prefix) => `prod-${prefix}-${dataLwtIdSuffix}`

const getLwtIdUnits = dataLwtIdSuffix => getLwtId(dataLwtIdSuffix, 'units')

const getLwtIdVolume = dataLwtIdSuffix => getLwtId(dataLwtIdSuffix, 'volume')

const getCard = (id, value, dataLwtId) => {
  return {id, value, dataLwtId }
}

const getVolumeSummaryCardData = (chartData, dataIndexes) => {

  const productionChartKeys = Object.keys(productionChartTabToolTips)

  productionChartKeys.forEach(el => {
    productionChartTabToolTips[el].id = el;
  })

  const points = getSummaryData({ chartData, dataIndexes })

  const cardData = []

  const cardList = getCard(productionChartTabToolTips.summaryVolListSide.id, getCurrencyFormat(points.totalListVol),
      getLwtIdVolume('dollarVolumeListSide'))
  cardData.push(cardList)

  const cardSell = getCard(productionChartTabToolTips.summaryVolSellSide.id, getCurrencyFormat(points.totalSellVol),
      getLwtIdVolume('dollarVolumeSellSide'))
  cardData.push(cardSell)

  const cardTotal = getCard(productionChartTabToolTips.summaryTotalVolume.id, getCurrencyFormat(points.totalListSellVol),
      getLwtIdVolume('totalDollarVolume'))
  cardData.push(cardTotal)

  const cardMonthly = getCard(productionChartTabToolTips.summaryVolPerMonth.id, getCurrencyFormat(points.avgPerMonthVol),
      getLwtIdVolume('dollarVolumePerMonth'))
  cardData.push(cardMonthly)

  const cardAvgPrice = getCard(productionChartTabToolTips.summaryAvgPrice.id, getCurrencyFormat(points.avgPrice),
      getLwtIdVolume('averagePrice'))
  cardData.push(cardAvgPrice)

  return cardData
}

const getUnitSummaryCardData = (chartData, dataIndexes) => {

  const productionChartKeys = Object.keys(productionChartTabToolTips)

  productionChartKeys.forEach(el => {
    productionChartTabToolTips[el].id = el;
  })


  const points = getSummaryData({ chartData, dataIndexes })

  const cardData = []

  const cardList = getCard(productionChartTabToolTips.summaryUnitsListSide.id , points.totalListUnits,
      getLwtIdUnits('numberUnitsListSide'))
  cardData.push(cardList)

  const cardSell = getCard(productionChartTabToolTips.summaryUnitsSellSide.id, points.totalSellUnits,
      getLwtIdUnits('numberUnitsSellSide'))
  cardData.push(cardSell)

  const cardTotal = getCard(productionChartTabToolTips.summaryTotalUnits.id, points.totalListSellUnits,
      getLwtIdUnits('totalNumberUnits'))
  cardData.push(cardTotal)

  const cardMonthly = getCard(productionChartTabToolTips.summaryUnitsPerMonth.id, maxTwoDecimals(points.avgPerMonthUnits),
      getLwtIdUnits('numberUnitsPerMonth'))
  cardData.push(cardMonthly)

  const cardAvgPrice = getCard(productionChartTabToolTips.summaryAvgPrice.id, getCurrencyFormat(points.avgPrice),
      getLwtIdUnits('averagePrice'))
  cardData.push(cardAvgPrice)

  return cardData
}

export const getPropsSummary = ({ graphData: chartData, dataIndexes, graphMode }) => {

  let title, cardData

  if (graphMode === chartModes.VOLUME) {

    title = agentProductionTerms.totalVolume
    cardData = getVolumeSummaryCardData(chartData, dataIndexes)

  } else {

    title = agentProductionTerms.totalUnits
    cardData = getUnitSummaryCardData(chartData, dataIndexes)
  }

  return {
    title,
    cardData
  }
}

export const getSummaryData = ({ chartData, dataIndexes }) => {

  const dataToMap = chartData?.slice(dataIndexes.lastPeriodStart, dataIndexes.lastPeriodFinish + 1)

  let totalListVol = 0, totalSellVol = 0, totalListSellVol, avgPerMonthVol,
      avgPrice,
      totalListUnits = 0, totalSellUnits = 0, avgPerMonthUnits, totalUnits = 0

  dataToMap?.forEach(d => {
    totalListVol += d.listVolume
    totalSellVol += d.sellVolume
    totalUnits += d.totalUnits
    totalListUnits += d.listUnits
    totalSellUnits += d.sellUnits
  })

  totalListSellVol = totalListVol + totalSellVol
  avgPerMonthVol = !dataToMap || dataToMap?.length === 0 ? 0 : totalListSellVol / dataToMap.length
  avgPerMonthUnits = !dataToMap || dataToMap?.length === 0 ? 0 : totalUnits / dataToMap.length
  avgPrice = totalUnits ? (totalListSellVol / totalUnits) : 0

  return {
    totalListVol, totalSellVol, totalListSellVol, avgPerMonthVol,
    avgPrice,
    totalListUnits, totalSellUnits, totalListSellUnits: totalUnits, avgPerMonthUnits
  }
}

export const getChartGraph = ({ timePeriod, graphMode, chartData, dataIndexes }) => {

  if (!timePeriod) return null

  const graphProps = getOverviewGraphProps({
    chartData: chartData || [],
    timePeriod,
    dataIndexes,
    widthPixelsOutsideGraph: 100, graphMode
  })
  return <OverviewChartGraph {...graphProps} />
}

export const formatTimePeriodInterval = (timePeriodInterval) => {
  const firstPeriod = new Date(timePeriodInterval[0])
  let lastPeriod = new Date(timePeriodInterval[1])
  const lastDayMonth = new Date(lastPeriod.getFullYear(), lastPeriod.getMonth() + 1, 0).getDate()
  lastPeriod.setDate(lastDayMonth)
  const dateOptions = {year:'numeric', month: 'short', day: 'numeric'}
  
  return `${firstPeriod.toLocaleDateString('default', dateOptions)} - ${lastPeriod.toLocaleDateString('default', dateOptions)}`
}
