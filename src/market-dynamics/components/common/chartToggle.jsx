import React from 'react';
import PropTypes from 'prop-types';
import { marketShareTerms } from '../../../market-share/constants';
import { CustomInput } from '@lwt-helix/controls';

const ChartToggle = props => {
    const { shouldShowChart, setShouldShowChart } = props;

    const toggleShowHideChart = () => setShouldShowChart(!shouldShowChart);

    return <>
        <label className='mr-2 clickable'
               onClick={toggleShowHideChart} >
            {marketShareTerms.chart}
        </label>
        <CustomInput
            dataLwtId='market-share-chart-toggle'
            type='switch'
            checked={shouldShowChart}
            onClick={setShouldShowChart}
            id='chart-toggle' />
    </>;
};

ChartToggle.propTypes = {
    shouldShowChart: PropTypes.bool,
    setShouldShowChart: PropTypes.func
};

export default ChartToggle;
