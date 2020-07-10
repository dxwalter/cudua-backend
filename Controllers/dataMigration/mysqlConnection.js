let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : process.env.MYSQL_DB_HOST,
  user     : process.env.MYSQL_DB_USER,
  password : '',
  database : process.env.MYSQL_DB_NAME
});
module.exports =  connection;