const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageAnalysisSchema = new Schema({
  mealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
  isFood: { type: Boolean, required: true },
  ingredients: [String] // מידע מה-API של USDA או שירות ענן דומה
});

module.exports = mongoose.model('ImageAnalysis', imageAnalysisSchema);
