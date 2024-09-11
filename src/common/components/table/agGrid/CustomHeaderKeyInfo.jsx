import React from "react";
import Tooltip from "@lwt-helix/tooltip";

const CustomHeaderKeyInfo = ({ headerDetails, isStatus }) => {
    return <div className={isStatus ? '' : 'td-num'}>
        <Tooltip target={headerDetails.id} placement="top" boundariesElement="window">
            <span className='helix-small'>{headerDetails.tip}</span>
        </Tooltip>
        {<span id={headerDetails.id} className={`clickable`}>
            {headerDetails.label}
        </span>}
    </div>;
};

export default CustomHeaderKeyInfo;
