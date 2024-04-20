import { ErrorWithData } from '../network/api';
import { showToast } from './toastHelper';

function handleFormError<T>(
    error: ErrorWithData,
    toastId: string,
    formError: T,
    setFormError: (formError: T) => void,
): void {
    let formErrors = { ...formError };
    let errors = error.data.errors;

    if (typeof errors === 'string') {
        showToast(toastId, 'error', errors);
    }

    if (typeof errors === 'object') {
        Object.keys(errors).forEach((key) => {
            formErrors = {
                ...formErrors,
                [key]: errors[key][0],
            };
        });
    }

    setFormError(formErrors);
}

export default handleFormError;
