import { Input } from '@lwt-helix/controls';
import React, { useEffect } from 'react';
import { NAME_MAX_LENGTH } from '../../market-share/helpers/comparisonSets';
import { marketShareTerms as mst } from '../../constants';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';
import { TransferOfficeList } from '../components/TransferOfficeList';

export const OfficeGroupContent = () => {

    const {
        officeGroupName,
        setOfficeGroupName,
        isOfficeGroupEdit,
        selectedOfficeGroup,
    } = useComparisonSetsStore(state => ({
        officeGroupName: state.officeGroupName,
        setOfficeGroupName: state.setOfficeGroupName,
        isOfficeGroupEdit: state.isOfficeGroupEdit,
        selectedOfficeGroup: state.selectedOfficeGroup,
    }));

    useEffect(() => {
        if (!isOfficeGroupEdit) return;
        setOfficeGroupName(selectedOfficeGroup.name);
    }, []);

    return (<>
        <div className='d-flex flex-column justify-content-center'>
            <p className='font-weight-bold mb-1'>{mst.officeGroupName}</p>
            <Input
                dataLwtId="new-office-group"
                name="new-office-group"
                placeholder={mst.newOfficeGroup}
                type="text"
                maxLength={NAME_MAX_LENGTH}
                onChange={(e) => setOfficeGroupName(e.target?.value)}
                value={officeGroupName}
            />
            <small className='my-1'>{mst.addNewGroupDescription}</small>
            <TransferOfficeList />
        </div>
    </>);
};
