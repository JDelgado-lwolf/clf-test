import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from '@lwt-helix/icon';
import { Button } from '@lwt-helix/buttons';
import { ToastContainer } from '@lwt-helix/toast';

const FavoriteButton = (props) => {
    const { className, checked, cssModule, ...attributes } = props;

    const [checkedState, setCheckedState] = useState(props.checked);

    const [toast, setToast] = useState({});
    let toastProperties = null;
    const showToast = (type) => {
        const id = Math.floor(Math.random() * 100 + 1);

        switch (type) {
            case 'favorite':
                toastProperties = {
                    id,
                    message: 'Agent Followed!',
                    color: 'secondary',
                    icon: 'check_icon',
                    border: 'none'
                };
                break;
            case 'pdf':
                toastProperties = {
                    id,
                    message: 'Report Downloaded!',
                    color: 'secondary',
                    icon: 'check_icon',
                    border: 'none'
                };
                break;
            case 'copy':
                toastProperties = {
                    id,
                    message: 'Link Copied!',
                    color: 'secondary',
                    icon: 'check_icon',
                    border: 'none'
                };
                break;
        }
        setToast(toastProperties);
    };

    return (
        <>
            <Button
                {...attributes}
                className={`p-1 d-flex align-self-stretch align-items-center ${className} ${
                    checkedState === true ? 'text-warning' : 'text-secondary'
                }`}
                color="light"
                size="lg"
                onClick={() => {
                    showToast('favorite');
                    setCheckedState(!checkedState);
                }}
            >
                <Icon
                    dataLwtId="icon"
                    iconName={checkedState === true ? 'star' : 'star_outline'}
                />
            </Button>
            <ToastContainer
                dataLwtId="toast"
                toastProps={toast}
                position={'toast-bottom-right'}
            />
        </>
    );
};

FavoriteButton.propTypes = {
    checked: PropTypes.oneOf([true, false]),
    className: PropTypes.string
};

FavoriteButton.defaultProps = {
    checked: false
};

export default FavoriteButton;
