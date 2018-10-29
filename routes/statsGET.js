const mysql = require('mysql');
var express = require('express');
var router = express.Router();

let keys = "";

if (process.env.NODE_ENV !== 'production'){
    keys = require('../config/keys');

}

let pool = mysql.createPool({
    connectionLimit : 10, // default = 10
    host: process.env.RDS_HOSTNAME || keys.AWSRDS.host,
    user: process.env.RDS_USERNAME || keys.AWSRDS.username,
    password: process.env.RDS_PASSWORD || keys.AWSRDS.password,
    database: "ebdb"
});

//let city = "SELECT city, count(*) FROM visitors GROUP BY city";

/* Send database info */
router.get('/',authenticationMiddleware(), (req, res) => {

    let visitors = "SELECT date, time, city, country, ip FROM visitors;";
    pool.getConnection(function(err, connection) {
        connection.query(visitors, function (error, results, fields) {
            connection.release();
            if(error){
                throw error;
            } else {
                res.send(results);
            }
        });
    });

});

function authenticationMiddleware () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        req.session.returnTo = req.originalUrl;
        res.redirect('/auth/login')
    }
}


module.exports = router;
