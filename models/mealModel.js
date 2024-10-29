const { db, poolPromise } = require("../config"); // ייבוא משולב
const {
  checkImageForFood,
  getHolidays,
  getSugarLevel,
} = require("../dataAccess/mealDataAccess");
const sql = require("mssql");
const { predictBloodSugar } = require('../services/bloodSugarPrediction');

let addMealToDatabase = async (mealData, session) => {
  const { mealType, description, image, mealDate, bloodSugar } = mealData;

  try {
    const pool = await poolPromise; // השגת מאגר החיבורים
    console.log("Pool:", pool); // הדפס את המאגר לבדוק אם הוא לא undefined
    // בדוק אם התמונה היא של אוכל
    const tags = await checkImageForFood(image);
    if (
      !tags ||
      !Array.isArray(tags.result.tags) ||
      !isFoodImage(tags.result.tags)
    ) {
      return "The image provided is not a food image.";
      
    }

    // בדוק אם התאריך הוא חג
    const holidays = await getHolidays(mealDate, "IL");
    const isHolidayDate = holidays.some(
      (holiday) => holiday.date.iso === mealDate
    );
    const holidayStatus = isHolidayDate ? 1 : 0;

    // בדוק את רמת הסוכר במזון
    const foodSugar = await checkSugarLevelFromDescription(description);

        // חיזוי רמת הסוכר אם לא ניתנה רמת סוכר
    let finalBloodSugar = bloodSugar; // אתחול עם רמת הסוכר הנתונה
    if (!bloodSugar) {
      const newSugarContent = { sugarContent: foodSugar }; // הגדרת תוכן סוכר חדש
      finalBloodSugar = await predictBloodSugar(
        newSugarContent, 
        session.userId, 
        holidayStatus
      );
      console.log("Predicted Blood Sugar:", finalBloodSugar);
    }
    const request = pool.request(); // יצירת בקשה מהמאגר

    // הוספת פרמטרים לבקשה
    request.input("mealType", sql.NVarChar, mealType);
    request.input("description", sql.NVarChar, description);
    request.input("image", sql.NVarChar, image);
    request.input("mealDate", sql.Date, mealDate);
    request.input("bloodSugar", sql.Float, finalBloodSugar);
    request.input("foodSugar", foodSugar !== null ? foodSugar : null);
    request.input("isHoliday", sql.Bit, holidayStatus);
    request.input("userId", sql.Int, session.userId);

    // ביצוע השאילתה
    await request.query(
      `INSERT INTO Meals (mealType, description, image, mealDate, bloodSugar, foodSugar, isHoliday, userId) 
      VALUES (@mealType, @description, @image, @mealDate, @bloodSugar, @foodSugar, @isHoliday, @userId)`
    );

    return "Meal added successfully";
  } catch (error) {
    throw new Error("Failed to add meal to database: " + error.message);
  }
};

// פונקציה לבדוק אם התמונה היא של אוכל
const isFoodImage = (tags) => {
  const foodTags = [
    "food",
    "meal",
    "dish",
    "fruit",
    "vegetable",
    "dessert",
    "snack",
    "breakfast",
    "lunch",
    "dinner",
    "pasta",
    "hamburger",
    "soup",
    "salad",
    "pizza",
    "bread",
    "cake",
    "ice cream",
    "chocolate",
    "fish",
    "meat",
    "steak",
    "sushi",
    "rice",
    "sandwich",
    "cheese",
    "egg",
    "pancake",
  ];

  for (let tag of tags) {
    if (
      tag.confidence >= 50 &&
      foodTags.some((foodTag) => tag.tag.en.toLowerCase().includes(foodTag))
    ) {
      return true; // התמונה היא של אוכל
    }
  }
  return false; // התמונה אינה של אוכל
};

// פונקציה לבדוק את רמת הסוכר על פי תיאור המזון
const checkSugarLevelFromDescription = async (description) => {
  try {
    const foodData = await getSugarLevel(description);
    if (!foodData) {
      return null; // אם לא נמצא מזון, החזר null
    }

    const nutrients = foodData.foodNutrients;
    const totalSugars = nutrients.find(
      (nutrient) =>
        nutrient.nutrientName.toLowerCase().includes("total sugars") ||
        nutrient.nutrientName.toLowerCase().includes("sugars")
    );

    return totalSugars ? (totalSugars.value > 0 ? totalSugars.value : 0) : null; // החזר כמות הסוכר או null
  } catch (error) {
    throw new Error("Error while checking sugar level: " + error.message);
  }
};

// פונקציה להחזיר את היסטוריית הארוחות
const getMealHistory = async (startDate, endDate, mealType, userId) => {
  try {
      const pool = await poolPromise;
      const request = pool.request();

      let query = `
          SELECT id, mealType, description, image, mealDate, bloodSugar, foodSugar, isHoliday, userId
          FROM Meals
          WHERE userId = @userId
      `;

      request.input('userId', sql.Int, userId);

      if (startDate && endDate) {
          query += ' AND mealDate BETWEEN @startDate AND @endDate';
          request.input('startDate', sql.Date, new Date(startDate));
          request.input('endDate', sql.Date, new Date(endDate));
      }

      if (mealType && mealType !== 'all') {
          query += ' AND mealType = @mealType';
          request.input('mealType', sql.NVarChar, mealType);
      }

      query += ' ORDER BY mealDate DESC';

      const result = await request.query(query);
      return result.recordset;
  } catch (error) {
      throw new Error('Failed to retrieve meal history: ' + error.message);
  }
};
module.exports = {
  addMealToDatabase,
  getMealHistory,
};
