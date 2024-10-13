const db = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// פונקציה ליצירת משתמש חדש
const createUser = async (id, username, password, email) => {
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw { status: 409, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return db.query(
    "INSERT INTO Users (id, username, password, email) VALUES (@id, @username, @password, @email)",
    {
      id,
      username,
      password: hashedPassword,
      email,
    }
  );
};

// פונקציה לקבלת משתמש לפי מזהה
const getUserById = async (userId) => {
  return db.query("SELECT * FROM Users WHERE id = @userId", { userId });
};

// פונקציה לקבלת משתמש לפי שם משתמש
const getUserByUsername = async (username) => {
  return db.query("SELECT * FROM Users WHERE username = @username", {
    username,
  });
};

// פונקציה לעדכון פרטי משתמש
const updateUser = async (userId, username, password, email) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.query(
    "UPDATE Users SET username = @username, password = @password, email = @email WHERE id = @userId",
    {
      username,
      password: hashedPassword,
      email,
      userId,
    }
  );
};

// פונקציה למחיקת משתמש
const deleteUser = async (userId) => {
  return db.query("DELETE FROM Users WHERE id = @userId", { userId });
};

// פונקציה לקבלת כל המשתמשים
const getAllUsers = async () => {
  return db.query("SELECT * FROM Users");
};

// פונקציה להזדהות משתמש
const login = async (username, password) => {
  const user = await getUserByUsername(username);
  if (!user) {
    throw { status: 401, message: "Invalid username or password" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: 401, message: "Invalid username or password" };
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token; // החזר את הטוקן
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
  login,
};
