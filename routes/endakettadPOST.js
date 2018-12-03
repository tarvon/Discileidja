var express = require('express');
var router = express.Router();
var path = require('path');
const passport = require('passport');
const mysql = require('mysql');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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

/* Send database info */
router.post('/', authenticationMiddleware(), (req, res) => {
    //lisada andmete kontroll, kas maht liiga suur või kõik tühi, kas numbrid on numbrid

    var lisaja = req.session.passport.user;

    var sql = 'SELECT * FROM ebdb.kadunudKettad WHERE lisaja = ' + lisaja;
    pool.getConnection(function (err, connection) {
        if(err) throw err;
        connection.query(sql, function (error, results, fields) {
            connection.release();
            if(err){
                if(err) throw err;
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