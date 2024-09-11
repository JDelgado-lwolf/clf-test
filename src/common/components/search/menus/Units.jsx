import React, { useState, useEffect } from 'react';
import { Input } from '@lwt-helix/controls';
import { setStateData } from '../../../helpers/state';

const Units = props => {
    const {
        initialUnits,
        setUnits,
        validationProps
    } = props;
    const { validationMessage, minInvalid, maxInvalid } = { ...validationProps };
    const initialState = {
        selectedUnits: initialUnits
    };

    const [state, setState] = useState(initialState);

    const changeUnits = (e) => {
        const input = e.target.value.replace(/,/g, '');
        const unitCount = !isNaN(parseInt(input)) ? Math.round(input) : input;
        setStateData(
            'selectedUnits',
            {
                ...state.selectedUnits,
                [e.target.name]: unitCount === 0 ? undefined : unitCount
            },
            setState
        );
    };

    useEffect(() => {
        state.selectedUnits && state.selectedUnits !== initialUnits && setUnits(state.selectedUnits);
    }, [state.selectedUnits]);

    return (<>
        <div className="d-flex">
            <Input
                dataLwtId="units-min"
                className="d-inline-block"
                name="min"
                value={state.selectedUnits?.min?.toLocaleString()}
                placeholder="No min"
                type="number"
                onChange={changeUnits}
                invalid={minInvalid}
                autoFocus={true}
            />
            <span className="m-2">-</span>
            <Input
                dataLwtId="units-max"
                className="d-inline-block"
                name="max"
                value={state.selectedUnits?.max?.toLocaleString()}
                placeholder="No max"
                type="number"
                onChange={changeUnits}
                invalid={maxInvalid}
            />
        </div>
        {validationMessage &&
        <div className="text-danger p-2" style={{ whiteSpace: 'pre-wrap' }}>{validationMessage}</div>
        }
    </>);
};

export default Units;
