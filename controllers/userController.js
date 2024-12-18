const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken"); // ייבוא jsonwebtoken
const { consumeTestResult } = require("../kafka/kafkaConsumer");

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
    console.log("Error during user creation:", err.message);

    return res.render("pages/index", {
      alertMessage: err.message,
    });
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
  const userId = req.session.userId; // מקבל את מזהה המשתמש מה-session
  try {
    await userModel.deleteUser(userId); // מחיקת המשתמש מה-DB
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to log out after deletion." });
      }
      res.redirect("/"); // הפניה לדף הראשי לאחר מחיקה מוצלחת
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await userModel.login(username, password);

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // פענוח הטוקן
    req.session.userId = decodedToken.userId; // שליפת ה-userId מתוך הטוקן ושמירה ב-session

    req.session.token = token; // שמירת הטוקן ב-session
    req.session.isLoggedIn = true; // שמירת מצב ההתחברות ב-session
    req.session.username = username; // שמירת שם המשתמש ב-session (אם צריך)

    // התחלת צריכת הודעות Kafka עבור המשתמש
    console.log("User logged in, starting Kafka consumer...");
    await consumeTestResult(); // צריכת הודעות

    // העברת המצב של isLoggedIn והשם משתמש לדף התצוגה
    res.render("pages/index", { isLoggedIn: true, username });
  } catch (err) {
    console.error(err);
    // במקרה של שגיאה, להעביר את הודעת השגיאה לעמוד
    res.render("pages/index", { isLoggedIn: false, alertMessage: err.message });
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
