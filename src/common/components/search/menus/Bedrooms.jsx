import React, { useEffect, useState } from 'react';
import { searchTerms } from '../../../../constants';
import { Input } from '@lwt-helix/controls';
import { roundIfNumber } from '../../../../agent-production/helpers/dataFormatters';

const Bedrooms = props => {
    const { initialBedrooms, validationProps, setBedrooms } = props;
    const { validationMessage, minInvalid, maxInvalid } = { ...validationProps };

    const initialState = {
        selectedBedrooms: initialBedrooms
    };
    const [state, setState] = useState(initialState);

    const changeBedrooms = (e) => {
        const input = e.target.value.replace(/\,/g, '');
        const bedrooms = roundIfNumber(input);
        setState(prevState => ({
            ...prevState,
            selectedBedrooms: {
                ...state.selectedBedrooms,
                [e.target.name]: bedrooms === 0 ? undefined : bedrooms
            }
        }));
    };

    useEffect(() => {
        state.selectedBedrooms && state.selectedBedrooms !== initialBedrooms && setBedrooms(state.selectedBedrooms);
    }, [state.selectedBedrooms]);
    return (<>
        <div className="d-flex">
            <Input
                dataLwtId="bedrooms-min"
                className="d-inline-block"
                name="min"
                value={initialBedrooms?.min}
                placeholder={searchTerms.noMin}
                type="number"
                onChange={changeBedrooms}
                invalid={minInvalid}
                autoFocus={true}
            />
            <span className="m-2">-</span>
            <Input
                dataLwtId="bedrooms-max"
                className="d-inline-block"
                name="max"
                value={initialBedrooms?.max}
                placeholder={searchTerms.noMax}
                type="number"
                onChange={changeBedrooms}
                invalid={maxInvalid}
            />
        </div>
        {validationMessage &&
            <div className="text-danger p-2" style={{ whiteSpace: 'pre-wrap' }}>{validationMessage}</div>
        }
    </>);
};

export default Bedrooms;
