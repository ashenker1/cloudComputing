const db = require('../config');

// פונקציה לקבלת היסטוריית ארוחות לפי טווח תאריכים
const getMealHistory = async (fromDate, toDate) => {
  return db.query(
    'SELECT * FROM Meals WHERE mealDate BETWEEN @fromDate AND @toDate',
    { fromDate, toDate }
  );
};

module.exports = {
  getMealHistory
};
