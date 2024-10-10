const db = require('../config');

// פונקציה ליצירת משתמש חדש
const createUser = async (id, username, hashedPassword, email) => {
  return db.query('INSERT INTO Users (id, username, password, email) VALUES (@id, @username, @password, @email)', {
    id,
    username,
    password: hashedPassword,
    email
  });
};

// פונקציה לקבלת משתמש לפי מזהה
const getUserById = async (userId) => {
  return db.query('SELECT * FROM Users WHERE id = @userId', { userId });
};

// פונקציה לקבלת משתמש לפי שם משתמש
const getUserByUsername = async (username) => {
  return db.query('SELECT * FROM Users WHERE username = @username', { username });
};

// פונקציה לעדכון פרטי משתמש
const updateUser = async (userId, username, hashedPassword, email) => {
  return db.query('UPDATE Users SET username = @username, password = @password, email = @email WHERE id = @userId', {
    username,
    password: hashedPassword,
    email,
    userId
  });
};

// פונקציה למחיקת משתמש
const deleteUser = async (userId) => {
  return db.query('DELETE FROM Users WHERE id = @userId', { userId });
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
};
