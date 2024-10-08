const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historicalDataSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'] },
  dateRange: {
    from: Date,
    to: Date
  },
  sugarLevel: Number
});

module.exports = mongoose.model('HistoricalData', historicalDataSchema);
