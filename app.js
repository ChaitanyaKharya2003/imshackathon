const express = require("express");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});




app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.get("/available", (req, res) => {
  res.render("availableFlats");
});

app.get("/booked", (req, res) => {
  res.render("bookedFlats");
});






app.listen(3000, () => {
  console.log("Server started on port 3000");
});
