const express = require('express');
const mealController = require('../controllers/mealController');
const router = express.Router();

// יצירת ארוחה חדשה
router.post('/add', mealController.addMeal);

// עדכון פרטי ארוחה קיימת
router.put('/update', mealController.updateMeal);

// מחיקת ארוחה לפי מזהה
router.delete('/:mealId', mealController.deleteMeal);

// קבלת כל הארוחות
router.get('/', mealController.getMeals);

module.exports = router;
