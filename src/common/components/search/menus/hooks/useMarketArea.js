import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash-es';
import { modalKeys } from '../../../../helpers/menu';
import { setStateData } from '../../../../helpers/state';
import { areaRequestTypes, searchTerms } from '../../../../../constants';

export const useMarketArea = ({
                                  typeOptions,
                                  selectedMarketAreaCriteria,
                                  mappedAreas,
                                  marketAreaLists,
                                  filterText,
                                  selectedSortOption
                              }) => {
    const initialState = {
        mappedAreas: undefined,
        addedAreas: undefined,
        availableAreas: undefined,
        selectOptions: typeOptions && [...typeOptions],
        showEditModal: {
            [modalKeys.dropdown]: false,
            [modalKeys.transfer]: false
        }
    };
    const [state, setState] = useState({ ...initialState });

    useEffect(() => {
        !state.selectedMarketAreaList && setStateData(
            'selectedMarketAreaList',
            state.selectedMarketAreaCriteria?.savedAreaId && marketAreaLists.find(list =>
            list.id === selectedMarketAreaCriteria.savedAreaId
            ),
            setState
        );
    }, [state.selectedMarketAreaCriteria]);

    useEffect(() => {
        if (mappedAreas) {
            const smac = selectedMarketAreaCriteria;
            let nextState = {
                ...state,
                availableAreas: smac && mappedAreas[smac.fieldName]
                    ? smac?.fieldValues
                        ? [...mappedAreas[smac.fieldName].mappedAreas]?.filter(area =>
                            ['areaKey', 'area2Key'].includes(smac.fieldName)
                                ? !smac.fieldValues.includes(area.areaKey)
                                : !smac.fieldValues.includes(area.areaValue)
                        )
                        : [...mappedAreas[smac.fieldName].mappedAreas]
                    : [],
                addedAreas: !!smac?.fieldValues?.length
                && mappedAreas[smac.fieldName].mappedAreas
                    ? [...mappedAreas[smac.fieldName].mappedAreas]?.filter(area =>
                        ['areaKey', 'area2Key'].includes(smac.fieldName)
                            ? smac.fieldValues.includes(area.areaKey)
                            : smac.fieldValues.includes(area.areaValue)
                    )
                    : [],
                initialSelectedAreas: smac?.fieldValues
                && mappedAreas[smac.fieldName]
                    ? [...mappedAreas[smac.fieldName].mappedAreas]?.filter(area =>
                        ['areaKey', 'area2Key'].includes(smac.fieldName)
                            ? smac.fieldValues.includes(area.areaKey)
                            : smac.fieldValues.includes(area.areaValue)
                    )
                    : [],
                selectedMarketAreaCriteria: smac
            };
            setState({ ...nextState });
        }
    }, [mappedAreas, selectedMarketAreaCriteria]);

    useEffect(() => {
        const updatedOptions = typeOptions ? [...typeOptions] : [];
        if (marketAreaLists?.length && mappedAreas) {
            if (!updatedOptions?.find(group => group.label === searchTerms.myMarketLists)) {
                updatedOptions.push({
                    label: searchTerms.myMarketLists,
                    options: marketAreaLists.filter(area => !isEmpty(area.elements)).map(list => {

                        const areaLabel = Object.values(mappedAreas).find(mappedArea =>
                            areaRequestTypes[mappedArea.columnName] === list.elements.fieldName
                        )?.viewName;
                        return {
                            label: `${list.name} (${areaLabel})`,
                            value: list.id
                        };
                    })
                });
            }
        }
        setStateData('selectOptions', updatedOptions, setState);
    }, [marketAreaLists]);

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            filteredAreas: sortList(filterAreas(state.availableAreas)),
            filteredAddedAreas: sortList(filterAreas(state.addedAreas))
        }));
    }, [
        filterText,
        selectedSortOption,
        state.availableAreas,
        state.addedAreas
    ]);

    const filterAreas = list => {
        if (!list) return [];
        if (!filterText) return [...list];

        return [...list]?.filter(a =>
            a.areaValue?.toLowerCase().startsWith(filterText?.toLowerCase())
            || a.areaKey?.toLowerCase().startsWith(filterText?.toLowerCase())
        );
    };

    const alphaSort = (a, b) => {
        return !a.areaValue
            ? a.areaKey.localeCompare(b.areaKey)
            : a.areaValue.localeCompare(b.areaValue);
    };
    const countSort = (a, b) => {
        return b.soldCount - a.soldCount;
    };

    const sortList = (list) => {
        const sortFunc = selectedSortOption?.value === 'soldCount'
            ? countSort
            : alphaSort;
        return list && [...list].sort(sortFunc);
    };

    return [state, setState];
};
