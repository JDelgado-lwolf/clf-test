import React, { useEffect } from 'react';
import { Button } from '@lwt-helix/buttons';
import { buttonTerms, searchStatuses } from '../../../constants';
import { useSearchStore } from '../../../store/store';
import { modules } from '../../../constants';

const RunSearchButton = props => {
    const { disabled, module } = props;

    const {
        setSearchStatus,
        shouldAgentNameRerunOnLoad,
        setAgentNameRerunOnLoad
    } = useSearchStore(state => ({
        setSearchStatus: state.setSearchStatus,
        shouldAgentNameRerunOnLoad: state.shouldAgentNameRerunOnLoad,
        setAgentNameRerunOnLoad: state.setAgentNameRerunOnLoad,
    }));

    const agentNameSearch = useSearchStore(state => state[modules.proficiencyMetrics.agents]);

    const runSearch = async () => {
        setSearchStatus(searchStatuses.run);
    };

    useEffect(() => {
        if (module !== modules.proficiencyMetrics.agents) return;
        const searchData = agentNameSearch?.search?.searchCriteria?.criteria?.realEstateDatasourceIdsWithFilters[0];
        const hasSearchMlsId =  !!agentNameSearch?.search?.mlsId;
        const hasFieldValues = !!searchData?.searchFields[0]?.fieldValues?.length;
        const hasIntervalType = !!agentNameSearch?.search?.searchCriteria?.criteria?.timePeriod?.intervalType;
        const hasIdValues = !!searchData?.idFiltering[0]?.idValues?.length;

        if (hasSearchMlsId && hasFieldValues && hasIntervalType && hasIdValues && shouldAgentNameRerunOnLoad) {
            setSearchStatus(searchStatuses.run);
            setAgentNameRerunOnLoad(false);
        }
    }, [module]);

    return <Button
        key={module}
        dataLwtId='run-search'
        color='primary'
        size='sm'
        disabled={disabled}
        onClick={runSearch}
    >
        {buttonTerms.runSearch}
    </Button>;
};

export default RunSearchButton;
