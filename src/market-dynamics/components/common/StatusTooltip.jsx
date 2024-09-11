import React from 'react';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { circle_info } from '@lwt-helix/helix-icon/outlined';
import Tooltip from '@lwt-helix/tooltip';

const StatusTooltip = props => {
    const { option } = props;

    return (
        <div className='status-icon'>
            <div id={`${option.id}-icon`}>
                <HelixIcon icon={circle_info} title='info icon' />
            </div>
            <div>
                <Tooltip
                    target={`${option.id}-icon`}
                    placement='top'
                    innerClassName="status-tooltip"
                >
                    <span className="helix-small">{option.tooltip}</span>
                </Tooltip>
            </div>
        </div>
    );
};

export default StatusTooltip;
