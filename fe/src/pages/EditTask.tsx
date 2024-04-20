import { useEffect, useState } from 'react';
import {
    Link,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import handleFormError from '../helper/error';
import { showToast } from '../helper/toastHelper';
import {
    TaskResponse,
    UpdateTaskRequest,
    getDetailTask,
    toErrorWithData,
    updateTask,
} from '../network/api';
import { useStore } from '../store/store';

export const EditTask = () => {
    const setLoading = useStore((state) => state.setLoading);
    const setLoaded = useStore((state) => state.setLoaded);
    let { state } = useLocation();
    let { id } = useParams();

    const [task, setTask] = useState<TaskResponse>({
        id: 0,
        name: '',
        description: '',
        due_date: '',
        created_at: '',
        updated_at: '',
        status: '',
        user_id: 0,
    });

    useEffect(() => {
        const fetchTask = async () => {
            let toastId = 'detailTask';
            try {
                setLoading();
                const response = await getDetailTask(id || '');
                setTask(response.data);
            } catch (error) {
                let errorData = toErrorWithData(error);
                showToast(toastId, 'error', errorData.message);
            } finally {
                setLoaded();
            }
        };

        fetchTask();
    }, [id]);

    const [formError, setFormError] = useState<UpdateTaskRequest>({
        id: 0,
        name: '',
        description: '',
        due_date: '',
        status: '',
    });

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let toastId = 'EditTask';

        // Call the API
        try {
            const payload = { ...task };
            payload.due_date =
                payload.due_date != ''
                    ? payload.due_date.replace('T', ' ')
                    : '';
            // check due_date if already have time only HH:mm and add :00
            if (payload.due_date.length == 16) {
                payload.due_date += ':00';
            }

            setLoading();

            await updateTask(payload);

            navigate(`/detailtask/${id}`);
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

            showToast(toastId, 'error', errorData.message);
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
                        Edit Task
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
                            value={task.name}
                            type="text"
                            id="name"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="Working..."
                            onChange={(e) => {
                                setTask({
                                    ...task,
                                    name: e.target.value,
                                });
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
                            value={task.description}
                            type="text"
                            id="description"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="description of task"
                            onChange={(e) => {
                                setTask({
                                    ...task,
                                    description: e.target.value,
                                });
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
                            value={task.due_date}
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
                                setTask({
                                    ...task,
                                    due_date: e.target.value,
                                });
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
                    <div className="flex flex-col">
                        <label
                            htmlFor="status"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Status
                        </label>
                        <select
                            value={task.status}
                            id="status"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            onChange={(e) => {
                                setTask({
                                    ...task,
                                    status: e.target.value,
                                });
                                if (formError.status) {
                                    setFormError({
                                        ...formError,
                                        status: '',
                                    });
                                }
                            }}
                        >
                            <option value="ongoing">ongoing</option>
                            <option value="completed">
                                completed
                            </option>
                        </select>
                        <p className="text-red-500 text-xs italic">
                            {formError.status}
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};
