import React from 'react';
import { Button } from '@lwt-helix/buttons';
import { buttonTerms } from '../../../../constants';

const DoneButton = props => {
    return (
        <div className="w-100 py-1 mt-2 text-center border-top">
            <Button dataLwtId="done"
                    color="text"
                    size="sm"
                    className="font-weight-bold text-decoration-none mt-2 w-100 text-primary "
                    onClick={props.onClick}
                    disabled={props.disabled}
            >
                {buttonTerms.done}
            </Button>
        </div>
    );
};

export default DoneButton;
