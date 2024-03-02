const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(fileUpload());
const port = process.env.PORT;
const visits = require("./routes/visits");




app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/visits", visits);

app.listen(port, () => {
  console.log(`Listening to port ${port} ${process.env.FRONTEND_URL}...`);
});
// Hey
