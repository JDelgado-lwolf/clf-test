import React from 'react';
import { agentProductionTerms } from '../../../constants';

export const NoResultsMessage = () => {
    return <>
        <p className='no-search-results font-weight-bold'>
            {agentProductionTerms.noData}
        </p>
        <p className='no-search-results-suggestion'>
            {agentProductionTerms.noDataSuggestion}
        </p>
    </>
};
