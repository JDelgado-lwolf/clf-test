import React from 'react';
import { buttonTerms, comparisonSetsModals, marketShareTerms as mst } from '../../constants';
import { Button } from '@lwt-helix/buttons';
import Icon from '@lwt-helix/icon';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { OfficeGroup } from '../modals/OfficeGroup';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { trash_can } from '@lwt-helix/helix-icon/outlined';


const OfficeGroups = () => {
    const {
        selectedComparisonSet,
        selectedMls,
        handleOfficeGroupsAdd,
        handleOfficeGroupsEdit,
        handleOfficeGroupsDelete,
    } = useComparisonSetsStore(state => ({
        selectedComparisonSet: state.selectedComparisonSet,
        selectedMls: state.selectedMls,
        handleOfficeGroupsAdd: state.handleOfficeGroupsAdd,
        handleOfficeGroupsEdit: state.handleOfficeGroupsEdit,
        handleOfficeGroupsDelete: state.handleOfficeGroupsDelete
    }));

    const hasGroups = selectedComparisonSet?.groups?.length;

    const officeGroupsMap = selectedComparisonSet?.groups?.map(officeGroup => {
        const mlsDescription = selectedComparisonSet.shortDescription || selectedMls?.value?.shortDescription;
        const scrollMarginClass = selectedComparisonSet?.groups.length < 11 ? 'mr-5' : 'mr-4';
        return <div
            key={officeGroup.name}
            className={`d-flex justify-content-between mb-3 ${scrollMarginClass}`}
        >
            <span
                className='btn-link clickable w-100'
                onClick={() => handleOfficeGroupsEdit(officeGroup)}
            >
                {`${officeGroup.name} (${mlsDescription})`}
            </span>
            <HelixIcon
                icon={trash_can}
                title='remove office group icon'
                className='clickable'
                onClick={() => handleOfficeGroupsDelete(officeGroup)}
            />
        </div>
    });

    return <>
        <div className='d-flex align-items-center my-4 justify-content-between'>
            <h5>{mst.officeGroup}</h5>
            <Button
                dataLwtId='new-office-group'
                size='sm'
                color='light'
                className='mb-1 text-capitalize d-inline-flex align-items-center'
                id='new-office-group'
                onClick={handleOfficeGroupsAdd}
            >
                <Icon className='mr-1 text-primary' iconName='add_circle' dataLwtId='add-icon' />
                {buttonTerms.newGroup}
            </Button>
        </div>
        {hasGroups
            ? <div id='office-group-list-container'>{officeGroupsMap}</div>
            : <div className='helix-card mt-5'>
                <div className='text-center'>
                    <p className='font-weight-bold mb-0'>{mst.noneAdded}</p>
                    <p>{mst.addOfficeGroupMessage}</p>
                </div>
            </div>
        }
        <OfficeGroup />
    </>
};

export default OfficeGroups;
