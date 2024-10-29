// historyController.js
const db = require('../config');

const getMealHistory = async (req, res) => {
  const { fromDate, toDate } = req.query;
  try {
    const meals = await db.query('SELECT * FROM Meals WHERE mealDate BETWEEN @fromDate AND @toDate', { fromDate, toDate });
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meal history', error: err });
  }
};

module.exports = {
  getMealHistory
};
