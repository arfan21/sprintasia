import { useMemo } from 'react';
import {
    RouterProvider,
    createBrowserRouter,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import GlobalLoader from './components/Loader';
import GuardRoute from './components/router/GuardRoute';
import GuestRoute from './components/router/GuestRoute';
import { AddTask } from './pages/AddTask';
import { DetailTask } from './pages/DetailTask';
import { EditTask } from './pages/EditTask';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Register } from './pages/Register';
import { useStore } from './store/store';

function App() {
    const token = useStore((state) => state.token);
    const setIsAuthenticated = useStore(
        (state) => state.setIsAuthenticated,
    );

    useMemo(() => {
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [token]);

    const router = createBrowserRouter([
        {
            path: '/',
            element: <GuardRoute component={Home} />,
            errorElement: <NotFound />,
        },
        {
            path: '/login',
            element: <GuestRoute component={Login} />,
        },
        {
            path: '/register',
            element: <GuestRoute component={Register} />,
        },
        {
            path: '/addtask',
            element: <GuardRoute component={AddTask} />,
        },
        {
            path: '/detailtask/:id',
            element: <GuardRoute component={DetailTask} />,
        },
        {
            path: '/edittask/:id',
            element: <GuardRoute component={EditTask} />,
        },
    ]);

    return (
        <>
            <GlobalLoader />
            <ToastContainer />
            <RouterProvider router={router} />
        </>
    );
}

export default App;
