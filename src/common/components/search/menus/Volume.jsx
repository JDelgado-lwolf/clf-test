import React, { useState, useEffect } from 'react';
import { Input } from '@lwt-helix/controls';
import { setStateData } from '../../../helpers/state';

const Volume = props => {
    const {
        initialVolume,
        setVolume,
        validationProps
    } = props;
    const { validationMessage, minInvalid, maxInvalid } = { ...validationProps };
    const initialState = {
        selectedVolume: initialVolume
    };

    const [state, setState] = useState(initialState);

    const changeVolume = (e) => {
        const input = e.target.value.replace(/\,/g, '');
        const price = !isNaN(parseInt(input)) ? Math.round(input) : input;
        setStateData(
            'selectedVolume',
            {
                ...state.selectedVolume,
                [e.target.name]: price === 0 ? undefined : price
            },
            setState
        );
    };

    useEffect(() => {
        state.selectedVolume && state.selectedVolume !== initialVolume && setVolume(state.selectedVolume);
    }, [state.selectedVolume]);

    return (<>
        <div className="d-flex">
            <Input
                dataLwtId="volume-min"
                className="d-inline-block"
                name="min"
                value={state.selectedVolume?.min?.toLocaleString()}
                placeholder="No min"
                type="number"
                onChange={changeVolume}
                invalid={minInvalid}
                autoFocus={true}
            />
            <span className="m-2">-</span>
            <Input
                dataLwtId="volume-max"
                className="d-inline-block"
                name="max"
                value={state.selectedVolume?.max?.toLocaleString()}
                placeholder="No max"
                type="number"
                onChange={changeVolume}
                invalid={maxInvalid}
            />
        </div>
        {validationMessage &&
        <div className="text-danger p-2" style={{ whiteSpace: 'pre-wrap' }}>{validationMessage}</div>
        }
    </>);
};

export default Volume;
