import React, { useEffect, useState } from 'react';
import { searchTerms } from '../../../../constants';
import { roundIfNumber } from '../../../../agent-production/helpers/dataFormatters';
import { Input } from '@lwt-helix/controls';

const Bathrooms = props => {
    const { initialBathrooms, validationProps, setBathrooms } = props;
    const { validationMessage, minInvalid, maxInvalid } = { ...validationProps };

    const initialState = {
        selectedBathrooms: initialBathrooms
    };
    const [state, setState] = useState(initialState);

    const changeBathrooms = (e) => {
        const input = e.target.value.replace(/\,/g, '');
        const bathrooms = roundIfNumber(input);
        setState(prevState => ({
            ...prevState,
            selectedBathrooms: {
                ...state.selectedBathrooms,
                [e.target.name]: bathrooms === 0 ? undefined : bathrooms
            }
        }));
    };

    useEffect(() => {
        state.selectedBathrooms && state.selectedBathrooms !== initialBathrooms && setBathrooms(state.selectedBathrooms);
    }, [state.selectedBathrooms]);

    return (<>
        <div className="d-flex">
            <Input
                dataLwtId="bathrooms-min"
                className="d-inline-block"
                name="min"
                value={initialBathrooms?.min}
                placeholder={searchTerms.noMin}
                type="number"
                onChange={changeBathrooms}
                invalid={minInvalid}
                autoFocus={true}
            />
            <span className="m-2">-</span>
            <Input
                dataLwtId="bathrooms-max"
                className="d-inline-block"
                name="max"
                value={initialBathrooms?.max}
                placeholder={searchTerms.noMax}
                type="number"
                onChange={changeBathrooms}
                invalid={maxInvalid}
            />
        </div>
        {validationMessage &&
            <div className="text-danger p-2" style={{ whiteSpace: 'pre-wrap' }}>{validationMessage}</div>
        }
    </>);
};

export default Bathrooms;
