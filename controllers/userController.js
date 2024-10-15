const userModel = require("../models/userModel");

// יצירת משתמש חדש (Create)
const createUser = async (req, res) => {
  const { id, username, password, email } = req.body;

  if (!id || !username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await userModel.createUser(id, username, password, email);

    // הפנה עם הודעה בפרמטר
    res.redirect("/?message=User created successfully");
  } catch (err) {
    // חזור לדף ההתחברות עם הודעת שגיאה
    res.redirect("/signup?message=" + encodeURIComponent(err.message));
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
    res.status(err.status || 500).json({ message: err.message });
  }
};

// קבלת כל המשתמשים (Read all users)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// עדכון פרטי משתמש (Update)
const updateUser = async (req, res) => {
  const { userId, username, password, email } = req.body;
  try {
    await userModel.updateUser(userId, username, password, email);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// מחיקת משתמש (Delete)
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await userModel.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await userModel.login(username, password);
    req.session.token = token; // שמירת הטוקן ב-session
    req.session.isLoggedIn = true; // שמירת מצב ההתחברות ב-session
    req.session.username = username; // שמירת שם המשתמש ב-session (אם צריך)

    // העברת המצב של isLoggedIn והשם משתמש לדף התצוגה
    res.render("pages/index", { isLoggedIn: true, username });
  } catch (err) {
    console.error(err);
    res.render("pages/index", { isLoggedIn: false }); // במקרה של שגיאה, המשתמש לא מחובר
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
