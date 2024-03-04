const express = require("express");
// const bodyParser = require("body-parser");
// const fileUpload = require('express-fileupload');
// const cors = require("cors");
// require("dotenv").config();

const app = express();
// app.use(fileUpload());
// const port = process.env.PORT;
// const visits = require("./routes/visits");


const mysql = require('mysql2');
// create a new MySQL connection
const connection = mysql.createConnection({

  host: '45.77.222.55',
  port:'9001',
  user: 'clqzol2m3003u9ns3ffargnxm',
  password: 'tg0WBGzjhlhstQv1wBZxldp3',
  database: 'clqzol2m4003w9ns3gdtg7icn'
  
});
// connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  } else {
    console.log('Connected to MySQL database!');
  }
});
// close the MySQL connection
connection.end();


// private $server = "mysql:host=clqzol2m600ags39npaohsbk1;dbname=clqzol2m4003w9ns3gdtg7icn";
// private $user = "clqzol2m3003v9ns38j3j6p4o";
// private $pass = "H2TxmQBtOBYhNWjScmQDzHvo";
// private $options = array(
//     PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
//     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
// );

// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(cors());

// app.use("/visits", visits);

app.listen(2554, () => {
  console.log(`Listening to port ${2554}`);
});
