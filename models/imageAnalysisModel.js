const axios = require('axios');

// כתובת ה-API של Imagga לניתוח תמונה
const IMAGGA_API_URL = 'https://api.imagga.com/v2/classify';

// הוספת מפתח ה-API שלך כאן
const IMAGGA_API_KEY = 'your_imagga_api_key';

// פונקציה לשלוח תמונה ל-API של Imagga לצורך ניתוח
const sendImageForAnalysis = async (imageBuffer) => {
  try {
    const response = await axios.post(
      IMAGGA_API_URL,
      imageBuffer,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`acc_${IMAGGA_API_KEY}`).toString('base64')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // מחזיר את תוצאות הניתוח
    return response.data;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image");
  }
};

// פונקציה לבדיקת אם מדובר במאכל מתוך תוצאות ניתוח התמונה
const isFoodItem = (analysisResults) => {
  const categories = analysisResults.result.categories;
  // בדוק אם אחת הקטגוריות שייכת למאכל
  return categories.some(category => category.category.en === 'food');
};

module.exports = {
  sendImageForAnalysis,
  isFoodItem
};
