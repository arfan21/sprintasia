import { useStore } from '../store/store';

export class ErrorWithData extends Error {
    data: any;
    statusCode: number;

    constructor(message: string, data: any, statusCode?: number) {
        super(message);
        this.data = data;
        this.statusCode = statusCode || 0;
    }
}

export const toErrorWithData = (error: unknown) => {
    if (error instanceof ErrorWithData) {
        return error;
    }
    return new ErrorWithData('An error occurred', {});
};

export type BaseResponse<T> = {
    data: T;
    message: string;
    errors?: any;
};

export type RegisterUserRequest = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
};

export const registerUser = async <T>(data: RegisterUserRequest) => {
    return fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
        },
    )
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new ErrorWithData(
                        data.message,
                        data,
                        res.status,
                    );
                });
            }
            return res.json() as Promise<BaseResponse<T>>;
        })
        .catch((error) => {
            // Handle error
            throw error;
        });
};

export type LoginUserRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
};

export const loginUser = async (data: LoginUserRequest) => {
    return fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data),
        },
    )
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new ErrorWithData(
                        data.message,
                        data,
                        res.status,
                    );
                });
            }
            return res.json() as Promise<BaseResponse<LoginResponse>>;
        })
        .catch((error) => {
            // Handle error
            throw error;
        });
};

export type InsertTaskRequest = {
    name: string;
    description: string;
    due_date: string;
    parent_id?: number;
};

export type TaskResponse = {
    name: string;
    description: string;
    due_date: string;
    parent_id?: number;
    user_id: number;
    updated_at: string;
    created_at: string;
    id: number;
    status: string;
    subtasks?: TaskResponse[];
    completed_at?: string;
};

export const insertTask = async (data: InsertTaskRequest) => {
    const token = useStore.getState().token;
    return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new ErrorWithData(
                        data.message,
                        data,
                        res.status,
                    );
                });
            }
            return res.json() as Promise<BaseResponse<TaskResponse>>;
        })
        .catch((error) => {
            // Handle error
            let errorData = toErrorWithData(error);
            if (errorData.statusCode == 401) {
                useStore.getState().setToken('');
            }
            throw error;
        });
};

export const getTasks = async (status?: string) => {
    const token = useStore.getState().token;
    return fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tasks?${
            status ? `status=${status}` : ''
        }`,
        {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    )
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new ErrorWithData(
                        data.message,
                        data,
                        res.status,
                    );
                });
            }
            return res.json() as Promise<
                BaseResponse<TaskResponse[]>
            >;
        })
        .catch((error) => {
            // Handle error
            let errorData = toErrorWithData(error);
            if (errorData.statusCode == 401) {
                useStore.getState().setToken('');
            }
            throw error;
        });
};

export const getDetailTask = async (id: string) => {
    const token = useStore.getState().token;
    return fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${id}`,
        {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    )
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new ErrorWithData(
                        data.message,
                        data,
                        res.status,
                    );
                });
            }
            return res.json() as Promise<BaseResponse<TaskResponse>>;
        })
        .catch((error) => {
            // Handle error
            let errorData = toErrorWithData(error);
            if (errorData.statusCode == 401) {
                useStore.getState().setToken('');
            }
            throw error;
        });
};

export type UpdateTaskRequest = {
    id: number;
    name: string;
    description: string;
    due_date: string;
    status: string;
};

export const updateTask = async (data: UpdateTaskRequest) => {
    const token = useStore.getState().token;
    return fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${data.id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        },
    )
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new ErrorWithData(
                        data.message,
                        data,
                        res.status,
                    );
                });
            }
            return res.json() as Promise<BaseResponse<TaskResponse>>;
        })
        .catch((error) => {
            // Handle error
            let errorData = toErrorWithData(error);
            if (errorData.statusCode == 401) {
                useStore.getState().setToken('');
            }
            throw error;
        });
};

export const deleteTask = async (id: number) => {
    const token = useStore.getState().token;
    return fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${id}`,
        {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    )
        .then((res) => {
            if (!res.ok) {
                return res.json().then((data) => {
                    throw new ErrorWithData(
                        data.message,
                        data,
                        res.status,
                    );
                });
            }
            return res.json() as Promise<BaseResponse<TaskResponse>>;
        })
        .catch((error) => {
            // Handle error
            let errorData = toErrorWithData(error);
            if (errorData.statusCode == 401) {
                useStore.getState().setToken('');
            }
            throw error;
        });
};
