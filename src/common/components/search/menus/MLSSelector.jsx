import React from 'react';
import Select from '@lwt-helix/select';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { search } from '@lwt-helix/helix-icon/outlined';
import { searchTerms } from '../../../../constants';

const MLSSelector = props => {
    const { handleSelectChange, mlsProviders, selectedMlsId } = props;

    const customFilter = (option, searchText) => {
        return `${option.data.shortDescription} (${option.data.longDescription})`.toLowerCase()
                .startsWith(searchText.toLowerCase())
            || option.data.longDescription.toLowerCase().startsWith(searchText.toLowerCase());
    };

    const getOptionLabel = option => `${option.shortDescription} (${option.longDescription})`;
    const getOptionValue = option => option.mlsId;

    const selectedValue = selectedMlsId && mlsProviders?.find(option => option.mlsId === selectedMlsId);

    return <Select
        placeholder={<>
            <HelixIcon icon={search} className='align-top mr-1' title='search icon'/>
            {searchTerms.searchForItem(searchTerms.mls)}
        </>}
        openMenuOnFocus={true}
        options={mlsProviders}
        getOptionLabel={getOptionLabel}
        getOptionValue={getOptionValue}
        value={selectedValue}
        filterOption={customFilter}
        className="w-100 mr-2 mb-2"
        onChange={handleSelectChange}
        autoFocus={true}
        isClearable={false}
    />;
};

export default MLSSelector;
