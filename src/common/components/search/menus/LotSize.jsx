import React, { useState, useEffect } from 'react';
import { Input, CustomInput } from '@lwt-helix/controls';
import { circle_info } from '@lwt-helix/helix-icon/outlined';
import { HelixIcon } from '@lwt-helix/helix-icon';
import Tooltip from '@lwt-helix/tooltip';
import { agentProductionTerms, searchTerms } from '../../../../constants';
import { roundIfNumber } from '../../../../agent-production/helpers/dataFormatters';

const LotSize = props => {

    const {
        initialLotSize,
        isPopoverOpen,
        setLotSize,
        validationProps,
        isMlsSupportsLotSizeAcres,
        isMlsSupportsLotSizeSqft
    } = props;

    const { validationMessage, minInvalid, maxInvalid } = { ...validationProps };
    const measureTypes = Object.freeze({ squareFeet: 'squareFeet', acres: 'acres' });

    const initialState = {
        selectedLotSize: initialLotSize
    };
    const [state, setState] = useState(initialState);

    useEffect(() => {
        state.selectedLotSize && state.selectedLotSize !== initialLotSize && setLotSize(state.selectedLotSize);
    }, [state.selectedLotSize]);

    const changeLotSize = (e) => {
        const input = e.target.value.replace(/\,/g, '');
        const isRadioType = e.target.type === 'radio';
        const size = roundIfNumber(input);
        const defaultMeasureType = isMlsSupportsLotSizeAcres ? measureTypes.acres : measureTypes.squareFeet;
        setState(prevState => ({
            ...prevState,
            selectedLotSize: {
                ...state.selectedLotSize,
                [e.target.name]: size === 0 ? undefined : size,
                measureType: isRadioType ? e.target.id : state.selectedLotSize?.measureType || defaultMeasureType
            }
        }));
    };

    const getIconTooltip = (measureType) => {
        if (!measureType) return <></>
        return <>
            <div id={measureType + '-icon'} className='d-flex align-items-center'>
                <HelixIcon icon={circle_info} />
            </div>
            <Tooltip target={measureType + '-icon'} itemRef={measureType + '-icon'}>
                {searchTerms.mlsNotSupportMeasureType(searchTerms[measureType])}
            </Tooltip>
        </>
    };

    return (<>
        <div className="d-flex">
            <Input
                dataLwtId="sold-price-min"
                className="d-inline-block"
                name="min"
                value={state.selectedLotSize?.min?.toLocaleString()}
                placeholder={searchTerms.noMin}
                type="number"
                onChange={changeLotSize}
                invalid={minInvalid}
                autoFocus={true}
            />
            <span className="m-2">-</span>
            <Input
                dataLwtId="sold-price-max"
                className="d-inline-block"
                name="max"
                value={state.selectedLotSize?.max?.toLocaleString()}
                placeholder={searchTerms.noMax}
                type="number"
                onChange={changeLotSize}
                invalid={maxInvalid}
            />
        </div>

        <>
            <div className='d-flex align-items-center mt-3'>
                <CustomInput
                    dataLwtId='radio-lot-size-acres'
                    type="radio"
                    id={measureTypes.acres}
                    label={agentProductionTerms.acres}
                    name="measureType"
                    className='mr-2'
                    defaultChecked={initialLotSize?.measureType === measureTypes.acres || isMlsSupportsLotSizeAcres}
                    disabled={!isMlsSupportsLotSizeAcres}
                    onClick={changeLotSize} />
                {isMlsSupportsLotSizeAcres === false && isPopoverOpen && getIconTooltip(measureTypes.acres)}
            </div>

            <div className='d-flex align-items-center'>
                <CustomInput
                    dataLwtId='radio-lot-size-square-feet'
                    type="radio"
                    id={measureTypes.squareFeet}
                    label={agentProductionTerms.squareFeet}
                    defaultChecked={initialLotSize?.measureType === measureTypes.squareFeet ||
                        (isMlsSupportsLotSizeSqft && !isMlsSupportsLotSizeAcres)}
                    name="measureType"
                    className='mr-2'
                    disabled={!isMlsSupportsLotSizeSqft}
                    onClick={changeLotSize} />
                {isMlsSupportsLotSizeSqft === false && isPopoverOpen && getIconTooltip(measureTypes.squareFeet)}
            </div>
        </>

        {validationMessage &&
        <div className="text-danger p-2" style={{ whiteSpace: 'pre-wrap' }}>{validationMessage}</div>
        }
    </>);
};

export default LotSize;
