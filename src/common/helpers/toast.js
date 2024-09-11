import { setStateData } from './state';

export const toastTypes = Object.freeze({
    success: 'success',
    error: 'error'
});

export const showToast = (type, message, setState) => {
    let toastProps;
    switch (type) {
        case toastTypes.success:
            toastProps = {
                id: Math.floor((Math.random() * 100) + 1),
                message: message || 'Success',
                color: 'success',
                icon: 'check_icon',
                border: 'left',
                className: 'search-toast'
            };
            break;
        case toastTypes.error:
            toastProps = {
                id: Math.floor((Math.random() * 100) + 1),
                message: message || 'Error',
                color: 'danger',
                icon: 'error_outline_icon',
                border: 'left',
                className: 'search-toast'
            };
            break;
    }
    setStateData('toastProps', toastProps, setState);
};
