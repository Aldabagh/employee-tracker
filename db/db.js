require("dotenv").config()
const mysql = require("mysql2");

// Accessing the database
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:process.env.MYSQL_PS,
    database:"employee_tracker_db"
});
// handle errors
db.connect(function (err) {
    if (err) throw err;
 
});

module.exports = db
