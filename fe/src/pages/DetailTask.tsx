import { useEffect, useState } from 'react';
import {
    Link,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { showToast } from '../helper/toastHelper';
import {
    TaskResponse,
    getDetailTask,
    toErrorWithData,
} from '../network/api';
import { useStore } from '../store/store';

export const DetailTask = () => {
    const setLoading = useStore((state) => state.setLoading);
    const setLoaded = useStore((state) => state.setLoaded);
    const { state } = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();

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
                showToast(
                    toastId,
                    'error',
                    errorData.data?.errors?.[0] ?? errorData.message,
                );
                navigate('/');
            } finally {
                setLoaded();
            }
        };

        fetchTask();
    }, [id, state]);

    const [isLate, setIsLate] = useState(false);

    useEffect(() => {
        if (
            new Date(task.due_date) < new Date() &&
            task.status !== 'completed'
        ) {
            setIsLate(true);
        }
    }, [task]);

    return (
        <>
            <div className="flex min-h-screen  flex-col bg-gray-100">
                <Navbar />

                <div className="pt-5 w-full">
                    <TaskCard data={task} isDetail></TaskCard>
                    {!task.parent_id && (
                        <>
                            {task.status !== 'completed' &&
                                !isLate && (
                                    <div className="flex w-full justify-center">
                                        <div className="flex flex-col  w-1/2 justify-center bg-white rounded-lg shadow-md p-6 my-4">
                                            <div className="px-4 w-full">
                                                <Link
                                                    state={{
                                                        isChild: true,
                                                        id: task.id,
                                                        name: task.name,
                                                    }}
                                                    to={'/addtask'}
                                                    type="submit"
                                                    className="w-[30%]  flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    + Add Sub Task
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {task.subtasks &&
                                task.subtasks.length > 0 && (
                                    <>
                                        <div className="flex w-full justify-center">
                                            <div className="w-1/2">
                                                <h1 className="text-xl font-bold">
                                                    Sub Tasks
                                                </h1>
                                            </div>
                                        </div>
                                        {task.subtasks?.map(
                                            (task) => (
                                                <TaskCard
                                                    key={task.id}
                                                    data={task}
                                                ></TaskCard>
                                            ),
                                        )}
                                    </>
                                )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
