import React from 'react';
import { createPortal } from 'react-dom';
import { ToastContainer } from '@lwt-helix/toast';

const ToastContainerPortal = ({ toastProps }) => {
    if(!toastProps) return null;
    return createPortal(
        <ToastContainer
            position="toast-bottom-right"
            dataLwtId="save-office-list-toasts"
            toastProps={toastProps}
        />,
        document.body
    );
};

export default ToastContainerPortal;
