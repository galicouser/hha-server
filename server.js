const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require("cors");
require("dotenv").config();
app.use(fileUpload());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


const visit = require("./routes/visits");
const misc = require("./routes/misc")
const masterweek = require("./routes/masterweek")

const { attachDatabaseConnection } = require('./middleware/middleware');


app.use(attachDatabaseConnection);

app.use("/visit", visit);
app.use("/misc", misc);
app.use("/masterweek", masterweek);



app.listen(2556, () => {
    console.log('Server is running on port 2556');
});