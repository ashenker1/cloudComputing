const express = require("express");
const mealController = require("../controllers/mealController");
const router = express.Router();

// Middleware לבדיקת אימות
const authenticateUser = (req, res, next) => {
    if (req.session && req.session.userId && req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/?message=' + encodeURIComponent('Please login first'));
    }
};

// הוספת middleware לכל הנתיבים
router.use(authenticateUser);

// יצירת ארוחה חדשה
router.post('/add', mealController.addMeal);

// קבלת היסטוריה של ארוחות
router.get('/history', mealController.getMealHistory); // הוספת הנתיב להיסטוריה

module.exports = router;