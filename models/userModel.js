const { db } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// פונקציה ליצירת משתמש חדש
const createUser = async (id, username, password, email) => {
  console.log(id, username, password, email);
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    throw { status: 409, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return db.query(
    "INSERT INTO Users (id, username, password, email) VALUES (@id, @username, @password, @email)",
    {
      id,
      username,
      password: hashedPassword,
      email,
    }
  );
};

// פונקציה לקבלת משתמש לפי מזהה
const getUserById = async (userId) => {
  return db.query("SELECT * FROM Users WHERE id = @userId", { userId });
};

// פונקציה לקבלת משתמש לפי שם משתמש
const getUserByUsername = async (username) => {
  try {
    const data = await db.query(
      "SELECT * FROM Users WHERE username = @username",
      {
        username,
      }
    );
    return data[0];
  } catch (error) {
    console.log("query error:", error);
  }
};

// פונקציה לעדכון פרטי משתמש
const updateUser = async (userId, username, password, email) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.query(
    "UPDATE Users SET username = @username, password = @password, email = @email WHERE id = @userId",
    {
      username,
      password: hashedPassword,
      email,
      userId,
    }
  );
};

// פונקציה למחיקת משתמש
const deleteUser = async (userId) => {
  return db.query("DELETE FROM Users WHERE id = @userId", { userId });
};

// פונקציה לקבלת כל המשתמשים
const getAllUsers = async () => {
  return db.query("SELECT * FROM Users");
};

const login = async (username, password) => {
  try {
    console.log("step 1");

    const user = await getUserByUsername(username);
    if (!user) {
      console.log("User not found"); // לוג נוסף במקרה שהמשתמש לא נמצא
      throw { status: 401, message: "Invalid username or password" };
    }

    console.log("step 2");
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match"); // לוג נוסף במקרה שהסיסמה לא תואמת
      throw { status: 401, message: "Invalid username or password" };
    }

    console.log("step 3");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token; // החזרת הטוקן
  } catch (error) {
    console.error("Error during login process:", error);

    // הטיפול בשגיאות בהתאם לסוג השגיאה
    if (error.status) {
      throw error; // במקרה שזה שגיאה עם סטטוס מותאם (כמו Invalid username or password)
    } else {
      throw { status: 500, message: "Internal server error" }; // שגיאה כללית
    }
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getAllUsers,
  login,
};
