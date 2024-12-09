import React from 'react';
import { Link } from 'react-router-dom';

function NotFound(): JSX.Element {
  return (
    <div>
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/login">Вернуться на главную</Link>
    </div>
  );
}

export default NotFound;
