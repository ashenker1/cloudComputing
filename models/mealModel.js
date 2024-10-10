const db = require("../config");

// פונקציה ליצירת ארוחה חדשה
const createMeal = async (meal, userId) => {
  return db.query(
    `INSERT INTO Meals (name, description, date, imageUrl, sugarLevel, isHoliday, userId) 
    VALUES (@name, @description, @date, @imageUrl, @sugarLevel, @isHoliday, @userId)`,
    { ...meal, userId }
  );
};

// פונקציה לקבלת ארוחה לפי מזהה
const getMealById = async (mealId) => {
  return db.query("SELECT * FROM Meals WHERE id = @mealId", { mealId });
};

// פונקציה לקבלת היסטורית ארוחות לפי טווח תאריכים
const getMealsByDateRange = async (startDate, endDate) => {
  return db.query(
    "SELECT * FROM Meals WHERE date BETWEEN @startDate AND @endDate",
    {
      startDate,
      endDate,
    }
  );
};

// פונקציה לעדכון ארוחה
const updateMeal = async (mealId, meal, userId) => {
  return db.query(
    `UPDATE Meals SET name = @name, description = @description, date = @date, 
    imageUrl = @imageUrl, sugarLevel = @sugarLevel, isHoliday = @isHoliday, userId = @userId WHERE id = @mealId`,
    { ...meal, userId, mealId }
  );
};

// פונקציה למחיקת ארוחה
const deleteMeal = async (mealId) => {
  return db.query("DELETE FROM Meals WHERE id = @mealId", { mealId });
};

module.exports = {
  createMeal,
  getMealById,
  getMealsByDateRange,
  updateMeal,
  deleteMeal,
};
