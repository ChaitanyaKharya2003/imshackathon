const express = require("express");
const ejs = require("ejs");
const { createPool } = require("mysql");
const bodyParser = require("body-parser");

const app = express();
 
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "Flat_Managment",
  connectionLimit: 10,
});

app.get("/", (req, res) => {
  res.render("index");
});

// --------------------------------------------------

// SQL CODE

app.post("/book", (req, res) => {
  res.redirect("/booked");
});
app.post("/visited", (req, res) => {});
app.post("/delete", (req, res) => {
  res.redirect("/available");
});

// --------------------------------------------------

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.post("/signin", (req, res) => {
  var email = req.body.email;
  var pass = req.body.pass;

  pool.query(`select * from Admin`, (err, result) => {
    if (err) {
      return console.log(err);
    } else {
      var userEmail = result[0].email;
      var userPass = result[0].password;

      if (email == userEmail && pass == userPass) {
        res.redirect("/");
      } else {
        res.write("Wrong ID PASS");
        res.send();
      }
    }
  });
});

app.get("/available", (req, res) => {

  pool.query(`select * from Flat`, (err, result) => {
    if (err) {
      return console.log(err);
      } 
      
      
      res.render("availableFlats", {newListItems: result});

    return console.log(result);
  });


  
});

app.get("/booked", (req, res) => {
  res.render("bookedFlats");
});

app.get("/addNewFlat", (req, res) => {
  res.render("addNewFlat");
});

app.post("/addNewFlat", (req, res) => {

  const name = req.body.name;
  const bhk = req.body.bhk;
  const area = req.body.area;
  const address = req.body.address;
  const furnishing = req.body.furnishing;
  const rent = req.body.rent;
  const floor = req.body.floor;

  pool.query(
    `insert into Flat values ("${name}","${address}", "${bhk}", "${furnishing}", null ,${floor},"Available",0,${rent},${area})`
  ,(err) => {
    if(!err){
      console.log("Success Adding To database!");
    }
    
  });

  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
