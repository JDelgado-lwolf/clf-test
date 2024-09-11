import React, { useEffect } from "react";
import { CustomInput } from "@lwt-helix/controls";
import { periodKeys, terms } from '../../constants';
import { Dropdown } from "@lwt-helix/dropdown";
import { getBeginOrEndOptions } from "../../helpers/beginEndMonth";
import {
    getQuarterFormatted,
    longQuarterNumberAndYear,
    monthAndYearFormat
} from "../../../agent-production/helpers/dataFormatters";
import { useCommonStore } from "../../../store/store";

const PeriodComparison = ({ setSelectedPeriodComparison, selectedPeriodComparison,
    agentData, intervalType }) => {
    const handleChange = (event) => {
        setSelectedPeriodComparison(event.target.value);
    };

    const {
        setSelectedBeginValue,
        setSelectedEndValue,
        selectedBeginValue,
        selectedEndValue
    } = useCommonStore(state => ({
        setSelectedBeginValue: state.setSelectedBeginValue,
        setSelectedEndValue: state.setSelectedEndValue,
        selectedBeginValue: state.selectedBeginValue,
        selectedEndValue: state.selectedEndValue
    }));

    const formatter = intervalType === terms.quarter ? getQuarterFormatted : monthAndYearFormat;
    const defaultBeginValue = agentData ? agentData[agentData?.length - 1]?.timePeriodStart : '';
    const defaultEndValue = agentData ? agentData[0]?.timePeriodStart : '';


    useEffect(() => {
        setSelectedBeginValue(defaultBeginValue);
        setSelectedEndValue(defaultEndValue);
    }, [intervalType]);

    const beginOptions = selectedEndValue ? getBeginOrEndOptions(terms.begin, agentData, formatter, setSelectedBeginValue, selectedEndValue) : [];
    const endOptions = selectedBeginValue ? getBeginOrEndOptions(terms.end, agentData, formatter, setSelectedEndValue, selectedBeginValue) : [];

    return selectedBeginValue ? <div className='period-comparison'>
        <CustomInput
            className='d-inline-block mr-4'
            key={1}
            dataLwtId={'begin-end'}
            id={'begin-end'}
            value={periodKeys.beginVsEndMonth}
            type="radio"
            name="period-comparison"
            label={terms.beginVsEndMonthLabel}
            checked={selectedPeriodComparison === periodKeys.beginVsEndMonth}
            onChange={handleChange}
        />
        <CustomInput
            className='d-inline-block mr-5'
            key={2}
            dataLwtId={'whole-time-period'}
            id={'whole-time-period'}
            value={periodKeys.wholeTimePeriod}
            type="radio"
            name="period-comparison"
            label={terms.wholeTimePeriodLabel}
            checked={selectedPeriodComparison === periodKeys.wholeTimePeriod}
            onChange={handleChange}
        />

        <Dropdown
            className='d-inline-block mr-3'
            dataLwtId='periodComparisonBeginOptions'
            toggleProps={{
                dataLwtId: 'no-split-toggle',
                id: 'caret',
                caret: true,
                children: terms.beginPeriod(formatter(selectedBeginValue, longQuarterNumberAndYear))
            }}
            items={beginOptions}
            menuProps={{
                dataLwtId: 'share-menu',
                right: true,
                className: 'periodComparisonDropdown'
            }}
            size='sm'
        />

        <Dropdown
            className='d-inline-block'
            dataLwtId='periodComparisonEndOptions'
            toggleProps={{
                dataLwtId: 'no-split-toggle',
                id: 'caret',
                caret: true,
                children: terms.endPeriod(formatter(selectedEndValue, longQuarterNumberAndYear))
            }}
            items={endOptions}
            menuProps={{
                dataLwtId: 'share-menu',
                right: true,
                className: 'periodComparisonDropdown'
            }}
            size='sm'
        />
    </div> : null;
};

export default PeriodComparison;
