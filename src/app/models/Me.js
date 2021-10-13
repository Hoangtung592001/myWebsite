const mysql = require('mysql');


const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0865783836',
    database : 'sellingwebsite'
});

module.exports = db;