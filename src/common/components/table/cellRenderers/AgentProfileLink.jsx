import React from 'react';
import { Link } from 'react-router-dom';
import { agentProfileRoute } from '../../../../agent-production/constants/agentProductionConstants';
import { useCommonStore } from '../../../../store/store';
import PropTypes from 'prop-types';

export const AgentProfileLink = (props) => {

    const { clearAgentListPopover } = useCommonStore(state => ({
        clearAgentListPopover: state.clearAgentListPopover
    }));

    return (
        <Link
            to={`${agentProfileRoute}?id=${props.data.agentId}`}
            onClick={clearAgentListPopover}
        >
            {props.data.agentName}
        </Link>
    );
};

AgentProfileLink.PropTypes = {
    data: PropTypes.object
};

