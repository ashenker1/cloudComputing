// mealController.js
const db = require('../config');

const addMeal = async (req, res) => {
  const { mealType, description, sugarLevel, imageUrl, isHoliday } = req.body;
  try {
    await db.query('INSERT INTO Meals (mealType, description, sugarLevel, imageUrl, isHoliday) VALUES (@mealType, @description, @sugarLevel, @imageUrl, @isHoliday)', {
      mealType, description, sugarLevel, imageUrl, isHoliday
    });
    res.status(201).json({ message: 'Meal added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding meal', error: err });
  }
};

const updateMeal = async (req, res) => {
  const { mealId, mealType, description, sugarLevel, imageUrl, isHoliday } = req.body;
  try {
    await db.query('UPDATE Meals SET mealType = @mealType, description = @description, sugarLevel = @sugarLevel, imageUrl = @imageUrl, isHoliday = @isHoliday WHERE id = @mealId', {
      mealId, mealType, description, sugarLevel, imageUrl, isHoliday
    });
    res.status(200).json({ message: 'Meal updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating meal', error: err });
  }
};

const deleteMeal = async (req, res) => {
  const { mealId } = req.params;
  try {
    await db.query('DELETE FROM Meals WHERE id = @mealId', { mealId });
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting meal', error: err });
  }
};

const getMeals = async (req, res) => {
  try {
    const meals = await db.query('SELECT * FROM Meals');
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meals', error: err });
  }
};

module.exports = {
  addMeal,
  updateMeal,
  deleteMeal,
  getMeals
};
