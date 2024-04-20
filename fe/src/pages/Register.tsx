import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import handleFormError from '../helper/error';
import { showToast } from '../helper/toastHelper';
import {
    RegisterUserRequest,
    registerUser,
    toErrorWithData,
} from '../network/api';
import { useStore } from '../store/store';

export const Register = () => {
    const formRef = useRef<RegisterUserRequest>({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const [formError, setFormError] = useState<RegisterUserRequest>({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });

    const setLoading = useStore((state) => state.setLoading);
    const setLoaded = useStore((state) => state.setLoaded);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let toastId = 'register';

        if (
            formRef.current.password !==
            formRef.current.passwordConfirm
        ) {
            setFormError({
                ...formError,
                passwordConfirm: 'password do not match',
            });
            return;
        }

        // Call the API
        try {
            setLoading();

            await registerUser(formRef.current);
            showToast(
                toastId,
                'info',
                'User registered successfully',
            );
            navigate('/login');
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
                    Sign Up
                </h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="your name"
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
                    <div className="flex flex-col">
                        <label
                            htmlFor="password-confirm"
                            className="text-sm font-medium text-gray-700 mb-2"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="password-confirm"
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:ring-opacity-50 text-gray-700"
                            placeholder="Password"
                            onChange={(e) => {
                                formRef.current.passwordConfirm =
                                    e.target.value;
                                if (formError.passwordConfirm) {
                                    setFormError({
                                        ...formError,
                                        passwordConfirm: '',
                                    });
                                }
                            }}
                        />
                        <p className="text-red-500 text-xs italic">
                            {formError.passwordConfirm}
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign Up
                    </button>
                    <div className="flex items-center justify-between">
                        <p className="text-sm">
                            Already have an account?{' '}
                            <span>
                                <Link
                                    to="/login"
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {' '}
                                    Login
                                </Link>
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
