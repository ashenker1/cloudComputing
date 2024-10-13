// dataAccess/mealDataAccess.js
const axios = require('axios');

const checkImageForFood = async (imageUrl) => {
  const apiKey = 'acc_71328f0c78bedb5'; 
  const apiSecret = '213b088b6ef055708be31dfd33d0a22f'; 
  const url = `https://api.imagga.com/v2/tags?image_url=${encodeURIComponent(imageUrl)}`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
    });
    return response.data;
  } catch (error) {
    return null;
  }
};

// פונקציה לבדוק אם התאריך הוא חג (גישה לנתונים)
const getHolidays = async (date, countryCode) => {
  const apiKey = 'C6owoSQuhg9XuNneW3cVz6jKPSVJH4HH';
  const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${countryCode}&year=${new Date(date).getFullYear()}`;

  try {
    const response = await axios.get(url);
    return response.data.response.holidays;
  } catch (error) {
    return []; // במקרה של שגיאה, מחזירים מערך ריק
  }
};

// פונקציה לקבלת נתוני מזון מה-API של USDA
const getSugarLevel = async (description) => {
    const usdaApiKey = '1mWhZakwi61dJOw0w4njakJstHrTItIaJ9GJemvI';
    const apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(description)}&api_key=${usdaApiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const foods = response.data.foods;

        if (foods.length > 0) {
            // מחפש את המוצר התואם
            const matchedFood = foods.find(food => food.description.toLowerCase().includes(description.toLowerCase()));
            return matchedFood || foods[0]; // מחזיר את המוצר המותאם או את הראשון
        } else {
            return null; // אם לא נמצאו מוצרים
        }
    } catch (error) {
        throw error; // לא להדפיס, רק לזרוק את השגיאה
    }
};

module.exports = { 
  checkImageForFood,
  getHolidays,
  getSugarLevel,
};
