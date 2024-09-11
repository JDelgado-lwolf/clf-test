import React, { useState, useEffect } from 'react';
import { Input } from '@lwt-helix/controls';
import Select from '@lwt-helix/select';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { search } from '@lwt-helix/helix-icon/outlined';
import { setStateData } from '../../../helpers/state';
import { searchTerms } from '../../../../constants';
import { isCustomDate } from '../../../helpers/timePeriods';

const TimeFrame = props => {
    const { timePeriodOptions, selectedTimeFrame, setTimeFrame, validationProps, togglePopover } = props;
    let { validationMessage, startDateInvalid, endDateInvalid } = { ...validationProps };
    const [state, setState] = useState({
        selectedTimeFrame,
        isPopoverOpen: false,
        showCustomDateFields: false
    });

    const handleChange = e => {
        setState(prevState => ({
            ...prevState,
            showCustomDateFields: isCustomDate(e.value),
            selectedTimeFrame: { type: e.value },
            validationMessage: undefined
        }));
    };

    useEffect(() => {
        setStateData(
            'showCustomDateFields',
            isCustomDate(state.selectedTimeFrame?.type),
            setState
        );
        if (state.selectedTimeFrame && state.selectedTimeFrame !== selectedTimeFrame) {
            if (!isCustomDate(state.selectedTimeFrame.type)) {
                togglePopover(state.selectedTimeFrame);
            } else {
                setTimeFrame(state.selectedTimeFrame);
            }
        }
    }, [state.selectedTimeFrame]);

    const changeDate = (e, dateType) => {
        const nextTimeFrame = { ...state.selectedTimeFrame };
        if (dateType === 'start') {
            nextTimeFrame.startDate = e.currentTarget.value
                ? e.currentTarget.value
                : undefined;
        } else {
            nextTimeFrame.endDate = e.currentTarget.value
                ? e.currentTarget.value
                : undefined;
        }
        setStateData('selectedTimeFrame', nextTimeFrame, setState);
    };

    return (<div style={{ minWidth: '200px' }}>
        <Select dataLwtId='time-frame-select'
                className='mb-2 w-100'
                type='select'
                value={state.selectedTimeFrame?.type && timePeriodOptions.find(tp => tp.value === state.selectedTimeFrame.type)}
                onChange={e => handleChange(e)}
                placeholder={
                    <>
                        <HelixIcon icon={search} className='align-top mr-1'
                                   title='search icon' />{`Select a ${searchTerms.timeFrame}`}
                    </>
                }
                options={timePeriodOptions}
                matchFrom='start'
                autoFocus={true}
                isClearable={false}
        />

        {state.showCustomDateFields &&
        <div className='d-flex'>
            <Input
                dataLwtId='start-date'
                className='d-inline-block'
                defaultValue={state.selectedTimeFrame.startDate}
                type='date'
                onChange={e => changeDate(e, 'start')}
                invalid={startDateInvalid}
            />
            <span className='m-2'>-</span>
            <Input
                dataLwtId='end-date'
                className='d-inline-block'
                defaultValue={state.selectedTimeFrame.endDate}
                type='date'
                onChange={e => changeDate(e, 'end')}
                invalid={endDateInvalid}
            />
        </div>
        }
        {validationMessage &&
        <div className='text-danger p-2' style={{ whiteSpace: 'pre-wrap' }}>{validationMessage}</div>
        }
    </div>);
};

export default TimeFrame;
