import { allFilterGroups, GROUP_FILTERS } from '../constants/filter-list';

export const getRevisedGroups = (groups, filterIdToRemove) => {
    return groups.map(group => {
        return {
            title: group.title,
            filters: group.filters.filter(filter => filter.id !== filterIdToRemove)
        };
    });
};

export const getFilterGroups = ({ isComparisonSetsEnabled }) => {
    if (!isComparisonSetsEnabled) {
        return getRevisedGroups(allFilterGroups, GROUP_FILTERS.COMPARISON_SET.id);
    }
    return allFilterGroups;
};

export const getFiltersByGroupTitle = (filterGroups, groupTitle) => {
    return filterGroups
           .find(group => group.title === groupTitle)
           .filters.map(filter => filter.id);
}
