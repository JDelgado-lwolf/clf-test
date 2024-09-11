import React from 'react';
import Card from '@lwt-helix/card';
import { getElementTooltip } from '../../helpers/uiHelpers';
import { productionChartTabToolTips } from '../../constants/agentProductionConstants';

export const SummaryCard = props => {

    const { id, value, dataLwtId } = props
    return <>
        <Card
            dataLwtId={`agent-profile-production-card-${dataLwtId}`}
            className="rounded-0 text-center mb-0"
            style={{ minWidth: '10em' }}
            bodyProps={{
                className: "p-2",
                children: <>
                    <p className="mb-2 text-nowrap helix-display-x-small">
                        {value}
                    </p>
                    <div className="helix-body">
                        {getElementTooltip(productionChartTabToolTips[id])}
                    </div>
                </>
            }}
        />
    </>
}
