import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './Layout';
import NotFound from './pages/NotFound/NotFound';
import LoginForm from './components/LoginForm/LoginForm';
import { useAppDispatch, useAppSelector } from "./store/hook";
import { checkAuthStatus } from "./store/authSlice"

function App(): JSX.Element {

const dispatch = useAppDispatch();
// const isAuthenticated = useAppSelector(state => state.auth.status === 'succeeded');

useEffect(() => {
	void dispatch(checkAuthStatus());
}, [dispatch])

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/login', element: <LoginForm /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
