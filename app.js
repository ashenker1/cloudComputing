const express = require("express");
const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine
app.set("view engine", "ejs");

// Routes
const userRoutes = require("./routes/userRoutes"); // Import user routes
app.use("/users", userRoutes); // All user-related routes will be prefixed with /users

app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/blog", (req, res) => {
  res.render("pages/blog");
});

app.get("/contact", (req, res) => {
  res.render("pages/contact");
});

app.get("/recipes", (req, res) => {
  res.render("pages/recipes");
});

app.get("/updateMeals", (req, res) => {
  res.render("pages/updateMeals");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
