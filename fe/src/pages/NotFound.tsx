import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="bg-white rounded-lg shadow-md px-8 py-12 max-w-[30rem] min-w-[20rem] md:min-w-[25rem] ">
                    <h1 className="text-2xl font-bold text-center mb-8">
                        Not Found
                    </h1>
                    <p className="text-center">
                        The page you are looking for does not exist.
                    </p>
                    <Link
                        to={'/'}
                        className="my-4 w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
};
