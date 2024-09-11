import { Routes } from '../../../../../../common/routes/routes';
import { maskUrlVar } from '../../../../../../common/helpers/routes';
import { Link } from 'react-router-dom';
import React from 'react';
import { useAgentProfileStore } from '../../../../../../store/store';
import { useQuery } from '../../../../../../common/hooks/location';

const getCurrentPeriod = (period) => {
  const dateSplitted = period.split(' ');
  const month = dateSplitted[0];
  const year = dateSplitted[1].slice(2);
  return `${month} ${year}`;
};

export const CoverageAddressFormatter = (data) => {
  const {selectedAgentId, selectedArea, displayMode, isUnits} = useAgentProfileStore()

  const to = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.LISTING_INFO}` +
      `?mlsNum=${data.mlsNum}` +
      `&agentId=${selectedAgentId}` +
      `&incomingPage=${Routes.PROF_METRICS.COVERAGE_LISTING}` +
      `&selectedArea=${maskUrlVar(selectedArea?.value)}` +
      `&displayMode=${displayMode}` +
      `&isUnits=${isUnits}`;

  return <Link to={to}>{data.address}</Link>;
};

export const ProductionAddressFormatter = (data) => {
  const query = useQuery();
  const { selectedAgentId, displayMode, currentTab, timePeriod } = useAgentProfileStore();

  const to = `${Routes.PROF_METRICS.BASE}${Routes.PROF_METRICS.LISTING_INFO}` +
      `?mlsNum=${data.mlsNum}` +
      `&agentId=${selectedAgentId}` +
      `&period=${getCurrentPeriod(timePeriod)}` +
      `&tabIndex=${currentTab}` +
      `&graph=${query.get('graph')}` +
      `&chartMode=${displayMode}` +
      `&isShowBarLabels=${query.get('isShowBarLabels')}` +
      `&intervalType=${query.get('intervalType')}`;

  return <Link to={to}>{data.address}</Link>;
};
