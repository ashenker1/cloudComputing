const { db, poolPromise } = require("../config"); // ייבוא משולב
const {
  checkImageForFood,
  getHolidays,
  getSugarLevel,
} = require("../dataAccess/mealDataAccess");
const sql = require("mssql");

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

    const request = pool.request(); // יצירת בקשה מהמאגר

    // הוספת פרמטרים לבקשה
    request.input("mealType", sql.NVarChar, mealType);
    request.input("description", sql.NVarChar, description);
    request.input("image", sql.NVarChar, image);
    request.input("mealDate", sql.Date, mealDate);
    request.input("bloodSugar", sql.Float, bloodSugar);
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
const getMealHistory = async (startDate, endDate, mealType, session) => {
  try {
    const pool = await poolPromise; // השתמש ב-poolPromise
    const request = pool.request(); // יצירת אובייקט של בקשת SQL

    // הוספת פרמטרים לבקשה
    request.input("userId", sql.Int, session.userId);
    request.input("startDate", sql.Date, startDate);
    request.input("endDate", sql.Date, endDate);

    // הוספת פרמטר עבור סוג הארוחה, אם לא נבחר - כל סוגי הארוחות
    if (mealType && mealType !== "all") {
      request.input("mealType", sql.NVarChar, mealType);
    }

    // בניית שאילתת SQL
    const query = `
      SELECT mealDate, description AS mealName, mealType, calories, bloodSugar, 
             CASE WHEN isHoliday = 1 THEN 'Holiday' ELSE 'Weekday' END AS dayType 
      FROM Meals
      WHERE userId = @userId 
      AND mealDate BETWEEN @startDate AND @endDate
      ${mealType && mealType !== "all" ? "AND mealType = @mealType" : ""}
      ORDER BY mealDate DESC;
    `;

    // ביצוע השאילתה
    const result = await request.query(query);

    return result.recordset; // מחזיר את רשימת הארוחות
  } catch (error) {
    throw new Error("Failed to retrieve meal history: " + error.message);
  }
};

module.exports = {
  addMealToDatabase,
  getMealHistory,
};
