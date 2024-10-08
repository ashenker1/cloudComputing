const db = require('../config');

// פונקציה ליצירת ארוחה חדשה
const createMeal = async (meal) => {
  return db.query(
    `INSERT INTO Meals (name, description, date, imageUrl, sugarLevel, isHoliday) 
    VALUES (@name, @description, @date, @imageUrl, @sugarLevel, @isHoliday)`, 
    meal
  );
};

// פונקציה לקבלת ארוחה לפי מזהה
const getMealById = async (mealId) => {
  return db.query('SELECT * FROM Meals WHERE id = @mealId', { mealId });
};

// פונקציה לקבלת היסטורית ארוחות לפי טווח תאריכים
const getMealsByDateRange = async (startDate, endDate) => {
  return db.query('SELECT * FROM Meals WHERE date BETWEEN @startDate AND @endDate', {
    startDate,
    endDate,
  });
};

// פונקציה לעדכון ארוחה
const updateMeal = async (mealId, meal) => {
  return db.query(
    `UPDATE Meals SET name = @name, description = @description, date = @date, 
    imageUrl = @imageUrl, sugarLevel = @sugarLevel, isHoliday = @isHoliday WHERE id = @mealId`, 
    { ...meal, mealId }
  );
};

// פונקציה למחיקת ארוחה
const deleteMeal = async (mealId) => {
  return db.query('DELETE FROM Meals WHERE id = @mealId', { mealId });
};

module.exports = {
  createMeal,
  getMealById,
  getMealsByDateRange,
  updateMeal,
  deleteMeal,
};
