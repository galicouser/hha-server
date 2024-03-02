const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(fileUpload());
const port = process.env.PORT;
const username = process.env.DB_USER_NAME;
const password = process.env.DB_USER_PASS;
const auth = require("./routes/auth");
const checkout = require("./routes/checkout");
const redeem = require("./routes/redeem");
const products = require("./routes/products");
//const uri = `mongodb+srv://${username}:${password}@nocablesneeded.ffgwwlu.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb://clp8oqz8b00029ns3cz42aum1:6phjim8rISBMeEVz6yb07ozK@clp8oqz8k0000s39ndhoz58d0:27017/?readPreference=primary&ssl=false`;



mongoose
  .connect(uri, { useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => console.log("Monogo with auth service is running"))
  .catch((error) => console.log("Error while connecting to atlas", error));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/auth", auth);
app.use("/products", products);
app.use("/checkout", checkout);
app.use("/redeem", redeem);

app.listen(port, () => {
  console.log(`Listening to port ${port} ${process.env.FRONTEND_URL}...`);
});
// Hey
