import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutThunk } from '../../store/auth/authThunks';
import { UserStatusEnum } from '../../types/authSchema';

export default function NavigationBar(): JSX.Element {
  const user = useAppSelector((store) => store.auth.user);
  const dispatch = useAppDispatch();

  return (
    <AppBar position="static">
      <Toolbar>
        {user.status === UserStatusEnum.logged ? (
          <>
            <Button
              color="inherit"
              component={Link}
              onClick={(e) => {
                e.preventDefault();
                void dispatch(logoutThunk());
              }}
              to="/logout"
            >
              Выход
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Вход
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Регистрация
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
