const express = require('express');
const mealController = require('../controllers/mealController');
const router = express.Router();

// יצירת ארוחה חדשה
router.post('/add', mealController.addMeal);

// קבלת היסטוריה של ארוחות
router.get('/history', mealController.getMealHistory); // הוספת הנתיב להיסטוריה

module.exports = router;
