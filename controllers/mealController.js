// mealController.js
const db = require('../config');
const axios = require('axios');
const got = require("got");


const addMeal = async (req, res) => {
  const { mealType, description, image, mealDate, bloodSugar, foodSugar, isHoliday, userId } = req.body;

  try {
       // בדוק אם התמונה היא של אוכל
       const isFoodImage = await checkImageForFood(image);
       if (!isFoodImage) {
         return res.status(400).json({ message: 'The image provided is not a food image.' });
       }
           // בדוק אם התאריך הוא חופש
    const isHolidayDate = await checkIfHoliday(mealDate, 'IL'); // 'IL' עבור ישראל
    const holidayStatus = isHolidayDate ? 1 : 0;

      // בדוק את רמת הסוכר במזון
      const foodSugar = await checkSugarLevelFromDescription(description);
      if (foodSugar === null) {
        return res.status(400).json({ message: 'Unable to determine food sugar level.' });
      }
    // יצירת אובייקט של בקשת SQL
    const insertRequest = new db.Request();

    // הוספת פרמטרים לבקשה
    insertRequest.input('mealType', db.NVarChar, mealType);
    insertRequest.input('description', db.NVarChar, description);
    insertRequest.input('image', db.NVarChar, image);
    insertRequest.input('mealDate', db.Date, mealDate); // ההנחה היא שהפורמט מתאים ל- Date
    insertRequest.input('bloodSugar', db.Float, bloodSugar); // הנחה: ערך מספרי
    insertRequest.input('foodSugar', db.Float, foodSugar); // הנחה: ערך מספרי
    insertRequest.input('isHoliday', db.Bit, isHoliday ? 1 : 0); // המרת boolean ל-1/0
    insertRequest.input('userId', db.Int, userId); // הנחה: userId הוא מספר שלם

    // ביצוע השאילתה
    await insertRequest.query(`
      INSERT INTO Meals (mealType, description, image, mealDate, bloodSugar, foodSugar, isHoliday, userId) 
      VALUES (@mealType, @description, @image, @mealDate, @bloodSugar, @foodSugar, @isHoliday, @userId)
    `);
    
    res.status(201).json({ message: 'Meal added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding meal', error: err.message });
  }
};

const checkImageForFood = async (imageUrl) => {
  const apiKey = 'acc_71328f0c78bedb5'; // הכנס כאן את המפתח התקין שלך
  const apiSecret = '213b088b6ef055708be31dfd33d0a22f'; // הכנס כאן את הסוד התקין שלך

  const url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`;

  const getTags = async () => {
    try {
      const response = await got(url, {
        username: apiKey,
        password: apiSecret,
      });

      return JSON.parse(response.body);
    } catch (error) {
      console.error('Error fetching tags from Imagga:', error);
      return null; // במקרה של שגיאה, נחזיר null
    }
  };

  try {
    const tags = await getTags(); // קריאה ל-getTags לקבלת התגים מהתמונה

    if (tags && tags.result && Array.isArray(tags.result.tags)) {
      console.log('Tags received from Imagga:', tags.result.tags); // הדפסת התגים שהתקבלו

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
      ];

      // עבור כל תג
      for (let tag of tags.result.tags) {
        console.log(`Tag: ${tag.tag.en}, Confidence: ${tag.confidence}`); // הצגת התג והביטחון שלו

        if (tag.confidence >= 50) { // הורדת סף הביטחון ל-50% לצורך בדיקה
          if (
            foodTags.some((foodTag) =>
              tag.tag.en.toLowerCase().includes(foodTag)
            )
          ) {
            return true; // התמונה היא של אוכל
          }
        }
      }
    }

    return false; // התמונה אינה של אוכל
  } catch (error) {
    console.error('Error processing tags:', error);
    return false; // במקרה של שגיאה, נחזיר false
  }
};


module.exports = { addMeal };

//פונקציה לבדוק אם התאריך הוא חג
const checkIfHoliday = async (date, countryCode) => {
  const apiKey = 'C6owoSQuhg9XuNneW3cVz6jKPSVJH4HH'; // הכנס את מפתח ה-API שלך כאן
  const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${countryCode}&year=${new Date(date).getFullYear()}`;

  try {
    const response = await axios.get(url);
    const holidays = response.data.response.holidays;

    // בדוק אם התאריך מופיע ברשימת החגים
    const isHoliday = holidays.some(holiday => holiday.date.iso === date);
    return isHoliday;
  } catch (error) {
    console.error('Error checking holidays:', error);
    return false; // במקרה של שגיאה, נניח שזה לא חופש
  }
};

// פונקציה לבדוק את כמות הסוכר במזון על סמך התיאור
const checkSugarLevelFromDescription = async (description) => {
  const apiKey = 'u4rD51zqIm3A278MI9L1EYsSArOu4QaFNMCBTabJ'; // הכנס כאן את המפתח שלך ל-API
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(description)}&api_key=${apiKey}`;

  try {
    // שליחת בקשת GET ל-API
    const response = await axios.get(url);
    const foods = response.data.foods;

    if (foods.length > 0) {
      // נבחר את המזון הראשון ברשימה
      const foodItem = foods[0];
      const sugarNutrient = foodItem.foodNutrients.find(nutrient => nutrient.nutrientName === 'Sugars');

      if (sugarNutrient) {
        return sugarNutrient.amount; // מחזיר את כמות הסוכר
      } else {
        return null; // מחזיר null אם לא נמצאה כמות סוכר
      }
    } else {
      return null; // מחזיר null אם אין פריטים
    }
  } catch (error) {
    return null; // מחזיר null במקרה של שגיאה
  }
};


const updateMeal = async (req, res) => {
  const { mealId, mealType, description, sugarLevel, imageUrl, isHoliday } = req.body;
  try {
    await db.query('UPDATE Meals SET mealType = @mealType, description = @description, sugarLevel = @sugarLevel, imageUrl = @imageUrl, isHoliday = @isHoliday WHERE id = @mealId', {
      mealId, mealType, description, sugarLevel, imageUrl, isHoliday
    });
    res.status(200).json({ message: 'Meal updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating meal', error: err });
  }
};

const deleteMeal = async (req, res) => {
  const { mealId } = req.params;
  try {
    await db.query('DELETE FROM Meals WHERE id = @mealId', { mealId });
    res.status(200).json({ message: 'Meal deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting meal', error: err });
  }
};

const getMeals = async (req, res) => {
  try {
    const meals = await db.query('SELECT * FROM Meals');
    res.status(200).json(meals);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meals', error: err });
  }
};

module.exports = {
  addMeal,
  updateMeal,
  deleteMeal,
  getMeals
};
