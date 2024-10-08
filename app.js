const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");

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

app.get("/index", (req, res) => {
  res.render("pages/index");
});

app.get("/updateMeals", (req, res) => {
  res.render("pages/updateMeals");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
