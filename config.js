const sql = require("mssql");

// config.js
const config = {
  server: "DietaryHabitsDB.mssql.somee.com", // שם השרת
  database: "DietaryHabitsDB", // שם מסד הנתונים
  user: "aabikel_SQLLogin_1", // שם המשתמש
  password: "4frb3e6qgq", // סיסמה
  options: {
    encrypt: true, // אם אתה משתמש ב-SSL
    trustServerCertificate: true, // אם אתה בודק את תעודת השרת
  },
};

// יצירת מאגר החיבורים
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed: ", err);
    process.exit(1); // עצור את התוכנית במקרה של שגיאה
  });

// פונקציה לחיבור למסד נתונים
const db = {
  query: async (query, params) => {
    const pool = await poolPromise; // השגת החיבור ממאגר החיבורים
    const request = pool.request();

    // הוספת הפרמטרים לשאילתה
    Object.keys(params).forEach((key) => {
      request.input(key, params[key]);
    });

    try {
      const result = await request.query(query);
      return result.recordset; // החזרת התוצאות
    } catch (error) {
      console.log("query error:", error);
      throw error; // זריקת השגיאה כך שניתן יהיה לטפל בה במקום אחר
    }
  },
};

module.exports = {
  config,
  sql,
  db,
  poolPromise,
};
