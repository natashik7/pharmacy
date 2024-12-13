const authenticateToken = require('../middleware/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Router } = require('express');

const { User } = require('../../db/models');

const authRouter = Router();

authRouter.route('/login').post(async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Проверьте креды' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      },
    );
    res.cookie('token', token);
    res.json({ message: 'Авторизация прошла успешно' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка авторизации', message: error.message });
  }
});

authRouter.get('/check-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    res.json({ username: decoded.username });
  });
});

authRouter.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

authRouter.route('/logout').post((req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Вы вышли из системы' });
});

module.exports = authRouter;
