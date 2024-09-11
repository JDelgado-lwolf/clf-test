import React from 'react';
import { getAdditionalTableHeaders } from '../helpers/growthAnalysisHelpers';

export const getGrowthTableSettings = (columns) => {
    const additionalTableHeaders = getAdditionalTableHeaders(columns, ['agentName', 'office']);

    return additionalTableHeaders;
};
