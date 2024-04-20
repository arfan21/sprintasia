import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import handleFormError from '../helper/error';
import { showToast } from '../helper/toastHelper';
import {
    InsertTaskRequest,
    insertTask,
    toErrorWithData,
} from '../network/api';
import { useStore } from '../store/store';

export const AddTask = () => {
    let { state } = useLocation();
    const formRef = useRef<InsertTaskRequest>({
        name: '',
        description: '',
        due_date: '',
    });

    const [formError, setFormError] = useState<InsertTaskRequest>({
        name: '',
        description: '',
        due_date: '',
    });

    const setLoading = useStore((state) => state.setLoading);
    const setLoaded = useStore((state) => state.setLoaded);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let toastId = 'addTask';

        // Call the API
        try {
            const payload = { ...formRef.current };
            payload.due_date =
                payload.due_date != ''
                    ? payload.due_date.replace('T', ' ') + ':00'
                    : '';

            if (state?.isChild) {
                payload.parent_id = state?.id;
            }
            setLoading();

            await insertTask(payload);

            if (state?.isChild) {
                navigate('/detailtask/' + state?.id);
            } else {
                navigate('/');
            }
        } catch (error) {
            let errorData = toErrorWithData(error);
            let errors = errorData.data.errors;

            if (errors) {
                handleFormError(
                    errorData,
                    toastId,
                    formError,
                    setFormError,
                );
            }
            showToast(
                toastId,
                'error',
                errorData.data?.errors?.[0] ?? errorData.message,
            );
        } finally {
            setLoaded();
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 ">
            <div className="bg-white rounded-lg shadow-md px-8 pt-6 pb-12 max-w-[30rem] min-w-[20rem] md:min-w-[25rem] ">
                <div className="flex items-center justify-end">
                    <Link
                        to={
                            state?.isChild
                                ? '/detailtask/' + state?.id
                                : '/'
                        }
                        className="text-xl font-bold text-center"
                    >
                        &#10005;
                    </Link>
                </div>
                <div className="flex items-center justify-center w-full">
                    <div className="text-2xl font-bold text-center mb-8 w-full flex justify-center">
                        {state?.isChild ? (
                            <div className=" w-full flex justify-center flex-col items-center">
                                Add Sub Task to
                                <div className="truncate  w-[65%]">
                                    {state?.name}
                                </div>
                            </div>
                        ) : (
                            'Add Task'
                        )}
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Task Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="Working..."
                            onChange={(e) => {
                                formRef.current.name = e.target.value;
                                if (formError.name) {
                                    setFormError({
                                        ...formError,
                                        name: '',
                                    });
                                }
                            }}
                        />
                        <p className="text-red-500 text-xs italic">
                            {formError.name}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="description of task"
                            onChange={(e) => {
                                formRef.current.description =
                                    e.target.value;
                                if (formError.description) {
                                    setFormError({
                                        ...formError,
                                        description: '',
                                    });
                                }
                            }}
                        />
                        <p className="text-red-500 text-xs italic">
                            {formError.description}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Due date
                        </label>
                        <input
                            type="datetime-local"
                            min={new Date()
                                .toISOString()
                                .slice(
                                    0,
                                    new Date()
                                        .toISOString()
                                        .lastIndexOf(':'),
                                )}
                            id="due_date"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="due_date of task"
                            onChange={(e) => {
                                formRef.current.due_date =
                                    e.target.value;
                                if (formError.due_date) {
                                    setFormError({
                                        ...formError,
                                        due_date: '',
                                    });
                                }
                            }}
                        />
                        <p className="text-red-500 text-xs italic">
                            {formError.due_date}
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
};
