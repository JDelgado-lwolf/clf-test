import React from 'react';

const AgentNameBlock = ({ selectedAgent, nameBold }) => {
    return (
        <div className="d-flex">
            <div>
                <h4 className={`mb-0 pb-0 ${nameBold ? 'font-weight-bold' : ''}`}>
                    {selectedAgent?.agentName}
                </h4>
                <p className="mb-0 helix-heading helix-gray-6">{selectedAgent?.officeName}</p>
            </div>
        </div>
    );
};

export default AgentNameBlock;
