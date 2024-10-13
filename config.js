// config.js
const config = {
    server: 'DietaryHabitsDB.mssql.somee.com', // שם השרת
    database: 'DietaryHabitsDB', // שם מסד הנתונים
    user: 'aabikel_SQLLogin_1', // שם המשתמש
    password: '4frb3e6qgq', // סיסמה
    options: {
      encrypt: true, // אם אתה משתמש ב-SSL
      trustServerCertificate: true // אם אתה בודק את תעודת השרת
    }
  };
  
  module.exports = config;
  