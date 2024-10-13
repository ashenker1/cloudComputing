const db = require("../config"); // ודא שהנתיב נכון
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel"); // ודא שהמודל בשם הזה

// יצירת משתמש חדש (Create)
const createUser = async (req, res) => {
  const { id, username, password, email } = req.body;

  // בדוק אם המשתמש כבר קיים
  const existingUser = await userModel.getUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // הצפנת הסיסמה
  try {
    await userModel.createUser(id, username, hashedPassword, email);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

// קבלת פרטי משתמש לפי מזהה (Read)
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err });
  }
};

// קבלת כל המשתמשים (Read all users)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers(); // ודא שיש פונקציה שמחזירה את כל המשתמשים
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

// עדכון פרטי משתמש (Update)
const updateUser = async (req, res) => {
  const { userId, username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // הצפנת הסיסמה החדשה
  try {
    await userModel.updateUser(userId, username, hashedPassword, email);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
};

// מחיקת משתמש (Delete)
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await userModel.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  // בדוק אם השדות ריקים
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // קבל את פרטי המשתמש מהמסד נתונים
    const user = await userModel.getUserByUsername(username);

    // אם המשתמש לא קיים
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // השוואת הסיסמאות
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // הכניסה הצליחה, צור טוקן JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // החזר את פרטי המשתמש ואת הטוקן
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
      token,
      expiresIn: 3600, // זמן התפוגה של הטוקן בשניות
    });
  } catch (err) {
    console.error(err); // חשוב ללכוד שגיאות
    res.status(500).json({ message: "Error logging in", error: err });
  }
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  login,
};
