/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-alert */
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { logoutUser } from '../../store/authSlice';
import React from 'react';

function Navbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'succeeded');
  const username = useAppSelector((state) => state.auth.user);

  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logoutUser()).unwrap();
      alert('Logged out successfully');
    } catch (error) {
      alert('Failed to log out');
    }
  };

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {username}</span>
          <Link to="/add-post">Add Post</Link>
          <Link to="/">Card List</Link>
          <button onClick={handleLogout} type="button">
            Log out
          </button>
        </>
      ) : (
        <p>Войдите в систему</p>
      )}
    </nav>
  );
}

export default Navbar;
