import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskResponse } from '../network/api';
import { DropdownAction } from './DropdownAction';

type TaskCardProps = {
    data: TaskResponse;
    isDetail?: boolean;
};

const TaskCard: React.FC<TaskCardProps> = ({
    data: {
        id,
        name,
        status,
        due_date,
        description,
        subtasks = [],
        completed_at,
    },
    isDetail = false,
}) => {
    const refElementDot = useRef(null);
    const getColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'ongoing':
                return 'bg-yellow-500';
            case 'canceled':
                return 'bg-black';
            case 'overdue':
                return 'bg-red-500';
            case 'completed late':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    const [totalTaskCompleted, setTotalTaskCompleted] = useState(0);

    useEffect(() => {
        setTotalTaskCompleted(
            subtasks.filter((task) => task.status === 'completed')
                .length,
        );
    }, [subtasks]);

    const [isLate, setIsLate] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(status);

    useEffect(() => {
        setCurrentStatus(status);
    }, [status]);

    useEffect(() => {
        if (
            new Date(due_date) < new Date() &&
            status !== 'completed'
        ) {
            setIsLate(true);
            setCurrentStatus('overdue');
        }

        if (
            status === 'completed' &&
            completed_at &&
            new Date(completed_at) > new Date(due_date)
        ) {
            setCurrentStatus('completed late');
        }
    }, [due_date, currentStatus]);

    const getWidthProgressBar = (
        totalTaskCompleted: number,
        subLenght: number,
    ) => {
        return `${(totalTaskCompleted / subLenght) * 100}%`;
    };

    const navigate = useNavigate();
    let { id: idParam } = useParams();

    return (
        <div key={id} className="flex w-full justify-center  ">
            <div
                className={`z-1 flex flex-col  w-1/2 justify-center bg-white rounded-lg shadow-md p-6 my-2 `}
            >
                <div className="flex justify-between items-center py-4 px-4">
                    <h1
                        className={`text-xl font-bold ${(!idParam || !isDetail) && 'cursor-pointer'}`}
                        onClick={(e) => {
                            let isChild = idParam && !isDetail;

                            navigate(`/detailtask/${id}`, {
                                replace: true,
                                state: { isChild },
                            });
                        }}
                    >
                        {name}
                    </h1>

                    <div className="focus:outline-none text-center">
                        <span
                            ref={refElementDot}
                            className="h-5 w-5 font-bold  text-2xl text-gray-400 hover:text-black"
                        >
                            <DropdownAction
                                data={
                                    {
                                        id,
                                        name,
                                        status,
                                        due_date,
                                        description,
                                        subtasks,
                                    } as TaskResponse
                                }
                            />
                        </span>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div
                        className={`px-4 ${isLate && 'text-red-500'}`}
                    >
                        <i className="fa fa-clock-o pr-2"></i>
                        {due_date.substring(0, due_date.length - 3)}
                    </div>
                    <div className="py-2 px-4 w-full flex justify-between">
                        <div className="w-[20%] text-center">
                            <p
                                className={`${getColor(currentStatus)} p-1 text-white rounded-lg shadow-md`}
                            >
                                {currentStatus}
                            </p>
                        </div>
                        {subtasks.length > 0 && (
                            <div className="flex flex-col  w-[30%]">
                                <div>
                                    <p className="text-sm">
                                        {totalTaskCompleted} of{' '}
                                        {subtasks.length} completed
                                    </p>
                                </div>
                                <div className=" bg-gray-200 rounded-full h-2.5 w-full">
                                    <div
                                        className={`bg-green-600 h-2.5 rounded-full`}
                                        style={{
                                            width: getWidthProgressBar(
                                                totalTaskCompleted,
                                                subtasks.length,
                                            ),
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div
                        className={`py-4 px-4 ${!isDetail && 'truncate'}  `}
                    >
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
