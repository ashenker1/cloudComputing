// models/mealModel.js
const db = require('../config');
const { checkImageForFood, getHolidays, getSugarLevel } = require('../dataAccess/mealDataAccess');
const sql = require('mssql'); // הוסף את ה-import של mssql

const addMealToDatabase = async (mealData) => {
  const { mealType, description, image, mealDate, bloodSugar, userId } = mealData;

  const defaultUserId = 1; // קבע ערך ברירת מחדל
  const finalUserId = userId !== undefined ? userId : defaultUserId;

  try {
      await sql.connect(db); // התחבר למסד הנתונים

      // בדוק אם התמונה היא של אוכל
      const tags = await checkImageForFood(image);
      if (!tags || !Array.isArray(tags.result.tags) || !isFoodImage(tags.result.tags)) {
           return 'The image provided is not a food image.'
      }

      // בדוק אם התאריך הוא חג
      const holidays = await getHolidays(mealDate, 'IL');
      const isHolidayDate = holidays.some(holiday => holiday.date.iso === mealDate);
      const holidayStatus = isHolidayDate ? 1 : 0;

      // בדוק את רמת הסוכר במזון
      const foodSugar = await checkSugarLevelFromDescription(description);

      // יצירת אובייקט של בקשת SQL
      const request = new sql.Request(); 

      // הוספת פרמטרים לבקשה
      request.input('mealType', sql.NVarChar, mealType);
      request.input('description', sql.NVarChar, description);
      request.input('image', sql.NVarChar, image);
      request.input('mealDate', sql.Date, mealDate);
      request.input('bloodSugar', sql.Float, bloodSugar);
      request.input('foodSugar', foodSugar !== null ? foodSugar : null); // טיפול במקרה של foodSugar ריק
      request.input('isHoliday', sql.Bit, holidayStatus);
      request.input('userId', sql.Int, finalUserId);

      // ביצוע השאילתה
      await request.query(
          `INSERT INTO Meals (mealType, description, image, mealDate, bloodSugar, foodSugar, isHoliday, userId) 
          VALUES (@mealType, @description, @image, @mealDate, @bloodSugar, @foodSugar, @isHoliday, @userId)`
      );

      return 'Meal added successfully';
  } catch (error) {
      throw new Error('Failed to add meal to database: ' + error.message);
  }
};

// פונקציה לבדוק אם התמונה היא של אוכל
const isFoodImage = (tags) => {
  const foodTags = [
    "food", "meal", "dish", "fruit", "vegetable",
    "dessert", "snack", "breakfast", "lunch", "dinner",
    "pasta", "hamburger"
  ];

  for (let tag of tags) {
    if (tag.confidence >= 50 && foodTags.some((foodTag) => tag.tag.en.toLowerCase().includes(foodTag))) {
      return true; // התמונה היא של אוכל
    }
  }
  return false; // התמונה אינה של אוכל
};

// פונקציה לבדוק אם התאריך הוא חג
const checkIfHoliday = async (date, countryCode) => {
  const holidays = await getHolidays(date, countryCode);
  return holidays.some(holiday => holiday.date.iso === date);
};

// פונקציה לבדוק את רמת הסוכר על פי תיאור המזון
const checkSugarLevelFromDescription = async (description) => {
  try {
      const foodData = await getSugarLevel(description);
      if (!foodData) {
          return null; // אם לא נמצא מזון, החזר null
      }

      const nutrients = foodData.foodNutrients;
      const totalSugars = nutrients.find(nutrient => 
          nutrient.nutrientName.toLowerCase().includes('total sugars') || 
          nutrient.nutrientName.toLowerCase().includes('sugars')
      );

      return totalSugars ? (totalSugars.value > 0 ? totalSugars.value : 0) : null; // החזר כמות הסוכר או null
  } catch (error) {
      throw error; // לא להדפיס, רק לזרוק את השגיאה
  }
};
// פונקציה להחזיר את היסטוריית הארוחות
const getMealHistory = async (startDate, endDate, mealType, userId = 1) => { // הוספת userId עם ברירת מחדל
  try {
    await sql.connect(db); // התחבר למסד הנתונים

    // יצירת אובייקט של בקשת SQL
    const request = new sql.Request();

    // הוספת פרמטרים לבקשה
    request.input('userId', sql.Int, userId);
    request.input('startDate', sql.Date, startDate);
    request.input('endDate', sql.Date, endDate);
    
    // הוספת פרמטר עבור סוג הארוחה, אם לא נבחר - כל סוגי הארוחות
    if (mealType && mealType !== 'all') {
      request.input('mealType', sql.NVarChar, mealType);
    }

    // בניית שאילתת SQL
    const query = `
      SELECT mealDate, description AS mealName, mealType, calories, bloodSugar, 
             CASE WHEN isHoliday = 1 THEN 'Holiday' ELSE 'Weekday' END AS dayType 
      FROM Meals
      WHERE userId = @userId 
      AND mealDate BETWEEN @startDate AND @endDate
      ${mealType && mealType !== 'all' ? 'AND mealType = @mealType' : ''}
      ORDER BY mealDate DESC;
    `;

    // ביצוע השאילתה
    const result = await request.query(query);

    return result.recordset; // מחזיר את רשימת הארוחות
  } catch (error) {
    throw new Error('Failed to retrieve meal history: ' + error.message);
  }
};


module.exports = {
  addMealToDatabase,
  getMealHistory, 
};
