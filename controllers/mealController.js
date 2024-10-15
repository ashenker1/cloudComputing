// controllers/mealController.js
const mealModel = require("../models/mealModel");

const addMeal = async (req, res) => {
  const mealData = req.body;
  try {
    const message = await mealModel.addMealToDatabase(mealData, req.session);
    res.status(201).json({ message });
  } catch (error) {
    console.error("Error in mealController:", error.message); // פלט שגיאה מפורט
    res.status(500).json({ message: error.message });
  }
};

// פונקציה לשליפת ההיסטוריה של הארוחות
const getMealHistory = async (req, res) => {
  const { startDate, endDate, mealType } = req.query;

  try {
    const meals = await mealModel.getMealHistory(
      startDate,
      endDate,
      mealType,
      1
    ); // קריאה לפונקציה במודל
    res.status(200).json(meals); // החזרת הנתונים
  } catch (error) {
    console.error("Error fetching meal history:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMeal, getMealHistory }; // הוספת הפונקציה החדשה למודול
