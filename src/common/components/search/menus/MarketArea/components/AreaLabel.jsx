import React from 'react';
import PropTypes from 'prop-types';

const AreaLabel = ({ area, key }) => {
    return area && <div key={key}>
        <div className='text-truncate area-label-1'>
            {area.areaKey
                ? `${area.areaKey} (${area.areaValue})`
                : area.areaValue}
        </div>
        <div className='area-label-2'>
            {area.soldCount.toLocaleString()}
        </div>
    </div>;
};

AreaLabel.propTypes = {
    area: PropTypes.object,
    key: PropTypes.string
};

export default AreaLabel;
