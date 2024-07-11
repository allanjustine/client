import {createBrowserRouter} from 'react-router-dom';
import Login from './Request/Login.jsx';
import Forgot from './Request/Forgot.jsx';
import DefaultLayout from './Components/DefaultLayout.jsx';
import GuestLayout from './Components/GuestLayout.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import Unit from './Dashboard/Setup/Unit.jsx';

const router = createBrowserRouter ([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/unit',
                element: <Unit />
            },
        ]
    },

    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/',
                element: <Login />,
            },
            {
                path: '/signup',
                element:  <Signup />,
            },
            {
                path: '/forgot',
                element:  <Forgot />,
            }
        ]
    },
]);

export default router;