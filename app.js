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
  password: "Vishal@2004",
  database: "Flat_Managment",
  connectionLimit: 10,
});

app.get("/book", (req, res) => {
  // res.redirect("/booked");
  res.render("userDetail");
});

app.post("/book", (req, res) => {
  const name = req.body.name;
  const bhk = req.body.bhk;
  const area = req.body.area;
  const address = req.body.address;
  const furnishing = req.body.furnishing;
  const rent = req.body.rent;
  const floor = req.body.floor;

  const ownName = req.body.ownerName;
  const ownNumber = req.body.ownerMobile;
  const ownEmail = req.body.ownerEmail;
  const ownID = req.body.ownerId;

  const id = req.body.bookButton;

  pool.query(
    `update Flat set Status_flat = "Booked" where Flat_ID = ${id};`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Success updated Status");
      }
    }
  );

  res.redirect("/booked");
});

app.post("/visited", (req, res) => {});

app.post("/delete", (req, res) => {
  const id = req.body.deleteButton;
  pool.query(`DELETE FROM Flat WHERE Flat_ID = ${id}`, (err) => {
    if (err) {
      console.log(err);
    }
  });

  res.redirect("/available");
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

app.post("/bookingDetails", (req, res) => {
  const buyerName = req.body.buyerName;
  const idProof = req.body.idProof;
  const flatID = req.body.flatID;
  const phnNumber = req.body.phnNumber;
  const uemail = req.body.uemail;
  const aadharNumber = req.body.aadharNumber;

  const w1Name = req.body.w1Name;
  const w1Phone = req.body.w1Phone;
  const w1Email = req.body.w1Email;
  const w2Phone = req.body.w2Phone;
  const w2Email = req.body.w2Email;

  const date = req.body.date;
  const amount = req.body.amount;
  const agreementID = req.body.agreementID;

  res.redirect("/booked");
});

// ------------------------------------------------------------------------------

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/addNewFlat", (req, res) => {
  const name = req.body.name;
  const bhk = req.body.bhk;
  const area = req.body.area;
  const address = req.body.address;
  const furnishing = req.body.furnishing;
  const rent = req.body.rent;
  const floor = req.body.floor;

  const ownName = req.body.ownerName;
  const ownNumber = req.body.ownerMobile;
  const ownEmail = req.body.ownerEmail;
  const ownID = req.body.ownerId;

  pool.query(
    `insert into Flat values ("${name}","${address}", "${bhk}", "${furnishing}", null ,${floor},"Available",0,${rent},${area})`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Success Adding To database!");
      }
    }
  );

  res.redirect("/");
});

app.get("/signin", (req, res) => {
  res.render("signin");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/available", (req, res) => {
  pool.query(
    `select * from Flat where Status_flat = "Available"`,
    (err, result) => {
      if (err) {
        return console.log(err);
      }

      res.render("availableFlats", { newListItems: result });
    }
  );
});

app.get("/booked", (req, res) => {
  pool.query(
    `select * from Flat where Status_flat = "Booked"`,
    (err, result) => {
      if (err) {
        return console.log(err);
      }

      res.render("bookedFlats", { newListItems: result });
    }
  );
});

app.get("/addNewFlat", (req, res) => {
  res.render("addNewFlat");
});

app.get("/visited", (req, res) => {
  res.render("visited");
});

app.get("/payments", (req, res) => {
  pool.query(`call Rent_Sum(@total)`);
  pool.query(`call Profit1(@profit)`);

  let sql1 = `call payment()`;

  var totalAmount;
  var profitEarned;

  pool.query(sql1, true, (error, results) => {
    if (error) {
      return console.error(error.message);
    }
    var arr = results[0];

    console.log(arr[0]);
    res.render("payments", {
      totAmount: arr[0].sum_s,
      profEarned: arr[0].profit,
    });
  });

  // pool.query(sql2, true, (error, results) => {
  //   if (error) {
  //     return console.error(error.message);
  //   }
  //   var arr2 = results[0];

  //   profitEarned = arr[0].profit;
  //   console.log(arr[0].profit);
  // });

  
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
