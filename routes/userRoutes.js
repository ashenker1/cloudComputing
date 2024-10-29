const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// יצירת משתמש חדש
router.post("/createUser", userController.createUser);

// קבלת פרטי משתמש לפי מזהה
router.get("/:userId", userController.getUser);

// בדיקת חיבור מה-session והעברת הנתונים ל-EJS
router.get("/", (req, res) => {
  res.render("pages/index"); // הנתונים יגיעו מה-middleware שהגדרנו ב-app.js
});

// קבלת כל המשתמשים
// router.get("/", userController.getAllUsers);

router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard");
});

// עדכון פרטי משתמש
router.put("/update", userController.updateUser);

// מחיקת משתמש
router.delete("/deleteAccount", userController.deleteUser);

// הזדהות משתמש
router.post("/login", userController.login);

module.exports = router;
