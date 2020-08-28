let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : '',
  database : "business-category"
});
module.exports =  connection;