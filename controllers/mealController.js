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

const getMealHistory = async (req, res) => {
  const { startDate, endDate, mealType } = req.query;
  // קבלת ה-userId מהסשן
  const userId = req.session.userId;
  
  if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
  }

  try {
      const meals = await mealModel.getMealHistory(startDate, endDate, mealType, userId);
      res.status(200).json(meals);
  } catch (error) {
      console.error('Error getting meal history:', error);
      res.status(500).json({ message: 'Error retrieving meal history', error: error.message });
  }
};

module.exports = { addMeal, getMealHistory }; // הוספת הפונקציה החדשה למודול
