import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import handleFormError from '../helper/error';
import { showToast } from '../helper/toastHelper';
import {
    LoginUserRequest,
    loginUser,
    toErrorWithData,
} from '../network/api';
import { useStore } from '../store/store';

export const Login = () => {
    const formRef = useRef<LoginUserRequest>({
        email: '',
        password: '',
    });

    const [formError, setFormError] = useState<LoginUserRequest>({
        email: '',
        password: '',
    });

    const setLoading = useStore((state) => state.setLoading);
    const setLoaded = useStore((state) => state.setLoaded);
    const setToken = useStore((state) => state.setToken);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let toastId = 'login';

        // Call the API
        try {
            setLoading();

            let response = await loginUser(formRef.current);
            showToast(toastId, 'info', 'User login successfully');
            console.log('response', response);
            setToken(response.data.access_token);
            navigate('/');
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
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-md px-8 py-12 max-w-[30rem] min-w-[20rem] md:min-w-[25rem] ">
                <h1 className="text-2xl font-bold text-center mb-8">
                    Login
                </h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="youremail@example.com"
                            onChange={(e) => {
                                formRef.current.email =
                                    e.target.value;
                                if (formError.email) {
                                    setFormError({
                                        ...formError,
                                        email: '',
                                    });
                                }
                            }}
                        />
                        <p className="text-red-500 text-xs italic">
                            {formError.email}
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="Password"
                            onChange={(e) => {
                                formRef.current.password =
                                    e.target.value;
                                if (formError.password) {
                                    setFormError({
                                        ...formError,
                                        password: '',
                                    });
                                }
                            }}
                        />
                        <p className="text-red-500 text-xs italic">
                            {formError.password}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <a
                            href="#"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                    <div className="flex items-center justify-between">
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <span>
                                <Link
                                    to="/register"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {' '}
                                    Sign Up
                                </Link>
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
