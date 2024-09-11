import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from '@lwt-helix/select';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { search } from '@lwt-helix/helix-icon/outlined';
import { searchTerms } from '../../../../constants';

export const ComparisonSets = (props) => {
    const { initialComparisonSet, setComparisonSet, comparisonSetListOptions, togglePopover } = props;

    const selectedOption = comparisonSetListOptions?.find(cs => cs.id === initialComparisonSet?.id);

    const initialState = {
        selectedOption
    };

    const [state, setState] = useState(initialState);

    const handleChange = (selectedOption) => {
        setState(prevState => ({
            ...prevState,
            selectedOption
        }));
        togglePopover();
    };

    useEffect(() => {
        state.selectedOption && state.selectedOption !== initialComparisonSet &&
            setComparisonSet(state.selectedOption.id);
    }, [state.selectedOption]);

    return (<>
        <Select
            dataLwtId='comparison-sets-chip-select'
            className='mb-2 w-100'
            value={state.selectedOption}
            options={comparisonSetListOptions}
            onChange={handleChange}
            isClearable={false}
            placeholder={<>
                <HelixIcon
                    icon={search}
                    className='align-top mr-1'
                    title='search comparison set icon'
                />
                <span>{searchTerms.searchForItem(searchTerms.comparisonSet)}</span>
            </>}
            autoFocus={true}
        />
    </>);
};

ComparisonSets.propTypes = {
    initialComparisonSet: PropTypes.obj,
    setComparisonSet: PropTypes.func,
    comparisonSetListOptions: PropTypes.array,
    togglePopover: PropTypes.func,
};
