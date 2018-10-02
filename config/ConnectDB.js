let mysql = require('mysql');
const keys = require('./keys');

//database connection
let connection = mysql.createConnection({
    host: keys.AWSRDS.host,
    user: keys.AWSRDS.username,
    password: keys.AWSRDS.password,
    database: "ebdb",
    insecureAuth: true,
    port: 3306
});

connection.connect(function(err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
});

