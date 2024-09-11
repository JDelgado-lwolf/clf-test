import React, { useState } from 'react';
import { Button } from '@lwt-helix/buttons';
import Icon from '@lwt-helix/icon';
import Select from '@lwt-helix/select';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { pencil } from '@lwt-helix/helix-icon/outlined';
import { ToastContainer } from '@lwt-helix/toast';
import { buttonTerms, comparisonSetsModals, marketShareTerms as mst } from '../constants';
import { useComparisonSets } from './hooks/comparisonSets';
import { useComparisonSetsStore } from '../store/comparisonSets/store';
import { SaveComparisonSet } from './modals/SaveComparisonSet';
import OfficeGroups from './components/OfficeGroups';
import { EditComparisonSet } from './modals/EditComparisonSet';
import { useCommonStore } from '../store/store';
import { getMlsToSet } from '../market-share/helpers/comparisonSets';

const ComparisonSets = () => {
    const {
        state,
        setState,
        mlsListOptions,
        defaultMlsOption,
    } = useComparisonSets();
    const {
        toggleModal,
        handleSelectedComparisonSet,
        selectedComparisonSet,
        comparisonSetListOptions,
        handleMlsChange
    } = useComparisonSetsStore(state => ({
        handleMlsChange: state.handleMlsChange,
        toggleModal: state.toggleModal,
        handleSelectedComparisonSet: state.handleSelectedComparisonSet,
        selectedComparisonSet: state.selectedComparisonSet,
        comparisonSetListOptions: state.comparisonSetListOptions,
    }));

    const {
        mlsList,
    } = useCommonStore(state => ({
        mlsList: state.mlsList,
    }));

    const handleCompSetChange = (value) => {
        handleSelectedComparisonSet(value);
        const mlsToSet = getMlsToSet(mlsList, value);
        handleMlsChange(mlsToSet);
    };
    const [selectedMls, setSelectedMls] = useState(defaultMlsOption);

    return <>
        <div className='m-auto text-center'>
            <h3>{mst.manageComparisonSets}</h3>
            <p>{mst.comparisonSetsDescription}</p>
        </div>
        <div className='bg-white raised-border p-3'>
            <div className='d-flex align-items-center justify-content-between'>
                <h5>{mst.comparisonSets}</h5>
                <Button
                    dataLwtId='new-comparison-set'
                    size='sm'
                    color='light'
                    className='mb-1 text-capitalize d-inline-flex align-items-center'
                    id='new-comparison-set'
                    onClick={() => {
                        toggleModal(true, comparisonSetsModals.SAVE);
                        setSelectedMls(defaultMlsOption);
                    }}
                >
                    <Icon className='mr-1 text-primary' iconName='add_circle' dataLwtId='add-icon' />
                    {buttonTerms.newSet}
                </Button>
            </div>

            {comparisonSetListOptions?.length ? <>
                 <div className='d-flex align-items-center'>
                    <Select
                        dataLwtId='comparison-sets'
                        className='w-100 mr-2'
                        options={comparisonSetListOptions}
                        value={selectedComparisonSet}
                        isClearable={false}
                        onChange={value => handleCompSetChange(value)}/>
                    <HelixIcon
                        icon={pencil}
                        title='edit icon'
                        className='clickable align-top mr-1'
                        onClick={() => { toggleModal(true, comparisonSetsModals.EDIT); }}
                    />
                </div>
                <OfficeGroups />
            </>
            : <div className="helix-card mt-5">
                <div className='text-center'>
                    <p className='font-weight-bold mb-0'>{mst.noneAdded}</p>
                    <p>{mst.addComparisonSetMessage}</p>
                </div>
            </div>
        }
        <SaveComparisonSet
            isSaveButtonDisabled={state.isSaveButtonDisabled}
            mlsListOptions={mlsListOptions}
            defaultMlsOption={defaultMlsOption}
            setState={setState}
            selectedMls={selectedMls}
            setSelectedMls={setSelectedMls}
        />
        <EditComparisonSet
            defaultMlsOption={defaultMlsOption}
            state={state}
            setState={setState}
            selectedMls={getMlsToSet(mlsList, selectedComparisonSet)}
        />
        </div>
        <ToastContainer
            position='toast-bottom-right'
            dataLwtId='save-list-toasts'
            toastProps={state.toastProps}
        />
    </>
};

export default ComparisonSets;
