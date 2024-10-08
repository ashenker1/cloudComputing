const historicalDataModel = require('../models/historicalDataModel');

// Controller to get historical data for a user
async function getHistoricalData(req, res) {
  try {
    const { userId, startDate, endDate } = req.query; // Query parameters for date range
    const historicalData = await historicalDataModel.getHistoricalData(userId, startDate, endDate);
    res.json(historicalData);
  } catch (err) {
    console.error('Error fetching historical data:', err);
    res.status(500).send('Server Error');
  }
}

// Controller to predict blood sugar level based on meal, day, and image
async function predictBloodSugar(req, res) {
  try {
    const { mealType, day, imageUrl } = req.body; // Incoming data for prediction
    const prediction = await historicalDataModel.predictBloodSugar(mealType, day, imageUrl);
    res.json(prediction);
  } catch (err) {
    console.error('Error predicting blood sugar:', err);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  getHistoricalData,
  predictBloodSugar,
};
