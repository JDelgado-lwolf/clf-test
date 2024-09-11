import React from 'react';
import { Input } from '@lwt-helix/controls';
import PropTypes from 'prop-types';

const TimePeriodSelector = ({ options, currentValue, setTimePeriod, isDisabled }) => {
	const displayedOptions = [];
	options?.forEach(o => displayedOptions.push(<option value={o.value}>{o.label}</option>));

	return (
		<>
			<Input
				dataLwtId={'time-period-selector'}
				value={currentValue}
				onChange={setTimePeriod}
				type="select"
				bsSize="sm"
				disabled={isDisabled}
			>
				{displayedOptions}
			</Input>
		</>
	);
};

export default TimePeriodSelector;

TimePeriodSelector.propTypes = {
	currentValue: PropTypes.string,
	setTimePeriod: PropTypes.func
};
