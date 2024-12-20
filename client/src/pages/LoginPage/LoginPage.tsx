import React from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
} from "@mui/material";

import { loginThunk } from "../../store/auth/authThunks";
import { useAppDispatch } from "../../store/hooks";

export default function LoginPage(): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" align="center" sx={{ mb: 2 }}>
          Войти в систему
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const username = e.currentTarget.username.value;
            const password = e.currentTarget.password.value;
            dispatch(loginThunk({ username, password }));
          }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Имя пользователя"
              type="username"
              name="username"
              fullWidth
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Пароль"
              type="password"
              name="password"
              fullWidth
              required
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ width: "100%" }}
            >
              Войти
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
