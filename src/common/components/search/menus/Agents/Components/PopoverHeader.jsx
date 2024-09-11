import React from 'react';
import PropTypes from 'prop-types';
import Select from '@lwt-helix/select';
import { searchTerms } from '../../../../../../constants';

const PopoverHeader = ({
    sortOptions,
    handleSortChange,
    selectedSortOption,
}) => (
    <div className='w-100'>
        <div className='list-select-container'>
            <p>{searchTerms.agents}</p>
        </div>
        <div className='sort-select-container'>
            <Select
                options={sortOptions}
                onChange={handleSortChange}
                isClearable={false}
                isSearchable={false}
                defaultValue={selectedSortOption || sortOptions[0]}
                className='agent-sort'
                />
        </div>
    </div>
);

PopoverHeader.propTypes = {
    sortOptions: PropTypes.func,
    handleSortChange: PropTypes.func,
    selectedSortOption: PropTypes.obj,
};

export default PopoverHeader;
