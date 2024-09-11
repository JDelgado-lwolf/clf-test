import React, { useState } from 'react';
import { HelixIcon } from '@lwt-helix/helix-icon';
import { pencil } from '@lwt-helix/helix-icon/outlined';
import { useSavedAgentsStore } from '../../../../../store/store';
import PropTypes from 'prop-types';
import { modules } from '../../../../../constants';

const AgentListOption = ({ list, index, handleSelect, handleEdit }) => {

    const { selectedList } = useSavedAgentsStore(state => ({
        selectedList: state.selectedListByModule[modules.proficiencyMetrics.savedAgents],
    }));

    const [shouldShowIcon, setShouldShowIcon] = useState(false);

    const setShowEditIcon = (showIcon) => setShouldShowIcon(showIcon);

    const selectedAgentClass = list?.agentListId === selectedList?.agentListId ? 'option-list-selected' : '';
    const agentListOptionContainerClass = `d-flex justify-content-between align-items-center popover-list-item
        clickable ${selectedAgentClass}`;

    return (
        <div
            key={index}
            className={agentListOptionContainerClass}
            onMouseOver={() => setShowEditIcon(true)}
            onMouseLeave={() => setShowEditIcon(false)}
            onClick={() => handleSelect(list)}
        >
            <p className='m-0 helix-heading text-capitalize text-truncate clickable'>
                {list?.name}
            </p>
            {shouldShowIcon &&
                <HelixIcon
                    icon={pencil}
                    className='clickable'
                    onClick={(e) => handleEdit(e, list)}
                />
            }
        </div>
    );
};

AgentListOption.propTypes = {
    list: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    handleSelect: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired
};

export default AgentListOption;
