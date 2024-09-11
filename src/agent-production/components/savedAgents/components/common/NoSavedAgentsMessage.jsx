import React from 'react';
import { agentProductionTerms } from '../../../../../constants';

export const NoSavedAgentsMessage = ({ isDropdown }) => {
    return <div className='text-center'>
        <p className={`no-search-results${isDropdown ? '-dropdown' : ''} font-weight-bold`}>
            {agentProductionTerms.noSavedAgents}
        </p>
        <p className={`no-search-results-suggestion${isDropdown ? '-dropdown' : ''}`}>
            {agentProductionTerms.noSavedAgentsSuggestion}
        </p>
    </div>;
};
