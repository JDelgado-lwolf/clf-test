import React, { useState, useEffect, useMemo } from 'react';
import { AddedOfficeTable, AvailableOfficeTable } from '../../common/components/search/menus/AvailableOfficeTable';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import TransferList from '../../common/components/search/menus/TransferList';
import { buildInitialAvailableOffices } from '../../market-share/helpers/comparisonSets';
import { getSortedObjectByProp } from '../../market-share/helpers/helpers';

export const TransferOfficeList = () => {

    const {
        addedOffices,
        setAddedOffices,
        selectedComparisonSet,
        selectedComparisonSetOfficesList,
        isOfficeGroupEdit,
    } = useComparisonSetsStore(state => ({
        addedOffices: state.addedOffices,
        setAddedOffices: state.setAddedOffices,
        selectedComparisonSet: state.selectedComparisonSet,
        selectedComparisonSetOfficesList: state.selectedComparisonSetOfficesList,
        isOfficeGroupEdit: state.isOfficeGroupEdit,
    }));

    const offices = useMemo(() =>
        buildInitialAvailableOffices(selectedComparisonSet, selectedComparisonSetOfficesList),
        [selectedComparisonSet, selectedComparisonSetOfficesList]
    );

    const [state, setState] = useState({
        availableOffices: offices ?? [],
        displayedOffices: offices ?? []
    });

    const addOffices = (officesToAdd) => {
        const officeIds = officesToAdd.map(office => office.officeId);
        const availableOffices = state.availableOffices.filter(office => !officeIds.includes(office.officeId));
        const availableOfficeIds = availableOffices.map(office => office.officeId);
        const newlyAddedOffices = isOfficeGroupEdit
            ? getSortedObjectByProp([...addedOffices, ...officesToAdd], 'officeName')
            : offices.filter(office => !availableOfficeIds.includes(office.officeId));
        setState(state => ({
            ...state,
            availableOffices
        }));
        setAddedOffices(newlyAddedOffices);
    };

    const addAll = () => {
        addOffices(state.displayedOffices);
    };

    const removeAddedOffices = (officesToRemove) => {
        const officeIds = officesToRemove.map(office => office.officeId);
        const filteredAddedOffices = addedOffices.filter(office => !officeIds.includes(office.officeId));
        const addedOfficesIds = filteredAddedOffices.map(office => office.officeId);
        const availableOffices = isOfficeGroupEdit
            ? getSortedObjectByProp([...state.availableOffices, ...officesToRemove], 'officeName')
            : offices.filter(office => !addedOfficesIds.includes(office.officeId));
        setState(state => ({
            ...state,
            availableOffices
        }));
        setAddedOffices(filteredAddedOffices);
    };

    const removeAll = () => {
        removeAddedOffices(addedOffices);
    };

    const renderedAvailableItems = <AvailableOfficeTable
        addOffices={(offices) => addOffices(offices)}
        availableOffices={state.availableOffices}
        hasAvailableOffices={state.availableOffices?.length}
        hasColumnFilters={true}
        setDisplayedOffices={(displayedOffices) => setState(prevState => ({
            ...prevState,
            displayedOffices
        }))}
    />;

    const renderedAddedItems = <AddedOfficeTable
        addedOffices={addedOffices}
        removeOffices={(offices) => removeAddedOffices(offices)}
    />;

    useEffect(() => {
        if (!offices?.length) return;
        setState(state => ({
            ...state,
            availableOffices: offices
        }));
    }, [selectedComparisonSetOfficesList]);

    return <TransferList
        isAddAllDisabled={!state.availableOffices?.length || !state.displayedOffices?.length}
        selectedItems={addedOffices}
        renderedAvailableItems={renderedAvailableItems}
        renderedAddedItems={renderedAddedItems}
        addAll={addAll}
        removeAll={removeAll}
        availableWidth='73%'
        addedWidth='25%'
        shouldHideSaveAsListButton={true}
    />
};
