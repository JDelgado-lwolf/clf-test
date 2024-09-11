import React, { useEffect, useState } from 'react';
import { shallow } from 'zustand/shallow';
import Popover from '@lwt-helix/popover';
import { Button } from '@lwt-helix/buttons';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { clock } from '@lwt-helix/helix-icon/outlined';
import { chipIconProps } from '../../../helpers/chips';
import TimeFrame from '../menus/TimeFrame';
import { searchTerms } from '../../../../constants';
import { setStateData } from '../../../helpers/state';
import { popoverModifiers, toggleRunSearchButton } from '../../../helpers/search';
import { validateTimeFrame } from '../../../helpers/date';
import { getTimePeriodsByModule } from '../../../helpers/timePeriods';
import { useCommonStore, useSearchStore } from '../../../../store/store';
import { useCloseChip } from './hooks/closeChip';

const TimeFrameChip = props => {
    const { disabled, module, selectedMls } = props;

    const {
        search,
        title,
        setTimePeriod
    } = useSearchStore(state => ({
        search: state[module]?.search,
        title: state[module]?.timeFrameTitle,
        setTimePeriod: state.setTimePeriod
    }), shallow);


    const { membership, timeIntervals } = useCommonStore(state => ({
        membership: state.membership,
        timeIntervals: state.timeIntervals
    }), shallow);

    const initialState = {
        isPopoverOpen: false,
        selectedTimeFrame: undefined,
        title: { mainTitle: searchTerms.selectType(searchTerms.timeFrame) }
    };
    const [state, setState] = useState({
        ...initialState,
        mlsMembershipList: []
    });

    useCloseChip(state.isPopoverOpen, setState);

    useEffect(() => {
        if (selectedMls) {
            const selectedTimePeriod = search.searchCriteria.criteria.timePeriod;
            if (selectedTimePeriod) {
                const selectedTimeFrame = {
                    type: selectedTimePeriod.intervalType,
                    startDate: selectedTimePeriod.startDate,
                    endDate: selectedTimePeriod.endDate
                };
                setStateData('selectedTimeFrame', selectedTimeFrame, setState);
            } else {
                setState(prevState => ({ ...initialState, mlsMembershipList: prevState.mlsMembershipList }));
            }
        }
    }, [search]);

    useEffect(() => {
        toggleRunSearchButton(state.isPopoverOpen);
    }, [state.isPopoverOpen]);

    const togglePopover = selectedTimeFrame => {
        const timeFrame = selectedTimeFrame || state.selectedTimeFrame;
        const hasTimeFrameTypeChanged = selectedTimeFrame && selectedTimeFrame?.type !== state.selectedTimeFrame?.type;

        if (state.isPopoverOpen) {
            if (hasTimeFrameTypeChanged || state.customDateChanged) {
                const nextState = { ...state };
                const validationProps = validateTimeFrame(timeFrame);
                if (validationProps.isValid) {
                    setTimePeriod(timeFrame.type, timeFrame.startDate, timeFrame.endDate, timeIntervals);
                    nextState.validationProps = undefined;
                    nextState.isPopoverOpen = false;
                } else {
                    nextState.validationProps = validationProps;
                }
                setState(nextState);
            } else {
                setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
            }
        } else {
            setStateData('isPopoverOpen', !state.isPopoverOpen, setState);
        }
    };

    const saveTimeFrame = timeFrame => {
        setStateData('selectedTimeFrame', timeFrame, setState);
        setStateData('customDateChanged', true, setState);
    };

    const timePeriodOptions = getTimePeriodsByModule({
            module,
            selectedMlsId: selectedMls?.mlsId,
            mlsMembershipList: membership
        }
    );

    return (<>
        <Button
            id='timeframe-chip'
            dataLwtId='timeframe-chip'
            size='sm'
            color='secondary'
            className='mb-1 text-capitalize'
            onClick={() => togglePopover()}
            disabled={disabled}
        >
            <HelixIcon icon={clock} {...chipIconProps} title='time icon' />
            {title?.mainTitle}
            {title?.subtitle && `: ${title.subtitle}`}
        </Button>

        <Popover
            innerClassName='helix-heading'
            style={{ minWidth: '250px' }}
            target='timeframe-chip'
            placement='bottom'
            size='auto'
            trigger='legacy'
            header={searchTerms.timeFrame}
            isOpen={state.isPopoverOpen}
            toggle={() => togglePopover()}
            body={
                <TimeFrame
                    initialTimeFrame={state.selectedTimeFrame}
                    setTimeFrame={saveTimeFrame}
                    module={module}
                    togglePopover={timeFrame => togglePopover(timeFrame)}
                    validationProps={state.validationProps}
                    selectedTimeFrame={state.selectedTimeFrame}
                    timePeriodOptions={timePeriodOptions}
                />
            }
            disabled={disabled}
            {...popoverModifiers}
        />
    </>);
};

export default TimeFrameChip;
