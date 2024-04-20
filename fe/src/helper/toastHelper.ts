import { toast } from 'react-toastify';

export const showToast = (
    id: string,
    type: string,
    message: string,
) => {
    if (!toast.isActive(id)) {
        if (type === 'info') {
            toast(message, {
                position: 'top-center',
                toastId: id,
            });
            return;
        }
        if (type === 'error') {
            toast.error(message, {
                position: 'top-center',
                toastId: id,
            });
            return;
        }
    }
};
