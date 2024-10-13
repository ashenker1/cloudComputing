const express = require('express');
const historyController = require('../controllers/historyController');
const router = express.Router();

// קבלת היסטוריית ארוחות לפי טווח תאריכים
router.get('/meal-history', historyController.getMealHistory);

module.exports = router;
