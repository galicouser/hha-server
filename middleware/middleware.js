const mysql = require("mysql2");


const dbConfig = {
  host: "104.238.131.15",
  port: 9001,
  user: "clqzol2m3003u9ns3ffargnxm",
  password: "tg0WBGzjhlhstQv1wBZxldp3",
  database: "clqzol2m4003w9ns3gdtg7icn",
};


const pool = mysql.createPool(dbConfig);

const attachDatabaseConnection =  async (req, res, next) => {
    req.mysql = pool; 
    next(); 
};

module.exports = {
    attachDatabaseConnection
};



