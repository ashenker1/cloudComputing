const db = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');  // יש לוודא שהמודל בשם הזה

// יצירת משתמש חדש (Create)
const createUser = async (req, res) => {
  const { id, username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // הצפנת הסיסמה
  try {
    await userModel.createUser(id, username, hashedPassword, email);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
};

// קבלת פרטי משתמש לפי מזהה (Read)
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
};

// קבלת כל המשתמשים (Read all users)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getUserByUsername();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

// עדכון פרטי משתמש (Update)
const updateUser = async (req, res) => {
  const { userId, username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // הצפנת הסיסמה החדשה
  try {
    await userModel.updateUser(userId, username, hashedPassword, email);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err });
  }
};

// מחיקת משתמש (Delete)
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await userModel.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
};

// הזדהות משתמש (Login)
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.getUserByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  login
};
