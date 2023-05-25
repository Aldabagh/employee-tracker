require("dotenv").config()
const mysql = require("mysql2");
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:process.env.MYSQL_PS,
    database:"employee_tracker_db"
});


module.exports = db
