const express = require('express');
const multer = require('multer');
const imageAnalysisModel = require('../models/imageAnalysisModel');  // ייבוא המודל של ניתוח תמונה

const router = express.Router();

// הגדרת אחסון התמונה באמצעות multer
const storage = multer.memoryStorage(); // לאחסן את התמונה בזיכרון
const upload = multer({ storage: storage });

// פונקציה שמקבלת את התמונה ומבצע את הניתוח שלה
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No image file uploaded' });
    }

    // שליחה למודל לניתוח התמונה
    const analysisResults = await imageAnalysisModel.sendImageForAnalysis(req.file.buffer);

    // בדיקה אם התמונה היא של מאכל
    const foodDetected = imageAnalysisModel.isFoodItem(analysisResults);

    if (foodDetected) {
      return res.status(200).send({ message: 'Image is a food item' });
    } else {
      return res.status(400).send({ message: 'Image is not recognized as a food item' });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Error processing the image', error: error.message });
  }
});

module.exports = router;
