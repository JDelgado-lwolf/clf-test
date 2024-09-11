import React, { useEffect, useRef } from 'react';
import { CustomInput } from '@lwt-helix/controls';

const MLSSearchSelection = props => {
    const { mls, handleChange, isSelected } = props;
    const ref = useRef();

    useEffect(() => {
        if (isSelected) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    }, [isSelected]);

    return <CustomInput dataLwtId={`mls-select-${mls.mlsId}`}
                        id={`mls-select-${mls.mlsId}`}
                        value={mls.mlsId}
                        type="radio"
                        name="mls-radio"
                        label={`${mls.shortDescription} (${mls.longDescription})`}
                        checked={isSelected}
                        onChange={handleChange}
                        innerRef={ref}
    />;
};

export default MLSSearchSelection;
