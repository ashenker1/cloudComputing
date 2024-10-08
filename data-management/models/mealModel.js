const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
  description: String,
  date: { type: Date, required: true },
  image: String,
  sugarLevel: Number,
  holiday: { type: Boolean, default: false }
});

module.exports = mongoose.model('Meal', mealSchema);
