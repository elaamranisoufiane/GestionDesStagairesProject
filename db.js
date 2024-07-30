const mysql = require('mysql');
require('dotenv').config();
const DB_HOST_db = process.env.DB_HOST;
const DB_USER_db = process.env.DB_USER;
const DB_PASSWORD_db = process.env.DB_PASSWORD;
const DB_NAME_db = process.env.DB_NAME;

const db = mysql.createPool({
    connectionLimit: 100,

    host: DB_HOST_db,
    user: DB_USER_db,
    password: DB_PASSWORD_db,
    database: DB_NAME_db,

});

module.exports = db;
