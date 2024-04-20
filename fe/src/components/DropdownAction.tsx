import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../../@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../@/components/ui/dropdown-menu';
import { showToast } from '../helper/toastHelper';
import {
    TaskResponse,
    deleteTask,
    toErrorWithData,
    updateTask,
} from '../network/api';
import { useStore } from '../store/store';

type Props = {
    ref?: any;
    data: TaskResponse;
};

export const DropdownAction: React.FC<Props> = ({ data }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const setLoading = useStore((state) => state.setLoading);
    const setLoaded = useStore((state) => state.setLoaded);

    const location = useLocation();
    const navigete = useNavigate();

    const handleSetAsCompleted = async (e: React.FormEvent) => {
        let toastId = 'handleSetAsCompleted';

        // Call the API
        try {
            const payload = { ...data };
            payload.due_date =
                payload.due_date != ''
                    ? payload.due_date.replace('T', ' ')
                    : '';
            payload.status = 'completed';
            setLoading();

            await updateTask(payload);

            showToast(
                toastId,
                'info',
                'Success set task to completed',
            );
            navigete(location.pathname, {
                state: window.performance.now(),
            });
        } catch (error) {
            let errorData = toErrorWithData(error);

            showToast(toastId, 'error', errorData.message);
        } finally {
            setLoaded();
        }
    };

    return (
        <>
            <AlertDeleteDialog
                open={openDialog}
                setOpen={setOpenDialog}
                id={data.id}
            />
            <DropdownMenu>
                <DropdownMenuTrigger className=" px-2 focus:border-none hover:border-none border-none">
                    &#8942;
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" w-40 bg-white z-50">
                    <DropdownMenuLabel className="text-base">
                        Action
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="h-[0.5px] bg-black z-50" />
                    {data.status !== 'completed' && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleSetAsCompleted}
                        >
                            Set As Completed
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                        className="cursor-pointer z-50"
                        onClick={() =>
                            navigete(`/edittask/${data.id}`)
                        }
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 z-50"
                        onClick={() => setOpenDialog(!openDialog)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

type AlertProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number;
};

const AlertDeleteDialog: React.FC<AlertProps> = (props) => {
    const setLoading = useStore((state) => state.setLoading);
    const setLoaded = useStore((state) => state.setLoaded);

    const navigete = useNavigate();

    const handleDelete = async (e: React.FormEvent) => {
        let toastId = 'handleDelete';

        // Call the API
        try {
            setLoading();

            await deleteTask(props.id);

            showToast(toastId, 'info', 'Success delete task');
            navigete('/', {
                state: window.performance.now(),
            });
        } catch (error) {
            let errorData = toErrorWithData(error);

            showToast(toastId, 'error', errorData.message);
        } finally {
            setLoaded();
            props.setOpen(!props.open);
        }
    };

    return (
        <AlertDialog {...props}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will
                        permanently delete task and sub tasks
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => props.setOpen(!open)}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600  hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
