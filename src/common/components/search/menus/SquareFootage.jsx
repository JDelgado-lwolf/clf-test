import React, { useState, useEffect } from 'react';
import { Input } from '@lwt-helix/controls';
import { roundIfNumber } from '../../../../agent-production/helpers/dataFormatters';

const SquareFootage = props => {
    const {
        initialSquareFootage,
        setSquareFootage,
        validationProps
    } = props;
    const { validationMessage, minInvalid, maxInvalid } = { ...validationProps };
    const initialState = {
        selectedSquareFootage: initialSquareFootage
    };
    const [state, setState] = useState(initialState);

    const changeSquareFootage = (e) => {
        const input = e.target.value.replace(/\,/g, '');
        const squareFoot = roundIfNumber(input);
        setState(prevState => ({
            ...prevState,
            selectedSquareFootage: {
                ...state.selectedSquareFootage,
                [e.target.name]: squareFoot === 0 ? undefined : squareFoot
            }
        }));
    };

    useEffect(() => {
        state.selectedSquareFootage && state.selectedSquareFootage !== initialSquareFootage &&
            setSquareFootage(state.selectedSquareFootage);
    }, [state.selectedSquareFootage]);

    return (<>
        <div className="d-flex">
            <Input
                dataLwtId="square-footage-min"
                className="d-inline-block"
                name="min"
                value={state.selectedSquareFootage?.min?.toLocaleString()}
                placeholder="No min"
                type="number"
                onChange={changeSquareFootage}
                invalid={minInvalid}
                autoFocus={true}
            />
            <span className="m-2">-</span>
            <Input
                dataLwtId="square-footage-max"
                className="d-inline-block"
                name="max"
                value={state.selectedSquareFootage?.max?.toLocaleString()}
                placeholder="No max"
                type="number"
                onChange={changeSquareFootage}
                invalid={maxInvalid}
            />
        </div>
        {validationMessage &&
            <div className="text-danger p-2" style={{ whiteSpace: 'pre-wrap' }}>{validationMessage}</div>
        }
    </>);
};

export default SquareFootage;
