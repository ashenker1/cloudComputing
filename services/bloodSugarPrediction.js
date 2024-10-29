const sql = require("mssql");
const DecisionTree = require("decision-tree");

// הגדרת פרטי החיבור למסד הנתונים
const config = {
  user: "aabikel_SQLLogin_1",
  password: "4frb3e6qgq",
  server: "DietaryHabitsDB.mssql.somee.com",
  database: "DietaryHabitsDB",
  options: {
    trustServerCertificate: true,
  },
};

// פונקציה לחלץ נתונים מהמסד נתונים
async function getData(userId, isHoliday) {
  try {
    await sql.connect(config);

    // חיבור למסד הנתונים ושאילתת נתונים רק עבור ה-userId הנתון
    const result = await sql.query`
      SELECT foodSugar AS sugarContent, bloodSugar 
      FROM Meals 
      WHERE userId = ${userId} AND isHoliday = ${isHoliday}`;

    // המרת התוצאות למערך
    const data = result.recordset.map((row) => ({
      sugarContent: row.sugarContent,
      bloodSugar: row.bloodSugar,
    }));

    return data;
  } catch (err) {
    console.error("Error retrieving data:", err);
  } finally {
    await sql.close();
  }
}

// פונקציה לחזוי סוכר בדם
async function predictBloodSugar(newSugarContent, userId, isHoliday) {
  const data = await getData(userId, isHoliday);

  if (data.length === 0) {
    console.error("No data retrieved from the database.");
    return null;
  }

  // הגדרת תכונות ותוויות
  const features = ["sugarContent"]; // תכונה לחיזוי
  const className = "bloodSugar"; // תווית לחיזוי

  // יצירת עץ החלטה
  const dt = new DecisionTree(data, className, features);

  // חיזוי רמת הסוכר בדם עבור כמות סוכר חדשה
  const predictedBloodSugar = dt.predict(newSugarContent);

  console.log(
    `Predicted blood sugar for sugar content ${newSugarContent.sugarContent}: ${predictedBloodSugar}`
  );

  return predictedBloodSugar;
}

module.exports = { predictBloodSugar };
