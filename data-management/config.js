// db.js (או config.js)
const sql = require('mssql');

// הגדרות החיבור
const config = {
    user: '	aabikel_SQLLogin_1', // שם המשתמש שלך ב-somee.com
    password: '4frb3e6qgq', // הסיסמה שלך ב-somee.com
    server: 'DietaryHabitsDB.mssql.somee.com', // שם השרת
    database: 'DietaryHabitsDB', // שם מסד הנתונים שלך
    options: {
        trustServerCertificate: true, // אם אתה נתקל בבעיות באישור SSL
        encrypt: true, // אם יש צורך בהצפנת החיבור
    },
    port: 1433, // היציאה הסטנדרטית עבור SQL Server
};

// פונקציה לחיבור למסד הנתונים
const connectToDatabase = async () => {
    try {
        await sql.connect(config);
        console.log('חיבור למסד הנתונים הוקם בהצלחה!');
    } catch (err) {
        console.error('שגיאה בחיבור למסד הנתונים:', err);
    }
};

// ייצוא הפונקציה והקונפיגורציה
module.exports = {
    connectToDatabase,
    sql,
};
