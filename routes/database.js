const {
    createPool
} = require('mysql')

const pool = createPool({

    host :"",
    user:"clqzol2m3003v9ns38j3j6p4o",
    password:"H2TxmQBtOBYhNWjScmQDzHvo",
    database:"empirehomecare-api",
    connectionLimit:10,
    // private $server = "mysql:host=clqzol2m600ags39npaohsbk1;dbname=clqzol2m4003w9ns3gdtg7icn";
    
})

pool.query(`select * from visits`)