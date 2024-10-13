const express = require("express");
const app = express();
const port = 3000;

const mealRoutes = require("./routes/mealRoutes"); // עדכן לפי המיקום המדויק שלך
const userRoutes = require("./routes/userRoutes"); // כולל את הראוט של המשתמשים

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // שירות קבצים סטטיים
app.set("view engine", "ejs"); // הגדרת EJS כתבנית

// כולל את הראוטס שלך
app.use("/meals", mealRoutes);
app.use("/users", userRoutes); // חיבור הראוטים של המשתמשים

// דפים
app.get("/", (req, res) => {
  res.render("pages/index");
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
