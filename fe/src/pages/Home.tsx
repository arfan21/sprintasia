import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DropdownFilter } from '../components/DropdownFilter';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { TaskResponse, getTasks } from '../network/api';
import { useStore } from '../store/store';

export const Home = () => {
    const [tasks, setTasks] = useState<TaskResponse[]>();
    const [tasksCompleted, setTasksCompleted] =
        useState<TaskResponse[]>();
    const setLoading = useStore((state) => state.setLoading);
    const setLoaded = useStore((state) => state.setLoaded);
    const { state } = useLocation();
    const [filter, setfilter] = useState('ongoing');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading();
                const response = await getTasks(filter);
                setTasks(response.data);
            } catch (error) {
                console.log('error', error);
            } finally {
                setLoaded();
            }
        };

        fetchTasks();
    }, [state, filter]);

    return (
        <>
            <div className="flex min-h-screen  flex-col bg-gray-100">
                <Navbar />

                <div className="pt-5 w-full">
                    <div className="flex w-full justify-center">
                        <div className="flex flex-row  w-1/2 justify-between items-center bg-white rounded-lg shadow-md p-6 my-4">
                            <div className="px-4 w-1/2 flex justify-start ">
                                <Link
                                    to={'/addtask'}
                                    type="submit"
                                    className="w-[27%]  flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    + Add Task
                                </Link>
                            </div>
                            <div className="px-4 w-1/2 flex justify-end">
                                <DropdownFilter
                                    filter={filter}
                                    setFilter={setfilter}
                                />
                            </div>
                        </div>
                    </div>
                    {tasks?.length === 0 ? (
                        <div className="flex w-full justify-center">
                            <div className="flex flex-col  w-1/2 justify-center bg-white rounded-lg shadow-md p-6 my-4">
                                <div className="px-4 w-full">
                                    No Task
                                </div>
                            </div>
                        </div>
                    ) : (
                        tasks?.map((task) => (
                            <TaskCard
                                key={task.id}
                                data={task}
                            ></TaskCard>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};
