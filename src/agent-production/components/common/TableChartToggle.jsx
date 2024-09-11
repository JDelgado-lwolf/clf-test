import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@lwt-helix/buttons';
import { agentProductionTerms } from '../../../constants';
import { useQuery } from '../../../common/hooks/location';
import { useAgentProfileStore } from '../../../store/store';

export const tableChartModes = Object.freeze({ TABLE: 'table', CHART: 'chart' });

const TableChartToggle = ({ defaultMode, parentSetMode, mlsName }) => {
    const query = useQuery();
    const queryDisplayMode = query.get('displayMode');
    const [mode, setMode] = useState(queryDisplayMode ? queryDisplayMode : defaultMode);
    const { setDisplayMode } = useAgentProfileStore()

    useEffect(() => {
        parentSetMode(mode);
        setDisplayMode(mode)
    }, [mode]);

    const handleModeClick = modeToSet => {
        setMode(modeToSet);
        parentSetMode(modeToSet);
    };

    return <div className="d-flex ml-sm-auto">
        <span className={'helix-body--strong mt-1'}>{mlsName}</span>
        <ButtonGroup dataLwtId={'table-chart-toggle'} className="ml-2 mb-2 xbm-toggles">
            <Button dataLwtId={'table-chart-toggle-table'}
                    className={mode === tableChartModes.TABLE && 'btn-primary'}
                    size="sm"
                    onClick={() => handleModeClick(tableChartModes.TABLE)}>
                {agentProductionTerms.table}
            </Button>
            <Button dataLwtId={'table-chart-toggle-chart'}
                    className={mode === tableChartModes.CHART && 'btn-primary'}
                    size="sm"
                    onClick={() => handleModeClick(tableChartModes.CHART)}>
                {agentProductionTerms.chart}
            </Button>
        </ButtonGroup>
    </div>;
};

export default TableChartToggle;
