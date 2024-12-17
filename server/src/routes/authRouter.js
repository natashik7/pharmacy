const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');
const generateTokens = require('../utils/generateTokens');
const cookiesConfig = require('../configs/cookieConfig');

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const targetUser = await User.findOne({ where: { username } });
    if (!targetUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, targetUser.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const user = targetUser.get();
    delete user.password;

    const { accessToken, refreshToken } = generateTokens({ user });
    res.cookie('refreshToken', refreshToken, cookiesConfig).json({ accessToken, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// authRouter.post('/signup', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({ message: 'username and password are required' });
//     }
//     if (password.length < 3)
//       return res.status(400).json({ message: 'Password too short' });

//     const hashpass = await bcrypt.hash(password, 10);
//     const [newUser, created] = await User.findOrCreate({
//       where: { username },
//       defaults: { username, password: hashpass },
//     });

//     if (!created) return res.status(403).json({ message: 'User already exists' });

//     const user = newUser.get();
//     delete user.password;

//     const { accessToken, refreshToken } = generateTokens({ user });
//     res.cookie('refreshToken', refreshToken, cookiesConfig).json({ accessToken, user });
//   } catch (error) {
//     console.error('Error during signup:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

authRouter.get('/logout', (req, res) => {
  res.clearCookie('refreshToken').sendStatus(200);
});

module.exports = authRouter;
