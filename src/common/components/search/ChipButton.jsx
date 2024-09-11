import React from 'react';
import { PropTypes } from 'prop-types';
import { Button } from '@lwt-helix/buttons';

export default function ChipButton(props) {
    const { id, isDisabled, label, onClick, leftIcon, rightIcon } = props;

    return (
        <Button
            dataLwtId={id}
            size='sm'
            color='secondary'
            className='mb-1 text-capitalize d-inline-flex'
            id={id}
            onClick={onClick}
            disabled={isDisabled}
        >
            {leftIcon}
            {label}
            {rightIcon}
        </Button>
    );
};

ChipButton.propTypes = {
    id: PropTypes.string,
    isDisabled: PropTypes.bool,
    label: PropTypes.string,
    onClick: PropTypes.func,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
};
