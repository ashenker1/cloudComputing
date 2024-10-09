const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// יצירת משתמש חדש
router.post('/create', userController.createUser);

// קבלת פרטי משתמש לפי מזהה
router.get('/:userId', userController.getUser);

// קבלת כל המשתמשים
router.get('/', userController.getAllUsers);

// עדכון פרטי משתמש
router.put('/update', userController.updateUser);

// מחיקת משתמש
router.delete('/:userId', userController.deleteUser);

// הזדהות משתמש
router.post('/login', userController.login);

module.exports = router;
