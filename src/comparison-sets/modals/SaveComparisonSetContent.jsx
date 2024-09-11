import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import { Input } from '@lwt-helix/controls';
import { marketShareTerms as mst, searchTerms } from '../../constants';
import { NAME_MAX_LENGTH } from '../../market-share/helpers/comparisonSets';
import Select from '@lwt-helix/select';
import { useComparisonSetsStore } from '../../store/comparisonSets/store';

export const SaveComparisonSetContent = ({ isEdit, shouldShowMlsList, mlsListOptions, defaultMlsOption, setState, setSelectedMls }) => {
    const {
        handleComparisonSetNameChange,
        selectedComparisonSet,
        setNewCompSetName
    } = useComparisonSetsStore(state => ({
        handleComparisonSetNameChange: state.handleComparisonSetNameChange,
        handleMlsChange: state.handleMlsChange,
        selectedComparisonSet: state.selectedComparisonSet,
        setNewCompSetName: state.setNewCompSetName,
    }));

    useEffect(() => {
        if (!isEdit) {
            setNewCompSetName(undefined);
            return;
        }
        setNewCompSetName(selectedComparisonSet?.name);
    }, []);

    return (<>
        <div className='d-flex flex-column justify-content-center'>
            <p className='font-weight-bold mb-1'>{mst.comparisonSetName}</p>
            <Input
                dataLwtId="comparison-set-name"
                name="comparison-set-name"
                placeholder={mst.newComparisonSet}
                type="text"
                maxLength={NAME_MAX_LENGTH}
                onChange={(e) => {handleComparisonSetNameChange(e, setState)}}
                defaultValue={isEdit ? selectedComparisonSet.name : null}
            />
            <small className='mt-1'>{isEdit ? mst.editComparisonSetDescription : mst.addComparisonSetDescription}</small>

            {shouldShowMlsList ? <>
                <p className='font-weight-bold mt-4 mb-1'>{searchTerms.mls}</p>
                <Select
                    dataLwtId='mls-list'
                    options={mlsListOptions}
                    onChange={setSelectedMls}
                    defaultValue={defaultMlsOption}
                    isClearable={false}
                />
            </>
                : null}
        </div>
    </>);
};

SaveComparisonSetContent.propTypes = {
    isEdit: PropTypes.bool,
    shouldShowMlsList: PropTypes.bool,
    mlsListOptions: PropTypes.array,
    defaultMlsOption: PropTypes.object,
    setState: PropTypes.func,
    setSelectedMls: PropTypes.func
};
