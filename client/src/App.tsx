import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { checkAuthThunk } from './store/auth/authThunks';
import { UserStatusEnum } from './types/authSchema';
import UploadFileComp from './components/ui/UploadFileComp';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const status = useAppSelector((store) => store.auth.user.status);

  useEffect(() => {
    void dispatch(checkAuthThunk());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <div>404</div>,
      children: [
        {
          path: '/prices',
          element: status === UserStatusEnum.logged ? <UploadFileComp /> : <Navigate to="/login" />,
        },
        {
          path: '/login',
          element: status !== UserStatusEnum.logged ? <LoginPage /> : <Navigate to="/prices" />,
        },
        {
          path: '*',
          element: <ErrorPage />,
        },
      ],
    },
  ]);

  if (status === UserStatusEnum.pending) return <h1>Loading...</h1>;

  return <RouterProvider router={router} />;
}

export default App;
