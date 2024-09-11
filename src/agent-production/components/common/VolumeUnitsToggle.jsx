import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@lwt-helix/buttons';
import { chartModes } from '../../helpers/agentDataCalculators';
import { getElementTooltip } from '../../helpers/uiHelpers';
import { agentProfileButtons } from '../../constants/agentProductionConstants';

const VolumeUnitsToggle = ({ defaultMode, parentSetMode, className }) => {

    const [mode, setMode] = useState(defaultMode);

    const handleModeClick = modeToSet => {
        setMode(modeToSet);
        parentSetMode(modeToSet);
    };

    useEffect(() => {
        handleModeClick(defaultMode);
    }, [defaultMode]);

    return <>

        <ButtonGroup dataLwtId={'button-group-volume-units'} className={className + ' xbm-toggles'}>
            <Button
                dataLwtId={'btn-volume'}
                size="sm"
                className={mode === chartModes.VOLUME && 'btn-primary'}
                onClick={() => handleModeClick(chartModes.VOLUME)}>
                {getElementTooltip(agentProfileButtons.volumeBtn)}
            </Button>
            <Button
                dataLwtId={'btn-units'}
                size="sm"
                className={mode === chartModes.UNITS && 'btn-primary'}
                onClick={() => handleModeClick(chartModes.UNITS)}>
                {getElementTooltip(agentProfileButtons.unitsBtn)}
            </Button>
        </ButtonGroup>
    </>;
};

export default VolumeUnitsToggle;
