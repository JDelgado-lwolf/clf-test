import React from 'react';
import { Button } from '@lwt-helix/buttons';
import Icon from '@lwt-helix/icon';
import { getFilterGroups } from '../../../helpers/filter-list';
import { useFeatureToggles } from '../../../hooks/featureToggles';
import { areaSearchTypes, searchTerms } from '../../../../constants';

const Filter = props => {
    const {
        name,
        id,
        icon,
        search,
        permanent,
        onClick,
        disabled
    } = props;
    const featureToggles = useFeatureToggles();

    const hasSearchCriteria = filter => {
        let found = false;
        if (search) {
            const mlsId = search?.mlsId;
            const criteriaObj = search.searchCriteria.criteria.realEstateDatasourceIdsWithFilters.find(x => x.realEstateDatasourceId === mlsId);
            switch (filter) {
                case searchTerms.mlsFilter:
                    found = !!mlsId;
                    break;
                case searchTerms.propTypeFilter: {
                    const propType = criteriaObj?.searchFields?.find(f => f.fieldName === filter);
                    found = !!propType && propType?.fieldValues?.length > 0;
                    break;
                }
                case searchTerms.timeFrameFilter:
                    found = !!search?.searchCriteria?.criteria?.timePeriod;
                    break;
                case searchTerms.areaTypeFilter: {
                    const areaType = criteriaObj?.computedFields?.find(field => field.fieldName === searchTerms.areaTypeFilter);
                    found = areaType?.fieldValues?.length > 0;
                    break;
                }
                case searchTerms.marketAreaFilter: {
                    const marketAreas = criteriaObj?.searchFields?.filter(f => areaSearchTypes.includes(f.fieldName));
                    found = !!criteriaObj?.searchAllMLS || (!!marketAreas?.length && marketAreas?.some(a => a.fieldValues?.length > 0));
                    break;
                }
                case searchTerms.listingStatusFilter: {
                    const listingStatus = criteriaObj?.computedFields?.find(f => f.fieldName === searchTerms.transactionStatus);
                    found = listingStatus?.fieldValues?.length > 0;
                    break;
                }
                case searchTerms.officesFilter: {
                    const offices = criteriaObj?.idFiltering?.find(f => f.idType?.toLowerCase() === searchTerms.officeIdType.toLowerCase());
                    found = offices?.idValues?.length > 0;
                    break;
                }
                case searchTerms.agentsFilter: {
                    const agents = criteriaObj?.idFiltering?.find(f => f.idType?.toLowerCase() === searchTerms.agentIdType.toLowerCase());
                    found = agents?.idValues?.length > 0;
                    break;
                }
                default: {
                    const filterGroups = getFilterGroups({isComparisonSetsEnabled: featureToggles.comparisonSets.isEnabled});
                    const filterMap = filterGroups.find(g => g.title === searchTerms.optional)?.filters.find(f => f.id === filter);
                    if (filterMap) {
                        const path = filterMap.path.split('/');
                        const searchField = filter === searchTerms.lotSizeFilter
                            ? criteriaObj?.[path[0]]?.find((f) =>
                                f.fieldName === searchTerms.lotSizeAcresFilter || f.fieldName === searchTerms.lotSquareFeetFilter)
                            : criteriaObj?.[path[0]].find(f => f.fieldName === path[1]);
                        found = !!searchField?.fieldValues?.length ||
                                !!searchField?.fieldMinValue ||
                                !!searchField?.fieldMaxValue ||
                                !!searchField?.comparisonSet;
                    }
                    break;
                }
            }
        }
        return found;
    };

    return <>
        <Button
            dataLwtId={id}
            block
            size='sm'
            color='text'
            className='mt-1 py-1 text-left text-capitalize'
            disabled={disabled}
            onClick={permanent ? undefined : () => onClick(id)}
        >
            {icon}
            {name}
            {hasSearchCriteria(id) &&
            <Icon dataLwtId={`${id}-selected`} className='float-right text-primary mt-1' iconName='check' />
            }
        </Button>
    </>;
};

export default Filter;
