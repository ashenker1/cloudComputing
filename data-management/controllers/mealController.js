const mealModel = require('../models/mealModel');

// Controller to create a new meal
async function createMeal(req, res) {
  try {
    const { date, description, imageUrl, sugarLevel, mealType, holiday } = req.body;
    const result = await mealModel.createMeal(date, description, imageUrl, sugarLevel, mealType, holiday);
    res.status(201).json({ message: 'Meal created successfully' });
  } catch (err) {
    console.error('Error creating meal:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to get all meals
async function getAllMeals(req, res) {
  try {
    const meals = await mealModel.getAllMeals();
    res.json(meals);
  } catch (err) {
    console.error('Error fetching meals:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to get meal by ID
async function getMealById(req, res) {
  try {
    const { id } = req.params;
    const meal = await mealModel.getMealById(id);
    res.json(meal);
  } catch (err) {
    console.error('Error fetching meal by ID:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to update a meal
async function updateMeal(req, res) {
  try {
    const { id } = req.params;
    const { date, description, imageUrl, sugarLevel, mealType, holiday } = req.body;
    await mealModel.updateMeal(id, date, description, imageUrl, sugarLevel, mealType, holiday);
    res.status(200).json({ message: 'Meal updated successfully' });
  } catch (err) {
    console.error('Error updating meal:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to delete a meal
async function deleteMeal(req, res) {
  try {
    const { id } = req.params;
    await mealModel.deleteMeal(id);
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (err) {
    console.error('Error deleting meal:', err);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  createMeal,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal,
};
