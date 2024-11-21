const express = require("express");
const sql = require("mssql");
const { config } = require("./config");
const session = require("express-session");
const http = require("http");
const socketIo = require("socket.io"); // הוספת socket.io
const app = express();
const alert = require("./kafka/alerts");
const { consumeTestResult } = require("./kafka/kafkaConsumer");
const port = 3000;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
require("dotenv").config();

// יצירת שרת HTTP ו- socket.io
const server = http.createServer(app);
const io = socketIo(server); // הגדרת io

alert.InitializeSocket(io);

io.on("connection", (socket) => {
  console.log("new client connected");

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});
const kafkacon = async () => {
  await consumeTestResult();
};

kafkacon();

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed: ", err);
    process.exit(1);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // שירות קבצים סטטיים
app.set("view engine", "ejs"); // הגדרת EJS כתבנית

// הגדרת ה-session
app.use(
  session({
    secret: "your_secret_key", // הכנס מפתח סודי שלך
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // השתנה ל-true אם אתה משתמש ב-HTTPS
  })
);

// ה-middleware להגדלת המשתנים המקומיים
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false; // ברירת מחדל אם לא מחובר
  res.locals.username = req.session.username || null; // שם המשתמש אם קיים
  next();
});

const mealRoutes = require("./routes/mealRoutes"); // עדכן לפי המיקום המדויק שלך
const userRoutes = require("./routes/userRoutes"); // כולל את הראוט של המשתמשים
const { start } = require("repl");

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/"); // אם הייתה שגיאה, הפנה לדף הבית או לדף אחר
    }
    res.redirect("/"); // הפנה לדף הבית לאחר ההתנתקות
  });
});

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/mealHistory", (req, res) => {
  res.render("pages/mealHistory");
});

app.get("/contact", (req, res) => {
  res.render("pages/contact");
});

app.get("/recipes", (req, res) => {
  res.render("pages/recipes");
});

app.get("/index", (req, res) => {
  res.render("pages/index");
});

app.get("/updateMeals", (req, res) => {
  res.render("pages/updateMeals");
});

app.get("/favicon.ico", (req, res) => res.status(204));

app.use("/meals", mealRoutes); // כולל את הראוטס שלך
app.use("/", userRoutes); // חיבור הראוטים של המשתמשים

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
