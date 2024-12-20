import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
} from '@mui/material';

function ErrorPage(): JSX.Element {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" sx={{ mb: 2 }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Страница не найдена
        </Typography>
        <Box>
          <Link to="/prices" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Вернуться на главную
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default ErrorPage;
