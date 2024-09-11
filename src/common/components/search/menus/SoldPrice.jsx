import React, { useState, useEffect } from 'react';
import { Input } from '@lwt-helix/controls';

const SoldPrice = props => {
    const {
        initialPrice,
        setPrice,
        validationProps
    } = props;
    const { validationMessage, minInvalid, maxInvalid } = { ...validationProps };
    const initialState = {
        selectedPrice: initialPrice
    };
    const [state, setState] = useState(initialState);

    const changePrice = (e) => {
        const input = e.target.value.replace(/\,/g, '');
        const price = !isNaN(parseInt(input)) ? Math.round(input) : input;
        setState(prevState => ({
            ...prevState,
            selectedPrice: {
                ...state.selectedPrice,
                [e.target.name]: price === 0 ? undefined : price
            }
        }));
    };

    useEffect(() => {
        state.selectedPrice && state.selectedPrice !== initialPrice && setPrice(state.selectedPrice);
    }, [state.selectedPrice]);

    return (<>
        <div className="d-flex">
            <Input
                dataLwtId="sold-price-min"
                className="d-inline-block"
                name="min"
                value={state.selectedPrice?.min?.toLocaleString()}
                placeholder="No min"
                type="number"
                onChange={changePrice}
                invalid={minInvalid}
                autoFocus={true}
            />
            <span className="m-2">-</span>
            <Input
                dataLwtId="sold-price-max"
                className="d-inline-block"
                name="max"
                value={state.selectedPrice?.max?.toLocaleString()}
                placeholder="No max"
                type="number"
                onChange={changePrice}
                invalid={maxInvalid}
            />
        </div>
        {validationMessage &&
        <div className="text-danger p-2" style={{ whiteSpace: 'pre-wrap' }}>{validationMessage}</div>
        }
    </>);
};

export default SoldPrice;
